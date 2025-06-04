
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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

    const body = await req.json()
    
    // Handle completion of signup
    if (body.action === 'complete' && body.token) {
      const { error } = await supabaseClient
        .from('pending_signups')
        .update({ completed: true })
        .eq('token', body.token)

      if (error) {
        console.error('Error completing signup:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to complete signup' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle new signup creation
    const { name, phone_number, timezone = 'UTC' } = body

    if (!name || !phone_number) {
      return new Response(
        JSON.stringify({ error: 'Name and phone number are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate secure token
    const token = crypto.randomUUID()

    // Store pending signup
    const { data, error } = await supabaseClient
      .from('pending_signups')
      .insert({
        token,
        name,
        phone_number,
        timezone,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create signup request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate completion URL
    const completionUrl = `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/complete-signup?token=${token}`

    return new Response(
      JSON.stringify({
        success: true,
        token,
        completion_url: completionUrl,
        expires_at: data.expires_at,
        message: `Hi ${name}! Please complete your signup by clicking this link: ${completionUrl}`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
