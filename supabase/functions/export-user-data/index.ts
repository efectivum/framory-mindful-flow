
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'
import { corsHeaders } from '../_shared/cors.ts'

interface Database {
  public: {
    Tables: {
      journal_entries: any
      habits: any
      habit_completions: any
      user_preferences: any
      profiles: any
      data_exports: any
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient<Database>(
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

    const { export_type = 'full', format = 'json' } = await req.json()

    console.log(`Starting data export for user ${user.id}, type: ${export_type}, format: ${format}`)

    // Create export record
    const { data: exportRecord, error: exportError } = await supabaseClient
      .from('data_exports')
      .insert({
        user_id: user.id,
        export_type,
        format
      })
      .select()
      .single()

    if (exportError) {
      console.error('Error creating export record:', exportError)
      return new Response(JSON.stringify({ error: 'Failed to create export record' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Gather user data
    const userData: any = {
      export_info: {
        export_id: exportRecord.id,
        export_type,
        created_at: new Date().toISOString(),
        user_id: user.id
      }
    }

    // Get journal entries (excluding soft-deleted)
    if (export_type === 'full' || export_type === 'journal_only') {
      const { data: journalEntries } = await supabaseClient
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      userData.journal_entries = journalEntries || []
    }

    // Get habits and completions
    if (export_type === 'full' || export_type === 'habits_only') {
      const { data: habits } = await supabaseClient
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const { data: habitCompletions } = await supabaseClient
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

      userData.habits = habits || []
      userData.habit_completions = habitCompletions || []
    }

    // Get user preferences and profile
    if (export_type === 'full') {
      const { data: preferences } = await supabaseClient
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      userData.preferences = preferences
      userData.profile = profile
    }

    // Format and return data
    let responseData: string
    let contentType: string
    let filename: string

    if (format === 'csv') {
      // Convert to CSV format
      responseData = convertToCSV(userData, export_type)
      contentType = 'text/csv'
      filename = `lumatori-data-${export_type}-${new Date().toISOString().split('T')[0]}.csv`
    } else {
      // JSON format
      responseData = JSON.stringify(userData, null, 2)
      contentType = 'application/json'
      filename = `lumatori-data-${export_type}-${new Date().toISOString().split('T')[0]}.json`
    }

    console.log(`Export completed for user ${user.id}`)

    return new Response(responseData, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('Export error:', error)
    return new Response(JSON.stringify({ error: 'Export failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function convertToCSV(userData: any, exportType: string): string {
  let csv = ''
  
  if (userData.journal_entries?.length > 0) {
    csv += 'Journal Entries\n'
    csv += 'Date,Title,Content,Mood After,Tags\n'
    
    userData.journal_entries.forEach((entry: any) => {
      const date = new Date(entry.created_at).toLocaleDateString()
      const title = (entry.title || '').replace(/"/g, '""')
      const content = (entry.content || '').replace(/"/g, '""')
      const mood = entry.mood_after || ''
      const tags = (entry.tags || []).join(';')
      
      csv += `"${date}","${title}","${content}","${mood}","${tags}"\n`
    })
    csv += '\n'
  }
  
  if (userData.habits?.length > 0) {
    csv += 'Habits\n'
    csv += 'Title,Description,Frequency,Current Streak,Longest Streak,Created Date\n'
    
    userData.habits.forEach((habit: any) => {
      const title = (habit.title || '').replace(/"/g, '""')
      const description = (habit.description || '').replace(/"/g, '""')
      const frequency = `${habit.frequency_value} ${habit.frequency_type}`
      const created = new Date(habit.created_at).toLocaleDateString()
      
      csv += `"${title}","${description}","${frequency}","${habit.current_streak}","${habit.longest_streak}","${created}"\n`
    })
  }
  
  return csv
}
