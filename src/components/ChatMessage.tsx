
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Added Avatar imports

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
      initial={{ opacity: 0, y: 10 }} // Slightly reduced y
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }} // Slightly faster transition
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`} // Added gap for avatar
    >
      {/* Avatar for bot */}
      {!isUser && (
        <Avatar className="w-8 h-8 order-1 self-end mb-6"> {/* Aligned with bottom of message block */}
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
            AI
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}> {/* Adjusted max-width and flex for items alignment */}
        {/* Activity Type Badge */}
        {message.activityType && (
          <div className="mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md border border-blue-200"> {/* Updated badge style */}
              <BookOpen className="w-3 h-3" />
              {message.activityType}
            </span>
          </div>
        )}

        {/* Journal Entry Indicator */}
        {message.isJournalEntry && !message.activityType && (
          <div className="mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md border border-green-200"> {/* Updated badge style */}
              <BookOpen className="w-3 h-3" />
              Journal Entry
            </span>
          </div>
        )}
        
        {/* Message Bubble */}
        <div
          className={`px-4 py-2.5 rounded-xl shadow-sm ${ // Standardized padding, increased rounding, added shadow
            isUser
              ? 'bg-blue-500 text-white rounded-br-md' // More subtle corner for user
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md' // Modern bot bubble
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Timestamp */}
        <div
          className={`flex items-center gap-1 mt-1.5 text-xs text-gray-500 ${ // Slightly increased margin-top
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isUser && <Check className="w-3 h-3 text-blue-300" />} {/* Adjusted check color for user bubble */}
        </div>
      </div>
    </motion.div>
  );
};

