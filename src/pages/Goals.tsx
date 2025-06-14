
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

  const mobileContent = (
    <div className="app-mobile-page">
      <TooltipProvider>
        <div className="app-fade-in">
          {/* Compact Mobile Header */}
          <div className="app-mobile-section">
            <AppPageHeader
              icon={<Target className="w-6 h-6 text-white" />}
              title="Your Habits"
              subtitle="Daily actions for lasting change"
            />
          </div>

          {!user ? (
            <div className="app-empty-state">
              <p className="text-base">Please sign in to manage your habits.</p>
            </div>
          ) : isLoading ? (
            <div className="app-empty-state">
              <div className="app-pulse">
                <div className="w-6 h-6 bg-gray-700 rounded-full mx-auto mb-3"></div>
                <p className="text-sm">Loading habits...</p>
              </div>
            </div>
          ) : habits.length === 0 ? (
            <div className="app-mobile-section">
              <AppCard variant="glass" className="app-card-compact">
                <AppCardContent>
                  <div className="app-empty-state">
                    <div className="app-empty-icon">
                      <Plus className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Start Your Journey</h3>
                    <p className="text-gray-400 mb-4 text-sm">Create your first habit to begin building positive routines.</p>
                    <CreateHabitDialog />
                  </div>
                </AppCardContent>
              </AppCard>
            </div>
          ) : (
            <>
              {/* Compact Statistics - Horizontal Pill Scroll */}
              <div className="app-mobile-section">
                <div className="app-stats-scroll">
                  <AppStatCard
                    value={stats.activeHabits}
                    label="Active"
                    icon={<Target className="w-3 h-3 text-blue-400" />}
                    className="app-stat-card-compact"
                  />
                  <AppStatCard
                    value={stats.completedToday}
                    label="Today"
                    icon={<TrendingUp className="w-3 h-3 text-green-400" />}
                    color="success"
                    className="app-stat-card-compact"
                  />
                  <AppStatCard
                    value={stats.totalStreaks}
                    label="Total Days"
                    icon={<Flame className="w-3 h-3 text-orange-400" />}
                    color="warning"
                    className="app-stat-card-compact"
                  />
                  <AppStatCard
                    value={stats.bestStreak}
                    label="Best Streak"
                    icon={<Flame className="w-3 h-3 text-purple-400" />}
                    className="app-stat-card-compact"
                  />
                </div>
              </div>

              {/* Habits List - Compact Mobile Cards */}
              <div className="app-mobile-section flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-medium text-white">Today's Habits</h2>
                  <CreateHabitDialog />
                </div>
                
                <div className="space-y-2">
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
                      isMobile={true}
                    />
                  ))}
                </div>
              </div>

              {/* Best Streak Highlight */}
              {stats.bestStreak > 0 && (
                <div className="app-mobile-section app-text-center">
                  <AppCard variant="glass" className="app-card-compact inline-block">
                    <AppCardContent>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-medium text-sm">{stats.bestStreak} day streak</span>
                      </div>
                      <p className="text-gray-300 text-xs">
                        You're building amazing momentum! 🎉
                      </p>
                    </AppCardContent>
                  </AppCard>
                </div>
              )}
            </>
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
    </div>
  );

  const desktopContent = (
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
            <div className="space-y-6 md:space-y-8">
              {/* Quick Stats */}
              <div className="app-slide-up app-grid app-grid-4">
                <AppStatCard
                  value={stats.activeHabits}
                  label="Active"
                  icon={<Target className="w-4 h-4 text-blue-400" />}
                />
                <AppStatCard
                  value={stats.completedToday}
                  label="Today"
                  icon={<TrendingUp className="w-4 h-4 text-green-400" />}
                  color="success"
                />
                <AppStatCard
                  value={stats.totalStreaks}
                  label="Total Days"
                  icon={<Flame className="w-4 h-4 text-orange-400" />}
                  color="warning"
                />
                <AppStatCard
                  value={stats.bestStreak}
                  label="Best Streak"
                  icon={<Flame className="w-4 h-4 text-purple-400" />}
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
                        isMobile={false}
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
                      <p className="text-gray-300 text-sm">
                        You're building amazing momentum! 🎉
                      </p>
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
    return <MobileLayout>{mobileContent}</MobileLayout>;
  }

  // Use PageLayout for desktop but without the default header since we have our own
  return (
    <PageLayout title="Goals & Habits" subtitle="Track your progress and build lasting habits" showHeader={false}>
      {desktopContent}
    </PageLayout>
  );
};

export default Goals;
