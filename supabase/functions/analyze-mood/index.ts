
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { content } = await req.json();
    
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid content provided');
    }

    const wordCount = content.trim().split(' ').length;
    
    // Skip analysis for very short content (minimum 50 words)
    if (wordCount < 50) {
      console.log(`Skipping mood analysis for short content (${wordCount} words)`);
      return new Response(JSON.stringify({
        mood: 3,
        sentiment: 0,
        emotions: [],
        confidence: 0.1
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Analyzing mood for ${wordCount} words`);
    
    // Content-driven emotion limit
    let maxEmotions;
    if (wordCount < 100) {
      maxEmotions = 2;
    } else if (wordCount < 200) {
      maxEmotions = 3;
    } else if (wordCount < 400) {
      maxEmotions = 4;
    } else {
      maxEmotions = 5;
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
          {
            role: 'system',
            content: `You are an expert emotional intelligence analyst. Analyze the emotional content of journal entries and return a JSON response with:
            - mood: integer 1-5 (1=very negative, 2=negative, 3=neutral, 4=positive, 5=very positive)
            - sentiment: decimal -1.0 to 1.0 (-1=very negative, 0=neutral, 1=very positive)
            - emotions: array of the ${maxEmotions} most prominent emotions (only clear, genuine emotions)
            - confidence: decimal 0.0 to 1.0 representing confidence in analysis
            
            For content with ${wordCount} words:
            - Extract only ${maxEmotions} main emotions that are clearly present
            - Focus on accuracy over quantity
            - Use specific emotion words, not generic ones
            - Ensure emotions are genuinely reflected in the content
            
            Return only valid JSON with no markdown formatting.`
          },
          { role: 'user', content: `Analyze this journal entry: "${content}"` }
        ],
        temperature: 0.2,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    console.log('Raw AI response:', data.choices[0].message.content);
    
    const analysis = cleanAndParseJSON(data.choices[0].message.content);

    // Validate the response structure
    if (typeof analysis.mood !== 'number' || analysis.mood < 1 || analysis.mood > 5) {
      analysis.mood = 3; // Default to neutral
    }
    if (typeof analysis.sentiment !== 'number' || analysis.sentiment < -1 || analysis.sentiment > 1) {
      analysis.sentiment = 0; // Default to neutral
    }
    if (!Array.isArray(analysis.emotions)) {
      analysis.emotions = [];
    }
    if (typeof analysis.confidence !== 'number' || analysis.confidence < 0 || analysis.confidence > 1) {
      analysis.confidence = 0.5; // Default confidence
    }

    // Ensure emotions array doesn't exceed limit
    if (analysis.emotions && analysis.emotions.length > maxEmotions) {
      analysis.emotions = analysis.emotions.slice(0, maxEmotions);
    }

    console.log(`Mood analysis complete: mood=${analysis.mood}, emotions=[${analysis.emotions.join(', ')}]`);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-mood function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      mood: 3,
      sentiment: 0,
      emotions: [],
      confidence: 0.0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
