import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NetworkStatusIndicator } from "@/components/NetworkStatusIndicator";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import { AppRoutes } from "@/components/AppRoutes";
import { OnboardingManager } from "@/components/OnboardingManager";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useErrorTracking } from "@/hooks/useErrorTracking";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Error tracking integration component
const ErrorTrackingProvider = ({ children }: { children: React.ReactNode }) => {
  const { logError } = useErrorTracking();

  React.useEffect(() => {
    // Make error logging available globally
    window.logError = logError;

    return () => {
      delete window.logError;
    };
  }, [logError]);

  return <>{children}</>;
};

const App = () => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Global error caught:', error, errorInfo);
        // Error tracking is handled in the ErrorBoundary component itself
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorTrackingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <NetworkStatusIndicator />
              <PWAInstallBanner />
              <OnboardingManager />
              <BrowserRouter>
                <ScrollToTop />
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </ErrorTrackingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
