
import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

export const NetworkStatusIndicator: React.FC = () => {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  if (isOnline && !isSlowConnection) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <Alert 
        variant={isOnline ? "default" : "destructive"}
        className="bg-gray-800/90 border-gray-600 backdrop-blur-sm"
      >
        {isOnline ? (
          <Wifi className="h-4 w-4 text-orange-400" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <AlertDescription className="text-white">
          {isOnline 
            ? "Slow connection detected - some features may be delayed"
            : "You're offline - some features are unavailable"
          }
        </AlertDescription>
      </Alert>
    </div>
  );
};
