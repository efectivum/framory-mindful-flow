
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ButtonErrorBoundaryProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  onRetry?: () => void;
}

export const ButtonErrorBoundary: React.FC<ButtonErrorBoundaryProps> = ({
  children,
  fallbackMessage = "Some buttons are not working properly",
  onRetry
}) => {
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
        setHasError(false);
      } catch (error) {
        console.error('Retry failed:', error);
      } finally {
        setIsRetrying(false);
      }
    } else {
      window.location.reload();
    }
  };

  if (hasError) {
    return (
      <Card className="bg-red-500/10 border-red-500/20 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-red-300 text-sm mb-3">{fallbackMessage}</p>
          <Button 
            onClick={handleRetry}
            disabled={isRetrying}
            size="sm"
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error('ButtonErrorBoundary caught error:', error);
    setHasError(true);
    return null;
  }
};
