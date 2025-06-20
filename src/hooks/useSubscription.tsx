
import { createContext, useContext, useEffect, useState } from 'react';
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

// Rate limiting state
let lastCheckTime = 0;
let checkAttempts = 0;
let isCurrentlyChecking = false;
const RATE_LIMIT_WINDOW = 30000; // 30 seconds
const MAX_ATTEMPTS_PER_WINDOW = 3;

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isBeta, setIsBeta] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium' | 'beta'>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const checkSubscription = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Rate limiting logic
    const now = Date.now();
    if (now - lastCheckTime > RATE_LIMIT_WINDOW) {
      // Reset attempts after window expires
      checkAttempts = 0;
      lastCheckTime = now;
    }

    if (checkAttempts >= MAX_ATTEMPTS_PER_WINDOW) {
      console.log('Rate limit exceeded for subscription check, skipping...');
      setIsLoading(false);
      return;
    }

    if (isCurrentlyChecking) {
      console.log('Subscription check already in progress, skipping...');
      return;
    }

    try {
      setIsLoading(true);
      isCurrentlyChecking = true;
      checkAttempts++;
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        // Don't show toast for rate limit errors to prevent spam
        if (error.message && error.message.includes('rate limit')) {
          console.warn('Subscription check rate limited, will retry later');
          return;
        }
        throw error;
      }
      
      const tier = data.subscription_tier || 'free';
      const isSubscribed = data.subscribed || false;
      
      setSubscriptionTier(tier);
      setIsPremium(isSubscribed || tier === 'premium');
      setIsBeta(tier === 'beta');
      setSubscriptionEnd(data.subscription_end || null);
      
      // Reset attempts on successful check
      checkAttempts = 0;
    } catch (error) {
      console.error('Error checking subscription:', error);
      
      // Only show toast for non-rate-limit errors and not too frequently
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes('rate limit') && checkAttempts <= 1) {
        toast({
          title: "Subscription Check Failed",
          description: "Unable to verify subscription status. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      isCurrentlyChecking = false;
    }
  };

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
    // Only check subscription once when user changes or on mount
    if (user) {
      checkSubscription();
    } else {
      setIsLoading(false);
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionTier('free');
      setSubscriptionEnd(null);
    }
  }, [user?.id]); // Only depend on user ID to prevent unnecessary re-runs

  return (
    <SubscriptionContext.Provider
      value={{
        isLoading,
        isPremium,
        isBeta,
        subscriptionTier,
        subscriptionEnd,
        checkSubscription,
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
