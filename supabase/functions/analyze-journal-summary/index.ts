
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entries, analysisType = 'summary', userPreferences } = await req.json();
    
    if (!entries || entries.length === 0) {
      throw new Error('No entries provided for analysis');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let systemPrompt = '';
    let analysisPrompt = '';

    if (analysisType === 'weekly') {
      systemPrompt = `You are a caring AI friend who provides personalized weekly journal insights. You know the user's preferences:
- Growth Focus: ${userPreferences?.growth_focus || 'general growth'}
- Communication Style: ${userPreferences?.tone_of_voice || 'supportive'}

Write in a warm, encouraging tone as if you're a close friend who really knows them. Use "you" and speak directly to them. Focus on their specific growth goals and communicate in their preferred style.`;

      analysisPrompt = `Analyze these journal entries from the past week and create a personalized weekly insight report:

${entries.map((entry: any, i: number) => `Entry ${i + 1} (${entry.created_at}): ${entry.content}`).join('\n\n')}

Create a comprehensive weekly analysis with:

1. EMOTIONAL_SUMMARY: A warm, personal summary of their emotional journey this week
2. KEY_PATTERNS: 3-4 meaningful patterns you noticed in their thoughts and feelings
3. GROWTH_OBSERVATIONS: 2-3 specific signs of personal growth or positive changes
4. RECOMMENDATIONS: 3-4 personalized, actionable suggestions for the coming week
5. EMOTION_BREAKDOWN: A JSON object with emotion names as keys and intensity scores (1-10) as values

Format as JSON:
{
  "emotionalSummary": "Personal, warm summary...",
  "keyPatterns": ["Pattern 1", "Pattern 2", "Pattern 3"],
  "growthObservations": ["Growth 1", "Growth 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "emotionBreakdown": {"joy": 8, "anxiety": 4, "gratitude": 9, "frustration": 3}
}`;
    } else if (analysisType === 'quick') {
      systemPrompt = `You are a caring AI friend who provides quick, actionable insights after journal entries. Be encouraging and focus on practical takeaways.`;
      
      analysisPrompt = `Analyze this journal entry and provide quick insights:

"${entries[0].content}"

Provide 2-3 quick takeaways, emotional insights, growth indicators, and action suggestions.

Format as JSON:
{
  "quickTakeaways": ["Takeaway 1", "Takeaway 2"],
  "emotionalInsights": ["Insight 1", "Insight 2"],
  "growthIndicators": ["Growth indicator 1"],
  "actionSuggestions": ["Suggestion 1", "Suggestion 2"],
  "confidenceScore": 0.85
}`;
    } else {
      // Regular summary analysis
      systemPrompt = `You are a caring AI companion specialized in emotional well-being and personal growth. Your tone should be ${userPreferences?.tone_of_voice || 'supportive'} and focus on ${userPreferences?.growth_focus || 'general development'}. Always use "you" and speak as a caring friend.`;
      
      analysisPrompt = `Analyze these journal entries and provide personalized insights:

${entries.map((entry: any, i: number) => `Entry ${i + 1}: ${entry.content}`).join('\n\n')}

Provide:
1. A warm, personal summary of their emotional patterns
2. Key strengths you've noticed
3. Meaningful insights about their growth journey
4. Personalized recommendations
5. Emotion breakdown with intensity scores

Format as JSON with summary, strengths, keyInsights, recommendations, and emotionBreakdown fields.`;
    }

    console.log('Calling OpenAI API for analysis type:', analysisType);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisContent = data.choices[0].message.content;

    console.log('Raw OpenAI response:', analysisContent);

    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysisContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      throw new Error('Failed to parse AI analysis');
    }

    // Store weekly insights in database if it's a weekly analysis
    if (analysisType === 'weekly' && entries[0]?.user_id) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weekEnd = new Date();

      const { error: insertError } = await supabase
        .from('weekly_insights')
        .insert({
          user_id: entries[0].user_id,
          week_start_date: weekStart.toISOString().split('T')[0],
          week_end_date: weekEnd.toISOString().split('T')[0],
          insights: parsedAnalysis,
          emotional_summary: parsedAnalysis.emotionalSummary,
          key_patterns: parsedAnalysis.keyPatterns,
          recommendations: parsedAnalysis.recommendations,
          growth_observations: parsedAnalysis.growthObservations,
          entry_count: entries.length,
          average_mood: entries.reduce((sum: number, entry: any) => sum + (entry.mood_after || 0), 0) / entries.length
        });

      if (insertError) {
        console.error('Error storing weekly insights:', insertError);
      }
    }

    // Store quick analysis in database if it's a quick analysis
    if (analysisType === 'quick' && entries[0]?.id && entries[0]?.user_id) {
      const { error: insertError } = await supabase
        .from('entry_quick_analysis')
        .insert({
          entry_id: entries[0].id,
          user_id: entries[0].user_id,
          quick_takeaways: parsedAnalysis.quickTakeaways,
          emotional_insights: parsedAnalysis.emotionalInsights,
          growth_indicators: parsedAnalysis.growthIndicators,
          action_suggestions: parsedAnalysis.actionSuggestions,
          confidence_score: parsedAnalysis.confidenceScore
        });

      if (insertError) {
        console.error('Error storing quick analysis:', insertError);
      }
    }

    return new Response(JSON.stringify(parsedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-journal-summary:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
