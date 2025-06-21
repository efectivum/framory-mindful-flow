
import React, { useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { Message } from '@/types/chat';
import { LoadingSpinner } from './ui/loading-spinner';

interface MessageListProps {
  messages: Message[];
  isDetectingIntent: boolean;
  isGeneratingResponse: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onFeedback?: (data: {
    satisfaction: number;
    interventionType: string;
    successMetric: string;
    notes?: string;
  }) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isDetectingIntent,
  isGeneratingResponse,
  messagesEndRef,
  onFeedback,
}) => {
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDetectingIntent, isGeneratingResponse, messagesEndRef]);

  return (
    <div className="flex-1 overflow-y-auto ios-scroll">
      <div className="p-4 space-y-3 min-h-full">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            onFeedback={onFeedback}
          />
        ))}
        
        {(isDetectingIntent || isGeneratingResponse) && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 flex items-center space-x-2 max-w-[85%] md:max-w-[80%]">
              <LoadingSpinner size="sm" />
              <span className="text-sm">
                {isDetectingIntent ? 'Understanding...' : 'Thinking...'}
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};
