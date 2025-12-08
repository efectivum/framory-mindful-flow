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
  const todaysHabits = uncompletedHabits.slice(0, 3);
  const completedCount = activeHabits.length - uncompletedHabits.length;

  const handleHabitComplete = async (habitId: string) => {
    try {
      await completeHabit({ habitId });
      toast({
        title: "Well done",
        description: "You're building great habits",
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
    return (
      <Card className="card-serene animate-fade-in">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="icon-container-lg mx-auto mb-4">
              <Plus className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-foreground font-semibold text-lg mb-2">
              Start building habits
            </h3>
            <p className="text-muted-foreground text-sm">
              Small, consistent actions lead to big changes
            </p>
          </div>
          <Button
            onClick={() => navigate('/goals')}
            className="btn-success"
          >
            Create your first habit
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (todaysHabits.length === 0) {
    return (
      <Card className="card-serene animate-fade-in">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="text-5xl mb-4 animate-breathe">✨</div>
            <h3 className="text-foreground font-semibold text-lg mb-2">
              All habits completed
            </h3>
            <p className="text-muted-foreground text-sm">
              You're doing amazing. Keep up the great work.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-serene animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-foreground font-semibold text-lg">Today's Focus</h3>
          {completedCount > 0 && (
            <div className="text-sm text-success font-medium">
              {completedCount} completed
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {todaysHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border hover:bg-muted/70 transition-all duration-300">
                <div className="flex-1 min-w-0 mr-4">
                  <h4 className="text-foreground font-medium mb-1 truncate">{habit.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Flame className="w-4 h-4 text-warning flex-shrink-0" />
                    <span>{habit.current_streak} day streak</span>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleHabitComplete(habit.id)}
                  disabled={isCompleting}
                  className="btn-success flex-shrink-0"
                >
                  {isCompleting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-success-foreground/30 border-t-success-foreground rounded-full animate-spin" />
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
              className="text-muted-foreground hover:text-foreground"
            >
              View all habits ({uncompletedHabits.length - 3} more)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
