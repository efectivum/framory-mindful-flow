
import React, { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingFlow } from './OnboardingFlow';

export const OnboardingManager: React.FC = () => {
  const { user } = useAuth();
  const { isOnboardingComplete, isLoading } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);

  React.useEffect(() => {
    if (user && !isLoading && !isOnboardingComplete) {
      setShowOnboarding(true);
    }
  }, [user, isLoading, isOnboardingComplete]);

  if (!showOnboarding || isLoading) {
    return null;
  }

  return (
    <OnboardingFlow
      onComplete={() => setShowOnboarding(false)}
      onSkip={() => setShowOnboarding(false)}
    />
  );
};
