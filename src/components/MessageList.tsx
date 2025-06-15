
import React from 'react';
import { Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  isDetectingIntent: boolean;
  isGeneratingResponse: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isDetectingIntent,
  isGeneratingResponse,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#202734]">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {(isDetectingIntent || isGeneratingResponse) && (
         <div className="flex items-center gap-3 self-start py-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">AI</AvatarFallback>
          </Avatar>
          <div className="bg-[#161c26] text-gray-200 px-4 py-2.5 rounded-xl rounded-bl-md border border-gray-700 shadow-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              <span className="text-sm text-gray-400">
                {isDetectingIntent ? 'Understanding...' : (isGeneratingResponse ? 'Thinking...' : 'Processing...')}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
