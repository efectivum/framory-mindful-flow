
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Plus, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivitySelector } from './ActivitySelector';
import { ChatMessage } from './ChatMessage';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  activityType?: string;
  timestamp: Date;
  isJournalEntry?: boolean;
}

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
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  
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

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      activityType: selectedActivity || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputText;
    setInputText('');

    // Detect intent using AI
    const intentResult = await detectIntent(currentInput, selectedActivity, conversationHistory);
    console.log('Intent detection result:', intentResult);

    if (intentResult?.intent === 'journal' && intentResult.confidence > 0.7) {
      // Handle as journal entry
      newMessage.isJournalEntry = true;
      setMessages(prev => prev.map(msg => msg.id === newMessage.id ? newMessage : msg));

      // Create journal entry
      createEntry({
        content: currentInput,
        title: selectedActivity ? `${selectedActivity} entry` : undefined,
      });

      // Generate immediate coaching response for the journal entry
      const aiResponse = await generateResponse(currentInput, conversationHistory, true);
      
      if (aiResponse) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
        setConversationHistory(prev => [...prev, 
          { role: 'user', content: currentInput },
          { role: 'assistant', content: aiResponse }
        ]);
      }
    } else {
      // Handle as conversation
      const updatedHistory = [...conversationHistory, { role: 'user' as const, content: currentInput }];
      setConversationHistory(updatedHistory);

      const aiResponse = await generateResponse(currentInput, conversationHistory, false);
      
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
        // Fallback response
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    setShowActivitySelector(false);
    textAreaRef.current?.focus();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-100">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-lg">F</span>
        </div>
        <div>
          <h1 className="text-gray-900 font-semibold">Framory Assistant</h1>
          <p className="text-gray-600 text-sm">Your personal growth companion</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Loading indicators */}
        {(isDetectingIntent || isGeneratingResponse) && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 px-4 py-3 rounded-2xl rounded-bl-lg">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">
                  {isDetectingIntent ? 'Understanding...' : 'Thinking...'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 p-4 md:bottom-0">
        {/* Activity Type Indicator */}
        {selectedActivity && (
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100">
              Logging as: {selectedActivity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedActivity(null)}
              className="text-gray-500 text-xs"
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="flex items-end gap-3 relative">
          {/* Activity Selector Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActivitySelector(!showActivitySelector)}
            className={cn(
              "text-gray-500 hover:text-gray-700 p-2 shrink-0 rounded-full",
              showActivitySelector && "text-blue-600 bg-blue-50"
            )}
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Activity Selector Popup */}
          <ActivitySelector
            isOpen={showActivitySelector}
            onSelect={handleActivitySelect}
            onClose={() => setShowActivitySelector(false)}
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textAreaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedActivity ? `Log your ${selectedActivity} experience...` : "Ask me anything or log an activity..."}
              className="w-full max-h-32 min-h-12 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-20 shadow-sm"
              rows={1}
              disabled={isDetectingIntent || isGeneratingResponse}
            />
            
            {/* Input Controls */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Send/Voice Button */}
          {inputText.trim() ? (
            <Button
              onClick={handleSend}
              disabled={isDetectingIntent || isGeneratingResponse}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shrink-0 shadow-sm disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={toggleRecording}
              className={cn(
                "p-3 rounded-full shrink-0 transition-colors shadow-sm",
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200"
              )}
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
