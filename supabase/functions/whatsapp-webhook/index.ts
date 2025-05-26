
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { phone_number, message_content, direction, user_id, message_type = 'text' } = await req.json()

    console.log('Processing WhatsApp webhook:', { phone_number, direction, user_id, message_content: message_content?.substring(0, 50) + '...' })

    if (!phone_number || !message_content || !direction || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Store the WhatsApp message
    const { data: messageData, error: messageError } = await supabaseClient
      .from('whatsapp_messages')
      .insert({
        user_id,
        phone_number,
        message_content,
        message_type,
        direction,
        processed: false
      })
      .select()
      .single()

    if (messageError) {
      console.error('Error storing WhatsApp message:', messageError)
      throw messageError
    }

    console.log('WhatsApp message stored:', messageData.id)

    // For inbound messages, determine the activity type and store in unified activity log
    if (direction === 'inbound') {
      let activityType = 'reflection' // default
      let activityTitle = 'WhatsApp Message'

      // Simple keyword detection to categorize the message
      const content = message_content.toLowerCase()
      
      if (content.includes('goal') || content.includes('target') || content.includes('achieve')) {
        activityType = 'goal'
        activityTitle = 'Goal Update via WhatsApp'
      } else if (content.includes('habit') || content.includes('daily') || content.includes('routine')) {
        activityType = 'habit'
        activityTitle = 'Habit Check-in via WhatsApp'
      } else if (content.includes('mood') || content.includes('feeling') || content.includes('emotion')) {
        activityType = 'mood'
        activityTitle = 'Mood Update via WhatsApp'
      } else if (content.includes('journal') || content.includes('today') || content.includes('reflect')) {
        activityType = 'journal'
        activityTitle = 'Journal Entry via WhatsApp'
      }

      // Store in unified activity log
      const { data: activityData, error: activityError } = await supabaseClient
        .from('user_activities')
        .insert({
          user_id,
          type: activityType,
          source: 'whatsapp',
          title: activityTitle,
          content: message_content,
          metadata: {
            whatsapp_message_id: messageData.id,
            phone_number,
            detected_keywords: content.split(' ').filter(word => 
              ['goal', 'habit', 'mood', 'journal', 'feeling', 'daily', 'routine', 'achieve', 'target'].includes(word)
            )
          }
        })

      if (activityError) {
        console.error('Error storing activity:', activityError)
        // Don't throw error here, message was still stored successfully
      } else {
        console.log('Activity stored:', activityData)
      }

      // Generate AI insight for the message
      try {
        const aiInsight = await generateAIInsight(message_content, activityType)
        
        if (aiInsight) {
          const { error: insightError } = await supabaseClient
            .from('ai_insights')
            .insert({
              user_id,
              source_type: 'whatsapp',
              source_id: messageData.id,
              insight_type: activityType === 'mood' ? 'mood' : 'theme',
              content: aiInsight.content,
              confidence_score: aiInsight.confidence || 0.7,
              metadata: {
                activity_type: activityType,
                generated_from: 'whatsapp_message'
              }
            })

          if (insightError) {
            console.error('Error storing AI insight:', insightError)
          } else {
            console.log('AI insight generated and stored')
          }
        }
      } catch (insightError) {
        console.error('Error generating AI insight:', insightError)
        // Don't fail the whole request if AI insight fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message_id: messageData.id,
        activity_logged: direction === 'inbound'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in WhatsApp webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function generateAIInsight(messageContent: string, activityType: string): Promise<{ content: string; confidence: number } | null> {
  // Simple AI insight generation based on keywords and patterns
  const content = messageContent.toLowerCase()
  
  if (activityType === 'mood') {
    if (content.includes('happy') || content.includes('great') || content.includes('amazing')) {
      return {
        content: "You seem to be in a positive mood today. This is great for maintaining motivation!",
        confidence: 0.8
      }
    } else if (content.includes('tired') || content.includes('stressed') || content.includes('difficult')) {
      return {
        content: "You might be experiencing some challenges today. Consider some self-care activities.",
        confidence: 0.75
      }
    }
  } else if (activityType === 'goal') {
    if (content.includes('completed') || content.includes('finished') || content.includes('done')) {
      return {
        content: "Great job on completing your goal! Consistency is key to building lasting habits.",
        confidence: 0.85
      }
    }
  } else if (activityType === 'habit') {
    if (content.includes('streak') || content.includes('consecutive') || content.includes('row')) {
      return {
        content: "Building streaks is an excellent way to maintain momentum. Keep it up!",
        confidence: 0.8
      }
    }
  }

  // General insight for any reflective content
  if (content.length > 50) {
    return {
      content: "Thank you for sharing your thoughts. Regular reflection can help you understand patterns in your life.",
      confidence: 0.6
    }
  }

  return null
}
