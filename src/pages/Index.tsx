
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--app-bg-primary)' }}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <div className="text-lg text-white font-medium">Loading your sanctuary...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--app-bg-primary)' }}>
        <div className="text-center max-w-md w-full space-y-8">
          <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-breathe" 
               style={{ background: 'var(--app-accent-primary)' }}>
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-hero mb-4">
              Welcome to Lumatori
            </h1>
            <p className="text-subhero">
              Your personal sanctuary for mindful growth and reflection
            </p>
          </div>
          <Button 
            size="lg" 
            className="btn-organic w-full h-14 text-lg font-medium shadow-2xl glow-primary" 
            asChild
          >
            <Link to="/auth">
              Begin Your Journey
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return <TodayDashboard />;
};

export default Index;
