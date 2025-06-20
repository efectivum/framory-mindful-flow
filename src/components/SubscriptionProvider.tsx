
import React, { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionState } from '@/hooks/subscription/useSubscriptionState';
import { useSubscriptionActions } from '@/hooks/subscription/useSubscriptionActions';
import { SubscriptionContext } from '@/contexts/SubscriptionContext';

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const {
    isLoading,
    isPremium,
    isBeta,
    subscriptionTier,
    subscriptionEnd,
    checkSubscriptionFromDatabase,
  } = useSubscriptionState();
  
  const { createCheckout, openCustomerPortal } = useSubscriptionActions();

  // Manual refresh function for users who want to check status
  const refreshSubscription = useCallback(async () => {
    await checkSubscriptionFromDatabase();
  }, [checkSubscriptionFromDatabase]);

  useEffect(() => {
    // Only check subscription when auth is ready and user exists
    if (!authLoading && user) {
      console.log('SubscriptionProvider: Checking subscription for user', user.email);
      checkSubscriptionFromDatabase();
    } else if (!authLoading && !user) {
      console.log('SubscriptionProvider: No user found, skipping subscription check');
    }
  }, [user?.id, authLoading, checkSubscriptionFromDatabase]);

  // Show loading while authentication is loading
  const contextIsLoading = authLoading || (user && isLoading);

  return (
    <SubscriptionContext.Provider
      value={{
        isLoading: contextIsLoading,
        isPremium,
        isBeta,
        subscriptionTier,
        subscriptionEnd,
        refreshSubscription,
        createCheckout,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
