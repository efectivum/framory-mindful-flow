
import { useState } from 'react';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useJournalSuggestion } from '@/hooks/useJournalSuggestion';
import { useCoachHabitSuggestion } from '@/hooks/useCoachHabitSuggestion';
import { useEnhancedCoaching } from '@/hooks/useEnhancedCoaching';
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
  const { generateEnhancedPrompt, recordUserFeedback } = useEnhancedCoaching();

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
      console.log('ConversationManager: Using enhanced coaching mode');
      const updatedHistory = [...conversationHistory, { role: 'user' as const, content: inputText }];
      
      // Generate enhanced prompt with scientific protocols and personalization
      const enhancedPrompt = generateEnhancedPrompt(inputText, updatedHistory);
      
      // Use enhanced prompt for AI response
      const aiResponse = await generateResponse(enhancedPrompt, updatedHistory, false, 'coaching');
      
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
          // Add coaching metadata for feedback tracking
          coachingMetadata: {
            interventionType: detectInterventionType(aiResponse),
            hasProtocolReference: hasProtocolReference(aiResponse),
            canRequestFeedback: true,
          },
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

  // Helper function to detect intervention type from AI response
  const detectInterventionType = (response: string): string => {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('breathing') || lowerResponse.includes('breathe')) {
      return 'breathing_technique';
    }
    if (lowerResponse.includes('habit') || lowerResponse.includes('routine')) {
      return 'habit_coaching';
    }
    if (lowerResponse.includes('sleep') || lowerResponse.includes('rest')) {
      return 'sleep_optimization';
    }
    if (lowerResponse.includes('focus') || lowerResponse.includes('concentration')) {
      return 'focus_enhancement';
    }
    if (lowerResponse.includes('stress') || lowerResponse.includes('anxiety')) {
      return 'stress_management';
    }
    if (lowerResponse.includes('thought') || lowerResponse.includes('thinking')) {
      return 'cognitive_restructuring';
    }
    
    return 'general_coaching';
  };

  // Helper function to check if response references scientific protocols
  const hasProtocolReference = (response: string): boolean => {
    const protocolKeywords = [
      'huberman', 'protocol', 'research', 'study', 'evidence',
      'atomic habits', 'cognitive behavioral', 'scientific'
    ];
    
    return protocolKeywords.some(keyword => 
      response.toLowerCase().includes(keyword)
    );
  };

  return {
    handleConversation,
    isGeneratingResponse,
    conversationHistory,
    recordUserFeedback,
  };
};
