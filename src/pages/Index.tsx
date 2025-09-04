
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Loader2 } from 'lucide-react';
import React from 'react';
import { TodayDashboard } from '@/components/today/TodayDashboard';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mobile-page mobile-center">
        <div className="mobile-center-content mobile-flow">
          <Loader2 className="mobile-w-6 mobile-h-6 animate-spin mobile-text-accent" />
          <div className="mobile-text-lg mobile-text-accent font-medium">Loading your sanctuary...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mobile-page mobile-center">
        <div className="mobile-center-content mobile-container">
          <div className="mobile-flow-loose text-center">
            <div className="mobile-w-20 mobile-h-20 mobile-rounded-lg mx-auto mobile-flex mobile-flex-center shadow-2xl animate-breathe mobile-bg-accent">
              <Calendar className="mobile-w-10 mobile-h-10 mobile-text-white" />
            </div>
            <div className="mobile-flow">
              <h1 className="mobile-display mobile-text-accent">
                Welcome to Lumatori
              </h1>
              <p className="mobile-text-lg mobile-text-muted">
                Your personal sanctuary for mindful growth and reflection
              </p>
            </div>
            <Button 
              size="lg" 
              className="mobile-w-full mobile-h-14 text-lg font-medium" 
              asChild
            >
              <Link to="/auth">
                Begin Your Journey
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <TodayDashboard />;
};

export default Index;
