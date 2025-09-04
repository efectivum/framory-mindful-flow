
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
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <div className="mobile-text-lg text-primary font-medium">Loading your sanctuary...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mobile-page mobile-center">
        <div className="mobile-center-content mobile-container">
          <div className="mobile-flow-loose text-center">
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-breathe bg-primary">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <div className="mobile-flow">
              <h1 className="mobile-display text-primary">
                Welcome to Lumatori
              </h1>
              <p className="mobile-text-lg text-muted-foreground">
                Your personal sanctuary for mindful growth and reflection
              </p>
            </div>
            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-medium" 
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
