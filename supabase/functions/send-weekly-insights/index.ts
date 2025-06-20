
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'
import { WeeklyInsightsEmail } from './_templates/weekly-insights-email.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json()
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      throw new Error('Could not fetch user profile')
    }

    // Get user preferences to check if they want weekly emails
    const { data: preferences, error: prefError } = await supabaseAdmin
      .from('user_preferences')
      .select('weekly_insights_email')
      .eq('user_id', userId)
      .single()

    if (prefError || !preferences?.weekly_insights_email) {
      console.log('User has disabled weekly insights emails')
      return new Response(JSON.stringify({ message: 'Weekly insights emails disabled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Get user's auth info for email
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (userError || !user?.email) {
      throw new Error('Could not fetch user email')
    }

    // Calculate insights for the past week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    // Get mood entries from the past week
    const { data: moodEntries, error: moodError } = await supabaseAdmin
      .from('journal_entries')
      .select('mood, emotions, created_at')
      .eq('user_id', userId)
      .gte('created_at', oneWeekAgo.toISOString())

    if (moodError) {
      console.error('Error fetching mood entries:', moodError)
    }

    // Get habit completions from the past week
    const { data: habitCompletions, error: habitError } = await supabaseAdmin
      .from('habit_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .gte('completed_at', oneWeekAgo.toISOString())

    if (habitError) {
      console.error('Error fetching habit completions:', habitError)
    }

    // Calculate insights
    const insights = {
      moodTrend: calculateMoodTrend(moodEntries || []),
      topEmotion: calculateTopEmotion(moodEntries || []),
      habitProgress: calculateHabitProgress(habitCompletions || []),
      weeklyStreak: calculateWeeklyStreak(moodEntries || [], habitCompletions || []),
    }

    const dashboardUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'vercel.app') || 'https://your-app.vercel.app'}/insights`

    const html = await renderAsync(
      React.createElement(WeeklyInsightsEmail, {
        name: profile.name || 'there',
        insights,
        dashboardUrl,
      })
    )

    const { data, error } = await resend.emails.send({
      from: 'Personal Growth Insights <insights@yourdomain.com>', // Update with your domain
      to: [user.email],
      subject: '📊 Your weekly growth insights are ready!',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Weekly insights email sent successfully:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error('Error in send-weekly-insights function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

function calculateMoodTrend(entries: any[]): string {
  if (entries.length === 0) return "No mood data this week"
  
  const avgMood = entries.reduce((sum, entry) => sum + (entry.mood || 5), 0) / entries.length
  
  if (avgMood >= 7) return "Your mood has been consistently positive this week! 😊"
  if (avgMood >= 5) return "Your mood has been balanced this week 😌"
  return "Consider focusing on activities that boost your mood 💙"
}

function calculateTopEmotion(entries: any[]): string {
  if (entries.length === 0) return "No emotion data this week"
  
  const emotions: { [key: string]: number } = {}
  entries.forEach(entry => {
    if (entry.emotions) {
      entry.emotions.forEach((emotion: string) => {
        emotions[emotion] = (emotions[emotion] || 0) + 1
      })
    }
  })
  
  const topEmotion = Object.keys(emotions).reduce((a, b) => 
    emotions[a] > emotions[b] ? a : b, Object.keys(emotions)[0])
  
  return topEmotion ? `${topEmotion} appeared most frequently` : "No emotions tracked"
}

function calculateHabitProgress(completions: any[]): string {
  if (completions.length === 0) return "No habits completed this week"
  
  const uniqueDays = new Set(completions.map(c => c.completed_at.split('T')[0]))
  const daysCount = uniqueDays.size
  
  if (daysCount >= 6) return "Excellent! You maintained your habits almost every day 🎯"
  if (daysCount >= 4) return "Good progress on your habits this week 👍"
  return "Room for improvement in habit consistency 📈"
}

function calculateWeeklyStreak(moodEntries: any[], habitCompletions: any[]): number {
  const uniqueDaysWithActivity = new Set([
    ...moodEntries.map(e => e.created_at.split('T')[0]),
    ...habitCompletions.map(c => c.completed_at.split('T')[0])
  ])
  
  return uniqueDaysWithActivity.size
}
