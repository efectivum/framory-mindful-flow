import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useJournalSuggestion } from '@/hooks/useJournalSuggestion';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { JournalPreviewModal } from './JournalPreviewModal';

export const ChatInterface = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const emotionFromParams = searchParams.get('emotion');
  
  // Check for journal context from navigation state
  const journalContext = location.state?.journalContext;
  const contextType = location.state?.contextType;
  const isCoachingMode = contextType === 'journal-entry';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const { createEntry } = useJournalEntries();
  const { detectIntent, generateResponse, isDetectingIntent, isGeneratingResponse } = useConversationalAI();
  const journalSuggestion = useJournalSuggestion();

  // Initialize conversation based on context
  useEffect(() => {
    if (isCoachingMode && journalContext && messages.length === 0) {
      const coachingWelcome: Message = {
        id: '1',
        type: 'bot',
        content: `I can see you'd like to explore your journal entry further. Let's dive deeper into what you've shared: "${journalContext.substring(0, 150)}${journalContext.length > 150 ? '...' : ''}"

What aspect of this would you like to explore more? What feelings or thoughts came up for you while writing this?`,
        timestamp: new Date(),
      };
      setMessages([coachingWelcome]);
    } else if (emotionFromParams && messages.length === 0) {
      const emotionPrompt = `I'd like to explore my ${emotionFromParams} entries. What patterns do you see with my ${emotionFromParams} experiences? Can you help me understand when and why I feel ${emotionFromParams}?`;
      setInputText(emotionPrompt);
      
      const emotionWelcome: Message = {
        id: '1',
        type: 'bot',
        content: `I see you want to explore your ${emotionFromParams} experiences. I'm ready to help you analyze patterns and insights related to this emotion. What would you like to know?`,
        timestamp: new Date(),
      };
      setMessages([emotionWelcome]);
      
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 100);
    } else if (messages.length === 0) {
      const defaultWelcome: Message = {
        id: '1',
        type: 'bot',
        content: "Hi! I'm your personal growth coach. I'm here to help you explore your thoughts, work through challenges, and gain deeper insights. What's on your mind today?",
        timestamp: new Date(),
      };
      setMessages([defaultWelcome]);
    }
  }, [isCoachingMode, journalContext, emotionFromParams, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({
        title: "Unsupported file",
        description: "Only images and PDFs are supported in this preview.",
        variant: "destructive"
      });
      return;
    }
    setFileAttachment(file);
    textAreaRef.current?.focus();
  };

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

  const handleSend = async () => {
    if (!inputText.trim() && !fileAttachment) return;
    
    let attachmentUrl: string | undefined = undefined;
    let attachmentType: string | undefined = undefined;
    if (fileAttachment) {
      attachmentUrl = URL.createObjectURL(fileAttachment);
      attachmentType = fileAttachment.type;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      activityType: selectedActivity || undefined,
      timestamp: new Date(),
      ...(attachmentUrl ? { attachmentUrl, attachmentType } : {}),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setFileAttachment(null);
    textAreaRef.current?.focus();

    if (attachmentUrl && !inputText.trim()) return;

    // Check if this is a journal confirmation from a coaching conversation
    if (journalSuggestion.isWaitingForConfirmation && isJournalConfirmation(inputText)) {
      journalSuggestion.confirmSuggestion();
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Perfect! I've prepared your journal entry based on our conversation. You can edit it before saving if needed.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }

    // For coaching mode, use different detection logic
    if (isCoachingMode) {
      // In coaching mode, focus on conversation rather than immediate journaling
      const updatedHistory = [...conversationHistory, { role: 'user' as const, content: inputText }];
      const aiResponse = await generateResponse(inputText, updatedHistory, false, 'coaching');
      
      if (aiResponse) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
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
      // Regular chat mode with intent detection
      const intentResult = await detectIntent(inputText, selectedActivity, conversationHistory);
      console.log('Intent detection result:', intentResult);

      if (intentResult?.intent === 'journal' && intentResult.confidence > 0.7) {
        newMessage.isJournalEntry = true;
        setMessages(prev => prev.map(msg => msg.id === newMessage.id ? newMessage : msg));

        createEntry({
          content: inputText,
          title: selectedActivity ? `${selectedActivity} entry` : undefined,
        });

        const aiResponse = await generateResponse(inputText, conversationHistory, true);
        
        if (aiResponse) {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: aiResponse,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, botResponse]);
          setConversationHistory(prev => [...prev, 
            { role: 'user', content: inputText },
            { role: 'assistant', content: aiResponse }
          ]);
        }
      } else {
        const updatedHistory = [...conversationHistory, { role: 'user' as const, content: inputText }];
        const aiResponse = await generateResponse(inputText, updatedHistory, false);
        
        if (aiResponse) {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: aiResponse,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, botResponse]);
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
          setMessages(prev => [...prev, botResponse]);
        }
      }
    }

    setSelectedActivity(null);
  };

  const handleJournalSave = (content: string) => {
    createEntry({
      content: content,
      title: selectedActivity ? `${selectedActivity} entry` : undefined,
    });

    const botResponse: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: "Great! Your journal entry has been saved successfully. How are you feeling about what you've shared?",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botResponse]);
    journalSuggestion.clearSuggestion();
  };

  const handleJournalCancel = () => {
    const botResponse: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: "No worries! Your thoughts weren't saved. Feel free to continue our conversation or let me know if you'd like to journal about something else.",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botResponse]);
    journalSuggestion.clearSuggestion();
  };

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    setShowActivitySelector(false);
    textAreaRef.current?.focus();
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    setInputText(transcribedText);
    textAreaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#171c26]">
      <ChatHeader />
      <MessageList
        messages={messages}
        isDetectingIntent={isDetectingIntent}
        isGeneratingResponse={isGeneratingResponse}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        handleSend={handleSend}
        handleFileChange={handleFileChange}
        handleVoiceTranscription={handleVoiceTranscription}
        handleActivitySelect={handleActivitySelect}
        fileAttachment={fileAttachment}
        setFileAttachment={setFileAttachment}
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
        showActivitySelector={showActivitySelector}
        setShowActivitySelector={setShowActivitySelector}
        isDetectingIntent={isDetectingIntent}
        isGeneratingResponse={isGeneratingResponse}
        textAreaRef={textAreaRef}
      />
      
      <JournalPreviewModal
        isOpen={journalSuggestion.showPreview}
        onClose={journalSuggestion.clearSuggestion}
        suggestedContent={journalSuggestion.suggestedContent}
        onSave={handleJournalSave}
        onCancel={handleJournalCancel}
      />
    </div>
  );
};
