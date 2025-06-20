
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { SubscriptionTier } from '@/types/subscription';

export const useSubscriptionState = () => {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isBeta, setIsBeta] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const checkSubscriptionFromDatabase = useCallback(async () => {
    // Don't check subscription if auth is still loading or user is null
    if (authLoading || !user?.email) {
      setIsLoading(false);
      setSubscriptionTier('free');
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionEnd(null);
      return;
    }

    try {
      setIsLoading(true);
      
      // Add a small delay to ensure auth context is fully established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get subscription data from local database with timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased timeout

      const { data: subscriberData, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', user.email)
        .abortSignal(controller.signal)
        .maybeSingle();

      clearTimeout(timeoutId);

      if (error) {
        console.error('Error fetching subscription data:', error);
        // On RLS or permission errors, default to free but don't block the UI
        if (error.code === 'PGRST116' || error.message.includes('RLS')) {
          console.warn('RLS policy blocked subscription check, defaulting to free tier');
        }
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
        return;
      }

      if (!subscriberData) {
        // No subscription record found - user is free tier
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
      // Default to free on any error - don't block the UI
      setSubscriptionTier('free');
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionEnd(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  return {
    isLoading,
    isPremium,
    isBeta,
    subscriptionTier,
    subscriptionEnd,
    checkSubscriptionFromDatabase,
  };
};
