
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { entryId, content, userId } = await req.json()

    if (!entryId || !content || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Generating focused analysis for entry ${entryId} (${content.split(' ').length} words)`)

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create focused analysis prompt
    const prompt = `Analyze this journal entry and provide focused insights in JSON format:

"${content}"

Provide analysis in this exact JSON structure:
{
  "quick_takeaways": ["insight 1", "insight 2"],
  "emotional_insights": ["emotional pattern or observation"],
  "growth_indicators": ["signs of personal growth or areas for development"],
  "action_suggestions": ["specific actionable suggestion"],
  "confidence_score": 0.85
}

Focus on:
- 2 key takeaways maximum
- 1 emotional insight
- 1 growth indicator
- 1 practical action suggestion
- Keep insights concise and actionable`

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
            content: 'You are an expert journal analysis assistant. Provide concise, actionable insights in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const aiResponse = await response.json()
    const analysisContent = aiResponse.choices[0]?.message?.content

    if (!analysisContent) {
      throw new Error('No analysis content received from AI')
    }

    let analysisData
    try {
      analysisData = JSON.parse(analysisContent)
      console.log('Raw AI response:', analysisData)
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisContent)
      throw new Error('Invalid AI response format')
    }

    // Validate required fields
    const requiredFields = ['quick_takeaways', 'emotional_insights', 'growth_indicators', 'action_suggestions', 'confidence_score']
    for (const field of requiredFields) {
      if (!analysisData[field]) {
        console.error(`Missing required field: ${field}`)
        throw new Error(`Analysis missing required field: ${field}`)
      }
    }

    console.log(`Quick analysis complete: ${analysisData.quick_takeaways?.length || 0} takeaways, ${analysisData.growth_indicators?.length || 0} growth indicators`)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store analysis using upsert to handle conflicts properly
    const { data, error } = await supabase
      .from('entry_quick_analysis')
      .upsert({
        entry_id: entryId,
        user_id: userId,
        quick_takeaways: analysisData.quick_takeaways || [],
        emotional_insights: analysisData.emotional_insights || [],
        growth_indicators: analysisData.growth_indicators || [],
        action_suggestions: analysisData.action_suggestions || [],
        confidence_score: analysisData.confidence_score || 0.5,
      }, {
        onConflict: 'entry_id',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('Error storing analysis:', error)
      // Don't throw here, return the analysis even if storage fails
      return new Response(
        JSON.stringify({
          success: true,
          analysis: analysisData,
          warning: 'Analysis completed but storage failed'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysisData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Analysis error:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Analysis failed',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
