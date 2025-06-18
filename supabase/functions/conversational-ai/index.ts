
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

    // Get user context for personalized responses
    const [preferencesResult, recentEntriesResult, patternsResult, habitsResult] = await Promise.all([
      supabase.from('user_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('user_patterns').select('*').eq('user_id', userId).order('confidence_level', { ascending: false }).limit(3),
      supabase.from('habits').select('*').eq('user_id', userId).eq('is_active', true).limit(5)
    ]);

    const userContext = {
      preferences: preferencesResult.data,
      recentEntries: recentEntriesResult.data || [],
      patterns: patternsResult.data || [],
      habits: habitsResult.data || []
    };

    console.log('User context for AI:', userContext);

    let systemPrompt = '';
    
    if (isJournalEntry) {
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
      // Conversational chat response with enhanced journal suggestion logic
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
        temperature: isJournalEntry ? 0.6 : 0.7,
        max_tokens: isJournalEntry ? 300 : 500,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated:', aiResponse);

    return new Response(JSON.stringify({ response: aiResponse }), {
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
