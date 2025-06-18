
import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Message } from '@/types/chat';

interface ChatContext {
  emotionFromParams: string | null;
  journalContext: any;
  contextType: string | undefined;
  isCoachingMode: boolean;
}

interface ChatContextManagerProps {
  onContextReady: (context: ChatContext) => void;
  onInitialMessage: (message: Message) => void;
}

export const ChatContextManager: React.FC<ChatContextManagerProps> = ({
  onContextReady,
  onInitialMessage
}) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const emotionFromParams = searchParams.get('emotion');
    const journalContext = location.state?.journalContext;
    const contextType = location.state?.contextType;
    const isCoachingMode = contextType === 'journal-entry';

    const context: ChatContext = {
      emotionFromParams,
      journalContext,
      contextType,
      isCoachingMode
    };

    onContextReady(context);

    // Generate initial message based on context
    let initialMessage: Message;

    if (isCoachingMode && journalContext) {
      initialMessage = {
        id: '1',
        type: 'bot',
        content: `I can see you'd like to explore your journal entry further. Let's dive deeper into what you've shared: "${journalContext.substring(0, 150)}${journalContext.length > 150 ? '...' : ''}"

What aspect of this would you like to explore more? What feelings or thoughts came up for you while writing this?`,
        timestamp: new Date(),
      };
    } else if (emotionFromParams) {
      initialMessage = {
        id: '1',
        type: 'bot',
        content: `I see you want to explore your ${emotionFromParams} experiences. I'm ready to help you analyze patterns and insights related to this emotion. What would you like to know?`,
        timestamp: new Date(),
      };
    } else {
      initialMessage = {
        id: '1',
        type: 'bot',
        content: "Hi! I'm your personal growth coach. I'm here to help you explore your thoughts, work through challenges, and gain deeper insights. What's on your mind today?",
        timestamp: new Date(),
      };
    }

    onInitialMessage(initialMessage);
    setIsInitialized(true);
  }, [searchParams, location.state, onContextReady, onInitialMessage, isInitialized]);

  return null; // This is a logic-only component
};
