
import { Target, Clock, CheckCircle, Flame, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Habit } from '@/hooks/useHabits';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onComplete: (habitId: string) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
  isCompleting?: boolean;
}

export const HabitCard = ({ 
  habit, 
  isCompleted, 
  onComplete, 
  onEdit, 
  onDelete,
  isCompleting = false 
}: HabitCardProps) => {
  const isMobile = useIsMobile();
  const progress = Math.min((habit.current_streak / habit.target_days) * 100, 100);

  const cardClasses = isMobile 
    ? "bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md"
    : "bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 group";

  const titleClasses = isMobile ? "text-gray-900" : "text-white";
  const descriptionClasses = isMobile ? "text-gray-600" : "text-gray-400";
  const iconClasses = isMobile ? "text-blue-600" : "text-blue-400";
  const streakClasses = isMobile ? "text-orange-600" : "text-orange-300";
  const progressLabelClasses = isMobile ? "text-gray-600" : "text-gray-400";
  const progressValueClasses = isMobile ? "text-gray-900" : "text-white";
  const timeClasses = isMobile ? "text-gray-500" : "text-gray-400";
  const timeTextClasses = isMobile ? "text-gray-600" : "text-gray-400";

  return (
    <Card className={cardClasses}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Target className={`w-5 h-5 ${iconClasses}`} />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Flame className={`w-3 h-3 ${isMobile ? 'text-orange-500' : 'text-orange-400'}`} />
              <span className={`font-medium ${streakClasses}`}>
                {habit.current_streak} day streak
              </span>
            </div>
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(habit)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(habit.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <CardTitle className={titleClasses}>{habit.title}</CardTitle>
        {habit.description && (
          <p className={`${descriptionClasses} text-sm`}>{habit.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className={progressLabelClasses}>Progress</span>
              <span className={progressValueClasses}>{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className={`h-2 ${!isMobile ? 'group-hover:shadow-md group-hover:shadow-blue-400/50 transition-all duration-300' : ''}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${timeClasses}`} />
            <span className={`text-sm ${timeTextClasses}`}>
              {habit.current_streak} of {habit.target_days} days
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`w-full transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-600 border-green-500 text-white hover:bg-green-700' 
                    : isMobile 
                      ? 'hover:bg-blue-50 hover:border-blue-300 border-gray-300'
                      : 'hover:bg-blue-600/20 hover:border-blue-500'
                }`}
                onClick={() => onComplete(habit.id)}
                disabled={isCompleted || isCompleting}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isCompleting ? 'Completing...' : isCompleted ? 'Completed Today!' : 'Mark Complete Today'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isCompleted 
                  ? 'You\'ve already completed this habit today!'
                  : 'Mark this habit as complete for today to maintain your streak'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
};
