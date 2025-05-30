
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Plus, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivitySelector } from './ActivitySelector';
import { ChatMessage } from './ChatMessage';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  activityType?: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm here to help you with your personal growth journey. What would you like to do today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      activityType: selectedActivity || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setSelectedActivity(null);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Got it! I've recorded your entry. Is there anything else you'd like to add?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">F</span>
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 md:bottom-0">
        {/* Activity Type Indicator */}
        {selectedActivity && (
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full border border-blue-200">
              {selectedActivity}
            </span>
          </div>
        )}

        <div className="flex items-end gap-2 relative">
          {/* Activity Selector Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActivitySelector(!showActivitySelector)}
            className={cn(
              "text-gray-500 hover:text-gray-700 p-2 shrink-0",
              showActivitySelector && "text-blue-600"
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
              placeholder="Type your message..."
              className="w-full max-h-32 min-h-12 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 focus:bg-white pr-20"
              rows={1}
            />
            
            {/* Input Controls */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600 p-1.5"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600 p-1.5"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Send/Voice Button */}
          {inputText.trim() ? (
            <Button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={toggleRecording}
              className={cn(
                "p-3 rounded-full shrink-0 transition-colors",
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
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
