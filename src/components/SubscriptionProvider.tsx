
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
    // Only check subscription when auth is ready, admin status is determined, and user exists
    if (!authLoading && !adminLoading && user) {
      console.log('SubscriptionProvider: Checking subscription for user', user.email, 'isAdmin:', isAdmin);
      checkSubscriptionFromDatabase();
    } else if (!authLoading && !adminLoading && !user) {
      console.log('SubscriptionProvider: No user found, skipping subscription check');
    }
  }, [user?.id, authLoading, adminLoading, isAdmin, checkSubscriptionFromDatabase]);

  // Show loading while authentication or admin check is loading
  const contextIsLoading = authLoading || adminLoading || (user && isLoading);

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
