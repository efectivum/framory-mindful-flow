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
      <div className="max-w-2xl mx-auto space-y-6 p-4 pb-24 md:pb-8">
        {/* Welcome */}
        <div className="text-center space-y-3 pt-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-white animate-fade-in">{greeting}</h1>
          <p className="text-gray-400 animate-fade-in">
            Let's take a moment to check in with yourself
          </p>
        </div>

        {/* Components */}
        <MilestoneErrorBoundary>
          <MilestoneManager />
        </MilestoneErrorBoundary>

        <ButtonErrorBoundary fallbackMessage="Mood check is not available">
          <DailyMoodCheck onMoodLogged={setHasMoodLogged} />
        </ButtonErrorBoundary>

        <ButtonErrorBoundary fallbackMessage="Habits are not available">
          <TodayHabits />
        </ButtonErrorBoundary>

        <ButtonErrorBoundary fallbackMessage="Progress tracking is not available">
          <DailyProgress />
        </ButtonErrorBoundary>

        <ButtonErrorBoundary fallbackMessage="AI Coach is not available">
          <CoachQuickAccess />
        </ButtonErrorBoundary>
      </div>
    </ResponsiveLayout>
  );
};