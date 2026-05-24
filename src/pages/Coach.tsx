import React from 'react';
import { PremiumGateWithFallback } from '@/components/PremiumGateWithFallback';
import { ChatInterface } from '@/components/ChatInterface';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';

const Coach = () => {
  return (
    <ResponsiveLayout title="Coach" subtitle="Your AI companion for reflection">
      <PremiumGateWithFallback
        feature="AI Coach"
        description="Get personalized AI coaching and guidance for your personal growth journey."
      >
        <ChatInterface />
      </PremiumGateWithFallback>
    </ResponsiveLayout>
  );
};

export default Coach;
