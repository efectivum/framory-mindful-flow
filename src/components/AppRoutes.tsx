import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import Chat from "../pages/Chat";
import Onboarding from "../pages/Onboarding";

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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <RequireOnboarding>
            <Index />
          </RequireOnboarding>
        </ProtectedRoute>
      } />
      <Route path="/auth" element={<Auth />} />
      <Route path="/complete-signup" element={<CompleteSignup />} />
      <Route path="/goals" element={
        <ProtectedRoute>
          <RequireOnboarding>
            <Goals />
          </RequireOnboarding>
        </ProtectedRoute>
      } />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <RequireOnboarding>
              <Journal />
            </RequireOnboarding>
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/history"
        element={
          <ProtectedRoute>
            <RequireOnboarding>
              <JournalHistory />
            </RequireOnboarding>
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/entry/:id"
        element={
          <ProtectedRoute>
            <RequireOnboarding>
              <JournalEntry />
            </RequireOnboarding>
          </ProtectedRoute>
        }
      />
      <Route path="/insights" element={
        <ProtectedRoute>
          <RequireOnboarding>
            <Insights />
          </RequireOnboarding>
        </ProtectedRoute>
      } />
      <Route path="/resources" element={<Resources />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <RequireOnboarding>
            <Profile />
          </RequireOnboarding>
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <RequireOnboarding>
            <Chat />
          </RequireOnboarding>
        </ProtectedRoute>
      } />
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
