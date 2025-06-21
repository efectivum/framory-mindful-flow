
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useJournalSuggestion } from '@/hooks/useJournalSuggestion';
import { Message } from '@/types/chat';

interface ChatMessageHandlerProps {
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  selectedActivity: string | null;
  setSelectedActivity: (activity: string | null) => void;
  fileAttachment: File | null;
  setFileAttachment: (file: File | null) => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  addMessage: (message: Message) => void;
  isGeneratingResponse: boolean;
  setIsGeneratingResponse: (generating: boolean) => void;
}

export const useChatMessageHandler = ({
  messages,
  inputText,
  setInputText,
  selectedActivity,
  setSelectedActivity,
  fileAttachment,
  setFileAttachment,
  textAreaRef,
  addMessage,
  isGeneratingResponse,
  setIsGeneratingResponse
}: ChatMessageHandlerProps) => {
  const location = useLocation();
  const { createEntry } = useJournalEntries();
  const journalSuggestion = useJournalSuggestion();
  const { generateResponse, detectIntent } = useConversationalAI();

  const contextType = location.state?.contextType;
  const isCoachingMode = location.pathname === '/coach' || contextType === 'journal-entry';

  const handleSend = useCallback(async () => {
    if (!inputText.trim() && !fileAttachment) return;
    
    let attachmentUrl: string | undefined = undefined;
    let attachmentType: string | undefined = undefined;
    if (fileAttachment) {
      attachmentUrl = URL.createObjectURL(fileAttachment);
      attachmentType = fileAttachment.type;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      activityType: selectedActivity || undefined,
      timestamp: new Date(),
      ...(attachmentUrl ? { attachmentUrl, attachmentType } : {}),
    };

    addMessage(userMessage);
    const currentInput = inputText;
    setInputText('');
    setFileAttachment(null);
    setSelectedActivity(null);
    textAreaRef.current?.focus();

    if (attachmentUrl && !currentInput.trim()) return;

    setIsGeneratingResponse(true);
    try {
      let aiResponse: string | null = null;
      
      if (isCoachingMode) {
        const conversationHistory = messages.map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));
        
        aiResponse = await generateResponse(currentInput, conversationHistory, false, 'coaching');
      } else {
        const intentResult = await detectIntent(currentInput, selectedActivity, []);
        
        if (intentResult?.intent === 'journal' && intentResult.confidence > 0.7) {
          userMessage.isJournalEntry = true;
          createEntry({
            content: currentInput,
            title: selectedActivity ? `${selectedActivity} entry` : undefined,
          });
        }
        
        const conversationHistory = messages.map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));
        
        aiResponse = await generateResponse(currentInput, conversationHistory, false);
      }

      if (aiResponse) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        };
        addMessage(botResponse);

        if (isCoachingMode && (
          aiResponse.toLowerCase().includes('would you like me to help you create a journal entry') || 
          aiResponse.toLowerCase().includes('capture these insights in your journal')
        )) {
          const conversationSummary = messages.map(msg => 
            `${msg.type === 'user' ? 'You' : 'Coach'}: ${msg.content}`
          ).join('\n\n');
          journalSuggestion.setSuggestion(conversationSummary);
        }
      } else {
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm sorry, I'm having trouble responding right now. Please try again.",
          timestamp: new Date(),
        };
        addMessage(errorResponse);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      addMessage(errorResponse);
    } finally {
      setIsGeneratingResponse(false);
    }
  }, [inputText, fileAttachment, selectedActivity, messages, addMessage, isCoachingMode, generateResponse, detectIntent, createEntry, journalSuggestion, setInputText, setFileAttachment, setSelectedActivity, textAreaRef, setIsGeneratingResponse]);

  return { handleSend };
};
