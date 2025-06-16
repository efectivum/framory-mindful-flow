
import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { PremiumGate } from '@/components/PremiumGate';

const Chat = () => {
  return (
    <PremiumGate
      feature="AI Chat Assistant"
      description="Get personalized coaching and insights through our intelligent chat assistant. Ask questions, log activities, and receive real-time guidance on your personal growth journey."
      className="h-screen"
    >
      <ChatInterface />
    </PremiumGate>
  );
};

export default Chat;
