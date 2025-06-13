
import { Target, CheckCircle, Flame, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
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
  isMobile?: boolean;
}

export const HabitCard = ({ 
  habit, 
  isCompleted, 
  onComplete, 
  onEdit, 
  onDelete,
  isCompleting = false,
  isDeleting = false,
  isMobile = false
}: HabitCardProps) => {
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
    if (isMobile) {
      if (isCompleting) return 'Completing...';
      if (isCompleted) return 'Done ✓';
      return 'Complete';
    }
    
    if (isCompleting) return 'Completing...';
    if (isCompleted) return 'Completed Today! ✓';
    return 'Mark Complete';
  };

  const getButtonClasses = () => {
    const baseClasses = isMobile ? 'app-button-compact' : '';
    if (isCompleted || justCompleted) {
      return `app-success border-0 ${baseClasses}`;
    }
    return `app-button-primary ${baseClasses}`;
  };

  return (
    <AppCard hover={true} className={isMobile ? 'app-card-compact' : ''}>
      <AppCardContent className={isMobile ? 'app-mobile-p-md' : ''}>
        <div className={`flex items-start justify-between ${isMobile ? 'app-mobile-mb-sm' : 'app-mb-lg'}`}>
          <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}>
              <Target className={`text-white ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-white truncate ${isMobile ? 'text-sm' : 'text-base'}`}>
                {habit.title}
              </h3>
              {habit.description && !isMobile && (
                <p className="text-sm text-gray-400 mt-1 truncate">{habit.description}</p>
              )}
            </div>
          </div>
          
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-700 ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`}
                >
                  <MoreVertical className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
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

        <div className={`space-y-3 ${isMobile ? 'space-y-2' : 'space-y-4'}`}>
          {/* Streak Display */}
          <div className={`flex items-center justify-between ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <div className="flex items-center gap-1">
              <Flame className={`text-orange-400 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className="text-gray-400">Streak</span>
            </div>
            <span className="font-medium text-orange-400">{habit.current_streak} days</span>
          </div>

          {/* Progress Bar - Simplified for mobile */}
          {!isMobile && (
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
          )}

          {/* Mobile simplified progress */}
          {isMobile && (
            <div>
              <Progress 
                value={progress} 
                className="h-1.5 bg-gray-700"
              />
              <div className="text-xs text-gray-500 mt-1">
                {habit.current_streak}/{habit.target_days} days ({Math.round(progress)}%)
              </div>
            </div>
          )}

          {/* Complete Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleComplete}
                disabled={isCompleting}
                className={`w-full transition-all duration-300 flex items-center justify-center gap-2 font-medium rounded-lg ${isMobile ? 'h-8 text-xs' : 'h-10 text-sm'} ${getButtonClasses()}`}
              >
                <CheckCircle className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
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
