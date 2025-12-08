import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalSuggestion } from '@/hooks/useJournalSuggestion';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useLocalChatState } from '@/hooks/useLocalChatState';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { JournalPreviewModal } from './JournalPreviewModal';
import { ChatSessionSidebar } from './ChatSessionSidebar';
import { ChatErrorBoundary } from './chat/ChatErrorBoundary';
import { LoadingSpinner } from './ui/loading-spinner';
import { Message } from '@/types/chat';
import { createUserMessage, createBotMessage } from '@/utils/messageUtils';
import { streamChat } from '@/utils/streamingChat';

export const ChatInterface = () => {
  // Initialize all hooks first - this ensures consistent hook order
  const { user } = useAuth();
  const { createEntry } = useJournalEntries();
  const journalSuggestion = useJournalSuggestion();
  const { isDetectingIntent } = useConversationalAI();
  
  const {
    messages,
    sessions,
    currentSessionId,
    isGeneratingResponse,
    setIsGeneratingResponse,
    isLoadingSessions,
    addMessage,
    setMessages,
    switchToSession,
    startNewChat,
    hasInitialized
  } = useLocalChatState();

  // Local UI state hooks
  const [inputText, setInputText] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [showSessionSidebar, setShowSessionSidebar] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Stable callback for scrolling
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle sending messages with simplified dependencies
  const handleSend = useCallback(async () => {
    if (!inputText.trim() && !fileAttachment) return;
    
    let attachmentUrl: string | undefined = undefined;
    let attachmentType: string | undefined = undefined;
    if (fileAttachment) {
      attachmentUrl = URL.createObjectURL(fileAttachment);
      attachmentType = fileAttachment.type;
    }

    const userMessage = createUserMessage(
      inputText,
      selectedActivity || undefined,
      attachmentUrl,
      attachmentType
    );

    await addMessage(userMessage);
    const currentInput = inputText;
    setInputText('');
    setFileAttachment(null);
    setSelectedActivity(null);
    textAreaRef.current?.focus();

    if (attachmentUrl && !currentInput.trim()) return;

    setIsGeneratingResponse(true);
    
    // Create streaming bot message placeholder
    const streamingMessageId = `streaming-${Date.now()}`;
    const streamingMessage = createBotMessage('');
    streamingMessage.id = streamingMessageId;
    
    // Add empty message that will be updated with streaming content
    setMessages(prev => [...prev, streamingMessage]);
    
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      
      // Add the new user message to history
      conversationHistory.push({ role: 'user', content: currentInput });
      
      let fullResponse = '';
      
      await streamChat({
        messages: conversationHistory,
        userId: user?.id || '',
        coachingMode: true,
        onDelta: (chunk) => {
          fullResponse += chunk;
          // Update the streaming message with accumulated content
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessageId 
              ? { ...msg, content: fullResponse }
              : msg
          ));
        },
        onDone: () => {
          // Persist the final message
          const finalMessage = createBotMessage(fullResponse);
          finalMessage.id = streamingMessageId;
          
          if (fullResponse.toLowerCase().includes('would you like me to help you create a journal entry') || 
              fullResponse.toLowerCase().includes('capture these insights in your journal')) {
            const conversationSummary = messages.map(msg => 
              `${msg.type === 'user' ? 'You' : 'Coach'}: ${msg.content}`
            ).join('\n\n');
            journalSuggestion.setSuggestion(conversationSummary);
          }
        },
        onError: (error) => {
          console.error('Streaming error:', error);
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessageId 
              ? { ...msg, content: "I'm sorry, I encountered an error. Please try again." }
              : msg
          ));
        }
      });
      
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === streamingMessageId 
          ? { ...msg, content: "I'm sorry, I encountered an error. Please try again." }
          : msg
      ));
    } finally {
      setIsGeneratingResponse(false);
    }
  }, [inputText, fileAttachment, selectedActivity, messages, addMessage, setMessages, user?.id, journalSuggestion, setIsGeneratingResponse]);

  // File handling
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      console.warn('Unsupported file type');
      return;
    }
    setFileAttachment(file);
    textAreaRef.current?.focus();
  }, []);

  // Voice transcription
  const handleVoiceTranscription = useCallback((transcribedText: string) => {
    setInputText(transcribedText);
    textAreaRef.current?.focus();
  }, []);

  // Activity selection
  const handleActivitySelect = useCallback((activity: string) => {
    setSelectedActivity(activity);
    setShowActivitySelector(false);
    textAreaRef.current?.focus();
  }, []);

  // Journal handling
  const handleJournalSave = useCallback((content: string) => {
    createEntry({
      content: content,
      title: selectedActivity ? `${selectedActivity} entry` : undefined,
    });

    const botResponse = createBotMessage(
      "Great! Your journal entry has been saved successfully. How are you feeling about what you've shared?"
    );
    addMessage(botResponse);
    journalSuggestion.clearSuggestion();
  }, [createEntry, selectedActivity, addMessage, journalSuggestion]);

  const handleJournalCancel = useCallback(() => {
    const botResponse = createBotMessage(
      "No worries! Your thoughts weren't saved. Feel free to continue our conversation or let me know if you'd like to journal about something else."
    );
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

  // Now handle loading state rendering - after all hooks are defined
  if (isLoadingSessions || !hasInitialized) {
    return (
      <div className="mobile-h-screen mobile-w-screen mobile-flex mobile-flex-center mobile-bg-primary">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mobile-mb-4" />
          <h3 className="mobile-text-white font-medium mobile-mb-2">Setting up your chat...</h3>
          <p className="mobile-text-muted mobile-text-body">Loading your conversation history</p>
        </div>
      </div>
    );
  }

  return (
    <ChatErrorBoundary>
      <div className="mobile-h-screen mobile-w-screen mobile-flex mobile-flex-col mobile-bg-primary mobile-overflow-hidden">
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
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSwitchSession={switchToSession}
          onNewChat={startNewChat}
        />
      </div>
    </ChatErrorBoundary>
  );
};
