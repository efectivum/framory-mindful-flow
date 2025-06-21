
import { useState, useRef, useCallback } from 'react';
import { Message } from '@/types/chat';

export const useChatState = () => {
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

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return {
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
  };
};
