
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const ChatLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <Card className="max-w-md w-full bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-white font-medium mb-2">Loading Coach</h3>
          <p className="text-gray-400 text-sm">
            Setting up your coaching session...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
