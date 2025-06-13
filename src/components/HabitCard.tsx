
import { Target, CheckCircle, Flame, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppCard, AppCardContent } from '@/components/ui/AppCard';
import type { Habit } from '@/hooks/useHabits';
import { useState, useEffect } from 'react';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onComplete: (habitId: string) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
  isCompleting?: boolean;
  isDeleting?: boolean;
}

export const HabitCard = ({ 
  habit, 
  isCompleted, 
  onComplete, 
  onEdit, 
  onDelete,
  isCompleting = false,
  isDeleting = false
}: HabitCardProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [justCompleted, setJustCompleted] = useState(false);
  const progress = Math.min((habit.current_streak / habit.target_days) * 100, 100);

  // Reset justCompleted when isCompleting changes from true to false
  useEffect(() => {
    if (!isCompleting && justCompleted) {
      setJustCompleted(false);
    }
  }, [isCompleting, justCompleted]);

  const handleComplete = () => {
    console.log('HabitCard: Complete button clicked for habit:', habit.id);
    console.log('HabitCard: isCompleted:', isCompleted, 'isCompleting:', isCompleting);
    
    if (isCompleted) {
      toast({
        title: "Already completed!",
        description: "You've already completed this habit today.",
      });
      return;
    }

    if (isCompleting) {
      console.log('HabitCard: Already in progress, ignoring click');
      return;
    }

    console.log('HabitCard: Calling onComplete');
    setJustCompleted(true);
    onComplete(habit.id);
  };

  const getButtonText = () => {
    if (isCompleting) return 'Completing...';
    if (isCompleted) return 'Completed Today! ✓';
    return 'Mark Complete';
  };

  const getButtonClasses = () => {
    if (isCompleted || justCompleted) {
      return 'app-success border-0';
    }
    return 'app-button-primary';
  };

  return (
    <AppCard hover={true}>
      <AppCardContent>
        <div className="flex items-start justify-between app-mb-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-white">{habit.title}</h3>
              {habit.description && (
                <p className="text-sm text-gray-400 mt-1">{habit.description}</p>
              )}
            </div>
          </div>
          
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-700">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(habit)} className="text-gray-300 hover:bg-gray-700">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-gray-300 hover:bg-gray-700">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-800 border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Habit</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to delete "{habit.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-gray-300 hover:bg-gray-600">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(habit.id)}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="space-y-4">
          {/* Streak Display */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-gray-400">Current streak</span>
            </div>
            <span className="font-medium text-orange-400">{habit.current_streak} days</span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm app-mb-sm">
              <span className="text-gray-400">Progress to goal</span>
              <span className="text-white font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-gray-700"
            />
            <div className="text-xs text-gray-500 app-mt-sm">
              {habit.current_streak} of {habit.target_days} days
            </div>
          </div>

          {/* Complete Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleComplete}
                disabled={isCompleting}
                className={`w-full h-10 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium ${getButtonClasses()}`}
              >
                <CheckCircle className="w-4 h-4" />
                {getButtonText()}
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 border-gray-700 text-gray-300">
              <p>
                {isCompleted 
                  ? 'You\'ve already completed this habit today!'
                  : 'Mark this habit as complete for today to maintain your streak'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </AppCardContent>
    </AppCard>
  );
};
