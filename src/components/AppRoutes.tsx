
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminProtectedRoute } from './AdminProtectedRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import CompleteSignup from '@/pages/CompleteSignup';
import ConversationalOnboarding from '@/pages/ConversationalOnboarding';
import Onboarding from '@/pages/Onboarding';
import Journal from '@/pages/Journal';
import JournalEntry from '@/pages/JournalEntry';
import Coach from '@/pages/Coach';
import Insights from '@/pages/Insights';
import Goals from '@/pages/Goals';
import Profile from '@/pages/Profile';
import Resources from '@/pages/Resources';
import NotFound from '@/pages/NotFound';
import PremiumSuccess from '@/pages/PremiumSuccess';
import EmailConfirmation from '@/pages/EmailConfirmation';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUsers from '@/pages/AdminUsers';
import AdminNotifications from '@/pages/AdminNotifications';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminContent from '@/pages/AdminContent';
import AdminSystem from '@/pages/AdminSystem';
import { ChallengeDetail } from '@/components/ChallengeDetail';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/confirm" element={<EmailConfirmation />} />
      <Route path="/complete-signup" element={<CompleteSignup />} />
      <Route path="/premium-success" element={<PremiumSuccess />} />
      
      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminUsers />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <AdminProtectedRoute>
            <AdminNotifications />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminProtectedRoute>
            <AdminAnalytics />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/content"
        element={
          <AdminProtectedRoute>
            <AdminContent />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/system"
        element={
          <AdminProtectedRoute>
            <AdminSystem />
          </AdminProtectedRoute>
        }
      />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
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
      
      {/* Unified Journal Routes */}
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/entry/:id"
        element={
          <ProtectedRoute>
            <JournalEntry />
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
