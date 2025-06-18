
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { Message } from '@/types/chat';
import { CoachHabitSuggestion } from '@/components/CoachHabitSuggestion';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleHabitCreated = () => {
    // Force a refresh to update the display
    setRefreshKey(prev => prev + 1);
  };

  if (message.type === 'user') {
    return (
      <div className="flex items-start gap-3 self-end max-w-[85%] sm:max-w-[70%]">
        <div className="bg-blue-600 text-white px-4 py-2.5 rounded-xl rounded-br-md shadow-sm order-2">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          {message.activityType && (
            <Badge variant="secondary" className="mt-2 text-xs bg-blue-700 text-blue-100">
              {message.activityType}
            </Badge>
          )}
          {message.attachmentUrl && (
            <div className="mt-2">
              {message.attachmentType?.startsWith('image/') ? (
                <img
                  src={message.attachmentUrl}
                  alt="attachment"
                  className="max-w-full h-auto rounded border border-gray-700"
                />
              ) : (
                <div className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-200 text-xs">
                  File attachment
                </div>
              )}
            </div>
          )}
          <div className="text-xs text-blue-200 mt-1.5 opacity-75">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </div>
        </div>
        <Avatar className="w-8 h-8 order-1">
          <AvatarFallback className="bg-gray-600 text-white text-xs">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 self-start max-w-[85%] sm:max-w-[70%]">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">AI</AvatarFallback>
      </Avatar>
      <div className="space-y-2 flex-1">
        <div className="bg-[#161c26] text-gray-200 px-4 py-2.5 rounded-xl rounded-bl-md border border-gray-700 shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <div className="text-xs text-gray-500 mt-1.5">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </div>
        </div>
        
        {/* Show habit suggestion if present */}
        {message.habitSuggestion && (
          <CoachHabitSuggestion 
            key={refreshKey}
            suggestion={message.habitSuggestion}
            onHabitCreated={handleHabitCreated}
          />
        )}
      </div>
    </div>
  );
};
