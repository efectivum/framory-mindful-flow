
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

    // Get user context for coaching personalization
    const [preferencesResult, recentEntriesResult, habitsResult] = await Promise.all([
      supabase.from('user_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
      supabase.from('habits').select('*').eq('user_id', userId).eq('is_active', true).limit(3),
    ]);

    const userContext = {
      preferences: preferencesResult.data,
      recentEntries: recentEntriesResult.data || [],
      habits: habitsResult.data || []
    };

    let systemPrompt = '';
    
    if (coachingMode) {
      // Balanced coaching approach
      systemPrompt = `You are Lumatori Coach, a skilled personal growth coach. Your role is to help people through thoughtful conversation that balances listening, exploration, and practical guidance.

COACHING APPROACH:
- Start by acknowledging what they've shared
- Ask one thoughtful follow-up question to understand better
- After understanding their situation, offer relevant insights or gentle suggestions
- Balance exploration with practical help - don't just keep asking questions

USER CONTEXT:
${userContext.preferences ? `
Preferences:
- Tone: ${userContext.preferences.tone_of_voice}
- Focus: ${userContext.preferences.growth_focus}
` : ''}

${userContext.habits.length > 0 ? `
Active Habits: ${userContext.habits.map(h => h.title).join(', ')}
` : ''}

${userContext.recentEntries.length > 0 ? `
Recent Journal Themes: ${userContext.recentEntries.map(e => 
  e.content.substring(0, 100)
).join(' | ')}
` : ''}

CONVERSATION STYLE:
- Use ${userContext.preferences?.tone_of_voice || 'supportive'} tone
- Focus on ${userContext.preferences?.growth_focus || 'personal growth'}
- Be warm, curious, and helpful
- Offer both understanding AND practical guidance when appropriate
- Keep responses conversational (150-200 words max)
- It's okay to suggest techniques or tools when they fit naturally

Remember: You're here to help them grow through both understanding and action.`;
    } else if (isJournalEntry) {
      // Journal entry response
      systemPrompt = `You are Lumatori Assistant, responding to a journal entry. Provide a thoughtful, personalized response that acknowledges their experience and offers gentle insights.

USER CONTEXT:
${userContext.preferences ? `
Preferences:
- Tone: ${userContext.preferences.tone_of_voice}
- Focus: ${userContext.preferences.growth_focus}
` : ''}

${userContext.recentEntries.length > 0 ? `
Recent Journal Patterns:
${userContext.recentEntries.slice(0, 3).map((entry, i) => 
  `${i + 1}. ${entry.created_at.split('T')[0]}: "${entry.content.substring(0, 100)}..." (Mood: ${entry.mood_after || 'N/A'})`
).join('\n')}
` : ''}

RESPONSE STYLE:
- Use a ${userContext.preferences?.tone_of_voice || 'supportive'} tone
- Be encouraging and insightful
- Reference their patterns when relevant
- Keep responses concise but meaningful (2-3 sentences)
- If concerning patterns emerge, gently suggest reflection or action

Respond naturally to their journal entry with personalized insights.`;
    } else {
      // Regular conversational chat
      systemPrompt = `You are Lumatori Assistant, a personal growth companion. You provide helpful, conversational responses and intelligently identify when content should be journaled.

USER CONTEXT:
${userContext.preferences ? `
Preferences:
- Tone: ${userContext.preferences.tone_of_voice}
- Focus: ${userContext.preferences.growth_focus}
` : ''}

${userContext.recentEntries.length > 0 ? `
Recent Journal Insights:
${userContext.recentEntries.slice(0, 3).map((entry, i) => 
  `${i + 1}. ${entry.created_at.split('T')[0]}: "${entry.content.substring(0, 100)}..." (Mood: ${entry.mood_after || 'N/A'})`
).join('\n')}
` : ''}

JOURNAL SUGGESTION GUIDELINES:
Suggest journaling when the user shares:
- Personal insights, realizations, or "aha" moments
- Significant experiences or emotions
- Goals, aspirations, or future plans  
- Reflections on growth or challenges
- Meaningful quotes, thoughts, or ideas they want to remember

When suggesting journaling, use this exact phrase: "This sounds like something meaningful to capture. Would you like to save this thought in your journal?"

PERSONALITY:
- Use a ${userContext.preferences?.tone_of_voice || 'supportive'} tone
- Focus on ${userContext.preferences?.growth_focus || 'personal growth'}
- Be conversational and engaging
- Reference their patterns when relevant
- Provide actionable advice when asked

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
        temperature: coachingMode ? 0.7 : (isJournalEntry ? 0.6 : 0.7),
        max_tokens: coachingMode ? 250 : (isJournalEntry ? 200 : 400),
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated:', aiResponse);

    return new Response(JSON.stringify({ 
      response: aiResponse
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
