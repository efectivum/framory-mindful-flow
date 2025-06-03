
import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { PageLayout } from '@/components/PageLayout';
import { MobileLayout } from '@/components/MobileLayout';
import { useIsMobile } from '@/hooks/use-mobile';

const Chat = () => {
  const isMobile = useIsMobile();

  const content = (
    <div className="h-[calc(100vh-12rem)]">
      <ChatInterface />
    </div>
  );

  // Use MobileLayout for mobile with swipe functionality
  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  // Use PageLayout for desktop
  return (
    <PageLayout title="AI Chat" subtitle="Get personalized guidance and insights" showHeader={false}>
      <div className="h-[calc(100vh-8rem)]">
        <ChatInterface />
      </div>
    </PageLayout>
  );
};

export default Chat;
