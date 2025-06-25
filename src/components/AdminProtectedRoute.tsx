
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Shield, User } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  console.log('AdminProtectedRoute:', { 
    user: user?.email, 
    loading, 
    isAdmin, 
    location: location.pathname 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-white text-lg">Checking authentication...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    console.log('AdminProtectedRoute: No user, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    console.log('AdminProtectedRoute: User not admin, redirecting to home');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Card className="bg-red-900/20 border-red-800 max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Access Denied</h3>
            <p className="text-gray-400 text-sm mb-4">
              You don't have admin privileges to access this area.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <User className="w-3 h-3" />
                <span>User: {user.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-3 h-3" />
                <span>Admin Status: {isAdmin ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('AdminProtectedRoute: Access granted, rendering admin content');
  return <>{children}</>;
};
