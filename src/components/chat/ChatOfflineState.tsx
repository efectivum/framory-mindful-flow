
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';

interface ChatOfflineStateProps {
  onRetry?: () => void;
}

export const ChatOfflineState: React.FC<ChatOfflineStateProps> = ({ onRetry }) => {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <Card className="max-w-md w-full bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Connection Issue</h3>
          <p className="text-gray-400 text-sm mb-4">
            Unable to connect to the coaching service. Please check your internet connection and try again.
          </p>
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
