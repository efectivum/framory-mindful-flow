
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
      <div className="mobile-center mobile-bg-background">
        <Card className="mobile-card bg-card/50 border-border">
          <CardContent className="mobile-card-content mobile-text-center">
            <div className="animate-spin mobile-w-8 mobile-h-8 border-2 border-primary border-t-transparent mobile-rounded-full mobile-mx-auto mobile-mb-md"></div>
            <div className="mobile-text-primary mobile-text-lg">Checking authentication...</div>
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
      <div className="mobile-center mobile-bg-background">
        <Card className="mobile-card bg-destructive/20 border-destructive mobile-max-w-md">
          <CardContent className="mobile-card-content mobile-text-center">
            <div className="mobile-w-12 mobile-h-12 mobile-bg-destructive/20 mobile-rounded-full mobile-flex mobile-flex-center mobile-mx-auto mobile-mb-md">
              <Shield className="mobile-w-6 mobile-h-6 mobile-text-destructive" />
            </div>
            <h3 className="mobile-text-primary font-semibold mobile-mb-sm">Access Denied</h3>
            <p className="mobile-text-muted mobile-text-sm mobile-mb-md">
              You don't have admin privileges to access this area.
            </p>
            <div className="mobile-text-xs mobile-text-muted mobile-flow-xs">
              <div className="mobile-flex mobile-flex-center mobile-gap-sm">
                <User className="mobile-w-3 mobile-h-3" />
                <span>User: {user.email}</span>
              </div>
              <div className="mobile-flex mobile-flex-center mobile-gap-sm">
                <AlertCircle className="mobile-w-3 mobile-h-3" />
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
