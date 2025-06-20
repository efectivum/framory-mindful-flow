
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ConversationState {
  role: 'user' | 'assistant';
  content: string;
}

export const useEnhancedCoaching = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const generateEnhancedPrompt = useCallback((
    userInput: string,
    conversationHistory: ConversationState[] = []
  ): string => {
    // Enhanced prompt that incorporates scientific protocols and personalization
    const basePrompt = `You are an advanced AI coach specializing in evidence-based personal development. 

User input: "${userInput}"

Context from conversation:
${conversationHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Provide coaching that:
1. References relevant scientific protocols (Huberman Lab, Atomic Habits, CBT techniques)
2. Offers specific, actionable steps
3. Includes evidence-based reasoning
4. Suggests measurable outcomes
5. Adapts to the user's apparent needs and communication style

Focus on practical implementation while maintaining an encouraging, professional tone.`;

    return basePrompt;
  }, []);

  const recordUserFeedback = useCallback(async (
    interactionId: string,
    satisfaction: number,
    interventionType: string,
    successMetric: string,
    notes?: string
  ) => {
    if (!user) return;

    setIsProcessing(true);
    try {
      // Record in coaching effectiveness table
      await supabase
        .from('coaching_effectiveness')
        .insert({
          user_id: user.id,
          interaction_id: interactionId,
          intervention_type: interventionType,
          success_metric: successMetric,
          user_satisfaction_rating: satisfaction,
          measured_at: new Date().toISOString()
        });

      console.log('User feedback recorded successfully');
    } catch (error) {
      console.error('Error recording user feedback:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  return {
    generateEnhancedPrompt,
    recordUserFeedback,
    isProcessing
  };
};
