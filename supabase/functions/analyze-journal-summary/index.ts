
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

    console.log(`Generating ${analysisType} analysis for ${entries.length} entries`);

    // Create Supabase client with service role for additional data access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from first entry
    const userId = entries[0].user_id;

    // Fetch user context for personalization
    const [userPatternsResult, coachingStateResult, recentEntriesResult] = await Promise.all([
      supabase.from('user_patterns').select('*').eq('user_id', userId).order('confidence_level', { ascending: false }).limit(10),
      supabase.from('coaching_state').select('*').eq('user_id', userId).single(),
      supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
    ]);

    const userPatterns = userPatternsResult.data || [];
    const coachingState = coachingStateResult.data;
    const recentEntries = recentEntriesResult.data || [];

    // Build personalized context
    let personalContext = userPreferences ? 
      `User prefers ${userPreferences.tone_of_voice} communication style and focuses on ${userPreferences.growth_focus}.` : 
      'Use a supportive and encouraging tone.';

    // Add pattern context
    if (userPatterns.length > 0) {
      const topPatterns = userPatterns.slice(0, 3).map(p => `${p.pattern_type}: ${p.pattern_key}`).join(', ');
      personalContext += ` Known patterns: ${topPatterns}.`;
    }

    // Add historical context
    if (recentEntries.length > 5) {
      const avgMood = recentEntries.filter(e => e.mood_after).reduce((sum, e) => sum + e.mood_after, 0) / recentEntries.filter(e => e.mood_after).length;
      personalContext += ` Recent average mood: ${avgMood.toFixed(1)}/5.`;
      
      const commonEmotions = recentEntries.flatMap(e => e.ai_detected_emotions || [])
        .reduce((acc, emotion) => {
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      
      const topEmotions = Object.entries(commonEmotions)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([emotion]) => emotion);
      
      if (topEmotions.length > 0) {
        personalContext += ` Frequently expressed emotions: ${topEmotions.join(', ')}.`;
      }
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (analysisType === 'individual' && entries.length === 1) {
      // Individual entry deep analysis
      systemPrompt = `You are a compassionate AI therapist and personal development coach who knows this person well. ${personalContext}

Provide deeply personalized analysis in this exact JSON format:
{
  "insights": ["personal insight referencing their patterns", "insight about their growth", "insight connecting to their history"],
  "emotionalThemes": ["theme1", "theme2", "theme3"],
  "cognitivePatterns": ["pattern specific to this person", "pattern they've shown before"],
  "suggestions": ["suggestion based on what works for them", "suggestion building on their strengths", "suggestion addressing their specific challenges"],
  "emotionalComplexity": 7,
  "selfAwareness": 8,
  "growthIndicators": ["specific progress they've made", "positive change noticed"],
  "concerns": ["gentle concern based on patterns", "area needing attention"]
}

Make insights personal by referencing their known patterns, growth areas, and what you've observed about them specifically. Use "you" language and be specific about THEIR journey.`;

      userPrompt = `Analyze this journal entry for someone you know well:

Title: ${entries[0].title || 'Untitled'}
Content: ${entries[0].content}
User's mood after writing: ${entries[0].mood_after || 'Not specified'}
AI detected emotions: ${entries[0].ai_detected_emotions?.join(', ') || 'None detected'}

Context about this person:
${personalContext}`;

    } else if (analysisType === 'quick') {
      // Enhanced quick analysis with personal context
      systemPrompt = `You are this person's personal AI coach who has been following their journey. ${personalContext}

Provide personalized quick insights in this exact JSON format:
{
  "quick_takeaways": ["takeaway connecting to their patterns", "takeaway about their specific growth", "takeaway addressing their known challenges"],
  "emotional_insights": ["insight about THEIR emotional patterns", "insight about how this fits their journey"],
  "growth_indicators": ["specific progress you notice", "positive change in their patterns"],
  "action_suggestions": ["suggestion based on what works for them", "suggestion addressing their specific needs"],
  "confidence_score": 0.85
}

Reference their known patterns and speak as someone who understands their unique journey. Be specific about THEIR growth and challenges.`;

      userPrompt = `Provide personalized insights for someone you've been coaching:

Entry: ${entries[0].content}
Mood: ${entries[0].mood_after || 'Not specified'}

Personal context: ${personalContext}

Known patterns to reference: ${userPatterns.map(p => `${p.pattern_type} (${p.pattern_key})`).join(', ')}`;

    } else if (analysisType === 'weekly') {
      // Weekly insights analysis
      systemPrompt = `You are a personal development coach who has been following this person's weekly journey. ${personalContext}

Provide deeply personal weekly analysis in this exact JSON format:
{
  "emotional_summary": "A warm, personal summary referencing their specific patterns and growth",
  "key_patterns": ["pattern specific to this person", "pattern you've observed consistently", "new pattern emerging"],
  "recommendations": ["rec based on their preferences", "rec building on their strengths", "rec addressing their challenges"],
  "growth_observations": ["specific growth you've witnessed", "positive change in their approach"],
  "insights": {
    "dominant_emotions": ["emotion1", "emotion2"],
    "breakthrough_moments": ["specific moment of growth", "positive pattern shift"],
    "areas_for_attention": ["area based on their patterns", "gentle guidance for improvement"]
  }
}

Write as their personal coach who has been watching their journey. Reference specific patterns and celebrate their unique progress.`;

      const weekContent = entries.map((entry, index) => 
        `Day ${index + 1}: ${entry.content.substring(0, 200)}... (Mood: ${entry.mood_after || 'N/A'})`
      ).join('\n\n');

      userPrompt = `Analyze this week's entries for someone you know well:

${weekContent}

Personal context: ${personalContext}
Their patterns: ${userPatterns.map(p => `${p.pattern_type}: ${p.pattern_key} (confidence: ${p.confidence_level})`).join(', ')}
Total entries this week: ${entries.length}`;

    } else {
      // Summary analysis with personal context
      systemPrompt = `You are a compassionate AI therapist providing deeply personalized journal analysis for someone you know well. ${personalContext}

Analyze their entries and provide personal insights in this exact JSON format:
{
  "summary": "A warm, personal summary that references their specific journey and patterns",
  "strengths": ["strength you've observed in them", "strength that's growing", "strength they may not recognize"],
  "keyInsights": ["insight about their unique patterns", "insight about their growth trajectory", "insight connecting their experiences"],
  "recommendations": ["rec based on their preferences", "rec leveraging their strengths", "rec addressing their specific challenges"],
  "emotionBreakdown": {
    "positive": 60,
    "neutral": 25,
    "negative": 15
  }
}

Reference their known patterns and speak as someone who truly knows their journey.`;

      const entriesText = entries.map((entry, index) => 
        `Entry ${index + 1} (${entry.created_at}): ${entry.content} (Mood: ${entry.mood_after || 'N/A'})`
      ).join('\n\n');

      userPrompt = `Analyze these journal entries for someone you've been following:

${entriesText}

Personal context: ${personalContext}
Their established patterns: ${userPatterns.map(p => `${p.pattern_type}: ${p.pattern_key}`).join(', ')}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    console.log('Raw AI response:', analysisText);

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Invalid AI response format');
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-journal-summary function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
