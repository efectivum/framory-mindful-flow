import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const Chat = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full h-screen bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] text-slate-100">
      <div className={isMobile ? 'pb-20 h-full' : 'h-full'}>
        <ChatInterface />
      </div>
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
};

export default Chat;
