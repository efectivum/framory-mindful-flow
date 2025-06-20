
import React from 'react';
import { SimplifiedChatInterface } from '@/components/SimplifiedChatInterface';
import { PremiumGateWithFallback } from '@/components/PremiumGateWithFallback';

const Coach = () => {
  return (
    <PremiumGateWithFallback
      feature="AI Coach"
      description="Get personalized coaching and insights through our intelligent coach. Ask questions, log activities, and receive real-time guidance on your personal growth journey."
      className="h-screen"
    >
      <SimplifiedChatInterface />
    </PremiumGateWithFallback>
  );
};

export default Coach;
