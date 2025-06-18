import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import Index from "../pages/Index";
import Auth from "../pages/Auth";
import CompleteSignup from "../pages/CompleteSignup";
import Goals from "../pages/Goals";
import Journal from '@/pages/Journal';
import JournalEntry from '@/pages/JournalEntry';
import JournalHistory from '@/pages/JournalHistory';
import Insights from "../pages/Insights";
import Resources from "../pages/Resources";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Coach from "../pages/Coach";
import Onboarding from "../pages/Onboarding";
import ConversationalOnboarding from "../pages/ConversationalOnboarding";
import PremiumSuccess from "../pages/PremiumSuccess";

import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from '@/hooks/useAuth';

// Route wrapper to check onboarding completion based on preferences
const RequireOnboarding = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { preferences, isLoading } = useUserPreferences();

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <span className="text-white text-lg">Loading...</span>
      </div>
    );
  }

  // If user has not set preferences (onboarding not complete), redirect to onboarding
  if (
    user &&
    (!preferences ||
      !preferences.tone_of_voice ||
      !preferences.growth_focus ||
      !preferences.notification_frequency)
  ) {
    return <Onboarding />;
  }

  return <>{children}</>;
};

// Wrapper component for route-level error boundaries and query error handling
const RouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <RouteErrorBoundary>
    <QueryErrorBoundary>
      {children}
    </QueryErrorBoundary>
  </RouteErrorBoundary>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <RequireOnboarding>
                <Index />
              </RequireOnboarding>
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route 
        path="/auth" 
        element={
          <RouteWrapper>
            <Auth />
          </RouteWrapper>
        } 
      />
      <Route 
        path="/complete-signup" 
        element={
          <RouteWrapper>
            <CompleteSignup />
          </RouteWrapper>
        } 
      />
      <Route
        path="/goals"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <RequireOnboarding>
                <Goals />
              </RequireOnboarding>
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/journal"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <RequireOnboarding>
                <Journal />
              </RequireOnboarding>
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/journal/history"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <RequireOnboarding>
                <JournalHistory />
              </RequireOnboarding>
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/journal/entry/:id"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <RequireOnboarding>
                <JournalEntry />
              </RequireOnboarding>
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/insights"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <RequireOnboarding>
                <Insights />
              </RequireOnboarding>
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route 
        path="/resources" 
        element={
          <RouteWrapper>
            <Resources />
          </RouteWrapper>
        } 
      />
      <Route
        path="/profile"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <RequireOnboarding>
                <Profile />
              </RequireOnboarding>
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/coach"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <RequireOnboarding>
                <Coach />
              </RequireOnboarding>
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/premium-success"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <PremiumSuccess />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/onboarding"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <ConversationalOnboarding />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route 
        path="*" 
        element={
          <RouteWrapper>
            <NotFound />
          </RouteWrapper>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
