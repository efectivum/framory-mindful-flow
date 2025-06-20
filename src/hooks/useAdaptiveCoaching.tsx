
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFeatureTracking } from '@/hooks/useFeatureTracking';

export interface CoachingEffectiveness {
  id: string;
  user_id: string;
  interaction_id?: string;
  intervention_type: string;
  success_metric: string;
  baseline_value?: number;
  follow_up_value?: number;
  improvement_percentage?: number;
  time_to_improvement?: string;
  user_satisfaction_rating?: number;
  created_at: string;
  measured_at?: string;
}

export interface CoachingLearningProfile {
  id: string;
  user_id: string;
  effective_intervention_types: string[];
  preferred_communication_styles: Record<string, any>;
  response_patterns: Record<string, any>;
  optimal_timing_preferences: Record<string, any>;
  protocol_success_rates: Record<string, number>;
  last_updated: string;
  learning_confidence: number;
  total_interactions: number;
  successful_interventions: number;
}

export interface ScientificProtocol {
  id: string;
  protocol_name: string;
  category: string;
  source: string;
  description: string;
  implementation_steps: string[];
  target_conditions: Record<string, any>;
  expected_timeline: string;
  success_metrics: string[];
  contraindications: string[];
  evidence_level: string;
  created_at: string;
  is_active: boolean;
}

export interface AdaptiveCoachingRule {
  id: string;
  rule_name: string;
  condition_criteria: Record<string, any>;
  coaching_adjustments: Record<string, any>;
  success_threshold: number;
  created_at: string;
  is_active: boolean;
  priority_level: number;
}

export const useAdaptiveCoaching = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { trackFeatureUsage } = useFeatureTracking();

  // Fetch user's learning profile
  const { data: learningProfile } = useQuery({
    queryKey: ['coaching-learning-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('coaching_learning_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data as CoachingLearningProfile | null;
    },
    enabled: !!user,
  });

  // Fetch available protocols
  const { data: protocols = [] } = useQuery({
    queryKey: ['scientific-protocols'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scientific_protocols')
        .select('*')
        .eq('is_active', true)
        .order('category');

      if (error) throw error;
      return data as ScientificProtocol[];
    },
  });

  // Fetch adaptive coaching rules
  const { data: adaptiveRules = [] } = useQuery({
    queryKey: ['adaptive-coaching-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adaptive_coaching_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority_level');

      if (error) throw error;
      return data as AdaptiveCoachingRule[];
    },
  });

  // Create or update learning profile
  const updateLearningProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<CoachingLearningProfile>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coaching_learning_profiles')
        .upsert({
          user_id: user.id,
          ...profileData,
          last_updated: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaching-learning-profile'] });
    },
  });

  // Record coaching effectiveness
  const recordEffectivenessMutation = useMutation({
    mutationFn: async (effectiveness: Omit<CoachingEffectiveness, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coaching_effectiveness')
        .insert([{
          ...effectiveness,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaching-effectiveness'] });
    },
  });

  // Apply protocol to user
  const applyProtocolMutation = useMutation({
    mutationFn: async ({ protocolId, interactionId, notes }: {
      protocolId: string;
      interactionId?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coaching_protocol_applications')
        .insert([{
          user_id: user.id,
          protocol_id: protocolId,
          interaction_id: interactionId,
          notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaching-protocol-applications'] });
      trackFeatureUsage('protocol_application', 'adaptive_coaching');
    },
  });

  // Get personalized protocol recommendations
  const getPersonalizedRecommendations = useCallback((userContext: {
    emotions?: string[];
    conditions?: string[];
    patterns?: string[];
    mood_indicators?: string[];
  }) => {
    const recommendations: (ScientificProtocol & { confidence: number; reason: string })[] = [];

    protocols.forEach(protocol => {
      let confidence = 0.3; // Base confidence
      let reasons: string[] = [];

      const targetConditions = protocol.target_conditions;

      // Check for condition matches
      if (userContext.conditions) {
        const conditionMatches = userContext.conditions.filter(condition => 
          targetConditions.conditions?.includes(condition)
        );
        if (conditionMatches.length > 0) {
          confidence += 0.4 * (conditionMatches.length / targetConditions.conditions.length);
          reasons.push(`Matches conditions: ${conditionMatches.join(', ')}`);
        }
      }

      // Check for emotion matches
      if (userContext.emotions) {
        const emotionMatches = userContext.emotions.filter(emotion => 
          targetConditions.emotions?.includes(emotion)
        );
        if (emotionMatches.length > 0) {
          confidence += 0.3 * (emotionMatches.length / targetConditions.emotions.length);
          reasons.push(`Addresses emotions: ${emotionMatches.join(', ')}`);
        }
      }

      // Check for mood indicator matches
      if (userContext.mood_indicators) {
        const moodMatches = userContext.mood_indicators.filter(mood => 
          targetConditions.mood_indicators?.includes(mood)
        );
        if (moodMatches.length > 0) {
          confidence += 0.2 * (moodMatches.length / targetConditions.mood_indicators.length);
          reasons.push(`Addresses mood indicators: ${moodMatches.join(', ')}`);
        }
      }

      // Factor in user's historical success with this protocol category
      if (learningProfile) {
        const categorySuccessRate = learningProfile.protocol_success_rates[protocol.category];
        if (categorySuccessRate !== undefined) {
          confidence = confidence * (0.7 + 0.6 * categorySuccessRate);
          reasons.push(`Historical success rate: ${Math.round(categorySuccessRate * 100)}%`);
        }
      }

      // Apply adaptive rules
      adaptiveRules.forEach(rule => {
        const criteria = rule.condition_criteria;
        const adjustments = rule.coaching_adjustments;
        
        // Check if user matches rule criteria
        let ruleMatches = true;
        
        if (criteria.stress_indicators && userContext.emotions) {
          const hasStressIndicators = criteria.stress_indicators.some((indicator: string) => 
            userContext.emotions!.includes(indicator)
          );
          if (!hasStressIndicators) ruleMatches = false;
        }

        if (ruleMatches && adjustments.protocol_preference === protocol.category) {
          confidence += 0.2;
          reasons.push(`Matches adaptive rule: ${rule.rule_name}`);
        }
      });

      if (confidence > 0.4) {
        recommendations.push({
          ...protocol,
          confidence,
          reason: reasons.join(' | ')
        });
      }
    });

    // Sort by confidence
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }, [protocols, learningProfile, adaptiveRules]);

  // Record user feedback on coaching interaction
  const recordUserFeedback = useCallback(async (
    interactionId: string,
    satisfaction: number,
    interventionType: string,
    successMetric: string,
    notes?: string
  ) => {
    if (!user) return;

    try {
      // Record effectiveness
      await recordEffectivenessMutation.mutateAsync({
        interaction_id: interactionId,
        intervention_type: interventionType,
        success_metric: successMetric,
        user_satisfaction_rating: satisfaction,
        measured_at: new Date().toISOString(),
      });

      // Update learning profile
      const currentProfile = learningProfile || {
        effective_intervention_types: [],
        preferred_communication_styles: {},
        response_patterns: {},
        optimal_timing_preferences: {},
        protocol_success_rates: {},
        learning_confidence: 0.1,
        total_interactions: 0,
        successful_interventions: 0,
      };

      const updatedProfile = {
        ...currentProfile,
        total_interactions: (currentProfile.total_interactions || 0) + 1,
        successful_interventions: satisfaction >= 4 
          ? (currentProfile.successful_interventions || 0) + 1 
          : currentProfile.successful_interventions,
      };

      // Update intervention effectiveness
      if (satisfaction >= 4) {
        const effectiveTypes = [...(currentProfile.effective_intervention_types || [])];
        if (!effectiveTypes.includes(interventionType)) {
          effectiveTypes.push(interventionType);
        }
        updatedProfile.effective_intervention_types = effectiveTypes;
      }

      // Calculate learning confidence based on interaction history
      updatedProfile.learning_confidence = Math.min(
        0.9,
        0.1 + (updatedProfile.total_interactions * 0.02)
      );

      await updateLearningProfileMutation.mutateAsync(updatedProfile);

      toast({
        title: "Feedback Recorded",
        description: "Thank you! This helps me provide better coaching.",
      });

      trackFeatureUsage('coaching_feedback', 'adaptive_coaching', {
        satisfaction,
        interventionType,
      });

    } catch (error) {
      console.error('Failed to record coaching feedback:', error);
      toast({
        title: "Feedback Error",
        description: "Failed to record feedback. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, learningProfile, recordEffectivenessMutation, updateLearningProfileMutation, toast, trackFeatureUsage]);

  // Get coaching adjustments based on user profile
  const getCoachingAdjustments = useCallback(() => {
    if (!learningProfile) return {};

    const adjustments: Record<string, any> = {};

    // Apply adaptive rules based on user profile
    adaptiveRules.forEach(rule => {
      const criteria = rule.condition_criteria;
      const ruleAdjustments = rule.coaching_adjustments;
      
      let ruleApplies = false;

      // Check habit completion rate
      if (criteria.habit_completion) {
        const successRate = learningProfile.successful_interventions / Math.max(1, learningProfile.total_interactions);
        
        if (criteria.habit_completion === "below_50_percent" && successRate < 0.5) {
          ruleApplies = true;
        } else if (criteria.habit_completion === "above_80_percent" && successRate > 0.8) {
          ruleApplies = true;
        }
      }

      if (ruleApplies) {
        Object.assign(adjustments, ruleAdjustments);
      }
    });

    return adjustments;
  }, [learningProfile, adaptiveRules]);

  return {
    learningProfile,
    protocols,
    adaptiveRules,
    getPersonalizedRecommendations,
    recordUserFeedback,
    getCoachingAdjustments,
    applyProtocol: applyProtocolMutation.mutate,
    isApplyingProtocol: applyProtocolMutation.isPending,
  };
};
