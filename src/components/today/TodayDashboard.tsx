import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { DailyMoodCheck } from './DailyMoodCheck';
import { TodayHabits } from './TodayHabits';
import { CoachQuickAccess } from './CoachQuickAccess';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const TodayDashboard: React.FC = () => {
  const { user } = useAuth();
  const { greeting } = useTimeOfDay();
  const [hasMoodLogged, setHasMoodLogged] = useState(false);

  if (!user) return null;

  return (
    <ResponsiveLayout showHeader={false}>
      <ErrorBoundary>
        <div className="app-content-flow max-w-2xl mx-auto">
          {/* Simple Welcome */}
          <div className="text-center pt-6 pb-8">
            <h1 className="text-hero animate-fade-in">{greeting}</h1>
          </div>

          {/* Daily Mood Check - Primary Action */}
          <DailyMoodCheck onMoodLogged={setHasMoodLogged} />

          {/* Today's Habits - Simple Focus */}
          <TodayHabits />

          {/* Coach Quick Access - Always Available */}
          <CoachQuickAccess />
        </div>
      </ErrorBoundary>
    </ResponsiveLayout>
  );
};