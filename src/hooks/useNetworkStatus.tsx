
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown'
  });
  const { toast } = useToast();

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setNetworkStatus({
        isOnline: navigator.onLine,
        isSlowConnection: connection ? connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g' : false,
        connectionType: connection ? connection.effectiveType : 'unknown'
      });
    };

    const handleOnline = () => {
      updateNetworkStatus();
      toast({
        title: "Back online!",
        description: "Your connection has been restored.",
      });
    };

    const handleOffline = () => {
      updateNetworkStatus();
      toast({
        title: "You're offline",
        description: "Some features may not work until you reconnect.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection type changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    // Initial check
    updateNetworkStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, [toast]);

  return networkStatus;
};
