
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
