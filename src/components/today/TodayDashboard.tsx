import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { DailyMoodCheck } from './DailyMoodCheck';
import { TodayHabits } from './TodayHabits';
import { CoachQuickAccess } from './CoachQuickAccess';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';

export const TodayDashboard: React.FC = () => {
  const { user } = useAuth();
  const { greeting } = useTimeOfDay();
  const [hasMoodLogged, setHasMoodLogged] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Welcome Section */}
        <div className="text-center mb-8 pt-2">
          <h1 className="text-2xl font-medium text-foreground mb-2 animate-fade-in">
            {greeting}
          </h1>
          <p className="text-muted-foreground animate-fade-in">
            Take a gentle moment to check in with yourself
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-5">
          <ButtonErrorBoundary fallbackMessage="Mood check is not available">
            <DailyMoodCheck onMoodLogged={setHasMoodLogged} />
          </ButtonErrorBoundary>

          <ButtonErrorBoundary fallbackMessage="Habits are not available">
            <TodayHabits />
          </ButtonErrorBoundary>

          <ButtonErrorBoundary fallbackMessage="AI Coach is not available">
            <CoachQuickAccess />
          </ButtonErrorBoundary>
        </div>
      </div>
    </div>
  );
};
