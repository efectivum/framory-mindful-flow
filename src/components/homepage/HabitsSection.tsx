
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useToast } from '@/hooks/use-toast';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';

export const HabitsSection: React.FC = () => {
  const { habits, completeHabit, isCompleting, todayCompletions } = useHabits();
  const { toast } = useToast();

  // Calculate habit stats and filter out completed habits
  const activeHabits = habits.filter(habit => habit.is_active);
  const uncompletedHabits = activeHabits.filter(habit => !todayCompletions.includes(habit.id));
  const todaysHabits = uncompletedHabits.slice(0, 3);

  const handleHabitComplete = async (habitId: string) => {
    try {
      await completeHabit({ habitId });
      toast({
        title: "Great job! 🎉",
        description: "Habit completed successfully!",
      });
    } catch (error) {
      console.error('Failed to complete habit:', error);
      toast({
        title: "Couldn't complete habit",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (activeHabits.length === 0) {
    return null;
  }

  return (
    <ButtonErrorBoundary fallbackMessage="Habit tracking is not available">
      <Card className="app-card-organic animate-fade-in">
        <CardContent className="p-6">
          <h3 className="text-white font-semibold mb-5 text-lg gradient-text">Today's Focus</h3>
          
          {todaysHabits.length > 0 ? (
            <div className="space-y-4">
              {todaysHabits.map(habit => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-5 bg-gray-700/20 rounded-2xl border border-gray-600/20 hover:border-gray-500/40 transition-all duration-300 hover:bg-gray-700/30 card-hover"
                >
                  <span className="text-gray-200 font-medium">{habit.title}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 font-medium">🔥 {habit.current_streak}d</span>
                    <Button 
                      size="sm" 
                      className="btn-organic bg-green-600 hover:bg-green-700 glow-success"
                      onClick={() => handleHabitComplete(habit.id)}
                      disabled={isCompleting}
                    >
                      {isCompleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        'Complete'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-5xl mb-4 animate-breathe">🎉</div>
              <p className="text-gray-300 font-semibold mb-2 text-lg">All habits completed!</p>
              <p className="text-gray-400 text-sm">Great job staying consistent today!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ButtonErrorBoundary>
  );
};
