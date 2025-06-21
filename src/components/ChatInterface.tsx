
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
import { Message } from '@/types/chat';

export const ChatInterface = () => {
  const { createEntry } = useJournalEntries();
  const journalSuggestion = useJournalSuggestion();
  const { isDetectingIntent, generateResponse } = useConversationalAI();
  
  const {
    messages,
    sessions,
    currentSessionId,
    isGeneratingResponse,
    setIsGeneratingResponse,
    addMessage,
    switchToSession,
    startNewChat
  } = useLocalChatState();

  // Local UI state
  const [inputText, setInputText] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [showSessionSidebar, setShowSessionSidebar] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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

    await addMessage(userMessage);
    const currentInput = inputText;
    setInputText('');
    setFileAttachment(null);
    setSelectedActivity(null);
    textAreaRef.current?.focus();

    if (attachmentUrl && !currentInput.trim()) return;

    setIsGeneratingResponse(true);
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      
      const aiResponse = await generateResponse(currentInput, conversationHistory, false, 'coaching');

      if (aiResponse) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        };
        await addMessage(botResponse);

        if (aiResponse.toLowerCase().includes('would you like me to help you create a journal entry') || 
            aiResponse.toLowerCase().includes('capture these insights in your journal')) {
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
        await addMessage(errorResponse);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      await addMessage(errorResponse);
    } finally {
      setIsGeneratingResponse(false);
    }
  }, [inputText, fileAttachment, selectedActivity, messages, addMessage, generateResponse, journalSuggestion, setIsGeneratingResponse]);

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

  return (
    <ChatErrorBoundary>
      <div className="h-screen w-screen flex flex-col bg-[#171c26] overflow-hidden">
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
