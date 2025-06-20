
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import type { SubscriptionTier } from '@/types/subscription';

export const useSubscriptionState = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isBeta, setIsBeta] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const checkSubscriptionFromDatabase = useCallback(async () => {
    // Don't check if we're still loading auth/admin or if we already checked
    if (authLoading || adminLoading || hasChecked) {
      return;
    }

    // If no user, set free tier and mark as checked
    if (!user?.email) {
      setIsLoading(false);
      setSubscriptionTier('free');
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionEnd(null);
      setHasChecked(true);
      return;
    }

    try {
      setIsLoading(true);
      
      // If user is admin, automatically grant premium access without DB check
      if (isAdmin) {
        console.log('Admin user detected, granting premium access');
        setSubscriptionTier('premium');
        setIsPremium(true);
        setIsBeta(false);
        setSubscriptionEnd(null);
        setIsLoading(false);
        setHasChecked(true);
        return;
      }
      
      // Only check database for non-admin users
      const { data: subscriberData, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription data:', error);
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
        setIsLoading(false);
        setHasChecked(true);
        return;
      }

      if (!subscriberData) {
        // No subscription record found - user is free tier
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
        setIsLoading(false);
        setHasChecked(true);
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
      // Default to free on any error
      setSubscriptionTier('free');
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionEnd(null);
    } finally {
      setIsLoading(false);
      setHasChecked(true);
    }
  }, [user?.email, authLoading, adminLoading, isAdmin, hasChecked]);

  // Reset hasChecked when user changes
  useEffect(() => {
    setHasChecked(false);
  }, [user?.id]);

  return {
    isLoading,
    isPremium,
    isBeta,
    subscriptionTier,
    subscriptionEnd,
    checkSubscriptionFromDatabase,
  };
};
