
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, BookOpen, MessageCircle } from 'lucide-react';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Activity Type Badge */}
        {message.activityType && (
          <div className="mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg">
              <BookOpen className="w-3 h-3" />
              {message.activityType}
            </span>
          </div>
        )}

        {/* Journal Entry Indicator */}
        {message.isJournalEntry && !message.activityType && (
          <div className="mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg">
              <BookOpen className="w-3 h-3" />
              journal entry
            </span>
          </div>
        )}
        
        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-lg'
              : 'bg-gray-700 text-gray-100 rounded-bl-lg'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* Timestamp */}
        <div
          className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isUser && <Check className="w-3 h-3 text-blue-400" />}
        </div>
      </div>

      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 order-1">
          <span className="text-white font-semibold text-xs">F</span>
        </div>
      )}
    </motion.div>
  );
};
