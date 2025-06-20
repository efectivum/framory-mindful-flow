
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ChatHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-[#171c26] border-b border-gray-800 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="text-gray-300 hover:text-white hover:bg-gray-700 shrink-0"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <Avatar className="w-9 h-9">
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
          AI
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-gray-100 font-semibold text-base">Lumatori Coach</h1>
        <p className="text-green-400 text-xs font-medium">Online</p>
      </div>
    </div>
  );
};
