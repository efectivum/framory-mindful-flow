
import { useAuth } from '@/hooks/useAuth';

// Simplified useSubscription hook that just reads from auth context
export const useSubscription = () => {
  const { 
    isPremium, 
    isBeta, 
    subscriptionTier, 
    subscriptionEnd, 
    refreshSubscription, 
    createCheckout, 
    openCustomerPortal,
    loading 
  } = useAuth();
  
  return {
    isLoading: loading,
    isPremium,
    isBeta,
    subscriptionTier,
    subscriptionEnd,
    refreshSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
