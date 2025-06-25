
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useHabitTemplate } from '@/hooks/useRoutines';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface RoutineExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineId: string;
  templateId: string;
  onComplete: () => void;
}

export const RoutineExecutionModal: React.FC<RoutineExecutionModalProps> = ({
  isOpen,
  onClose,
  routineId,
  templateId,
  onComplete
}) => {
  const { data: template, isLoading } = useHabitTemplate(templateId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [reflections, setReflections] = useState<{ [key: number]: string }>({});
  const [isCompleting, setIsCompleting] = useState(false);

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
    
    // Auto-advance to next step if not the last one
    if (stepIndex < (template?.steps.length || 0) - 1) {
      setCurrentStepIndex(stepIndex + 1);
    }
  };

  const handleFinishRoutine = async () => {
    if (!template) return;
    
    setIsCompleting(true);
    
    // Simulate completing the routine (you would call your completion API here)
    setTimeout(() => {
      onComplete();
      setIsCompleting(false);
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
      setReflections({});
    }, 1000);
  };

  const progress = template ? (completedSteps.size / template.steps.length) * 100 : 0;
  const currentStep = template?.steps[currentStepIndex];

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-white">
            {template.title}
          </DialogTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Step {currentStepIndex + 1} of {template.steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {currentStep && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  completedSteps.has(currentStepIndex)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {completedSteps.has(currentStepIndex) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    currentStepIndex + 1
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">
                    {currentStep.title}
                  </h3>
                  {currentStep.estimated_duration_minutes && (
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {currentStep.estimated_duration_minutes} minutes
                    </div>
                  )}
                </div>
              </div>

              {currentStep.description && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-300 leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>
              )}

              {currentStep.prompt_question && (
                <div className="space-y-3">
                  <Label className="text-gray-300 font-medium">
                    💭 Reflection Prompt:
                  </Label>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <p className="text-blue-300 mb-3">
                      {currentStep.prompt_question}
                    </p>
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={reflections[currentStepIndex] || ''}
                      onChange={(e) => setReflections(prev => ({
                        ...prev,
                        [currentStepIndex]: e.target.value
                      }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {!completedSteps.has(currentStepIndex) && (
                <Button
                  onClick={() => handleStepComplete(currentStepIndex)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete This Step
                </Button>
              )}
            </div>
          )}

          {/* Navigation and Completion */}
          <div className="flex items-center justify-between border-t border-gray-700 pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="border-gray-600 text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {template.steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    completedSteps.has(index)
                      ? 'bg-green-500'
                      : index === currentStepIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {currentStepIndex < template.steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStepIndex(Math.min(template.steps.length - 1, currentStepIndex + 1))}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleFinishRoutine}
                disabled={completedSteps.size === 0 || isCompleting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCompleting ? 'Completing...' : 'Finish Routine'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
