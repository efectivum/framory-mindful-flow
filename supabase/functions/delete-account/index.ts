
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { confirmation_text } = await req.json()

    // Verify confirmation text
    if (confirmation_text !== 'DELETE MY ACCOUNT') {
      return new Response(JSON.stringify({ error: 'Invalid confirmation text' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Starting account deletion for user ${user.id}`)

    // Delete user data in correct order (respecting foreign keys)
    const tables = [
      'habit_completions',
      'habits',
      'deep_reflections',
      'entry_quick_analysis',
      'journal_entries',
      'coaching_interactions',
      'coaching_state',
      'user_patterns',
      'weekly_insights',
      'ai_insights',
      'user_activities',
      'notifications',
      'data_exports',
      'user_preferences',
      'profiles'
    ]

    for (const table of tables) {
      const { error } = await supabaseClient
        .from(table)
        .delete()
        .eq('user_id', user.id)
      
      if (error) {
        console.error(`Error deleting from ${table}:`, error)
        // Continue with other tables even if one fails
      }
    }

    // Delete the auth user (this will cascade to any remaining references)
    const { error: deleteUserError } = await supabaseClient.auth.admin.deleteUser(user.id)
    
    if (deleteUserError) {
      console.error('Error deleting auth user:', deleteUserError)
      return new Response(JSON.stringify({ error: 'Failed to delete account' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Account deletion completed for user ${user.id}`)

    return new Response(JSON.stringify({ message: 'Account deleted successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Account deletion error:', error)
    return new Response(JSON.stringify({ error: 'Account deletion failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
