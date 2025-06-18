
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entries, analysisType = 'quick', userPreferences, userPatterns } = await req.json();
    
    if (!entries || entries.length === 0) {
      throw new Error('No entries provided for analysis');
    }

    const entry = entries[0];
    const wordCount = entry.content.trim().split(' ').length;
    
    // Content-driven analysis logic
    let maxTakeaways, analysisDepth;
    if (wordCount < 50) {
      // Very short entries - minimal analysis
      maxTakeaways = 1;
      analysisDepth = "brief";
    } else if (wordCount < 150) {
      // Short entries - light analysis
      maxTakeaways = 3;
      analysisDepth = "concise";
    } else if (wordCount < 300) {
      // Medium entries - moderate analysis
      maxTakeaways = 5;
      analysisDepth = "moderate";
    } else {
      // Rich entries - comprehensive analysis
      maxTakeaways = 8;
      analysisDepth = "comprehensive";
    }

    if (analysisType === 'quick') {
      console.log(`Generating ${analysisDepth} analysis for ${entries.length} entries`);
      
      const analysisPrompt = `You are an expert journal analyst. Analyze this journal entry and provide insights based on its content richness.

Entry content: "${entry.content}"
Word count: ${wordCount}
Analysis depth: ${analysisDepth}

Provide a JSON response with:
- quick_takeaways: Array of meaningful insights (extract as many as the content warrants, up to ${maxTakeaways} for this entry length)
- emotional_insights: Array of emotional observations (only if emotionally rich content)
- growth_indicators: Array of growth signals (only if present)
- action_suggestions: Array of actionable suggestions (only if appropriate)
- confidence_score: 0.0-1.0 confidence level

Guidelines:
- Quality over quantity - each insight must add genuine value
- For short entries (${wordCount} words): Focus on 1-2 key themes only
- For rich entries: Extract multiple meaningful insights
- Don't force insights if content is simple
- Avoid repetitive or shallow observations
- Each takeaway should be a complete, valuable insight

Only return valid JSON.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: analysisPrompt }],
          temperature: 0.4,
        }),
      });

      const aiResponse = await response.json();
      console.log('Raw AI response:', aiResponse.choices[0].message.content);
      
      const analysis = JSON.parse(aiResponse.choices[0].message.content);

      // Store the analysis
      const { error: insertError } = await supabase
        .from('entry_quick_analysis')
        .upsert({
          entry_id: entry.id,
          user_id: entry.user_id,
          quick_takeaways: analysis.quick_takeaways || [],
          emotional_insights: analysis.emotional_insights || [],
          growth_indicators: analysis.growth_indicators || [],
          action_suggestions: analysis.action_suggestions || [],
          confidence_score: analysis.confidence_score || 0.5
        }, {
          onConflict: 'entry_id'
        });

      if (insertError) {
        console.error('Error storing analysis:', insertError);
      }

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Individual entry analysis for deep reflection
    if (analysisType === 'individual') {
      const analysisPrompt = `You are an expert therapeutic journal analyst. Provide deep analysis for this journal entry.

Entry: "${entry.content}"
Analysis depth: ${analysisDepth}

Provide comprehensive analysis with:
- insights: Array of deep psychological insights
- emotionalThemes: Array of emotional themes
- cognitivePatterns: Array of thinking patterns
- suggestions: Array of growth suggestions
- emotionalComplexity: 1-10 rating
- selfAwareness: 1-10 rating
- growthIndicators: Array of positive signals
- concerns: Array of areas needing attention

Extract as many meaningful insights as the content warrants. Rich, complex entries should yield more insights.

Return only valid JSON.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: analysisPrompt }],
          temperature: 0.4,
        }),
      });

      const aiResponse = await response.json();
      const analysis = JSON.parse(aiResponse.choices[0].message.content);

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid analysis type');

  } catch (error) {
    console.error('Error in analyze-journal-summary function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
