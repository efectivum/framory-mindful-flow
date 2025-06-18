
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AsyncErrorHandlerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onRetry?: () => void;
  errorMessage?: string;
}

export const AsyncErrorHandler: React.FC<AsyncErrorHandlerProps> = ({
  children,
  fallback,
  onRetry,
  errorMessage = "Operation failed"
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
    }
  };

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-gray-300 text-sm mb-3">{errorMessage}</p>
          {onRetry && (
            <Button 
              onClick={handleRetry}
              disabled={isRetrying}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <React.Suspense 
      fallback={
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Loading...</p>
          </CardContent>
        </Card>
      }
    >
      {children}
    </React.Suspense>
  );
};

// HOC for handling async component errors
export const withAsyncErrorHandling = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorMessage?: string
) => {
  return React.forwardRef<any, P>((props, ref) => {
    return (
      <AsyncErrorHandler errorMessage={errorMessage}>
        <WrappedComponent {...props} ref={ref} />
      </AsyncErrorHandler>
    );
  });
};
