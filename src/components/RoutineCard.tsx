
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Clock, Flame, Settings, Trash2 } from 'lucide-react';
import { UserHabitRoutine } from '@/types/routines';
import { RoutineExecutionModal } from './RoutineExecutionModal';

interface RoutineCardProps {
  routine: UserHabitRoutine;
  isCompleted: boolean;
  onComplete: (routineId: string) => void;
  onEdit: (routine: UserHabitRoutine) => void;
  onDelete: (routineId: string) => void;
  isCompleting?: boolean;
  isDeleting?: boolean;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  isCompleted,
  onComplete,
  onEdit,
  onDelete,
  isCompleting = false,
  isDeleting = false
}) => {
  const [showExecution, setShowExecution] = useState(false);

  const handleStartRoutine = () => {
    setShowExecution(true);
  };

  const handleCompleteRoutine = () => {
    onComplete(routine.id);
    setShowExecution(false);
  };

  return (
    <>
      <Card className={`bg-gray-800/50 border-gray-700 transition-all ${
        isCompleted ? 'ring-2 ring-green-500/30 bg-green-500/5' : 'hover:border-gray-600'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-white mb-2">
                {routine.title}
              </CardTitle>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                {routine.scheduled_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {routine.scheduled_time}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  {routine.current_streak} day streak
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(routine)}
                className="text-gray-400 hover:text-white p-2"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(routine.id)}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-400 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {routine.longest_streak > 0 && (
                <Badge className="bg-orange-500/20 text-orange-300">
                  Best: {routine.longest_streak} days
                </Badge>
              )}
            </div>
            
            <Button
              onClick={handleStartRoutine}
              disabled={isCompleted || isCompleting}
              className={`${
                isCompleted 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50`}
              size="sm"
            >
              {isCompleting ? (
                "Completing..."
              ) : isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Routine
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <RoutineExecutionModal
        isOpen={showExecution}
        onClose={() => setShowExecution(false)}
        routineId={routine.id}
        templateId={routine.template_id}
        onComplete={handleCompleteRoutine}
      />
    </>
  );
};
