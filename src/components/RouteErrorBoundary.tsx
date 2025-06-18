
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RouteErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

const RouteErrorFallback: React.FC<RouteErrorFallbackProps> = ({ resetError }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-lg bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-white">Page Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-center">
            This page encountered an error, but the rest of Lumatori is still working.
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={resetError}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Page
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary 
      fallback={<RouteErrorFallback error={undefined} resetError={() => window.location.reload()} />}
    >
      {children}
    </ErrorBoundary>
  );
};
