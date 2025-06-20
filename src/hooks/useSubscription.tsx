
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionContextType {
  isLoading: boolean;
  isPremium: boolean;
  isBeta: boolean;
  subscriptionTier: 'free' | 'premium' | 'beta';
  subscriptionEnd: string | null;
  checkSubscription: () => Promise<void>;
  createCheckout: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isBeta, setIsBeta] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium' | 'beta'>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('Subscription check timed out, assuming free tier');
        setIsLoading(false);
        setHasTimedOut(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  const checkSubscriptionFromDatabase = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Get subscription data from local database with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const { data: subscriberData, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', user.email)
        .abortSignal(controller.signal)
        .maybeSingle();

      clearTimeout(timeoutId);

      if (error) {
        console.error('Error fetching subscription data:', error);
        // Don't throw error, just default to free
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
        return;
      }

      if (!subscriberData) {
        // No subscription record found
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
        return;
      }

      const now = new Date();
      const endDate = subscriberData.subscription_end ? new Date(subscriberData.subscription_end) : null;
      
      // Check if subscription is still valid based on end date
      const isSubscriptionActive = subscriberData.subscribed && (!endDate || endDate > now);
      
      if (subscriberData.subscription_tier === 'beta') {
        setSubscriptionTier('beta');
        setIsBeta(true);
        setIsPremium(false);
        setSubscriptionEnd(subscriberData.subscription_end);
      } else if (isSubscriptionActive && subscriberData.subscription_tier === 'premium') {
        setSubscriptionTier('premium');
        setIsPremium(true);
        setIsBeta(false);
        setSubscriptionEnd(subscriberData.subscription_end);
      } else {
        // Subscription expired or not found
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
      }
      
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Default to free on error - don't block the UI
      setSubscriptionTier('free');
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionEnd(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // This function only hits Stripe when manually called (e.g., after checkout or manual refresh)
  const checkSubscription = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Add timeout for Stripe check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Error checking subscription with Stripe:', error);
        // Fall back to database check if Stripe fails
        await checkSubscriptionFromDatabase();
        return;
      }
      
      const tier = data.subscription_tier || 'free';
      const isSubscribed = data.subscribed || false;
      
      setSubscriptionTier(tier);
      setIsPremium(isSubscribed || tier === 'premium');
      setIsBeta(tier === 'beta');
      setSubscriptionEnd(data.subscription_end || null);
      
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Fall back to database check
      await checkSubscriptionFromDatabase();
    } finally {
      setIsLoading(false);
    }
  }, [user, checkSubscriptionFromDatabase]);

  const createCheckout = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to upgrade to premium",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      // Only check database on initial load - much faster and no API calls
      checkSubscriptionFromDatabase();
    } else {
      setIsLoading(false);
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionTier('free');
      setSubscriptionEnd(null);
    }
  }, [user?.id, checkSubscriptionFromDatabase]);

  return (
    <SubscriptionContext.Provider
      value={{
        isLoading: isLoading && !hasTimedOut, // Don't show loading if timed out
        isPremium,
        isBeta,
        subscriptionTier,
        subscriptionEnd,
        checkSubscription, // Now only used for manual refreshes
        createCheckout,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
