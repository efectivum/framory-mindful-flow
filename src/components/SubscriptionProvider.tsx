
import React, { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useSubscriptionState } from '@/hooks/subscription/useSubscriptionState';
import { useSubscriptionActions } from '@/hooks/subscription/useSubscriptionActions';
import { SubscriptionContext } from '@/contexts/SubscriptionContext';

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
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
    // Only trigger check once when auth and admin loading are complete
    if (!authLoading && !adminLoading) {
      console.log('SubscriptionProvider: Auth ready, checking subscription for user', user?.email, 'isAdmin:', isAdmin);
      checkSubscriptionFromDatabase();
    }
  }, [authLoading, adminLoading, checkSubscriptionFromDatabase]);

  // Show loading while authentication or admin check is loading
  const contextIsLoading = authLoading || adminLoading || isLoading;

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
