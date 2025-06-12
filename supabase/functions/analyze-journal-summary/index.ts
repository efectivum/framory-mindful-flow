
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { entries, analysisType = 'summary' } = await req.json();

    if (!entries || entries.length === 0) {
      throw new Error('No entries provided for analysis');
    }

    let prompt = '';
    let systemMessage = '';

    if (analysisType === 'summary') {
      systemMessage = `You are an expert emotional intelligence analyst and therapist. Analyze a collection of journal entries and provide comprehensive insights.

Return a JSON response with:
- emotionBreakdown: object with emotion names as keys and percentages as values (should add up to 100)
- keyInsights: array of 3-4 key insights about emotional patterns
- summary: detailed paragraph summary of emotional journey
- recommendations: array of 2-3 actionable recommendations
- overallTrend: string describing the general emotional trajectory ("improving", "stable", "declining", "mixed")
- riskFactors: array of potential concerns if any
- strengths: array of positive patterns identified

Only return valid JSON, no other text.`;

      const entriesText = entries.map((entry: any) => 
        `Date: ${entry.created_at}\nContent: ${entry.content}\nUser Mood: ${entry.mood_after || 'Not specified'}\nAI Detected Emotions: ${entry.ai_detected_emotions?.join(', ') || 'None'}`
      ).join('\n\n---\n\n');

      prompt = `Analyze these journal entries for emotional patterns and insights:\n\n${entriesText}`;
    } else if (analysisType === 'entry') {
      systemMessage = `You are an expert emotional intelligence analyst. Provide deep analysis for a single journal entry.

Return a JSON response with:
- emotionalThemes: array of main emotional themes identified
- cognitivePatterns: array of thinking patterns observed
- insights: array of 2-3 key insights about this entry
- suggestions: array of 2-3 specific suggestions for growth
- emotionalComplexity: number 1-10 representing emotional complexity
- selfAwareness: number 1-10 representing level of self-awareness shown
- growthIndicators: array of positive signs of personal growth
- concerns: array of any concerning patterns (empty if none)

Only return valid JSON, no other text.`;

      const entry = entries[0];
      prompt = `Analyze this journal entry in depth:\n\nDate: ${entry.created_at}\nContent: ${entry.content}\nUser Mood: ${entry.mood_after || 'Not specified'}\nAI Detected: Mood ${entry.ai_detected_mood || 'None'}, Emotions: ${entry.ai_detected_emotions?.join(', ') || 'None'}`;
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
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-journal-summary function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
