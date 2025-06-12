
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    // Prepare personalized context
    const personalizedContext = userPreferences ? 
      `User prefers ${userPreferences.tone_of_voice} communication style and focuses on ${userPreferences.growth_focus}.` : 
      'Use a supportive and encouraging tone.';

    let systemPrompt = '';
    let userPrompt = '';

    if (analysisType === 'individual' && entries.length === 1) {
      // Individual entry deep analysis
      systemPrompt = `You are a compassionate AI therapist and personal development coach. Analyze this journal entry deeply and personally. ${personalizedContext}

Provide analysis in this exact JSON format:
{
  "insights": ["insight1", "insight2", "insight3"],
  "emotionalThemes": ["theme1", "theme2", "theme3"],
  "cognitivePatterns": ["pattern1", "pattern2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "emotionalComplexity": 7,
  "selfAwareness": 8,
  "growthIndicators": ["indicator1", "indicator2"],
  "concerns": ["concern1", "concern2"]
}

Make insights personal and actionable. Emotional complexity and self-awareness should be scores from 1-10.`;

      userPrompt = `Analyze this journal entry deeply:

Title: ${entries[0].title || 'Untitled'}
Content: ${entries[0].content}
User's mood after writing: ${entries[0].mood_after || 'Not specified'}
AI detected emotions: ${entries[0].ai_detected_emotions?.join(', ') || 'None detected'}`;

    } else if (analysisType === 'quick') {
      // Quick analysis for individual entries
      systemPrompt = `You are a caring friend who provides quick, actionable insights from journal entries. ${personalizedContext}

Provide analysis in this exact JSON format:
{
  "quick_takeaways": ["takeaway1", "takeaway2", "takeaway3"],
  "emotional_insights": ["insight1", "insight2"],
  "growth_indicators": ["indicator1", "indicator2"],
  "action_suggestions": ["suggestion1", "suggestion2"],
  "confidence_score": 0.85
}

Keep takeaways concise but meaningful. Focus on practical insights and growth opportunities.`;

      userPrompt = `Provide quick insights for this journal entry:

Content: ${entries[0].content}
Mood: ${entries[0].mood_after || 'Not specified'}`;

    } else if (analysisType === 'weekly') {
      // Weekly insights analysis
      systemPrompt = `You are a personal development coach creating weekly reflection insights. ${personalizedContext}

Provide analysis in this exact JSON format:
{
  "emotional_summary": "A warm, personal summary of the week's emotional journey",
  "key_patterns": ["pattern1", "pattern2", "pattern3"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "growth_observations": ["observation1", "observation2"],
  "insights": {
    "dominant_emotions": ["emotion1", "emotion2"],
    "breakthrough_moments": ["moment1", "moment2"],
    "areas_for_attention": ["area1", "area2"]
  }
}

Write as if you're a caring friend who has been following their journey. Be encouraging and specific.`;

      const weekContent = entries.map(entry => 
        `Entry ${entry.created_at}: ${entry.content.substring(0, 200)}...`
      ).join('\n\n');

      userPrompt = `Analyze this week's journal entries for patterns and growth:

${weekContent}

Total entries: ${entries.length}
Average mood: ${entries.filter(e => e.mood_after).reduce((sum, e) => sum + e.mood_after, 0) / entries.filter(e => e.mood_after).length || 'Not available'}`;

    } else {
      // Summary analysis (original functionality)
      systemPrompt = `You are a compassionate AI therapist providing personalized journal analysis. ${personalizedContext}

Analyze the journal entries and provide insights in this exact JSON format:
{
  "summary": "A warm, encouraging summary",
  "strengths": ["strength1", "strength2", "strength3"],
  "keyInsights": ["insight1", "insight2", "insight3"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "emotionBreakdown": {
    "positive": 60,
    "neutral": 25,
    "negative": 15
  }
}`;

      const entriesText = entries.map(entry => 
        `Entry from ${entry.created_at}: ${entry.content}`
      ).join('\n\n');

      userPrompt = `Analyze these journal entries:

${entriesText}`;
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
