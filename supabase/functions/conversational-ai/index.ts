
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, userId, isJournalEntry, coachingMode } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get comprehensive user context for enhanced coaching
    const [preferencesResult, recentEntriesResult, patternsResult, habitsResult, learningProfileResult, protocolsResult, adaptiveRulesResult] = await Promise.all([
      supabase.from('user_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('user_patterns').select('*').eq('user_id', userId).order('confidence_level', { ascending: false }).limit(3),
      supabase.from('habits').select('*').eq('user_id', userId).eq('is_active', true).limit(5),
      supabase.from('coaching_learning_profiles').select('*').eq('user_id', userId).single(),
      supabase.from('scientific_protocols').select('*').eq('is_active', true),
      supabase.from('adaptive_coaching_rules').select('*').eq('is_active', true).order('priority_level')
    ]);

    const userContext = {
      preferences: preferencesResult.data,
      recentEntries: recentEntriesResult.data || [],
      patterns: patternsResult.data || [],
      habits: habitsResult.data || [],
      learningProfile: learningProfileResult.data,
      protocols: protocolsResult.data || [],
      adaptiveRules: adaptiveRulesResult.data || []
    };

    console.log('Enhanced user context for AI:', userContext);

    let systemPrompt = '';
    
    if (coachingMode) {
      // Enhanced coaching mode with scientific protocols and adaptive learning
      systemPrompt = `You are Lumatori Coach, an advanced AI coach with access to evidence-based scientific protocols and personalized learning capabilities.

SCIENTIFIC KNOWLEDGE BASE:
You have access to ${userContext.protocols.length} evidence-based protocols from:
${userContext.protocols.map(p => `- ${p.protocol_name} (${p.source}): ${p.description}`).join('\n')}

USER LEARNING PROFILE:
${userContext.learningProfile ? `
- Total coaching interactions: ${userContext.learningProfile.total_interactions}
- Success rate: ${Math.round((userContext.learningProfile.successful_interventions / Math.max(1, userContext.learningProfile.total_interactions)) * 100)}%
- Learning confidence: ${Math.round(userContext.learningProfile.learning_confidence * 100)}%
- Effective interventions: ${userContext.learningProfile.effective_intervention_types.join(', ') || 'Still learning'}
- Protocol success rates: ${JSON.stringify(userContext.learningProfile.protocol_success_rates)}
` : 'New user - building learning profile'}

ADAPTIVE COACHING ADJUSTMENTS:
${userContext.adaptiveRules.map(rule => {
  // Apply rule logic based on user context
  let ruleApplies = false;
  const criteria = rule.condition_criteria;
  
  if (criteria.habit_completion && userContext.learningProfile) {
    const successRate = userContext.learningProfile.successful_interventions / Math.max(1, userContext.learningProfile.total_interactions);
    if (criteria.habit_completion === "below_50_percent" && successRate < 0.5) ruleApplies = true;
    if (criteria.habit_completion === "above_80_percent" && successRate > 0.8) ruleApplies = true;
  }
  
  if (ruleApplies) {
    return `ACTIVE RULE - ${rule.rule_name}: ${JSON.stringify(rule.coaching_adjustments)}`;
  }
  return null;
}).filter(Boolean).join('\n')}

USER CONTEXT:
${userContext.preferences ? `
Preferences:
- Tone: ${userContext.preferences.tone_of_voice}
- Growth Focus: ${userContext.preferences.growth_focus}
- Notification Time: ${userContext.preferences.notification_time}
` : ''}

${userContext.habits.length > 0 ? `
Current Active Habits:
${userContext.habits.map(h => 
  `- ${h.title}: ${h.current_streak} day streak (Target: ${h.target_days} days)`
).join('\n')}
` : 'No active habits yet - perfect opportunity to create some!'}

${userContext.recentEntries.length > 0 ? `
Recent Journal Patterns:
${userContext.recentEntries.slice(0, 3).map((entry, i) => 
  `${i + 1}. ${entry.created_at.split('T')[0]}: "${entry.content.substring(0, 100)}..." (Mood: ${entry.mood_after || 'N/A'})`
).join('\n')}
` : ''}

PROTOCOL RECOMMENDATION LOGIC:
When suggesting interventions, reference specific protocols from your knowledge base:
1. Match user conditions to protocol target_conditions
2. Consider user's historical success with protocol categories
3. Reference implementation_steps for actionable guidance
4. Mention expected_timeline for realistic expectations
5. Use success_metrics for tracking recommendations

ENHANCED COACHING APPROACH:
1. EVIDENCE-BASED: Always reference specific protocols when relevant
2. PERSONALIZED: Use learning profile to adapt communication style and suggestions
3. ADAPTIVE: Apply coaching adjustments based on user patterns
4. PROGRESSIVE: Build on demonstrated user capabilities and preferences
5. TRACKABLE: Suggest specific metrics and follow-up approaches

HABIT CREATION GUIDELINES:
When suggesting habits, be specific and reference relevant protocols:
- Reference protocol implementation steps
- Suggest appropriate frequency based on user success patterns
- Include science-backed reasoning
- Offer to create trackable habits in the system

CONVERSATION STYLE:
- Use ${userContext.preferences?.tone_of_voice || 'supportive'} tone
- Focus on ${userContext.preferences?.growth_focus || 'personal growth'}
- Adapt complexity based on user's learning confidence
- Reference past successes to build motivation

Remember: You can create habits, reference specific scientific protocols, and your responses will be tracked for effectiveness to continuously improve your coaching approach.`;
    } else if (isJournalEntry) {
      // Journal entry response - provide immediate contextual coaching
      systemPrompt = `You are Lumatori Assistant, responding to a journal entry. Provide a thoughtful, personalized response that acknowledges their experience and offers gentle insights.

USER CONTEXT:
${userContext.preferences ? `
Preferences:
- Tone: ${userContext.preferences.tone_of_voice}
- Growth Focus: ${userContext.preferences.growth_focus}
` : ''}

${userContext.recentEntries.length > 0 ? `
Recent Journal Patterns:
${userContext.recentEntries.slice(0, 3).map((entry, i) => 
  `${i + 1}. ${entry.created_at.split('T')[0]}: "${entry.content.substring(0, 100)}..." (Mood: ${entry.mood_after || 'N/A'})`
).join('\n')}
` : ''}

${userContext.patterns.length > 0 ? `
Detected Patterns:
${userContext.patterns.map(p => 
  `- ${p.pattern_type}: ${p.pattern_key} (confidence: ${Math.round(p.confidence_level * 100)}%)`
).join('\n')}
` : ''}

${userContext.habits.length > 0 ? `
Active Habits:
${userContext.habits.map(h => 
  `- ${h.title}: ${h.current_streak} day streak`
).join('\n')}
` : ''}

RESPONSE STYLE:
- Use a ${userContext.preferences?.tone_of_voice || 'supportive'} tone
- Focus on ${userContext.preferences?.growth_focus || 'personal growth'}
- Be encouraging and insightful
- Reference their patterns and progress when relevant
- Keep responses concise but meaningful (2-3 sentences)
- If you notice concerning patterns, gently suggest reflection or action
- Celebrate positive moments and progress

Respond naturally to their journal entry with personalized coaching insights.`;
    } else {
      // Regular conversational chat response
      systemPrompt = `You are Lumatori Assistant, a personal growth companion. You provide helpful, conversational responses and intelligently identify when content should be journaled.

USER CONTEXT:
${userContext.preferences ? `
Preferences:
- Tone: ${userContext.preferences.tone_of_voice}
- Growth Focus: ${userContext.preferences.growth_focus}
- Notification Frequency: ${userContext.preferences.notification_frequency}
` : ''}

${userContext.recentEntries.length > 0 ? `
Recent Journal Insights:
${userContext.recentEntries.slice(0, 3).map((entry, i) => 
  `${i + 1}. ${entry.created_at.split('T')[0]}: "${entry.content.substring(0, 100)}..." (Mood: ${entry.mood_after || 'N/A'})`
).join('\n')}
` : ''}

${userContext.patterns.length > 0 ? `
Detected Patterns:
${userContext.patterns.map(p => 
  `- ${p.pattern_type}: ${p.pattern_key} (confidence: ${Math.round(p.confidence_level * 100)}%)`
).join('\n')}
` : ''}

${userContext.habits.length > 0 ? `
Active Habits:
${userContext.habits.map(h => 
  `- ${h.title}: ${h.current_streak} day streak`
).join('\n')}
` : ''}

JOURNAL SUGGESTION GUIDELINES:
Suggest journaling when the user shares:
- Personal insights, realizations, or "aha" moments
- Significant experiences or emotions
- Goals, aspirations, or future plans  
- Reflections on growth or challenges
- Meaningful quotes, thoughts, or ideas they want to remember
- Achievements or milestones
- Struggles they're working through

When suggesting journaling, use this exact phrase: "This sounds like something meaningful to capture. Would you like to save this thought in your journal?"

PERSONALITY:
- Use a ${userContext.preferences?.tone_of_voice || 'supportive'} tone
- Focus on ${userContext.preferences?.growth_focus || 'personal growth'}
- Be conversational and engaging
- Reference their patterns and progress when relevant
- Provide actionable advice when asked
- Don't suggest journaling for simple questions or casual conversations

Keep responses helpful, personalized, and conversational.`;
    }

    // Build conversation messages
    const messages = [{ role: 'system', content: systemPrompt }];

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: coachingMode ? 0.8 : (isJournalEntry ? 0.6 : 0.7),
        max_tokens: coachingMode ? 400 : (isJournalEntry ? 300 : 500),
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated:', aiResponse);

    // Check if the response contains a habit creation suggestion
    const habitSuggestionPatterns = [
      /let me create a.*habit/i,
      /i can help you set up.*habit/i,
      /i can set up.*practice/i,
      /let me help you create.*habit/i,
      /perfect daily habit/i,
      /create.*habit.*for you/i
    ];

    const containsHabitSuggestion = habitSuggestionPatterns.some(pattern => 
      pattern.test(aiResponse)
    );

    return new Response(JSON.stringify({ 
      response: aiResponse,
      containsHabitSuggestion 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in conversational-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
