
import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { PremiumGateWithFallback } from '@/components/PremiumGateWithFallback';
import { ChatInterface } from '@/components/ChatInterface';

const Coach = () => {
  return (
    <PremiumGateWithFallback
      feature="AI Coach"
      description="Get personalized AI coaching and guidance for your personal growth journey."
    >
      <ChatInterface />
    </PremiumGateWithFallback>
  );
};

export default Coach;
