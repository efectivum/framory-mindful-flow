
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  activityType?: string;
  timestamp: Date;
  isJournalEntry?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar for bot */}
      {!isUser && (
        <Avatar className="w-8 h-8 order-1 self-end mb-6">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
            AI
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Activity Type Badge */}
        {message.activityType && (
          <div className="mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-950 text-blue-300 text-xs rounded-md border border-blue-800">
              <BookOpen className="w-3 h-3" />
              {message.activityType}
            </span>
          </div>
        )}

        {/* Journal Entry Indicator */}
        {message.isJournalEntry && !message.activityType && (
          <div className="mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-900 text-green-300 text-xs rounded-md border border-green-800">
              <BookOpen className="w-3 h-3" />
              Journal Entry
            </span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`px-4 py-2.5 rounded-xl shadow-sm ${
            isUser
              ? 'bg-blue-700 text-white rounded-br-md'
              : 'bg-[#242c3a] text-gray-100 border border-gray-800 rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Timestamp */}
        <div
          className={`flex items-center gap-1 mt-1.5 text-xs ${
            isUser ? 'justify-end text-gray-400' : 'justify-start text-gray-500'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && <Check className="w-3 h-3 text-blue-300" />}
        </div>
      </div>
    </motion.div>
  );
};
