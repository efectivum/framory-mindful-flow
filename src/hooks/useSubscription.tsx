
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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

// Enhanced rate limiting state
let lastCheckTime = 0;
let checkAttempts = 0;
let isCurrentlyChecking = false;
const RATE_LIMIT_WINDOW = 60000; // Increased to 60 seconds
const MAX_ATTEMPTS_PER_WINDOW = 2; // Reduced to 2 attempts
const MIN_CHECK_INTERVAL = 30000; // Minimum 30 seconds between checks

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isBeta, setIsBeta] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium' | 'beta'>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [lastErrorTime, setLastErrorTime] = useState(0);
  const checkTimeoutRef = useRef<NodeJS.Timeout>();

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const now = Date.now();
    
    // Enhanced rate limiting
    if (now - lastCheckTime < MIN_CHECK_INTERVAL && lastCheckTime > 0) {
      console.log('Subscription check skipped - too soon since last check');
      setIsLoading(false);
      return;
    }

    if (now - lastCheckTime > RATE_LIMIT_WINDOW) {
      checkAttempts = 0;
      lastCheckTime = now;
    }

    if (checkAttempts >= MAX_ATTEMPTS_PER_WINDOW) {
      console.log('Rate limit exceeded for subscription check, will retry later');
      setIsLoading(false);
      // Schedule a retry in 2 minutes
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      checkTimeoutRef.current = setTimeout(() => {
        checkAttempts = 0;
        checkSubscription();
      }, 120000);
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
      lastCheckTime = now;
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        // Only show error toast if it's been more than 5 minutes since last error
        const timeSinceLastError = now - lastErrorTime;
        if (error.message && error.message.includes('rate limit')) {
          console.warn('Subscription check rate limited, will retry later');
          // Schedule retry in 5 minutes for rate limit errors
          if (checkTimeoutRef.current) {
            clearTimeout(checkTimeoutRef.current);
          }
          checkTimeoutRef.current = setTimeout(() => {
            checkAttempts = 0;
            checkSubscription();
          }, 300000);
          return;
        }
        
        // Only show error notification if more than 5 minutes since last error
        if (timeSinceLastError > 300000) {
          setLastErrorTime(now);
          toast({
            title: "Subscription Check Failed",
            description: "Unable to verify subscription status. Retrying in background.",
            variant: "destructive",
          });
        }
        
        throw error;
      }
      
      const tier = data.subscription_tier || 'free';
      const isSubscribed = data.subscribed || false;
      
      setSubscriptionTier(tier);
      setIsPremium(isSubscribed || tier === 'premium');
      setIsBeta(tier === 'beta');
      setSubscriptionEnd(data.subscription_end || null);
      
      // Reset attempts and error tracking on successful check
      checkAttempts = 0;
      setLastErrorTime(0);
      
    } catch (error) {
      console.error('Error checking subscription:', error);
      
      // Fallback to cached data or defaults
      setSubscriptionTier('free');
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionEnd(null);
      
    } finally {
      setIsLoading(false);
      isCurrentlyChecking = false;
    }
  }, [user, toast, lastErrorTime]);

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
    // Clear any existing timeout when user changes
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    if (user) {
      // Debounce the initial check to prevent multiple rapid calls
      const timeoutId = setTimeout(() => {
        checkSubscription();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionTier('free');
      setSubscriptionEnd(null);
      checkAttempts = 0;
      lastCheckTime = 0;
    }
  }, [user?.id, checkSubscription]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, []);

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
