
import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { PremiumGate } from '@/components/PremiumGate';

const Coach = () => {
  return (
    <PremiumGate
      feature="AI Coach"
      description="Get personalized coaching and insights through our intelligent coach. Ask questions, log activities, and receive real-time guidance on your personal growth journey."
      className="h-screen"
    >
      <ChatInterface />
    </PremiumGate>
  );
};

export default Coach;
