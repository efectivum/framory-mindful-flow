import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/hooks/useHabits';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export const TodayHabits: React.FC = () => {
  const { habits, completeHabit, isCompleting, todayCompletions } = useHabits();
  const { toast } = useToast();
  const navigate = useNavigate();

  const activeHabits = habits.filter(habit => habit.is_active);
  const uncompletedHabits = activeHabits.filter(habit => !todayCompletions.includes(habit.id));
  const todaysHabits = uncompletedHabits.slice(0, 3); // Max 3 for focus
  const completedCount = activeHabits.length - uncompletedHabits.length;

  const handleHabitComplete = async (habitId: string) => {
    try {
      await completeHabit({ habitId });
      toast({
        title: "Amazing! 🎉",
        description: "You're building great habits!",
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

  // No habits created yet
  if (activeHabits.length === 0) {
    return (
      <Card className="app-card-organic animate-fade-in mb-6">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Start building habits
            </h3>
            <p className="text-gray-400 text-sm">
              Small, consistent actions lead to big changes
            </p>
          </div>
          <Button
            onClick={() => navigate('/goals')}
            className="btn-organic glow-success"
          >
            Create your first habit
          </Button>
        </CardContent>
      </Card>
    );
  }

  // All habits completed
  if (todaysHabits.length === 0) {
    return (
      <Card className="app-card-organic animate-fade-in mb-6">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="text-6xl mb-4 animate-breathe">🎉</div>
            <h3 className="text-white font-semibold text-lg mb-2">
              All habits completed!
            </h3>
            <p className="text-gray-400 text-sm">
              You're doing amazing! Keep up the great work.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="app-card-organic animate-fade-in mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Today's Focus</h3>
          {completedCount > 0 && (
            <div className="text-sm text-green-400 font-medium">
              {completedCount} completed
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {todaysHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between p-6 bg-gray-800/30 rounded-2xl border border-gray-700/30 hover:border-gray-600/40 transition-all duration-300 hover:bg-gray-800/40">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{habit.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{habit.current_streak} day streak</span>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleHabitComplete(habit.id)}
                  disabled={isCompleting}
                  className="btn-organic bg-green-600 hover:bg-green-700 glow-success min-w-[100px]"
                >
                  {isCompleting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Done</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Done</span>
                    </div>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {uncompletedHabits.length > 3 && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/goals')}
              className="text-gray-400 hover:text-white"
            >
              View all habits ({uncompletedHabits.length - 3} more)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};