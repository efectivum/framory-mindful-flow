
import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';

const Chat = () => {
  return (
    <ResponsiveLayout title="Chat">
      <div className="w-full h-full min-h-[60vh] flex flex-col justify-center">
        <ChatInterface />
      </div>
    </ResponsiveLayout>
  );
};

export default Chat;
