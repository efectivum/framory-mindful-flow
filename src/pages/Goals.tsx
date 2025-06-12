import { useState } from 'react';
import { Activity, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ActivityLog } from '@/components/ActivityLog';
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
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    if (todayCompletions.includes(habitId)) {
      return; // Already completed today
    }

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

  const content = (
    <TooltipProvider>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">Your Active Habits</h2>
          <p className="text-gray-400">Track your progress and build lasting habits</p>
        </div>
        <CreateHabitDialog />
      </div>

      {!user ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Please sign in to manage your habits.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading your habits...</p>
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No habits yet. Create your first habit to get started!</p>
          <CreateHabitDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityLog />
        </div>
        
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Habits</span>
                <span className="text-white font-medium">{habits.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completed Today</span>
                <span className="text-white font-medium">{todayCompletions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Streaks</span>
                <span className="text-white font-medium">
                  {habits.reduce((sum, habit) => sum + habit.current_streak, 0)} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Via WhatsApp</span>
                <span className="text-white font-medium">Coming soon</span>
              </div>
            </CardContent>
          </Card>

          {habits.length > 0 && (
            <Card className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Best Streak</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const bestHabit = habits.reduce((best, current) => 
                    current.current_streak > best.current_streak ? current : best
                  );
                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-green-400 font-medium">
                          {bestHabit.current_streak} days
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        You're crushing it with {bestHabit.title}! Keep it up! 🎉
                      </p>
                      <span className="text-xs text-green-400">Current streak</span>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );

  // Use MobileLayout for mobile with swipe functionality
  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  // Use PageLayout for desktop
  return (
    <PageLayout title="Goals & Habits" subtitle="Track your progress and build lasting habits">
      {content}
    </PageLayout>
  );
};

export default Goals;
