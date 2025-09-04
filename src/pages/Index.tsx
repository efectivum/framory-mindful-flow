
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-lg text-muted-foreground font-medium">Loading your sanctuary...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-sm w-full">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="w-20 h-20 rounded-xl mx-auto flex items-center justify-center shadow-2xl animate-breathe bg-primary">
              <Calendar className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold gradient-text">
                Welcome to Lumatori
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
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
