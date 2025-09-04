
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
  BarChart3,
  Loader2
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

  const handleComplete = () => {
    if (!isCompleting && !isCompleted) {
      onComplete(habit.id);
    }
  };

  const handleEdit = () => {
    if (!isDeleting) {
      onEdit(habit);
    }
  };

  const handleDelete = () => {
    if (!isDeleting && !isCompleting) {
      onDelete(habit.id);
    }
  };

  const handleViewProgress = () => {
    if (onViewProgress && !isDeleting && !isCompleting) {
      onViewProgress(habit);
    }
  };

  return (
    <Card className={`bg-card/50 border-border backdrop-blur transition-all duration-200 ${
      isCompleted ? 'ring-2 ring-success/30 bg-success/5' : 'hover:bg-card/70'
    }`}>
      <CardContent className="mobile-card-content-lg">
        <div className="mobile-flex mobile-flex-start mobile-flex-between mb-4">
          <div className="flex-1">
            <h3 className="mobile-h3 text-foreground mb-2">{habit.title}</h3>
            {habit.description && (
              <p className="text-muted-foreground mobile-text-sm mb-3 line-clamp-2">
                {habit.description}
              </p>
            )}
            <div className="mobile-flex mobile-flex-center mobile-gap-sm mb-3">
              <Badge className={getFrequencyColor(habit.frequency_type)}>
                {habit.frequency_type}
              </Badge>
              <div className="mobile-flex mobile-flex-center mobile-gap-xs mobile-text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {habit.target_days} days
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="mobile-admin-grid-2 mb-4 mobile-card-content bg-muted/30 rounded-lg">
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
            onClick={handleComplete}
            disabled={isCompleting || isCompleted || isDeleting}
            className={`flex-1 ${
              isCompleted 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Completing...
              </>
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

          {onViewProgress && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewProgress}
              disabled={isDeleting || isCompleting}
              className="text-gray-400 border-gray-600 hover:bg-gray-700"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            disabled={isDeleting || isCompleting}
            className="text-gray-400 border-gray-600 hover:bg-gray-700"
          >
            <Edit3 className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting || isCompleting}
            className="text-red-400 border-gray-600 hover:bg-red-900/20"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
