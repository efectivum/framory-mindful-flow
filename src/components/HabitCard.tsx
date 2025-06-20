import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Calendar,
  BarChart3
} from 'lucide-react';
import type { Habit } from '@/types/habits';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onViewProgress?: (habit: Habit) => void;
  isCompleting: boolean;
  isDeleting: boolean;
  isMobile?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  onComplete,
  onEdit,
  onDelete,
  onViewProgress,
  isCompleting,
  isDeleting,
  isMobile = false
}) => {
  const getFrequencyColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-500/20 text-green-300';
      case 'weekly': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-yellow-400';
    if (streak >= 7) return 'text-green-400';
    if (streak >= 3) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <Card className={`bg-gray-800/50 border-gray-700 backdrop-blur transition-all duration-200 ${
      isCompleted ? 'ring-2 ring-green-500/30 bg-green-500/5' : 'hover:bg-gray-800/70'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-2">{habit.title}</h3>
            {habit.description && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {habit.description}
              </p>
            )}
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getFrequencyColor(habit.frequency_type)}>
                {habit.frequency_type}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                {habit.target_days} days
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-900/30 rounded-lg">
          <div className="text-center">
            <div className={`text-xl font-bold ${getStreakColor(habit.current_streak)}`}>
              {habit.current_streak}
            </div>
            <div className="text-xs text-gray-500">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-400">
              {habit.longest_streak}
            </div>
            <div className="text-xs text-gray-500">Best Streak</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onComplete(habit.id)}
            disabled={isCompleting || isCompleted}
            className={`flex-1 ${
              isCompleted 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isCompleting ? (
              'Completing...'
            ) : isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 mr-2" />
                Complete
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProgress?.(habit)}
            className="text-gray-400 border-gray-600 hover:bg-gray-700"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(habit)}
            className="text-gray-400 border-gray-600 hover:bg-gray-700"
          >
            <Edit3 className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(habit.id)}
            disabled={isDeleting}
            className="text-red-400 border-gray-600 hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
