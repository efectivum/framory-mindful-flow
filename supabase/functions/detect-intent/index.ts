import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const { message, activityType, conversationHistory } = await req.json();

    // If user explicitly selected an activity type, it's definitely a journal intent
    if (activityType && activityType !== 'chat') {
      return new Response(JSON.stringify({
        intent: 'journal',
        confidence: 1.0,
        reasoning: `User explicitly selected "${activityType}" activity type`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build context from recent conversation
    const recentContext = conversationHistory 
      ? conversationHistory.slice(-3).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
      : '';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an intent detection system. Analyze the user's message and determine if they want to:
1. "chat" - Have a conversation, ask questions, get advice, discuss topics, seek help
2. "journal" - Log a personal experience, record thoughts/feelings, document events, reflect on something that happened

BE VERY STRICT: Only classify as "journal" if the user is clearly sharing a personal experience or reflection they want to record. Questions, requests for advice, general discussion, or exploratory thoughts should be "chat".

${recentContext ? `Recent conversation context:\n${recentContext}\n` : ''}

Return a JSON object with:
- intent: "chat" or "journal"
- confidence: number between 0 and 1 (be conservative - only high confidence for clear journal entries)
- reasoning: brief explanation

Examples of CHAT intent:
- "How can I improve my sleep?"
- "What should I do about stress?"
- "I'm thinking about starting a new habit"
- "Any tips for waking up early?"
- "Hello" / "Hi" / greetings
- "Can you help me with..."
- "What do you think about..."
- "I'm wondering if..."
- "Should I..."

Examples of JOURNAL intent (HIGH confidence only):
- "I had a great workout today and feel amazing"
- "Today was really stressful at work, couldn't focus"
- "Just finished meditating, feeling much calmer now"
- "Went to bed at 10pm, slept really well"
- "Had a difficult conversation with my partner today"

When in doubt, lean towards "chat" with lower confidence.`
          },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(JSON.stringify({ 
          error: "Rate limits exceeded, please try again later.",
          intent: 'chat',
          confidence: 0.5,
          reasoning: 'Defaulting to chat due to rate limit'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(JSON.stringify({ 
          error: "AI credits exhausted, please add funds.",
          intent: 'chat',
          confidence: 0.5,
          reasoning: 'Defaulting to chat due to payment required'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    let result;
    try {
      let content = data.choices[0].message.content;
      // Clean markdown if present
      if (content.startsWith('```json')) {
        content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse intent response:', data.choices[0].message.content);
      result = { intent: 'chat', confidence: 0.5, reasoning: 'Failed to parse AI response' };
    }

    console.log('Intent detection result:', result);

    // Apply confidence threshold - only journal if confidence > 0.7
    if (result.intent === 'journal' && result.confidence <= 0.7) {
      result.intent = 'chat';
      result.reasoning = `Low confidence journal detection (${result.confidence}), treating as chat: ${result.reasoning}`;
      result.confidence = 0.6;
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in detect-intent function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      intent: 'chat',
      confidence: 0.5,
      reasoning: 'Error occurred, defaulting to chat'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
