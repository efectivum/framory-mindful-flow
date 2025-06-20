
import { useCallback } from 'react';
import { useAdaptiveCoaching } from './useAdaptiveCoaching';
import { useUserPatterns } from './useUserPatterns';
import { useMoodAnalysis } from './useMoodAnalysis';

export const useEnhancedCoaching = () => {
  const { 
    getPersonalizedRecommendations, 
    getCoachingAdjustments,
    recordUserFeedback,
    learningProfile 
  } = useAdaptiveCoaching();
  const { patterns } = useUserPatterns();
  const { emotions } = useMoodAnalysis();

  // Generate enhanced coaching prompt with scientific protocols and user context
  const generateEnhancedPrompt = useCallback((
    userMessage: string,
    conversationHistory: any[] = [],
    userContext: any = {}
  ) => {
    const adjustments = getCoachingAdjustments();
    const userEmotions = emotions?.slice(0, 3) || [];
    const userPatterns = patterns?.slice(0, 3) || [];

    // Extract conditions from user message and context
    const conditions = extractConditionsFromText(userMessage, userContext);
    const moodIndicators = extractMoodIndicators(userMessage, userContext);

    // Get personalized protocol recommendations
    const recommendations = getPersonalizedRecommendations({
      emotions: userEmotions.map(e => e.emotion),
      conditions,
      patterns: userPatterns.map(p => p.pattern_key),
      mood_indicators: moodIndicators,
    });

    const topRecommendations = recommendations.slice(0, 2);

    let enhancedPrompt = `You are Lumatori Coach, an advanced AI coach with access to scientific protocols and personalized insights.

SCIENTIFIC KNOWLEDGE BASE:
You have access to evidence-based protocols from:
- Huberman Lab: Neuroscience-based optimization protocols
- Atomic Habits: Behavior change and habit formation
- Cognitive Behavioral Therapy: Thought pattern restructuring
- Research-backed interventions for sleep, stress, focus, and habit formation

USER LEARNING PROFILE:
${learningProfile ? `
- Total coaching interactions: ${learningProfile.total_interactions}
- Success rate: ${Math.round((learningProfile.successful_interventions / Math.max(1, learningProfile.total_interactions)) * 100)}%
- Learning confidence: ${Math.round(learningProfile.learning_confidence * 100)}%
- Effective intervention types: ${learningProfile.effective_intervention_types.join(', ') || 'Still learning'}
` : 'New user - building profile'}

CURRENT USER CONTEXT:
- Recent emotions: ${userEmotions.map(e => e.emotion).join(', ') || 'None detected'}
- Detected patterns: ${userPatterns.map(p => p.pattern_key).join(', ') || 'None yet'}
- Current conditions: ${conditions.join(', ') || 'None specific'}
- Mood indicators: ${moodIndicators.join(', ') || 'Neutral'}

PERSONALIZED PROTOCOL RECOMMENDATIONS:
${topRecommendations.map(rec => `
- ${rec.protocol_name} (${Math.round(rec.confidence * 100)}% match)
  Source: ${rec.source}
  Description: ${rec.description}
  Steps: ${rec.implementation_steps.slice(0, 3).join(', ')}
  Expected timeline: ${rec.expected_timeline}
  Reason: ${rec.reason}
`).join('\n')}

ADAPTIVE COACHING ADJUSTMENTS:
${Object.keys(adjustments).length > 0 ? `
Applied adjustments based on user profile:
${Object.entries(adjustments).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
` : 'Using standard coaching approach'}

COACHING GUIDELINES:
1. EVIDENCE-BASED: Reference specific protocols when relevant
2. PERSONALIZED: Use user's learning profile and success patterns
3. ACTIONABLE: Provide concrete, implementable steps
4. PROGRESSIVE: Build on user's demonstrated capabilities
5. ADAPTIVE: Adjust approach based on user's response patterns

PROTOCOL INTEGRATION:
- When suggesting interventions, reference specific protocols from the knowledge base
- Explain the science behind recommendations when helpful
- Offer step-by-step implementation from relevant protocols
- Suggest tracking methods to measure effectiveness

TONE AND APPROACH:
${adjustments.tone === 'extra_gentle' ? 'Use extra gentle, supportive language' : 
  adjustments.feedback_style === 'achievement_focused' ? 'Focus on achievements and progress' : 
  'Use warm, encouraging, but direct communication'}

Remember: You can create habits, suggest specific protocols, and reference the user's learning profile to provide increasingly personalized coaching.`;

    return enhancedPrompt;
  }, [getPersonalizedRecommendations, getCoachingAdjustments, learningProfile, emotions, patterns]);

  // Extract conditions from user text
  const extractConditionsFromText = useCallback((text: string, context: any) => {
    const conditions: string[] = [];
    const lowerText = text.toLowerCase();

    // Sleep-related conditions
    if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('sleep')) {
      conditions.push('poor_sleep');
    }
    if (lowerText.includes('anxious') || lowerText.includes('anxiety') || lowerText.includes('worried')) {
      conditions.push('anxiety');
    }
    if (lowerText.includes('stressed') || lowerText.includes('overwhelmed') || lowerText.includes('pressure')) {
      conditions.push('acute_stress');
    }
    if (lowerText.includes('focus') || lowerText.includes('distracted') || lowerText.includes('concentration')) {
      conditions.push('poor_concentration');
    }
    if (lowerText.includes('habit') || lowerText.includes('routine') || lowerText.includes('consistency')) {
      conditions.push('habit_formation_difficulty');
    }
    if (lowerText.includes('procrastinate') || lowerText.includes('delay') || lowerText.includes('putting off')) {
      conditions.push('procrastination');
    }

    return conditions;
  }, []);

  // Extract mood indicators
  const extractMoodIndicators = useCallback((text: string, context: any) => {
    const indicators: string[] = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes('tired') || lowerText.includes('fatigue') || lowerText.includes('drained')) {
      indicators.push('fatigue');
    }
    if (lowerText.includes('energy') && (lowerText.includes('low') || lowerText.includes('no'))) {
      indicators.push('low_energy');
    }
    if (lowerText.includes('motivated') && lowerText.includes('not')) {
      indicators.push('low_motivation');
    }

    // Add mood from context if available
    if (context.mood_after) {
      if (context.mood_after <= 2) indicators.push('low_mood');
      if (context.mood_after >= 4) indicators.push('positive_mood');
    }

    return indicators;
  }, []);

  return {
    generateEnhancedPrompt,
    recordUserFeedback,
    learningProfile,
  };
};
