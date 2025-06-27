
import React, { useState } from 'react';
import { Plus, Target, Calendar, Zap, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { useHabits } from '@/hooks/useHabits';
import { CreateHabitDialog } from '@/components/CreateHabitDialog';
import { EditHabitDialog } from '@/components/EditHabitDialog';
import { HabitCard } from '@/components/HabitCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { AutoSaveIndicator } from '@/components/ui/AutoSaveIndicator';
import { useAutoSave } from '@/hooks/useAutoSave';

const Goals = () => {
  const { habits, isLoading, createHabit, updateHabit, deleteHabit, completeHabit, todayCompletions, isCompleting, isUpdating, isDeleting } = useHabits();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [localHabits, setLocalHabits] = useState(habits);

  // Auto-save functionality for habit updates
  const { status: autoSaveStatus, lastSaved } = useAutoSave(localHabits, {
    delay: 1500,
    onSave: async (data) => {
      // Only save if there are actual changes
      const hasChanges = JSON.stringify(data) !== JSON.stringify(habits);
      if (hasChanges) {
        console.log('Auto-saving habit changes');
      }
    }
  });

  React.useEffect(() => {
    setLocalHabits(habits);
  }, [habits]);

  const handleCreateHabit = async (habitData: any) => {
    createHabit(habitData);
    setShowCreateDialog(false);
  };

  const handleUpdateHabit = async (habitData: any) => {
    updateHabit({ id: editingHabit.id, updates: habitData });
    setEditingHabit(null);
  };

  const handleDeleteHabit = async (habitId: string) => {
    deleteHabit(habitId);
    setEditingHabit(null);
  };

  const activeHabits = habits.filter(habit => habit.is_active);
  const completedToday = activeHabits.filter(habit => 
    todayCompletions.includes(habit.id)
  );

  const overallProgress = activeHabits.length > 0 ? (completedToday.length / activeHabits.length) * 100 : 0;

  if (isLoading) {
    return (
      <ResponsiveLayout title="Habits" subtitle="Build better habits, one day at a time">
        <div className="space-y-6">
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Habits" subtitle="Build better habits, one day at a time">
      <div className="space-y-6">
        {/* Auto-save indicator */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="btn-organic glow-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Habit
            </Button>
            {autoSaveStatus !== 'idle' && (
              <AutoSaveIndicator 
                status={autoSaveStatus as 'saving' | 'saved' | 'error'} 
                lastSaved={lastSaved}
                className="text-xs"
              />
            )}
          </div>
        </div>

        {/* Progress Overview */}
        {activeHabits.length > 0 && (
          <Card className="app-card-organic">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-purple-400" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {completedToday.length} of {activeHabits.length} habits completed
                  </span>
                  <span className="text-white font-medium">
                    {Math.round(overallProgress)}%
                  </span>
                </div>
                <Progress 
                  value={overallProgress} 
                  className="h-3 bg-gray-700"
                />
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {completedToday.length} completed
                  </Badge>
                  {activeHabits.length - completedToday.length > 0 && (
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                      <Circle className="w-3 h-3 mr-1" />
                      {activeHabits.length - completedToday.length} remaining
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Habits List */}
        {activeHabits.length === 0 ? (
          <Card className="app-card-organic">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No habits yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Start building better habits today. Create your first habit and begin your journey to personal growth.
              </p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="btn-organic glow-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={todayCompletions.includes(habit.id)}
                onEdit={() => setEditingHabit(habit)}
                onComplete={(habitId) => completeHabit({ habitId })}
                onDelete={handleDeleteHabit}
                isCompleting={isCompleting}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}

        {/* Dialogs */}
        <CreateHabitDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />

        {editingHabit && (
          <EditHabitDialog
            open={!!editingHabit}
            onOpenChange={(open) => !open && setEditingHabit(null)}
            habit={editingHabit}
            onSave={handleUpdateHabit}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default Goals;
