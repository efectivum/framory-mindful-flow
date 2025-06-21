
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { OnboardingWelcome } from './onboarding/OnboardingWelcome';
import { OnboardingCreateEntry } from './onboarding/OnboardingCreateEntry';
import { OnboardingCreateHabit } from './onboarding/OnboardingCreateHabit';
import { OnboardingTour } from './onboarding/OnboardingTour';
import { OnboardingComplete } from './onboarding/OnboardingComplete';

interface OnboardingFlowProps {
  onComplete?: () => void;
  onSkip?: () => void;
  onForceClose?: () => void;
  isSkipping?: boolean;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  onComplete, 
  onSkip, 
  onForceClose,
  isSkipping = false 
}) => {
  const { 
    steps, 
    currentStep, 
    nextStep, 
    completionPercentage, 
    updateStep, 
    completeStep, 
    skipOnboarding,
    isUpdating 
  } = useOnboarding();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [skipError, setSkipError] = useState<string | null>(null);

  const handleNext = () => {
    const current = steps[currentStepIndex];
    completeStep(current.id);
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      const nextStepId = steps[currentStepIndex + 1].id;
      updateStep({ step: nextStepId });
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      const prevStepId = steps[currentStepIndex - 1].id;
      updateStep({ step: prevStepId });
    }
  };

  const handleSkip = async () => {
    setSkipError(null);
    try {
      await onSkip?.();
    } catch (error) {
      console.error('Skip failed:', error);
      setSkipError('Failed to skip onboarding. Please try again.');
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStepIndex];
    
    switch (step.component) {
      case 'welcome':
        return <OnboardingWelcome onNext={handleNext} />;
      case 'create_entry':
        return <OnboardingCreateEntry onNext={handleNext} />;
      case 'create_habit':
        return <OnboardingCreateHabit onNext={handleNext} />;
      case 'tour':
        return <OnboardingTour onNext={handleNext} />;
      case 'complete':
        return <OnboardingComplete onComplete={() => onComplete?.()} />;
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">Getting Started</h2>
              <div className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onForceClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onForceClose}
                  className="text-red-500 hover:text-red-600"
                  title="Force close (if stuck)"
                >
                  <AlertTriangle className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                disabled={isSkipping || isUpdating}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Skip Error */}
          {skipError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{skipError}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={onForceClose}
                className="mt-2 text-red-600"
              >
                Force Close
              </Button>
            </div>
          )}

          {/* Progress */}
          <div className="mb-8">
            <Progress value={(currentStepIndex / (steps.length - 1)) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Getting Started</span>
              <span>{Math.round((currentStepIndex / (steps.length - 1)) * 100)}% Complete</span>
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {steps[currentStepIndex].component !== 'complete' && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0 || isUpdating}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={isSkipping || isUpdating}
                  className="text-muted-foreground"
                >
                  {isSkipping ? 'Skipping...' : 'Skip Tour'}
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isUpdating}
                >
                  {currentStepIndex === steps.length - 1 ? 'Complete' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
