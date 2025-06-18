
import React from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Wifi } from 'lucide-react';

interface QueryErrorFallbackProps {
  resetError: () => void;
}

const QueryErrorFallback: React.FC<QueryErrorFallbackProps> = ({ resetError }) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wifi className="w-6 h-6 text-orange-400" />
        </div>
        <h3 className="text-white font-semibold mb-2">Unable to load data</h3>
        <p className="text-gray-400 text-sm mb-4">
          We're having trouble connecting to our servers. Your data is safe.
        </p>
        <Button 
          onClick={resetError}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
}

export const QueryErrorBoundary: React.FC<QueryErrorBoundaryProps> = ({ children }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary 
          fallback={<QueryErrorFallback resetError={reset} />}
          onError={() => {
            console.error('Query error caught by boundary');
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
