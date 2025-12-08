import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const { entryContent, userPreferences, recentEntries } = await req.json();

    // Build context from recent entries
    const contextEntries = recentEntries?.slice(0, 3)
      .map((entry: any, index: number) => `Entry ${index + 1}: ${entry.content}`)
      .join('\n\n') || '';

    const systemPrompt = `You are a skilled therapist providing deep reflection on journal entries. Your role is to:

1. Acknowledge what you hear with empathy and understanding
2. Connect patterns from their current and previous entries
3. Ask ONE powerful, probing question that helps them explore deeper

Follow this structure:
- Start with "I hear..." to reflect their emotions and situation
- Connect to patterns: "Your previous entries mentioned..." (if relevant)
- End with ONE specific, thought-provoking question

Keep the reflection warm, professional, and focused. Avoid generic advice. Make it personal to their specific situation.

Tone: ${userPreferences?.tone_of_voice || 'supportive'} and therapeutic
Focus area: ${userPreferences?.growth_focus || 'general well-being'}`;

    const userPrompt = `Current journal entry:
${entryContent}

${contextEntries ? `Recent entries for context:\n${contextEntries}` : ''}

Please provide a deep reflection following the structure above.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(JSON.stringify({ 
          error: "Rate limits exceeded, please try again later." 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(JSON.stringify({ 
          error: "AI credits exhausted, please add funds." 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.statusText}`);
    }

    const data = await response.json();
    const reflection = data.choices[0]?.message?.content;

    if (!reflection) {
      throw new Error('No reflection generated');
    }

    // Split reflection into content and question
    const parts = reflection.split('\n\n');
    const reflectionContent = parts.slice(0, -1).join('\n\n');
    const probingQuestion = parts[parts.length - 1];

    return new Response(
      JSON.stringify({
        reflection_content: reflectionContent,
        probing_question: probingQuestion,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error generating deep reflection:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
