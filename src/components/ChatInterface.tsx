
import React, { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalSuggestion } from '@/hooks/useJournalSuggestion';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useChatState } from '@/hooks/useChatState';
import { useChatMessageHandler } from '@/components/chat/ChatMessageHandler';
import { ChatInitializer } from './chat/ChatInitializer';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { JournalPreviewModal } from './JournalPreviewModal';
import { ChatSessionSidebar } from './ChatSessionSidebar';
import { ChatErrorBoundary } from './chat/ChatErrorBoundary';
import { LoadingSpinner } from './ui/loading-spinner';

export const ChatInterface = () => {
  const { loading: authLoading } = useAuth();
  const { createEntry } = useJournalEntries();
  const journalSuggestion = useJournalSuggestion();
  const { isDetectingIntent } = useConversationalAI();
  
  const chatState = useChatState();
  const {
    messages,
    setMessages,
    inputText,
    setInputText,
    selectedActivity,
    setSelectedActivity,
    fileAttachment,
    setFileAttachment,
    showActivitySelector,
    setShowActivitySelector,
    showSessionSidebar,
    setShowSessionSidebar,
    isGeneratingResponse,
    setIsGeneratingResponse,
    isInitialized,
    setIsInitialized,
    isLoading,
    setIsLoading,
    messagesEndRef,
    textAreaRef,
    addMessage,
    scrollToBottom
  } = chatState;

  const { handleSend } = useChatMessageHandler({
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
  });

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

    const botResponse = {
      id: Date.now().toString(),
      type: 'bot' as const,
      content: "Great! Your journal entry has been saved successfully. How are you feeling about what you've shared?",
      timestamp: new Date(),
    };
    addMessage(botResponse);
    journalSuggestion.clearSuggestion();
  }, [createEntry, selectedActivity, addMessage, journalSuggestion]);

  const handleJournalCancel = useCallback(() => {
    const botResponse = {
      id: Date.now().toString(),
      type: 'bot' as const,
      content: "No worries! Your thoughts weren't saved. Feel free to continue our conversation or let me know if you'd like to journal about something else.",
      timestamp: new Date(),
    };
    addMessage(botResponse);
    journalSuggestion.clearSuggestion();
  }, [addMessage, journalSuggestion]);

  // Coaching feedback
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
        <ChatInitializer
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isInitialized={isInitialized}
          setIsInitialized={setIsInitialized}
          setMessages={setMessages}
          setInputText={setInputText}
          textAreaRef={textAreaRef}
          scrollToBottom={scrollToBottom}
        />
        
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
