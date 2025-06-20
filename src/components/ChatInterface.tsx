
import React, { useState, useRef, useEffect } from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalSuggestion } from '@/hooks/useJournalSuggestion';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Message } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { JournalPreviewModal } from './JournalPreviewModal';
import { ChatSessionSidebar } from './ChatSessionSidebar';
import { ChatContextManager } from './chat/ChatContextManager';
import { useSimpleConversationManager } from './chat/SimpleConversationManager';
import { useSimpleMessageManager } from './chat/SimpleMessageManager';
import { ChatErrorBoundary } from './chat/ChatErrorBoundary';
import { ChatLoadingState } from './chat/ChatLoadingState';
import { ChatOfflineState } from './chat/ChatOfflineState';

export const ChatInterface = () => {
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [showSessionSidebar, setShowSessionSidebar] = useState(false);
  const [chatContext, setChatContext] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const { createEntry } = useJournalEntries();
  const journalSuggestion = useJournalSuggestion();
  
  // Session management with error handling
  const { 
    currentSession, 
    createSession, 
    isLoading: sessionsLoading, 
    error: sessionsError 
  } = useChatSessions();
  
  const { 
    messages, 
    addMessage, 
    clearMessages, 
    isLoading: messagesLoading, 
    error: messagesError 
  } = useChatMessages(currentSession?.id || null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleContextReady = (context: any) => {
    try {
      console.log('ChatInterface: Context ready', context);
      setChatContext(context);
      setIsInitialized(true);
      setInitializationError(null);
    } catch (error) {
      console.error('ChatInterface: Error setting context', error);
      setInitializationError('Failed to initialize chat context');
    }
  };

  const handleInitialMessage = async (message: Message) => {
    try {
      console.log('ChatInterface: Adding initial message', message);
      
      // Create new session if none exists
      if (!currentSession) {
        const contextType = chatContext?.isCoachingMode ? 'coaching' : 'general';
        const session = await createSession('New Conversation', contextType, chatContext);
        if (!session) {
          console.warn('Failed to create session, continuing without persistence');
        }
      }

      await addMessage(message);
      
      // Set up input text for emotion context
      if (chatContext?.emotionFromParams && messageManager) {
        const emotionPrompt = `I'd like to explore my ${chatContext.emotionFromParams} entries. What patterns do you see with my ${chatContext.emotionFromParams} experiences? Can you help me understand when and why I feel ${chatContext.emotionFromParams}?`;
        messageManager.setInputText(emotionPrompt);
        
        setTimeout(() => {
          textAreaRef.current?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('ChatInterface: Error handling initial message:', error);
      // Don't set initialization error - continue with basic functionality
    }
  };

  const handleInputFocus = () => {
    textAreaRef.current?.focus();
  };

  // Initialize conversation manager
  const conversationManager = useSimpleConversationManager({
    onMessageAdd: addMessage,
    onInputFocus: handleInputFocus
  });

  // Initialize message manager
  const messageManager = useSimpleMessageManager({
    onMessageAdd: addMessage,
    textAreaRef
  });

  const handleSend = async () => {
    if (!messageManager || !conversationManager) {
      console.error('ChatInterface: Managers not initialized');
      return;
    }

    try {
      // Create session if none exists (but don't fail if it doesn't work)
      if (!currentSession) {
        const contextType = chatContext?.isCoachingMode ? 'coaching' : 'general';
        await createSession('New Conversation', contextType, chatContext);
      }

      // Get the input text before sending
      const inputText = messageManager.inputText;
      
      // Send the user message
      await messageManager.handleSend();
      
      // Generate AI response
      if (inputText.trim()) {
        await conversationManager.handleConversation(inputText);
      }
    } catch (error) {
      console.error('ChatInterface: Error sending message:', error);
    }
  };

  // Handle coaching feedback
  const handleCoachingFeedback = (feedbackData: {
    satisfaction: number;
    interventionType: string;
    successMetric: string;
    notes?: string;
  }) => {
    if (conversationManager?.recordUserFeedback) {
      const interactionId = `interaction_${Date.now()}`;
      conversationManager.recordUserFeedback(
        interactionId,
        feedbackData.satisfaction,
        feedbackData.interventionType,
        feedbackData.successMetric,
        feedbackData.notes
      );
    }
  };

  const handleJournalSave = (content: string) => {
    createEntry({
      content: content,
      title: messageManager?.selectedActivity ? `${messageManager.selectedActivity} entry` : undefined,
    });

    const botResponse: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: "Great! Your journal entry has been saved successfully. How are you feeling about what you've shared?",
      timestamp: new Date(),
    };
    addMessage(botResponse);
    journalSuggestion.clearSuggestion();
  };

  const handleJournalCancel = () => {
    const botResponse: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: "No worries! Your thoughts weren't saved. Feel free to continue our conversation or let me know if you'd like to journal about something else.",
      timestamp: new Date(),
    };
    addMessage(botResponse);
    journalSuggestion.clearSuggestion();
  };

  const handleActivitySelect = (activity: string) => {
    if (messageManager) {
      messageManager.setSelectedActivity(activity);
    }
    setShowActivitySelector(false);
    textAreaRef.current?.focus();
  };

  const handleRetry = async () => {
    try {
      setInitializationError(null);
      setIsInitialized(false);
      // Simple retry - just reload
      window.location.reload();
    } catch (error) {
      console.error('ChatInterface: Retry failed:', error);
    }
  };

  // Show loading state only while sessions are loading (simplified condition)
  if (sessionsLoading) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#171c26]">
        <ChatLoadingState />
      </div>
    );
  }

  // Show error state for initialization failures
  if (initializationError) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#171c26]">
        <ChatOfflineState onRetry={handleRetry} />
      </div>
    );
  }

  // Show offline state for connection errors
  if (sessionsError?.includes('Failed to fetch') || messagesError?.includes('Failed to fetch')) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#171c26]">
        <ChatOfflineState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <ChatErrorBoundary>
      <div className="flex flex-col h-screen w-full bg-[#171c26]">
        <ChatContextManager 
          onContextReady={handleContextReady}
          onInitialMessage={handleInitialMessage}
        />
        
        <ChatHeader onShowSessions={() => setShowSessionSidebar(true)} />
        <MessageList
          messages={messages}
          isDetectingIntent={messageManager?.isDetectingIntent || false}
          isGeneratingResponse={conversationManager?.isGeneratingResponse || false}
          messagesEndRef={messagesEndRef}
          onFeedback={handleCoachingFeedback}
        />
        <ChatInput
          inputText={messageManager?.inputText || ''}
          setInputText={messageManager?.setInputText || (() => {})}
          handleSend={handleSend}
          handleFileChange={messageManager?.handleFileChange || (() => {})}
          handleVoiceTranscription={messageManager?.handleVoiceTranscription || (() => {})}
          handleActivitySelect={handleActivitySelect}
          fileAttachment={messageManager?.fileAttachment || null}
          setFileAttachment={messageManager?.setFileAttachment || (() => {})}
          selectedActivity={messageManager?.selectedActivity || null}
          setSelectedActivity={messageManager?.setSelectedActivity || (() => {})}
          showActivitySelector={showActivitySelector}
          setShowActivitySelector={setShowActivitySelector}
          isDetectingIntent={messageManager?.isDetectingIntent || false}
          isGeneratingResponse={conversationManager?.isGeneratingResponse || false}
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
