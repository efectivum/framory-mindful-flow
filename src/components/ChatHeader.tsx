
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const ChatHeader = () => {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#171c26] border-b border-gray-800 shadow-sm">
      <Avatar className="w-9 h-9">
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
          AI
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-gray-100 font-semibold text-base">Framory Assistant</h1>
        <p className="text-green-400 text-xs font-medium">Online</p>
      </div>
    </div>
  );
};
