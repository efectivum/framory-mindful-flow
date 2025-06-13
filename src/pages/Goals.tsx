
import { useState } from 'react';
import { Plus, Target, Flame, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-4">Your Habits</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Small daily actions that create lasting change
            </p>
          </div>

          {!user ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Please sign in to manage your habits.</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-16">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your habits...</p>
              </div>
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Start Your Journey</h3>
                <p className="text-gray-600 mb-6">Create your first habit to begin building positive routines.</p>
                <CreateHabitDialog />
              </div>
            </div>
          ) : (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-white/80 backdrop-blur-sm border-gray-100">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-gray-900">{stats.activeHabits}</div>
                    <div className="text-sm text-gray-600">Active Habits</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-gray-100">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-green-600">{stats.completedToday}</div>
                    <div className="text-sm text-gray-600">Completed Today</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-gray-100">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-orange-600">{stats.totalStreaks}</div>
                    <div className="text-sm text-gray-600">Total Streak Days</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-gray-100">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-semibold text-blue-600">{stats.bestStreak}</div>
                    <div className="text-sm text-gray-600">Best Streak</div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Area */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium text-gray-900">Today's Habits</h2>
                    <CreateHabitDialog />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>

              {/* Best Streak Highlight */}
              {stats.bestStreak > 0 && (
                <div className="mt-8 text-center">
                  <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-100 max-w-md mx-auto">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="text-orange-600 font-medium">{stats.bestStreak} day streak</span>
                      </div>
                      <p className="text-gray-700 text-sm">You're building amazing momentum! 🎉</p>
                    </CardContent>
                  </Card>
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
      </div>
    </TooltipProvider>
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
