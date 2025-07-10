import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useHabits } from '@/hooks/useHabits';
import { TrendingUp, Target } from 'lucide-react';

export const DailyProgress: React.FC = () => {
  const { habits, todayCompletions } = useHabits();
  
  const activeHabits = habits.filter(habit => habit.is_active);
  const completedCount = activeHabits.filter(habit => todayCompletions.includes(habit.id)).length;
  const totalCount = activeHabits.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Don't show if no habits
  if (totalCount === 0) return null;

  return (
    <Card className="app-card-organic animate-fade-in mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Today's Progress
          </h3>
          <div className="text-sm text-gray-400">
            {completedCount} of {totalCount}
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Progress Ring */}
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700/50"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-green-400"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Encouraging message */}
          <div className="text-center">
            {progress === 100 ? (
              <p className="text-green-400 font-medium">
                Perfect day! All habits completed 🎉
              </p>
            ) : progress >= 50 ? (
              <p className="text-blue-400 font-medium">
                Great progress! Keep it up 💪
              </p>
            ) : progress > 0 ? (
              <p className="text-yellow-400 font-medium">
                Good start! You've got this ⭐
              </p>
            ) : (
              <p className="text-gray-400 font-medium">
                Ready to begin? Every small step counts ✨
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};