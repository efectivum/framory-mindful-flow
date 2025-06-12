
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { current_utc_hour } = await req.json();
    console.log(`Processing weekly insights for UTC hour: ${current_utc_hour}`);

    // Calculate target timezone offset for 8:00 AM
    // If it's 08:00 in a timezone, what's the UTC offset?
    // UTC hour 8 = UTC+0 timezone at 8:00 AM
    // UTC hour 7 = UTC+1 timezone at 8:00 AM
    // UTC hour 6 = UTC+2 timezone at 8:00 AM, etc.
    const targetOffset = 8 - current_utc_hour;
    
    console.log(`Looking for users with timezone offset: UTC${targetOffset >= 0 ? '+' : ''}${targetOffset}`);

    // Get all users who should receive insights at this hour
    // We'll look for users whose timezone would make it 8:00 AM right now
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, timezone')
      .not('timezone', 'is', null);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      console.log('No profiles found with timezones');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No profiles with timezones found',
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Filter profiles that match our target timezone
    const targetProfiles = profiles.filter(profile => {
      if (!profile.timezone) return false;
      
      // Parse timezone strings like "UTC+5", "UTC-8", "America/New_York", etc.
      let profileOffset = 0;
      
      if (profile.timezone.startsWith('UTC')) {
        const offsetStr = profile.timezone.replace('UTC', '');
        profileOffset = offsetStr ? parseInt(offsetStr) : 0;
      } else {
        // For named timezones, we'll use a simple mapping for common ones
        const timezoneOffsets: Record<string, number> = {
          'America/New_York': -5,
          'America/Chicago': -6,
          'America/Denver': -7,
          'America/Los_Angeles': -8,
          'Europe/London': 0,
          'Europe/Paris': 1,
          'Europe/Berlin': 1,
          'Asia/Tokyo': 9,
          'Asia/Shanghai': 8,
          'Australia/Sydney': 11,
        };
        profileOffset = timezoneOffsets[profile.timezone] || 0;
      }
      
      return profileOffset === targetOffset;
    });

    console.log(`Found ${targetProfiles.length} users in target timezone`);

    if (targetProfiles.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: `No users found for timezone offset UTC${targetOffset >= 0 ? '+' : ''}${targetOffset}`,
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate the current week's start and end dates (Monday to Sunday)
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    console.log(`Processing week: ${weekStartStr} to ${weekEndStr}`);

    let processedCount = 0;
    let errorCount = 0;

    // Process each user
    for (const profile of targetProfiles) {
      try {
        // Check if user already has insights for this week
        const { data: existingInsight } = await supabase
          .from('weekly_insights')
          .select('id')
          .eq('user_id', profile.id)
          .eq('week_start_date', weekStartStr)
          .single();

        if (existingInsight) {
          console.log(`User ${profile.id} already has insights for week ${weekStartStr}`);
          continue;
        }

        // Get user's journal entries for the week
        const { data: entries, error: entriesError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', profile.id)
          .gte('created_at', weekStart.toISOString())
          .lte('created_at', weekEnd.toISOString())
          .order('created_at', { ascending: false });

        if (entriesError) {
          console.error(`Error fetching entries for user ${profile.id}:`, entriesError);
          errorCount++;
          continue;
        }

        // Skip if user has no entries this week
        if (!entries || entries.length === 0) {
          console.log(`No entries found for user ${profile.id} for week ${weekStartStr}`);
          continue;
        }

        console.log(`Generating weekly insight for user ${profile.id} with ${entries.length} entries`);

        // Get user preferences for personalized analysis
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', profile.id)
          .single();

        // Generate weekly analysis using the existing analyze-journal-summary function
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-journal-summary', {
          body: { 
            entries,
            analysisType: 'weekly',
            userPreferences: preferences 
          }
        });

        if (analysisError) {
          console.error(`Analysis error for user ${profile.id}:`, analysisError);
          errorCount++;
          continue;
        }

        if (!analysisData) {
          console.error(`No analysis data returned for user ${profile.id}`);
          errorCount++;
          continue;
        }

        // Calculate average mood for the week
        const moodEntries = entries.filter(entry => entry.mood_after !== null);
        const averageMood = moodEntries.length > 0 
          ? moodEntries.reduce((sum, entry) => sum + entry.mood_after, 0) / moodEntries.length 
          : null;

        // Store the weekly insight
        const { error: insertError } = await supabase
          .from('weekly_insights')
          .insert({
            user_id: profile.id,
            week_start_date: weekStartStr,
            week_end_date: weekEndStr,
            insights: analysisData.insights || {},
            emotional_summary: analysisData.emotional_summary,
            key_patterns: analysisData.key_patterns || [],
            recommendations: analysisData.recommendations || [],
            growth_observations: analysisData.growth_observations || [],
            entry_count: entries.length,
            average_mood: averageMood
          });

        if (insertError) {
          console.error(`Error storing insight for user ${profile.id}:`, insertError);
          errorCount++;
          continue;
        }

        processedCount++;
        console.log(`Successfully generated weekly insight for user ${profile.id}`);

        // Small delay between users to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (userError) {
        console.error(`Error processing user ${profile.id}:`, userError);
        errorCount++;
      }
    }

    const response = {
      success: true,
      message: `Weekly insights generation completed`,
      processed: processedCount,
      errors: errorCount,
      totalUsers: targetProfiles.length,
      weekRange: `${weekStartStr} to ${weekEndStr}`,
      targetTimezone: `UTC${targetOffset >= 0 ? '+' : ''}${targetOffset}`
    };

    console.log('Final result:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-weekly-insights function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        processed: 0 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
