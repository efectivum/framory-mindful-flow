
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

// Helper function to clean and parse JSON from OpenAI response
function cleanAndParseJSON(rawResponse: string) {
  try {
    // Remove markdown code blocks if present
    let cleaned = rawResponse.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '');
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/\s*```$/, '');
    }
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    console.error('Raw response:', rawResponse);
    throw new Error('Invalid JSON response from AI');
  }
}

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
    
    // Skip analysis for very short content (minimum 50 words)
    if (wordCount < 50) {
      console.log(`Skipping quick analysis for short content (${wordCount} words)`);
      const defaultAnalysis = {
        quick_takeaways: [],
        emotional_insights: [],
        growth_indicators: [],
        action_suggestions: [],
        confidence_score: 0.1
      };
      
      const { error: insertError } = await supabase
        .from('entry_quick_analysis')
        .upsert({
          entry_id: entry.id,
          user_id: entry.user_id,
          ...defaultAnalysis
        }, {
          onConflict: 'entry_id'
        });

      if (insertError) {
        console.error('Error storing analysis:', insertError);
      }

      return new Response(JSON.stringify(defaultAnalysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Smart content-driven analysis logic - Mindsera style
    let maxTakeaways, maxGrowthIndicators, analysisDepth;
    if (wordCount < 100) {
      maxTakeaways = 1;
      maxGrowthIndicators = 1;
      analysisDepth = "concise";
    } else if (wordCount < 200) {
      maxTakeaways = 2;
      maxGrowthIndicators = 1;
      analysisDepth = "focused";
    } else if (wordCount < 400) {
      maxTakeaways = 3;
      maxGrowthIndicators = 2;
      analysisDepth = "balanced";
    } else {
      maxTakeaways = 4;
      maxGrowthIndicators = 2;
      analysisDepth = "comprehensive";
    }

    if (analysisType === 'quick') {
      console.log(`Generating ${analysisDepth} analysis for entry ${entry.id} (${wordCount} words)`);
      
      const analysisPrompt = `You are an expert journal analyst specializing in extracting concise, meaningful insights from personal writing.

Entry content: "${entry.content}"
Word count: ${wordCount}
Analysis approach: ${analysisDepth}

Provide a JSON response with these fields:
- quick_takeaways: Array of ${maxTakeaways} concise insights (one clear sentence each)
- emotional_insights: Array of emotional observations (only if emotionally significant)
- growth_indicators: Array of ${maxGrowthIndicators} growth signals (only if clearly present)
- action_suggestions: Array of actionable suggestions (only if appropriate)
- confidence_score: 0.0-1.0 confidence level

Mindsera-style guidelines:
- Each takeaway must be ONE sentence, clear and specific
- Focus on the most important insight(s) only
- For shorter entries: Extract 1-2 core themes, avoid over-analysis
- For longer entries: Identify key patterns but stay concise
- Don't force insights if content is simple
- Make each insight genuinely valuable and specific to this content
- Avoid generic advice - personalize to what was actually written

Return only valid JSON with no markdown formatting.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: analysisPrompt }],
          temperature: 0.2,
        }),
      });

      const aiResponse = await response.json();
      console.log('Raw AI response:', aiResponse.choices[0].message.content);
      
      const analysis = cleanAndParseJSON(aiResponse.choices[0].message.content);

      // Ensure limits are respected
      if (analysis.quick_takeaways && analysis.quick_takeaways.length > maxTakeaways) {
        analysis.quick_takeaways = analysis.quick_takeaways.slice(0, maxTakeaways);
      }
      if (analysis.growth_indicators && analysis.growth_indicators.length > maxGrowthIndicators) {
        analysis.growth_indicators = analysis.growth_indicators.slice(0, maxGrowthIndicators);
      }

      console.log(`Quick analysis complete: ${analysis.quick_takeaways?.length || 0} takeaways, ${analysis.growth_indicators?.length || 0} growth indicators`);

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

Extract meaningful insights based on content richness. Quality over quantity.

Return only valid JSON with no markdown formatting.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: analysisPrompt }],
          temperature: 0.3,
        }),
      });

      const aiResponse = await response.json();
      const analysis = cleanAndParseJSON(aiResponse.choices[0].message.content);

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid analysis type');

  } catch (error) {
    console.error('Error in analyze-journal-summary function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      quick_takeaways: [],
      emotional_insights: [],
      growth_indicators: [],
      action_suggestions: [],
      confidence_score: 0.0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
