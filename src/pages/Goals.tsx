
import { useState } from 'react';
import { Target, Plus, Flame, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useHabits } from '@/hooks/useHabits';
import { useAuth } from '@/hooks/useAuth';
import { HabitCard } from '@/components/HabitCard';
import { CreateHabitDialog } from '@/components/CreateHabitDialog';
import { EditHabitDialog } from '@/components/EditHabitDialog';
import { PageLayout } from '@/components/PageLayout';
import { MobileLayout } from '@/components/MobileLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppContainer } from '@/components/layouts/AppContainer';
import { AppPageHeader } from '@/components/ui/AppPageHeader';
import { AppCard, AppCardContent, AppCardHeader } from '@/components/ui/AppCard';
import { AppStatCard } from '@/components/ui/AppStatCard';
import type { Habit } from '@/hooks/useHabits';

const Goals = () => {
  const { user } = useAuth();
  const { habits, isLoading, completeHabit, updateHabit, deleteHabit, todayCompletions, isCompleting, isUpdating, isDeleting } = useHabits();
  const isMobile = useIsMobile();
  
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleCompleteHabit = (habitId: string) => {
    console.log('Attempting to complete habit:', habitId);
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
      console.log('Habit not found:', habitId);
      return;
    }

    if (todayCompletions.includes(habitId)) {
      console.log('Habit already completed today:', habitId);
      return;
    }

    console.log('Calling completeHabit mutation for:', habitId);
    completeHabit({ habitId });
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleUpdateHabit = (updates: Partial<Habit>) => {
    if (editingHabit) {
      updateHabit({ id: editingHabit.id, updates });
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId);
  };

  const stats = {
    activeHabits: habits.length,
    completedToday: todayCompletions.length,
    totalStreaks: habits.reduce((sum, habit) => sum + habit.current_streak, 0),
    bestStreak: habits.length > 0 ? Math.max(...habits.map(h => h.current_streak)) : 0
  };

  const content = (
    <AppContainer width="centered">
      <TooltipProvider>
        <div className="app-fade-in">
          {/* Header Section */}
          <AppPageHeader
            icon={<Target className="w-8 h-8 text-white" />}
            title="Your Habits"
            subtitle="Small daily actions that create lasting change"
          />

          {!user ? (
            <div className="app-empty-state">
              <p className="text-lg">Please sign in to manage your habits.</p>
            </div>
          ) : isLoading ? (
            <div className="app-empty-state">
              <div className="app-pulse">
                <div className="w-8 h-8 bg-gray-700 rounded-full mx-auto mb-4"></div>
                <p>Loading your habits...</p>
              </div>
            </div>
          ) : habits.length === 0 ? (
            <AppCard variant="glass" className="app-slide-up">
              <AppCardContent>
                <div className="app-empty-state">
                  <div className="app-empty-icon">
                    <Plus className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">Start Your Journey</h3>
                  <p className="text-gray-400 mb-6">Create your first habit to begin building positive routines.</p>
                  <CreateHabitDialog />
                </div>
              </AppCardContent>
            </AppCard>
          ) : (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="app-grid app-grid-4 app-slide-up">
                <AppStatCard
                  value={stats.activeHabits}
                  label="Active Habits"
                  icon={<Target className="w-5 h-5 text-blue-400" />}
                />
                <AppStatCard
                  value={stats.completedToday}
                  label="Completed Today"
                  icon={<TrendingUp className="w-5 h-5 text-green-400" />}
                  color="success"
                />
                <AppStatCard
                  value={stats.totalStreaks}
                  label="Total Streak Days"
                  icon={<Flame className="w-5 h-5 text-orange-400" />}
                  color="warning"
                />
                <AppStatCard
                  value={stats.bestStreak}
                  label="Best Streak"
                  icon={<Flame className="w-5 h-5 text-purple-400" />}
                />
              </div>

              {/* Main Content Area */}
              <AppCard variant="glass" className="app-slide-up">
                <AppCardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium text-white">Today's Habits</h2>
                    <CreateHabitDialog />
                  </div>
                </AppCardHeader>
                
                <AppCardContent>
                  <div className="app-grid app-grid-2">
                    {habits.map((habit) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        isCompleted={todayCompletions.includes(habit.id)}
                        onComplete={handleCompleteHabit}
                        onEdit={handleEditHabit}
                        onDelete={handleDeleteHabit}
                        isCompleting={isCompleting}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </div>
                </AppCardContent>
              </AppCard>

              {/* Best Streak Highlight */}
              {stats.bestStreak > 0 && (
                <div className="app-text-center">
                  <AppCard variant="glass" className="inline-block">
                    <AppCardContent>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <span className="text-orange-400 font-medium">{stats.bestStreak} day streak</span>
                      </div>
                      <p className="text-gray-300 text-sm">You're building amazing momentum! 🎉</p>
                    </AppCardContent>
                  </AppCard>
                </div>
              )}
            </div>
          )}

          {editingHabit && (
            <EditHabitDialog
              habit={editingHabit}
              open={!!editingHabit}
              onOpenChange={(open) => !open && setEditingHabit(null)}
              onSave={handleUpdateHabit}
              isUpdating={isUpdating}
            />
          )}
        </div>
      </TooltipProvider>
    </AppContainer>
  );

  // Use MobileLayout for mobile with swipe functionality
  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  // Use PageLayout for desktop but without the default header since we have our own
  return (
    <PageLayout title="Goals & Habits" subtitle="Track your progress and build lasting habits" showHeader={false}>
      {content}
    </PageLayout>
  );
};

export default Goals;
