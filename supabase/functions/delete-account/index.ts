
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

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Delete account: Invalid JSON in request body:', error);
      return new Response(JSON.stringify({ error: 'Invalid request format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { confirmation_text } = body;

    // Validate confirmation text (must be exact match)
    if (!confirmation_text || typeof confirmation_text !== 'string') {
      return new Response(JSON.stringify({ error: 'Confirmation text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (confirmation_text.trim() !== 'DELETE MY ACCOUNT') {
      console.warn(`Delete account: Invalid confirmation attempt for user ${user.id}:`, confirmation_text);
      return new Response(JSON.stringify({ error: 'Invalid confirmation text' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Rate limiting - prevent multiple deletion attempts
    const currentWindow = new Date();
    currentWindow.setMinutes(0, 0, 0);

    try {
      const { data: rateLimitData } = await supabaseClient
        .from('rate_limits')
        .select('request_count')
        .eq('user_id', user.id)
        .eq('endpoint', 'delete-account')
        .eq('window_start', currentWindow.toISOString())
        .maybeSingle();

      if (rateLimitData && rateLimitData.request_count >= 1) {
        return new Response(JSON.stringify({ 
          error: 'Account deletion request already in progress' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      await supabaseClient
        .from('rate_limits')
        .upsert({
          user_id: user.id,
          endpoint: 'delete-account',
          window_start: currentWindow.toISOString(),
          request_count: 1
        });
    } catch (error) {
      console.error('Delete account: Rate limiting error:', error);
      // Continue with deletion even if rate limiting fails
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
