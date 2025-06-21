
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  completed: boolean;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Journey',
    description: 'Learn about the power of journaling and habit tracking',
    component: 'welcome',
    completed: false
  },
  {
    id: 'create_entry',
    title: 'Write Your First Entry',
    description: 'Create your first journal entry or use a template',
    component: 'create_entry',
    completed: false
  },
  {
    id: 'create_habit',
    title: 'Build Your First Habit',
    description: 'Set up a habit to track your progress',
    component: 'create_habit',
    completed: false
  },
  {
    id: 'explore_features',
    title: 'Explore Features',
    description: 'Take a tour of insights, coaching, and analytics',
    component: 'tour',
    completed: false
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start your personal growth journey',
    component: 'complete',
    completed: false
  }
];

export const useOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: onboardingData, isLoading } = useQuery({
    queryKey: ['onboarding', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('Fetching onboarding data for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching onboarding data:', error);
        throw error;
      }

      console.log('Onboarding data fetched:', data);

      // Initialize onboarding if not exists
      if (!data) {
        console.log('Creating initial onboarding record');
        const { data: newData, error: insertError } = await supabase
          .from('user_onboarding')
          .insert({
            user_id: user.id,
            current_step: 'welcome',
            completed_steps: [],
            completion_percentage: 0,
            onboarding_completed: false
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating onboarding record:', insertError);
          throw insertError;
        }
        
        console.log('Created onboarding record:', newData);
        return newData;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 0, // Always refetch to ensure fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const updateOnboardingMutation = useMutation({
    mutationFn: async ({ step, completed = false }: { step: string; completed?: boolean }) => {
      if (!user?.id || !onboardingData) return;

      console.log('Updating onboarding:', { step, completed });

      const completedSteps = onboardingData.completed_steps || [];
      const newCompletedSteps = completed && !completedSteps.includes(step) 
        ? [...completedSteps, step] 
        : completedSteps;

      const totalSteps = ONBOARDING_STEPS.length;
      const completionPercentage = Math.round((newCompletedSteps.length / totalSteps) * 100);
      const isOnboardingComplete = completionPercentage === 100;

      const { error } = await supabase
        .from('user_onboarding')
        .update({
          current_step: step,
          completed_steps: newCompletedSteps,
          completion_percentage: completionPercentage,
          onboarding_completed: isOnboardingComplete,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating onboarding:', error);
        throw error;
      }

      console.log('Onboarding updated successfully');
      return { step, completed, completionPercentage, isOnboardingComplete };
    },
    onSuccess: (result) => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: ['onboarding', user?.id] });
      queryClient.refetchQueries({ queryKey: ['onboarding', user?.id] });
      
      if (result?.completed) {
        toast({
          title: "Step Completed! 🎉",
          description: `Great progress! You're ${result.completionPercentage}% through onboarding.`
        });
      }

      if (result?.isOnboardingComplete) {
        toast({
          title: "Welcome aboard! 🚀",
          description: "You've completed the onboarding. Let's start your growth journey!"
        });
      }
    },
    onError: (error) => {
      console.error('Onboarding update failed:', error);
      toast({
        title: "Update Failed",
        description: "There was an issue updating your progress. Please try again.",
        variant: "destructive"
      });
    }
  });

  const completeStepMutation = useMutation({
    mutationFn: async (stepId: string) => {
      return updateOnboardingMutation.mutateAsync({ step: stepId, completed: true });
    }
  });

  const skipOnboardingMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Skipping onboarding for user:', user.id);

      const { error } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: user.id,
          onboarding_completed: true,
          completion_percentage: 100,
          completed_steps: ONBOARDING_STEPS.map(step => step.id),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error skipping onboarding:', error);
        throw error;
      }

      console.log('Onboarding skipped successfully');
    },
    onSuccess: () => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: ['onboarding', user?.id] });
      queryClient.refetchQueries({ queryKey: ['onboarding', user?.id] });
      
      toast({
        title: "Onboarding Skipped",
        description: "You can always revisit the tour from your profile settings."
      });
    },
    onError: (error) => {
      console.error('Skip onboarding failed:', error);
      toast({
        title: "Skip Failed",
        description: "There was an issue skipping onboarding. Please try again.",
        variant: "destructive"
      });
      throw error; // Re-throw to handle in component
    }
  });

  const getStepsWithProgress = () => {
    if (!onboardingData) return ONBOARDING_STEPS;

    return ONBOARDING_STEPS.map(step => ({
      ...step,
      completed: onboardingData.completed_steps?.includes(step.id) || false
    }));
  };

  const getCurrentStep = () => {
    if (!onboardingData) return ONBOARDING_STEPS[0];
    return ONBOARDING_STEPS.find(step => step.id === onboardingData.current_step) || ONBOARDING_STEPS[0];
  };

  const getNextStep = () => {
    const currentStep = getCurrentStep();
    const currentIndex = ONBOARDING_STEPS.findIndex(step => step.id === currentStep.id);
    return ONBOARDING_STEPS[currentIndex + 1] || null;
  };

  // Debug logging for the hook state
  console.log('useOnboarding state:', {
    isLoading,
    onboardingData,
    isOnboardingComplete: onboardingData?.onboarding_completed || false
  });

  return {
    onboardingData,
    isLoading,
    steps: getStepsWithProgress(),
    currentStep: getCurrentStep(),
    nextStep: getNextStep(),
    isOnboardingComplete: onboardingData?.onboarding_completed || false,
    completionPercentage: onboardingData?.completion_percentage || 0,
    updateStep: updateOnboardingMutation.mutate,
    completeStep: completeStepMutation.mutate,
    skipOnboarding: skipOnboardingMutation.mutateAsync,
    isUpdating: updateOnboardingMutation.isPending || completeStepMutation.isPending
  };
};
