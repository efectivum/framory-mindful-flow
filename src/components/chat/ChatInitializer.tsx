
import { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@/types/chat';

interface ChatInitializerProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isInitialized: boolean;
  setIsInitialized: (initialized: boolean) => void;
  setMessages: (messages: Message[]) => void;
  setInputText: (text: string) => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  scrollToBottom: () => void;
}

export const ChatInitializer: React.FC<ChatInitializerProps> = ({
  isLoading,
  setIsLoading,
  isInitialized,
  setIsInitialized,
  setMessages,
  setInputText,
  textAreaRef,
  scrollToBottom
}) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { loading: authLoading } = useAuth();

  const emotionFromParams = searchParams.get('emotion');
  const journalContext = location.state?.journalContext;
  const contextType = location.state?.contextType;
  const isCoachingMode = location.pathname === '/coach' || contextType === 'journal-entry';

  // Wait for auth to be stable before initializing
  useEffect(() => {
    if (authLoading) return;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [authLoading, setIsLoading]);

  // Initialize with welcome message
  useEffect(() => {
    if (isLoading || isInitialized) return;

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
    } else if (isCoachingMode) {
      initialMessage = {
        id: '1',
        type: 'bot',
        content: "Hi! I'm your personal growth coach. I'm here to help you explore your thoughts, work through challenges, and gain deeper insights. What's on your mind today?",
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

    setMessages([initialMessage]);
    setIsInitialized(true);

    if (emotionFromParams) {
      const emotionPrompt = `I'd like to explore my ${emotionFromParams} entries. What patterns do you see with my ${emotionFromParams} experiences? Can you help me understand when and why I feel ${emotionFromParams}?`;
      setInputText(emotionPrompt);
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 200);
    }
  }, [isLoading, isInitialized, isCoachingMode, journalContext, emotionFromParams, setMessages, setIsInitialized, setInputText, textAreaRef]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return null; // This is a logic-only component
};
