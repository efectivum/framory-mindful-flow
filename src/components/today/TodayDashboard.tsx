import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
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
    <div className="mobile-page">
      <div className="mobile-container mobile-nav-safe">
        <div className="mobile-flow-loose">
          {/* Welcome */}
          <div className="text-center mobile-flow pt-2">
            <h1 className="mobile-h1 text-foreground animate-fade-in">{greeting}</h1>
            <p className="mobile-text-base text-muted-foreground animate-fade-in">
              Let's take a moment to check in with yourself
            </p>
          </div>

          {/* Components */}
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