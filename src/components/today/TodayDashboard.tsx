import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { DailyMoodCheck } from './DailyMoodCheck';
import { TodayHabits } from './TodayHabits';
import { CoachQuickAccess } from './CoachQuickAccess';
import { DailyProgress } from './DailyProgress';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';
import { MilestoneManager } from '@/components/MilestoneManager';
import { MilestoneErrorBoundary } from '@/components/MilestoneErrorBoundary';

export const TodayDashboard: React.FC = () => {
  const { user } = useAuth();
  const { greeting } = useTimeOfDay();
  const [hasMoodLogged, setHasMoodLogged] = useState(false);

  if (!user) return null;

  return (
    <ResponsiveLayout showHeader={false}>
      <div className="app-content-flow max-w-2xl mx-auto">
        {/* Gentle Welcome */}
        <div className="text-center space-y-4 pt-6 pb-8">
          <h1 className="text-hero animate-fade-in">{greeting}</h1>
          <p className="text-subhero animate-fade-in">
            Let's take a moment to check in with yourself
          </p>
        </div>

        {/* Milestone Celebration */}
        <MilestoneErrorBoundary>
          <MilestoneManager />
        </MilestoneErrorBoundary>

        {/* Daily Mood Check - Primary Action */}
        <ButtonErrorBoundary fallbackMessage="Mood check is not available">
          <DailyMoodCheck onMoodLogged={setHasMoodLogged} />
        </ButtonErrorBoundary>

        {/* Today's Habits - Simple Focus */}
        <ButtonErrorBoundary fallbackMessage="Habits are not available">
          <TodayHabits />
        </ButtonErrorBoundary>

        {/* Daily Progress Ring */}
        <ButtonErrorBoundary fallbackMessage="Progress tracking is not available">
          <DailyProgress />
        </ButtonErrorBoundary>

        {/* Coach Quick Access - Always Available */}
        <ButtonErrorBoundary fallbackMessage="AI Coach is not available">
          <CoachQuickAccess />
        </ButtonErrorBoundary>
      </div>
    </ResponsiveLayout>
  );
};