
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Index from '@/pages/Index';
import MobileIndex from '@/pages/MobileIndex';
import Auth from '@/pages/Auth';
import CompleteSignup from '@/pages/CompleteSignup';
import ConversationalOnboarding from '@/pages/ConversationalOnboarding';
import Onboarding from '@/pages/Onboarding';
import Journal from '@/pages/Journal';
import JournalEntry from '@/pages/JournalEntry';
import JournalHistory from '@/pages/JournalHistory';
import Coach from '@/pages/Coach';
import Insights from '@/pages/Insights';
import Goals from '@/pages/Goals';
import Profile from '@/pages/Profile';
import Resources from '@/pages/Resources';
import NotFound from '@/pages/NotFound';
import PremiumSuccess from '@/pages/PremiumSuccess';
import { ChallengeDetail } from '@/components/ChallengeDetail';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/complete-signup" element={<CompleteSignup />} />
      <Route path="/premium-success" element={<PremiumSuccess />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="block md:hidden">
              <MobileIndex />
            </div>
            <div className="hidden md:block">
              <Index />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <ConversationalOnboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding-form"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/:id"
        element={
          <ProtectedRoute>
            <JournalEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal-history"
        element={
          <ProtectedRoute>
            <JournalHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coach"
        element={
          <ProtectedRoute>
            <Coach />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <Insights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenge/:id"
        element={
          <ProtectedRoute>
            <ChallengeDetail />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
