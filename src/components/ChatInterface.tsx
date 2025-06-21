
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalSuggestion } from '@/hooks/useJournalSuggestion';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { JournalPreviewModal } from './JournalPreviewModal';
import { ChatSessionSidebar } from './ChatSessionSidebar';
import { ChatErrorBoundary } from './chat/ChatErrorBoundary';
import { ChatLoadingState } from './chat/ChatLoadingState';
import { LoadingSpinner } from './ui/loading-spinner';

export const ChatInterface = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();
  
  // Simple state management
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [showSessionSidebar, setShowSessionSidebar] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const { createEntry } = useJournalEntries();
  const journalSuggestion = useJournalSuggestion();
  const { generateResponse, detectIntent, isDetectingIntent } = useConversationalAI();

  // Context detection
  const emotionFromParams = searchParams.get('emotion');
  const journalContext = location.state?.journalContext;
  const contextType = location.state?.contextType;
  const isCoachingMode = location.pathname === '/coach' || contextType === 'journal-entry';

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Add message helper
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Wait for auth to be stable before initializing
  useEffect(() => {
    if (authLoading) return;
    
    // Small delay to prevent flickering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [authLoading]);

  // Initialize with welcome message only after loading is complete
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

    // Set up input text for emotion context
    if (emotionFromParams) {
      const emotionPrompt = `I'd like to explore my ${emotionFromParams} entries. What patterns do you see with my ${emotionFromParams} experiences? Can you help me understand when and why I feel ${emotionFromParams}?`;
      setInputText(emotionPrompt);
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 200);
    }
  }, [isLoading, isInitialized, isCoachingMode, journalContext, emotionFromParams]);

  // Handle sending messages
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

    // Generate AI response
    setIsGeneratingResponse(true);
    try {
      let aiResponse: string | null = null;
      
      if (isCoachingMode) {
        // Enhanced coaching mode
        const conversationHistory = messages.map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));
        
        aiResponse = await generateResponse(currentInput, conversationHistory, false, 'coaching');
      } else {
        // Regular mode with intent detection
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

        // Check for journaling suggestions
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
  }, [inputText, fileAttachment, selectedActivity, messages, addMessage, isCoachingMode, generateResponse, detectIntent, createEntry, journalSuggestion]);

  // File handling
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      console.warn('Unsupported file type');
      return;
    }
    setFileAttachment(file);
    textAreaRef.current?.focus();
  };

  // Voice transcription
  const handleVoiceTranscription = (transcribedText: string) => {
    setInputText(transcribedText);
    textAreaRef.current?.focus();
  };

  // Activity selection
  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    setShowActivitySelector(false);
    textAreaRef.current?.focus();
  };

  // Journal handling
  const handleJournalSave = useCallback((content: string) => {
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
    addMessage(botResponse);
    journalSuggestion.clearSuggestion();
  }, [createEntry, selectedActivity, addMessage, journalSuggestion]);

  const handleJournalCancel = useCallback(() => {
    const botResponse: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: "No worries! Your thoughts weren't saved. Feel free to continue our conversation or let me know if you'd like to journal about something else.",
      timestamp: new Date(),
    };
    addMessage(botResponse);
    journalSuggestion.clearSuggestion();
  }, [addMessage, journalSuggestion]);

  // Coaching feedback (placeholder)
  const handleCoachingFeedback = useCallback((feedbackData: {
    satisfaction: number;
    interventionType: string;
    successMetric: string;
    notes?: string;
  }) => {
    console.log('Coaching feedback received:', feedbackData);
  }, []);

  // Show loading state while initializing
  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#171c26]">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">Loading Coach</h3>
          <p className="text-gray-400 text-sm">
            Setting up your coaching session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ChatErrorBoundary>
      <div className="flex flex-col h-screen w-full bg-[#171c26]">
        <ChatHeader onShowSessions={() => setShowSessionSidebar(true)} />
        
        <MessageList
          messages={messages}
          isDetectingIntent={isDetectingIntent}
          isGeneratingResponse={isGeneratingResponse}
          messagesEndRef={messagesEndRef}
          onFeedback={handleCoachingFeedback}
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

        <ChatSessionSidebar
          isOpen={showSessionSidebar}
          onClose={() => setShowSessionSidebar(false)}
        />
      </div>
    </ChatErrorBoundary>
  );
};
