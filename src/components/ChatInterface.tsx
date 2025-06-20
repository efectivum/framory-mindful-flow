import React, { useState, useRef, useEffect } from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalSuggestion } from '@/hooks/useJournalSuggestion';
import { Message } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { JournalPreviewModal } from './JournalPreviewModal';
import { ChatContextManager } from './chat/ChatContextManager';
import { useConversationManager } from './chat/ConversationManager';
import { useMessageManager } from './chat/MessageManager';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [chatContext, setChatContext] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const { createEntry } = useJournalEntries();
  const journalSuggestion = useJournalSuggestion();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleContextReady = (context: any) => {
    setChatContext(context);
  };

  const handleInitialMessage = (message: Message) => {
    setMessages([message]);
    
    // Set up input text for emotion context
    if (chatContext?.emotionFromParams) {
      const emotionPrompt = `I'd like to explore my ${chatContext.emotionFromParams} entries. What patterns do you see with my ${chatContext.emotionFromParams} experiences? Can you help me understand when and why I feel ${chatContext.emotionFromParams}?`;
      messageManager.setInputText(emotionPrompt);
      
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 100);
    }
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleInputFocus = () => {
    textAreaRef.current?.focus();
  };

  // Initialize conversation manager
  const conversationManager = useConversationManager({
    isCoachingMode: chatContext?.isCoachingMode || false,
    onMessageAdd: addMessage,
    onInputFocus: handleInputFocus
  });

  // Initialize message manager
  const messageManager = useMessageManager({
    isCoachingMode: chatContext?.isCoachingMode || false,
    onConversation: conversationManager.handleConversation,
    textAreaRef
  });

  const handleSend = async () => {
    await messageManager.handleSend(addMessage);
  };

  // Handle coaching feedback
  const handleCoachingFeedback = (feedbackData: {
    satisfaction: number;
    interventionType: string;
    successMetric: string;
    notes?: string;
  }) => {
    // Use the conversation manager's feedback function
    if (conversationManager.recordUserFeedback) {
      // For now, we'll create a dummy interaction ID since we don't have it
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
      title: messageManager.selectedActivity ? `${messageManager.selectedActivity} entry` : undefined,
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
    messageManager.setSelectedActivity(activity);
    setShowActivitySelector(false);
    textAreaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#171c26]">
      <ChatContextManager 
        onContextReady={handleContextReady}
        onInitialMessage={handleInitialMessage}
      />
      
      <ChatHeader />
      <MessageList
        messages={messages}
        isDetectingIntent={messageManager.isDetectingIntent}
        isGeneratingResponse={conversationManager.isGeneratingResponse}
        messagesEndRef={messagesEndRef}
        onFeedback={handleCoachingFeedback}
      />
      <ChatInput
        inputText={messageManager.inputText}
        setInputText={messageManager.setInputText}
        handleSend={handleSend}
        handleFileChange={messageManager.handleFileChange}
        handleVoiceTranscription={messageManager.handleVoiceTranscription}
        handleActivitySelect={handleActivitySelect}
        fileAttachment={messageManager.fileAttachment}
        setFileAttachment={messageManager.setFileAttachment}
        selectedActivity={messageManager.selectedActivity}
        setSelectedActivity={messageManager.setSelectedActivity}
        showActivitySelector={showActivitySelector}
        setShowActivitySelector={setShowActivitySelector}
        isDetectingIntent={messageManager.isDetectingIntent}
        isGeneratingResponse={conversationManager.isGeneratingResponse}
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
