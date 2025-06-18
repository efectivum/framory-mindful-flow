
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
    const { content } = await req.json();
    
    // Skip analysis for very short content
    if (content.trim().split(' ').length < 10) {
      return new Response(JSON.stringify({
        mood: 3,
        sentiment: 0,
        emotions: [],
        confidence: 0.1
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const wordCount = content.trim().split(' ').length;
    
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
            - emotions: array of ALL meaningful emotions detected (extract as many as are genuinely present - quality over arbitrary limits)
            - confidence: decimal 0.0 to 1.0 representing confidence in analysis
            
            For content with ${wordCount} words:
            - Extract emotions that are clearly present and meaningful
            - Don't force emotions if content is simple
            - Rich, complex entries may have 6-12 emotions
            - Simple entries may have 2-4 emotions
            - Focus on accuracy and relevance
            
            Return only valid JSON with no markdown formatting.`
          },
          { role: 'user', content: `Analyze this journal entry: "${content}"` }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    console.log('Raw AI response:', data.choices[0].message.content);
    
    const analysis = cleanAndParseJSON(data.choices[0].message.content);

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
