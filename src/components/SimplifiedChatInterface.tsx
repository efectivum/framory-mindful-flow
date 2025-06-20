
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatErrorBoundary } from './chat/ChatErrorBoundary';
import { useConversationalAI } from '@/hooks/useConversationalAI';

export const SimplifiedChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { generateResponse } = useConversationalAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add initial message
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your personal growth coach. I'm here to help you explore your thoughts, work through challenges, and gain deeper insights. What's on your mind today?",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputText,
        timestamp: new Date(),
      };
      
      addMessage(userMessage);
      const currentInput = inputText;
      setInputText('');
      setIsGeneratingResponse(true);

      // Generate AI response
      const aiResponse = await generateResponse(currentInput, [], false, 'coaching');
      
      if (aiResponse) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        };
        addMessage(botResponse);
      } else {
        // Fallback response
        const fallbackResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm here to help you explore your thoughts and feelings. What's on your mind today?",
          timestamp: new Date(),
        };
        addMessage(fallbackResponse);
      }
    } catch (error) {
      console.error('Error in conversation:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      };
      addMessage(errorResponse);
    } finally {
      setIsGeneratingResponse(false);
      textAreaRef.current?.focus();
    }
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    setInputText(transcribedText);
    textAreaRef.current?.focus();
  };

  return (
    <ChatErrorBoundary>
      <div className="flex flex-col h-screen w-full bg-[#171c26]">
        <ChatHeader />
        <MessageList
          messages={messages}
          isDetectingIntent={false}
          isGeneratingResponse={isGeneratingResponse}
          messagesEndRef={messagesEndRef}
          onFeedback={() => {}} // Simplified - no feedback for now
        />
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          handleSend={handleSend}
          handleFileChange={() => {}} // Simplified - no file upload for now
          handleVoiceTranscription={handleVoiceTranscription}
          handleActivitySelect={() => {}} // Simplified - no activity selection for now
          fileAttachment={null}
          setFileAttachment={() => {}}
          selectedActivity={null}
          setSelectedActivity={() => {}}
          showActivitySelector={false}
          setShowActivitySelector={() => {}}
          isDetectingIntent={false}
          isGeneratingResponse={isGeneratingResponse}
          textAreaRef={textAreaRef}
        />
      </div>
    </ChatErrorBoundary>
  );
};
