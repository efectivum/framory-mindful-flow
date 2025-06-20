import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Enhanced in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW = 120000; // 2 minutes
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 requests per 2 minutes
const MIN_REQUEST_INTERVAL = 30000; // Minimum 30 seconds between requests

const checkRateLimit = (userId: string): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Create new or reset expired limit
    rateLimitMap.set(userId, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW,
      lastRequest: now
    });
    return { allowed: true };
  }
  
  // Check if too soon since last request
  if (now - userLimit.lastRequest < MIN_REQUEST_INTERVAL) {
    const retryAfter = Math.ceil((MIN_REQUEST_INTERVAL - (now - userLimit.lastRequest)) / 1000);
    return { allowed: false, retryAfter };
  }
  
  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  userLimit.count++;
  userLimit.lastRequest = now;
  return { allowed: true };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header provided");
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError) {
      logStep("Authentication error", { error: userError.message });
      throw new Error(`Authentication error: ${userError.message}`);
    }
    const user = userData.user;
    if (!user?.email) {
      logStep("ERROR: User not authenticated or email not available");
      throw new Error("User not authenticated or email not available");
    }

    // Enhanced rate limit check
    const rateLimitResult = checkRateLimit(user.id);
    if (!rateLimitResult.allowed) {
      logStep("Rate limit exceeded for user", { 
        userId: user.id, 
        retryAfter: rateLimitResult.retryAfter 
      });
      
      // Return cached data from Supabase instead of error
      const { data: cachedData } = await supabaseClient
        .from("subscribers")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();
      
      // Return the cached data or default values
      return new Response(JSON.stringify({ 
        subscribed: cachedData?.subscribed || false,
        subscription_tier: cachedData?.subscription_tier || "free",
        subscription_end: cachedData?.subscription_end || null,
        cached: true
      }), {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": rateLimitResult.retryAfter?.toString() || "60"
        },
        status: 200, // Return 200 instead of 429 to prevent error notifications
      });
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if user has beta tier in subscribers table
    const { data: subscriberData } = await supabaseClient
      .from("subscribers")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (subscriberData?.subscription_tier === 'beta') {
      logStep("Beta user found", { email: user.email });
      return new Response(JSON.stringify({
        subscribed: false,
        subscription_tier: "beta",
        subscription_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY is not set");
      return new Response(JSON.stringify({
        subscribed: false,
        subscription_tier: "free",
        subscription_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    let customers;
    try {
      customers = await stripe.customers.list({ email: user.email, limit: 1 });
    } catch (stripeError: any) {
      logStep("Stripe API error", { error: stripeError.message });
      
      // Always return cached data for Stripe errors to prevent error spam
      const { data: cachedData } = await supabaseClient
        .from("subscribers")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();
      
      return new Response(JSON.stringify({
        subscribed: cachedData?.subscribed || false,
        subscription_tier: cachedData?.subscription_tier || "free",
        subscription_end: cachedData?.subscription_end || null,
        cached: true
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: "free",
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      return new Response(JSON.stringify({ subscribed: false, subscription_tier: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    let subscriptions;
    try {
      subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
    } catch (stripeError: any) {
      logStep("Stripe subscription check error", { error: stripeError.message });
      
      // Return cached data for subscription check errors too
      const { data: cachedData } = await supabaseClient
        .from("subscribers")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();
      
      return new Response(JSON.stringify({
        subscribed: cachedData?.subscribed || false,
        subscription_tier: cachedData?.subscription_tier || "free",
        subscription_end: cachedData?.subscription_end || null,
        cached: true
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = "free";
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      subscriptionTier = "premium";
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
    } else {
      logStep("No active subscription found");
    }

    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    
    // Return free tier as fallback instead of error
    return new Response(JSON.stringify({ 
      subscribed: false,
      subscription_tier: "free",
      subscription_end: null,
      cached: true
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
