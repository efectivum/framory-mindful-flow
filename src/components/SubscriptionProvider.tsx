
import React, { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionState } from '@/hooks/subscription/useSubscriptionState';
import { useSubscriptionActions } from '@/hooks/subscription/useSubscriptionActions';
import { SubscriptionContext } from '@/contexts/SubscriptionContext';

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
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
    if (user) {
      checkSubscriptionFromDatabase();
    }
  }, [user?.id, checkSubscriptionFromDatabase]);

  return (
    <SubscriptionContext.Provider
      value={{
        isLoading,
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
