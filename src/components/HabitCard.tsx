import { Target, CheckCircle, Flame, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
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
    const baseClasses = isMobile ? 'app-button-compact touch-manipulation' : '';
    if (isCompleted || justCompleted) {
      return `app-success border-0 ${baseClasses}`;
    }
    return `app-button-primary ${baseClasses}`;
  };

  // Mobile-optimized layout - Clean and simple
  if (isMobile) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Left: Icon and Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 w-10 h-10">
                <Target className="text-white w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">
                  {habit.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Flame className="text-orange-400 w-4 h-4" />
                    <span className="text-orange-400 font-medium text-sm">{habit.current_streak} days</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {Math.round(progress)}% complete
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Complete Button and Menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={handleComplete}
                disabled={isCompleting}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  isCompleted || justCompleted
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {isCompleting ? 'Completing...' : isCompleted ? 'Done ✓' : 'Complete'}
              </button>
              
              {(onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                    >
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
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop layout (existing code)
  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/30 hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 w-10 h-10">
              <Target className="text-white w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate text-base">
                {habit.title}
              </h3>
              {habit.description && (
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
                  className="flex-shrink-0 ml-2 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-700 h-8 w-8"
                >
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
              <Flame className="text-orange-400 w-4 h-4" />
              <span className="text-gray-400">Streak</span>
            </div>
            <span className="font-medium text-orange-400">{habit.current_streak} days</span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress to goal</span>
              <span className="text-white font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-gray-700"
            />
            <div className="text-xs text-gray-500 mt-2">
              {habit.current_streak} of {habit.target_days} days
            </div>
          </div>

          {/* Complete Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleComplete}
                disabled={isCompleting}
                className={`w-full transition-all duration-300 flex items-center justify-center gap-2 font-medium rounded-lg h-10 text-sm ${
                  isCompleted || justCompleted
                    ? 'bg-green-600 text-white border-0' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {isCompleting ? 'Completing...' : isCompleted ? 'Completed Today! ✓' : 'Mark Complete'}
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
      </CardContent>
    </Card>
  );
};
