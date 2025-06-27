import React, { useState } from 'react';
import { Target, Plus, TrendingUp, Calendar, BarChart3, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HabitCard } from '@/components/HabitCard';
import { CreateHabitDialog } from '@/components/CreateHabitDialog';
import { HabitProgressModal } from '@/components/HabitProgressModal';
import { useHabits } from '@/hooks/useHabits';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { AppStatCard } from '@/components/ui/AppStatCard';
import { FlippableCard } from '@/components/ui/FlippableCard';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';
import type { Habit } from '@/hooks/useHabits';

const Goals = () => {
  const { habits, isLoading, completeHabit, isCompleting, todayCompletions } = useHabits();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const activeHabits = habits.filter(habit => habit.is_active);
  const completedTodayCount = todayCompletions.length;
  const totalStreak = activeHabits.reduce((sum, habit) => sum + habit.current_streak, 0);
  const averageStreak = activeHabits.length > 0 ? Math.round(totalStreak / activeHabits.length) : 0;

  const handleHabitClick = (habit: Habit) => {
    setSelectedHabit(habit);
    setShowProgressModal(true);
  };

  const handleHabitComplete = (habitId: string) => {
    completeHabit({ habitId });
  };

  const handleHabitEdit = (habit: Habit) => {
    // Edit functionality would go here
    console.log('Edit habit:', habit);
  };

  const handleHabitDelete = (habitId: string) => {
    // Delete functionality would go here
    console.log('Delete habit:', habitId);
  };

  const createStatCard = (
    icon: React.ReactNode,
    title: string,
    value: string | number,
    description: string,
    gradient: string
  ) => {
    const front = (
      <div className={`h-full w-full rounded-3xl p-6 flex flex-col justify-between shadow-xl border border-white/10 backdrop-blur-sm app-card-organic`}
           style={{ background: gradient }}>
        <div className="flex items-center justify-between">
          <div className="text-white/80">{icon}</div>
        </div>
        <div>
          <div className="text-3xl font-light text-white mb-2 animate-gentle-pulse">{value}</div>
          <div className="text-white/80 text-sm font-medium">{title}</div>
        </div>
      </div>
    );

    const back = (
      <div className={`h-full w-full rounded-3xl p-6 flex items-center justify-center shadow-xl border border-white/10 backdrop-blur-sm`}
           style={{ background: gradient }}>
        <p className="text-white/90 text-center font-light text-sm leading-relaxed">{description}</p>
      </div>
    );

    return { front, back };
  };

  const activeHabitsCard = createStatCard(
    <Target className="w-6 h-6" />,
    "Active Habits",
    activeHabits.length,
    "Building consistent daily practices that transform your life over time.",
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
  );

  const completedTodayCard = createStatCard(
    <Award className="w-6 h-6" />,
    "Completed Today",
    completedTodayCount,
    "Every completion is a step forward in your personal growth journey.",
    "linear-gradient(135deg, #10b981 0%, #059669 100%)"
  );

  const averageStreakCard = createStatCard(
    <TrendingUp className="w-6 h-6" />,
    "Average Streak",
    `${averageStreak}d`,
    "Consistency is the foundation of lasting change and personal transformation.",
    "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
  );

  if (isLoading) {
    return (
      <ResponsiveLayout title="Habits" subtitle="Building your daily practices">
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <div className="text-lg text-gray-400 font-medium ml-2">Loading your habits...</div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Habits" subtitle="Building your daily practices">
      <NetworkStatusIndicator />
      <div className="app-content-flow">
        {/* Enhanced Statistics */}
        <ButtonErrorBoundary fallbackMessage="Statistics are not available">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
            <FlippableCard
              frontContent={activeHabitsCard.front}
              backContent={activeHabitsCard.back}
              height="h-36"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={completedTodayCard.front}
              backContent={completedTodayCard.back}
              height="h-36"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={averageStreakCard.front}
              backContent={averageStreakCard.back}
              height="h-36"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
          </div>
        </ButtonErrorBoundary>

        {/* Enhanced Create Habit Button */}
        <ButtonErrorBoundary fallbackMessage="Habit creation is not available">
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="btn-organic w-full h-16 text-lg font-semibold glow-primary mb-8"
          >
            <Plus className="w-6 h-6 mr-3" />
            Create New Habit
          </Button>
        </ButtonErrorBoundary>

        {activeHabits.length === 0 ? (
          <div className="text-center space-y-6 pt-12">
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-breathe app-card-organic" 
                 style={{ background: 'var(--app-accent-primary)' }}>
              <Target className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-hero mb-4">Start Your Transformation</h3>
              <p className="text-subhero max-w-2xl mx-auto">
                Habits are the compound interest of self-improvement. Start small, stay consistent, and watch your life transform.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-xl gradient-text mb-6">Your Active Habits</h3>
            <div className="space-y-4">
              {activeHabits.map(habit => (
                <div key={habit.id} className="animate-fade-in">
                  <HabitCard
                    habit={habit}
                    onComplete={handleHabitComplete}
                    onEdit={handleHabitEdit}
                    onDelete={handleHabitDelete}
                    isCompleting={isCompleting}
                    isCompleted={todayCompletions.includes(habit.id)}
                    onViewProgress={handleHabitClick}
                    isDeleting={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Dialogs */}
        {showCreateDialog && (
          <CreateHabitDialog 
            onClose={() => setShowCreateDialog(false)}
          />
        )}
        
        {selectedHabit && (
          <HabitProgressModal
            habit={selectedHabit}
            open={showProgressModal}
            onOpenChange={setShowProgressModal}
          />
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default Goals;
