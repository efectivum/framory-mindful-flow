
import { useState } from 'react';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { Message } from '@/types/chat';

interface ConversationState {
  role: 'user' | 'assistant';
  content: string;
}

interface SimpleConversationManagerProps {
  onMessageAdd: (message: Message) => void;
  onInputFocus: () => void;
}

export const useSimpleConversationManager = ({
  onMessageAdd,
  onInputFocus
}: SimpleConversationManagerProps) => {
  const [conversationHistory, setConversationHistory] = useState<ConversationState[]>([]);
  const { generateResponse, isGeneratingResponse } = useConversationalAI();

  const handleConversation = async (inputText: string) => {
    console.log('SimpleConversationManager: Handling conversation', { inputText });
    
    const updatedHistory = [...conversationHistory, { role: 'user' as const, content: inputText }];
    
    try {
      const aiResponse = await generateResponse(inputText, updatedHistory, false, 'coaching');
      
      if (aiResponse) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        };
        
        onMessageAdd(botResponse);
        setConversationHistory([...updatedHistory, { role: 'assistant', content: aiResponse }]);
      } else {
        // Fallback response
        const fallbackResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm here to help you explore your thoughts and feelings. What's on your mind today?",
          timestamp: new Date(),
        };
        onMessageAdd(fallbackResponse);
      }
    } catch (error) {
      console.error('Error in conversation:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      };
      onMessageAdd(errorResponse);
    }

    onInputFocus();
  };

  const recordUserFeedback = (
    interactionId: string,
    satisfaction: number,
    interventionType: string,
    successMetric: string,
    notes?: string
  ) => {
    console.log('Feedback recorded:', {
      interactionId,
      satisfaction,
      interventionType,
      successMetric,
      notes
    });
  };

  return {
    handleConversation,
    isGeneratingResponse,
    conversationHistory,
    recordUserFeedback,
  };
};
