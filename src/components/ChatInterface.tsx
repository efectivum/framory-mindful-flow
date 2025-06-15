
import React, { useState, useRef, useEffect } from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm here to help you with your personal growth journey. You can chat with me about anything or log activities using the + button. What would you like to do today?",
      timestamp: new Date(),
    },
  ]);
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

    setSelectedActivity(null);
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
    </div>
  );
};
