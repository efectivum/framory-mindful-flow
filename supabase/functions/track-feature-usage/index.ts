
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      supabaseClient.auth.setSession({
        access_token: authHeader.replace('Bearer ', ''),
        refresh_token: ''
      })
    }

    // Get the user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('No user found')
    }

    const { featureName, featureCategory, context = {} } = await req.json()

    if (!featureName || !featureCategory) {
      throw new Error('featureName and featureCategory are required')
    }

    // Insert feature usage record
    const { error: usageError } = await supabaseClient
      .from('premium_feature_usage')
      .insert({
        user_id: user.id,
        feature_name: featureName,
        feature_category: featureCategory,
        usage_context: context.metadata || {},
        session_id: context.sessionId || crypto.randomUUID()
      })

    if (usageError) {
      throw usageError
    }

    // Get user's subscription info
    const { data: subscription } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Track subscription analytics if user is premium
    if (subscription?.subscribed) {
      const { error: analyticsError } = await supabaseClient
        .from('subscription_analytics')
        .insert({
          user_id: user.id,
          metric_type: 'feature_usage',
          metric_value: 1,
          metric_data: {
            feature_name: featureName,
            feature_category: featureCategory,
            subscription_tier: subscription.subscription_tier || 'premium'
          }
        })

      if (analyticsError) {
        console.error('Failed to track subscription analytics:', analyticsError)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
