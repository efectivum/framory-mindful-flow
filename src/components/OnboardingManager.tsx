
import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingFlow } from './OnboardingFlow';

export const OnboardingManager: React.FC = () => {
  const { user } = useAuth();
  const { isOnboardingComplete, isLoading, skipOnboarding } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  // Debug logging
  console.log('OnboardingManager state:', {
    user: !!user,
    isLoading,
    isOnboardingComplete,
    showOnboarding
  });

  useEffect(() => {
    if (user && !isLoading) {
      // Only show onboarding if it's not complete
      if (!isOnboardingComplete) {
        console.log('Setting showOnboarding to true');
        setShowOnboarding(true);
      } else {
        console.log('Onboarding already complete, hiding modal');
        setShowOnboarding(false);
      }
    }
  }, [user, isLoading, isOnboardingComplete]);

  const handleComplete = () => {
    console.log('Onboarding completed');
    setShowOnboarding(false);
  };

  const handleSkip = async () => {
    console.log('Attempting to skip onboarding');
    setIsSkipping(true);
    
    try {
      await skipOnboarding();
      console.log('Skip successful');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Failed to skip onboarding:', error);
      // Force close even if skip fails
      setShowOnboarding(false);
    } finally {
      setIsSkipping(false);
    }
  };

  const handleForceClose = () => {
    console.log('Force closing onboarding');
    setShowOnboarding(false);
    // Store in localStorage as backup
    localStorage.setItem('onboarding_dismissed', 'true');
  };

  // Check localStorage backup
  useEffect(() => {
    const dismissed = localStorage.getItem('onboarding_dismissed');
    if (dismissed === 'true') {
      console.log('Onboarding dismissed via localStorage');
      setShowOnboarding(false);
    }
  }, []);

  if (!showOnboarding || isLoading) {
    return null;
  }

  return (
    <OnboardingFlow
      onComplete={handleComplete}
      onSkip={handleSkip}
      onForceClose={handleForceClose}
      isSkipping={isSkipping}
    />
  );
};
