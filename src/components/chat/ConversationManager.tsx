
import { useState } from 'react';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useJournalSuggestion } from '@/hooks/useJournalSuggestion';
import { useCoachHabitSuggestion } from '@/hooks/useCoachHabitSuggestion';
import { Message } from '@/types/chat';

interface ConversationState {
  role: 'user' | 'assistant';
  content: string;
}

interface UseConversationManagerProps {
  isCoachingMode: boolean;
  onMessageAdd: (message: Message) => void;
  onInputFocus: () => void;
}

export const useConversationManager = ({
  isCoachingMode,
  onMessageAdd,
  onInputFocus
}: UseConversationManagerProps) => {
  const [conversationHistory, setConversationHistory] = useState<ConversationState[]>([]);
  const { generateResponse, isGeneratingResponse } = useConversationalAI();
  const journalSuggestion = useJournalSuggestion();
  const { parseHabitFromCoachResponse } = useCoachHabitSuggestion();

  const isJournalConfirmation = (message: string): boolean => {
    const confirmationPatterns = [
      /^yes,?\s*(save|journal)/i,
      /^save\s*(it|this|that)/i,
      /^(yes|yeah|yep)\s*$/i,
      /^please\s*save/i,
      /^i\s*would\s*like\s*to\s*save/i,
    ];
    
    return confirmationPatterns.some(pattern => pattern.test(message.trim()));
  };

  const handleConversation = async (inputText: string) => {
    console.log('ConversationManager: Handling conversation', { inputText, isCoachingMode });
    
    // Check if this is a journal confirmation from a coaching conversation
    if (journalSuggestion.isWaitingForConfirmation && isJournalConfirmation(inputText)) {
      journalSuggestion.confirmSuggestion();
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Perfect! I've prepared your journal entry based on our conversation. You can edit it before saving if needed.",
        timestamp: new Date(),
      };
      onMessageAdd(botResponse);
      return;
    }

    // For coaching mode, use enhanced logic
    if (isCoachingMode) {
      console.log('ConversationManager: Using coaching mode');
      const updatedHistory = [...conversationHistory, { role: 'user' as const, content: inputText }];
      const aiResponse = await generateResponse(inputText, updatedHistory, false, 'coaching');
      
      if (aiResponse) {
        // Only check for habit suggestions if the response explicitly offers to create one
        let habitSuggestion = null;
        const explicitHabitOffers = [
          'let me create a habit',
          'i can help you set up a habit',
          'would you like me to create a habit',
          'i can set up a daily practice',
          'let me help you create a habit',
          'this sounds like a perfect daily habit'
        ];
        
        const hasExplicitOffer = explicitHabitOffers.some(offer => 
          aiResponse.toLowerCase().includes(offer)
        );
        
        if (hasExplicitOffer) {
          habitSuggestion = parseHabitFromCoachResponse(aiResponse);
        }
        
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
          habitSuggestion: habitSuggestion || undefined,
        };
        onMessageAdd(botResponse);
        setConversationHistory([...updatedHistory, { role: 'assistant', content: aiResponse }]);

        // Only suggest journaling if the coach naturally offers it in the response
        if (aiResponse.toLowerCase().includes('would you like me to help you create a journal entry') || 
            aiResponse.toLowerCase().includes('capture these insights in your journal')) {
          const conversationSummary = conversationHistory.map(msg => 
            `${msg.role === 'user' ? 'You' : 'Coach'}: ${msg.content}`
          ).join('\n\n');
          journalSuggestion.setSuggestion(conversationSummary);
        }
      }
    } else {
      // Regular mode
      console.log('ConversationManager: Using regular mode');
      const updatedHistory = [...conversationHistory, { role: 'user' as const, content: inputText }];
      const aiResponse = await generateResponse(inputText, updatedHistory, false);
      
      if (aiResponse) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        };
        onMessageAdd(botResponse);
        setConversationHistory([...updatedHistory, { role: 'assistant', content: aiResponse }]);

        // Check if AI suggested journaling (but not in coaching mode)
        if (aiResponse.toLowerCase().includes('would you like to save') && 
            aiResponse.toLowerCase().includes('journal')) {
          journalSuggestion.setSuggestion(inputText);
        }
      } else {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm sorry, I'm having trouble responding right now. Please try again.",
          timestamp: new Date(),
        };
        onMessageAdd(botResponse);
      }
    }

    onInputFocus();
  };

  return {
    handleConversation,
    isGeneratingResponse,
    conversationHistory
  };
};
