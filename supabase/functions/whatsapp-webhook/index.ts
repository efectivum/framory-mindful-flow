
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppMessage {
  phone_number: string
  message_content: string
  message_type?: 'text' | 'voice' | 'image'
  direction: 'inbound' | 'outbound'
  whatsapp_message_id?: string
}

interface AIInsight {
  source_type: 'whatsapp' | 'journal' | 'goals'
  source_id?: string
  insight_type: 'mood' | 'theme' | 'suggestion' | 'progress'
  content: string
  confidence_score?: number
  metadata?: Record<string, any>
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    if (req.method === 'POST') {
      const body = await req.json()
      console.log('Received request:', { action, body })

      if (action === 'store-message') {
        return await storeMessage(supabaseClient, body)
      } else if (action === 'store-insight') {
        return await storeInsight(supabaseClient, body)
      } else if (action === 'get-user-by-phone') {
        return await getUserByPhone(supabaseClient, body)
      } else if (action === 'create-user-profile') {
        return await createUserProfile(supabaseClient, body)
      }
    }

    if (req.method === 'GET' && action === 'get-messages') {
      const phone = url.searchParams.get('phone')
      const limit = parseInt(url.searchParams.get('limit') || '50')
      return await getMessages(supabaseClient, phone, limit)
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint or method' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function storeMessage(supabase: any, data: WhatsAppMessage & { user_id?: string }) {
  const { phone_number, message_content, message_type = 'text', direction, whatsapp_message_id, user_id } = data

  if (!phone_number || !message_content || !direction) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: phone_number, message_content, direction' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  let finalUserId = user_id

  // If no user_id provided, try to find user by phone number
  if (!finalUserId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone_number', phone_number)
      .single()

    if (profile) {
      finalUserId = profile.id
    } else {
      return new Response(
        JSON.stringify({ error: 'User not found for phone number. Create profile first.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  const { data, error } = await supabase
    .from('whatsapp_messages')
    .insert({
      user_id: finalUserId,
      phone_number,
      message_content,
      message_type,
      direction,
      whatsapp_message_id,
      processed: false
    })
    .select()

  if (error) {
    console.error('Error storing message:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, data }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function storeInsight(supabase: any, data: AIInsight & { user_id?: string, phone_number?: string }) {
  const { source_type, source_id, insight_type, content, confidence_score, metadata, user_id, phone_number } = data

  if (!source_type || !insight_type || !content) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: source_type, insight_type, content' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  let finalUserId = user_id

  // If no user_id but phone_number provided, find user by phone
  if (!finalUserId && phone_number) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone_number', phone_number)
      .single()

    if (profile) {
      finalUserId = profile.id
    }
  }

  if (!finalUserId) {
    return new Response(
      JSON.stringify({ error: 'User ID required or user not found for phone number' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data, error } = await supabase
    .from('ai_insights')
    .insert({
      user_id: finalUserId,
      source_type,
      source_id,
      insight_type,
      content,
      confidence_score,
      metadata: metadata || {}
    })
    .select()

  if (error) {
    console.error('Error storing insight:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, data }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getUserByPhone(supabase: any, data: { phone_number: string }) {
  const { phone_number } = data

  if (!phone_number) {
    return new Response(
      JSON.stringify({ error: 'Phone number required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('phone_number', phone_number)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error getting user:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ user: profile }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createUserProfile(supabase: any, data: { phone_number: string, timezone?: string, whatsapp_active?: boolean }) {
  const { phone_number, timezone = 'UTC', whatsapp_active = true } = data

  if (!phone_number) {
    return new Response(
      JSON.stringify({ error: 'Phone number required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Create a temporary user in auth.users first (this is for WhatsApp-only users)
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    phone: phone_number,
    user_metadata: { 
      phone_number,
      timezone,
      whatsapp_only: true 
    }
  })

  if (authError) {
    console.error('Error creating auth user:', authError)
    return new Response(
      JSON.stringify({ error: authError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Update the profile that was auto-created by the trigger
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({
      phone_number,
      timezone,
      whatsapp_active
    })
    .eq('id', authUser.user.id)
    .select()

  if (profileError) {
    console.error('Error updating profile:', profileError)
    return new Response(
      JSON.stringify({ error: profileError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, user: profile[0] }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getMessages(supabase: any, phone: string | null, limit: number) {
  if (!phone) {
    return new Response(
      JSON.stringify({ error: 'Phone number required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data, error } = await supabase
    .from('whatsapp_messages')
    .select('*')
    .eq('phone_number', phone)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error getting messages:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ messages: data }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
