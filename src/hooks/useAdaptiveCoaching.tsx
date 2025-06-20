
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProtocolSuggestion {
  id: string;
  protocol_name: string;
  category: string;
  source: string;
  description: string;
  implementation_steps: string[];
  expected_timeline: string;
  success_metrics: string[];
  confidence: number;
  reason: string;
}

interface AdaptiveCoachingData {
  userContext: {
    currentChallenges: string[];
    previousSuccesses: string[];
    preferredApproaches: string[];
    timeConstraints: string;
  };
  protocolSuggestions: ProtocolSuggestion[];
  adaptiveInsights: string[];
}

export const useAdaptiveCoaching = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [coachingData, setCoachingData] = useState<AdaptiveCoachingData | null>(null);

  const generateAdaptiveCoaching = useCallback(async (
    conversationContext: string,
    userGoals: string[] = [],
    previousFeedback: any[] = []
  ): Promise<AdaptiveCoachingData | null> => {
    if (!user) return null;

    setIsLoading(true);
    try {
      // Get user's learning profile
      const { data: learningProfile } = await supabase
        .from('coaching_learning_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get relevant scientific protocols
      const { data: protocols } = await supabase
        .from('scientific_protocols')
        .select('*')
        .eq('is_active', true)
        .limit(5);

      // Get adaptive coaching rules
      const { data: rules } = await supabase
        .from('adaptive_coaching_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority_level', { ascending: false });

      // Apply adaptive logic based on learning profile and rules
      const adaptiveData: AdaptiveCoachingData = {
        userContext: {
          currentChallenges: extractChallenges(conversationContext),
          previousSuccesses: learningProfile?.effective_intervention_types || [],
          preferredApproaches: learningProfile?.preferred_communication_styles?.styles || [],
          timeConstraints: 'moderate'
        },
        protocolSuggestions: protocols?.map(protocol => ({
          id: protocol.id,
          protocol_name: protocol.protocol_name,
          category: protocol.category,
          source: protocol.source,
          description: protocol.description,
          implementation_steps: protocol.implementation_steps || [],
          expected_timeline: protocol.expected_timeline || 'Variable',
          success_metrics: protocol.success_metrics || [],
          confidence: calculateProtocolConfidence(protocol, learningProfile),
          reason: generateRecommendationReason(protocol, learningProfile)
        })) || [],
        adaptiveInsights: generateAdaptiveInsights(conversationContext, learningProfile, rules)
      };

      setCoachingData(adaptiveData);
      return adaptiveData;

    } catch (error) {
      console.error('Error generating adaptive coaching:', error);
      toast({
        title: "Coaching Error",
        description: "Unable to generate adaptive coaching recommendations.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const recordProtocolApplication = useCallback(async (
    protocolId: string,
    interactionId?: string
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('coaching_protocol_applications')
        .insert({
          user_id: user.id,
          protocol_id: protocolId,
          interaction_id: interactionId,
          applied_at: new Date().toISOString()
        });

    } catch (error) {
      console.error('Error recording protocol application:', error);
    }
  }, [user]);

  const updateLearningProfile = useCallback(async (
    feedbackData: {
      interventionType: string;
      satisfaction: number;
      successMetric: string;
      notes?: string;
    }
  ) => {
    if (!user) return;

    try {
      // Update or create learning profile
      const { data: existingProfile } = await supabase
        .from('coaching_learning_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const updatedInterventionTypes = [...(existingProfile.effective_intervention_types || [])];
        if (feedbackData.satisfaction >= 4 && !updatedInterventionTypes.includes(feedbackData.interventionType)) {
          updatedInterventionTypes.push(feedbackData.interventionType);
        }

        await supabase
          .from('coaching_learning_profiles')
          .update({
            effective_intervention_types: updatedInterventionTypes,
            total_interactions: (existingProfile.total_interactions || 0) + 1,
            successful_interventions: feedbackData.satisfaction >= 4 
              ? (existingProfile.successful_interventions || 0) + 1 
              : existingProfile.successful_interventions,
            learning_confidence: Math.min(1.0, (existingProfile.learning_confidence || 0.1) + 0.05),
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Create new profile
        await supabase
          .from('coaching_learning_profiles')
          .insert({
            user_id: user.id,
            effective_intervention_types: feedbackData.satisfaction >= 4 ? [feedbackData.interventionType] : [],
            total_interactions: 1,
            successful_interventions: feedbackData.satisfaction >= 4 ? 1 : 0,
            learning_confidence: 0.15
          });
      }

    } catch (error) {
      console.error('Error updating learning profile:', error);
    }
  }, [user]);

  // Helper functions
  const extractChallenges = (context: string): string[] => {
    const challengeKeywords = ['stress', 'anxiety', 'sleep', 'focus', 'motivation', 'habit'];
    return challengeKeywords.filter(keyword => 
      context.toLowerCase().includes(keyword)
    );
  };

  const calculateProtocolConfidence = (protocol: any, profile: any): number => {
    if (!profile) return 0.5;
    
    const baseConfidence = 0.5;
    const categoryMatch = profile.effective_intervention_types?.includes(protocol.category) ? 0.3 : 0;
    const successRate = (profile.successful_interventions || 0) / Math.max(1, profile.total_interactions || 1) * 0.2;
    
    return Math.min(1.0, baseConfidence + categoryMatch + successRate);
  };

  const generateRecommendationReason = (protocol: any, profile: any): string => {
    if (!profile) {
      return `This ${protocol.category} protocol aligns with your current conversation context.`;
    }

    const hasSuccess = profile.effective_intervention_types?.includes(protocol.category);
    if (hasSuccess) {
      return `Based on your previous success with ${protocol.category} approaches, this protocol is highly recommended.`;
    }

    return `This evidence-based ${protocol.category} protocol from ${protocol.source} could be valuable for your current goals.`;
  };

  const generateAdaptiveInsights = (context: string, profile: any, rules: any[]): string[] => {
    const insights = [];
    
    if (profile?.learning_confidence && profile.learning_confidence > 0.7) {
      insights.push("Your coaching profile shows strong engagement with evidence-based approaches.");
    }
    
    if (profile?.effective_intervention_types?.length > 2) {
      insights.push("You respond well to diverse intervention types, suggesting an adaptable mindset.");
    }
    
    insights.push("Your conversation patterns indicate readiness for structured growth protocols.");
    
    return insights;
  };

  return {
    generateAdaptiveCoaching,
    recordProtocolApplication,
    updateLearningProfile,
    isLoading,
    coachingData
  };
};
