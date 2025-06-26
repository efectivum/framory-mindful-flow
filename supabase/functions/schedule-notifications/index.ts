
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TemplateVariables {
  [key: string]: string | number | boolean;
}

class TemplateEngine {
  static render(template: string, variables: TemplateVariables = {}): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      const value = variables[variableName];
      if (value === undefined || value === null) {
        console.warn(`Template variable '${variableName}' not found`);
        return match;
      }
      return String(value);
    });
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    if (!userId) {
      throw new Error("User ID is required.")
    }

    console.log(`Scheduling notifications for user: ${userId}`)

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Get user preferences and profile
    const { data: preferences, error: prefError } = await supabaseAdmin
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (prefError || !preferences) {
      console.error(`Error fetching preferences for user ${userId}:`, prefError)
      throw new Error('Could not fetch user preferences.')
    }

    // Get user profile for personalization
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Get user's name from auth metadata if available
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
    const userName = authUser?.user?.user_metadata?.full_name || 
                    authUser?.user?.email?.split('@')[0] || 
                    'there'

    // 2. Clear existing pending reminders for this user
    const { error: deleteError } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('status', 'pending')
      .in('type', ['daily_reminder', 'weekly_insight'])

    if (deleteError) {
      console.error(`Error clearing old notifications for user ${userId}:`, deleteError)
    } else {
      console.log(`Cleared pending notifications for user ${userId}.`)
    }

    if (preferences.notification_frequency === 'none' || !preferences.push_notifications_enabled) {
        console.log(`Notifications disabled for user ${userId}.`)
        return new Response(JSON.stringify({ message: 'Notifications disabled, no new notifications scheduled.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    }

    // 3. Get appropriate notification template
    const { data: template, error: templateError } = await supabaseAdmin
      .from('notification_templates')
      .select('*')
      .eq('channel', 'push')
      .eq('type', 'daily_reminder')
      .eq('is_active', true)
      .limit(1)
      .single()

    let notificationContent = "It's time for your daily reflection. How are you feeling today?"
    
    if (template && !templateError) {
      // Render template with user data
      const templateVariables: TemplateVariables = {
        user_name: userName,
        current_time: new Date().toLocaleTimeString(),
        streak_count: 0, // TODO: Get actual streak from habits/routines
      }
      
      notificationContent = TemplateEngine.render(template.content_template, templateVariables)
      console.log(`Using template "${template.name}" for user ${userId}`)
    } else {
      console.log(`No template found, using default content for user ${userId}`)
    }

    const notificationsToCreate = []
    const now = new Date()

    // 4. Schedule new notifications
    if (preferences.notification_frequency === 'daily' && preferences.notification_time) {
      for (let i = 0; i < 7; i++) { // Schedule for the next 7 days
        const scheduledDate = new Date()
        scheduledDate.setDate(now.getDate() + i)
        const [hours, minutes] = preferences.notification_time.split(':')
        scheduledDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
        
        // Only schedule if it's in the future
        if (scheduledDate > now) {
            notificationsToCreate.push({
                user_id: userId,
                channel: 'push',
                type: 'daily_reminder',
                content: notificationContent,
                status: 'pending',
                scheduled_for: scheduledDate.toISOString(),
                template_id: template?.id || null,
            })
        }
      }
    }
    
    if (notificationsToCreate.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('notifications')
        .insert(notificationsToCreate)

      if (insertError) {
        console.error(`Error inserting new notifications for user ${userId}:`, insertError)
        throw new Error('Could not schedule new notifications.')
      } else {
        console.log(`Successfully inserted ${notificationsToCreate.length} notifications for user ${userId}.`)
      }
    }

    return new Response(JSON.stringify({ 
      message: `${notificationsToCreate.length} notifications scheduled.`,
      template_used: template?.name || 'default'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
