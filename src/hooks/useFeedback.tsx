
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FeedbackData {
  feedback_type: string;
  rating?: number;
  message?: string;
  feature_context?: string;
}

export const useFeedback = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: FeedbackData) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          ...feedbackData
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Thank you! 💙",
        description: "Your feedback helps us improve the experience for everyone."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    submitFeedback: submitFeedbackMutation.mutate,
    isSubmitting: submitFeedbackMutation.isPending
  };
};
