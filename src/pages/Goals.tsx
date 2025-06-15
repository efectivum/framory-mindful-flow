import { useState } from 'react';
import { Target, Plus, Flame, TrendingUp } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useHabits } from '@/hooks/useHabits';
import { useAuth } from '@/hooks/useAuth';
import { HabitCard } from '@/components/HabitCard';
import { CreateHabitDialog } from '@/components/CreateHabitDialog';
import { EditHabitDialog } from '@/components/EditHabitDialog';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Habit } from '@/hooks/useHabits';
import { AppContainer } from '@/components/layouts/AppContainer';
import { StatCardRow } from '@/components/StatCardRow';

const Goals = () => {
  const { user } = useAuth();
  const { habits, isLoading, completeHabit, updateHabit, deleteHabit, todayCompletions, isCompleting, isUpdating, isDeleting } = useHabits();
  
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

  // -- New: statCards array for consistency with homepage and AppStatCard usage --
  const statCards = [
    {
      value: stats.activeHabits,
      label: "Active",
      icon: <Target className="w-5 h-5 text-blue-400" />,
    },
    {
      value: stats.completedToday,
      label: "Today",
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      color: stats.activeHabits > 0 && stats.completedToday === stats.activeHabits ? "success" as const : undefined,
    },
    {
      value: stats.totalStreaks,
      label: "Total Days",
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      color: undefined,
    },
    {
      value: stats.bestStreak,
      label: "Best Streak",
      icon: <Flame className="w-5 h-5 text-purple-400" />,
      color: stats.bestStreak >= 7 ? "success" as const : undefined,
    }
  ];

  // Use ResponsiveLayout everywhere (mobile first)
  return (
    <ResponsiveLayout title="Goals & Habits" subtitle="Track your progress and build lasting habits">
      {/* All previous desktopContent code goes here, including statCards, cards, etc */}
      { /* Remove any duplicate 'mobileContent', use a single unified main content. */ }
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-white mb-4">Your Habits</h1>
          <p className="text-lg text-gray-400">Small daily actions that create lasting change</p>
        </div>
        {!user ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-400">Please sign in to manage your habits.</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 bg-gray-700 rounded-full mx-auto mb-4 animate-pulse"></div>
            <p className="text-gray-400">Loading your habits...</p>
          </div>
        ) : habits.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Start Your Journey</h3>
              <p className="text-gray-400 mb-6">Create your first habit to begin building positive routines.</p>
              <CreateHabitDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* -- UPDATED: Using StatCardRow for consistency -- */}
            <StatCardRow statCards={statCards} />
            {/* Main Content Area */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-white">Today's Habits</h2>
                  <CreateHabitDialog />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </CardContent>
            </Card>

            {/* Best Streak Highlight */}
            {stats.bestStreak > 0 && (
              <div className="text-center">
                <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur inline-block">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-400 font-medium">{stats.bestStreak} day streak</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You're building amazing momentum! 🎉
                    </p>
                  </CardContent>
                </Card>
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
    </ResponsiveLayout>
  );
};

export default Goals;
