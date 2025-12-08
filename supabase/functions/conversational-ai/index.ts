import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JournalAnalysis {
  totalEntries: number;
  averageMood: number;
  moodTrend: string;
  topEmotions: string[];
  emotionalTrends: { emotion: string; frequency: number; trend: string }[];
  recentThemes: string[];
  moodAlignment: number;
  confidenceLevel: number;
  recentEntries: Array<{
    date: string;
    content: string;
    mood: number;
    emotions: string[];
    sentiment: number;
  }>;
}

interface HabitAnalysis {
  totalHabits: number;
  activeHabits: Array<{
    title: string;
    currentStreak: number;
    longestStreak: number;
    successRate: number;
    targetDays: number;
    progressPercentage: number;
    trend: string;
    recentCompletions: number;
  }>;
  overallSuccessRate: number;
  averageStreak: number;
  improvingHabits: string[];
  decliningHabits: string[];
}

interface RoutineAnalysis {
  totalRoutines: number;
  activeRoutines: Array<{
    title: string;
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    trend: string;
    isCoachRecommended: boolean;
  }>;
  overallCompletionRate: number;
  averageStreak: number;
  coachRecommendedCount: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, userId, isJournalEntry, coachingMode } = await req.json();
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Enhanced user context gathering with comprehensive analysis
    const [preferencesResult, journalAnalysisData, habitsAnalysisData, routinesData] = await Promise.all([
      supabase.from('user_preferences').select('*').eq('user_id', userId).single(),
      getJournalAnalysis(supabase, userId),
      getHabitAnalysis(supabase, userId),
      getRoutineAnalysis(supabase, userId)
    ]);

    const userContext = {
      preferences: preferencesResult.data,
      journalAnalysis: journalAnalysisData,
      habitAnalysis: habitsAnalysisData,
      routineAnalysis: routinesData
    };

    let systemPrompt = '';
    
    if (coachingMode) {
      // Enhanced coaching approach with comprehensive user understanding
      systemPrompt = `You are Lumatori Coach, a skilled personal growth coach with deep insights into the user's patterns and progress.

COMPREHENSIVE USER ANALYSIS:

JOURNALING INSIGHTS:
${userContext.journalAnalysis ? `
📊 Journal Overview:
- Total entries: ${userContext.journalAnalysis.totalEntries}
- Average mood: ${userContext.journalAnalysis.averageMood}/5 (${userContext.journalAnalysis.moodTrend})
- Mood-AI alignment: ${(userContext.journalAnalysis.moodAlignment * 100).toFixed(1)}% (confidence: ${(userContext.journalAnalysis.confidenceLevel * 100).toFixed(1)}%)

🎭 Emotional Patterns:
- Top emotions: ${userContext.journalAnalysis.topEmotions.join(', ')}
- Emotional trends: ${userContext.journalAnalysis.emotionalTrends.map(t => `${t.emotion} (${t.trend})`).join(', ')}
- Recent themes: ${userContext.journalAnalysis.recentThemes.join(', ')}

📝 Recent Entries Context:
${userContext.journalAnalysis.recentEntries.map(entry => 
  `${entry.date}: Mood ${entry.mood}/5, Emotions: [${entry.emotions.join(', ')}], Content: "${entry.content.substring(0, 100)}..."`
).join('\n')}
` : 'No journal data available yet.'}

HABIT PROGRESS ANALYSIS:
${userContext.habitAnalysis ? `
🎯 Simple Habits Overview:
- Active habits: ${userContext.habitAnalysis.totalHabits}
- Overall success rate: ${userContext.habitAnalysis.overallSuccessRate.toFixed(1)}%
- Average streak: ${userContext.habitAnalysis.averageStreak} days

📈 Individual Habit Performance:
${userContext.habitAnalysis.activeHabits.map(habit => 
  `• ${habit.title}: ${habit.currentStreak}/${habit.longestStreak} streak (${habit.successRate.toFixed(1)}% success, ${habit.trend})`
).join('\n')}

🚀 Improving: ${userContext.habitAnalysis.improvingHabits.join(', ') || 'None identified'}
⚠️ Needs attention: ${userContext.habitAnalysis.decliningHabits.join(', ') || 'None identified'}
` : 'No simple habit data available yet.'}

ROUTINE PROGRESS ANALYSIS:
${userContext.routineAnalysis ? `
🔄 Multi-Step Routines Overview:
- Active routines: ${userContext.routineAnalysis.totalRoutines}
- Overall completion rate: ${userContext.routineAnalysis.overallCompletionRate.toFixed(1)}%
- Average routine streak: ${userContext.routineAnalysis.averageStreak} days

📋 Individual Routine Performance:
${userContext.routineAnalysis.activeRoutines.map(routine => 
  `• ${routine.title}: ${routine.currentStreak}/${routine.longestStreak} streak (${routine.completionRate.toFixed(1)}% completion, ${routine.trend})`
).join('\n')}

✨ Coach-recommended routines in use: ${userContext.routineAnalysis.coachRecommendedCount}
` : 'No routine data available yet.'}

USER PREFERENCES:
${userContext.preferences ? `
- Preferred tone: ${userContext.preferences.tone_of_voice}
- Growth focus: ${userContext.preferences.growth_focus}
- Communication style: Based on their patterns and preferences
` : 'Default supportive approach'}

COACHING APPROACH:
With this comprehensive understanding of the user's emotional patterns, habit progress, routine engagement, and personal journey:

1. **Acknowledge Patterns**: Reference specific trends and progress you observe
2. **Personalized Guidance**: Tailor advice based on their emotional patterns and success rates
3. **Strategic Support**: Address declining areas while reinforcing successful patterns
4. **Emotional Intelligence**: Respond to their emotional state and recent themes
5. **Progress Recognition**: Celebrate improvements and address setbacks with understanding

COACHING CAPABILITIES:
- Suggest journaling when you see patterns worth exploring deeper
- Recommend habit adjustments based on their success/failure patterns
- **ROUTINE RECOMMENDATIONS**: When you provide detailed step-by-step guidance (like morning routines, evening routines, or any multi-step process), include a clear suggestion to create it as a structured routine
- Offer specific techniques that align with their emotional needs
- Provide data-driven insights about their progress
- When appropriate, suggest creating new habits or modifying existing ones

ROUTINE SUGGESTION GUIDELINES:
When you provide step-by-step guidance for routines, end your response with:
"This would make a great structured routine in Lumatori! Would you like me to help you create this as a trackable routine with guided steps and reflection prompts?"

Look for opportunities to suggest routines when discussing:
- Morning/evening routines
- Workout sequences
- Meditation practices
- Study/work sessions
- Self-care practices
- Any multi-step processes

CONVERSATION STYLE:
- Use ${userContext.preferences?.tone_of_voice || 'supportive'} tone
- Focus on ${userContext.preferences?.growth_focus || 'personal growth'}
- Be data-informed but emotionally intelligent
- Reference specific patterns and progress when relevant
- Keep responses conversational (150-250 words max)
- Integrate insights naturally into coaching responses
- **Actively look for routine suggestion opportunities**

Remember: You have deep insight into their journey. Use this knowledge to provide personalized, relevant, and impactful coaching that acknowledges their unique patterns and progress. Always look for opportunities to suggest structured routines when providing step-by-step guidance.`;
    } else if (isJournalEntry) {
      // Enhanced journal entry response with pattern awareness
      systemPrompt = `You are Lumatori Assistant, responding to a journal entry with deep understanding of the user's patterns.

USER CONTEXT SUMMARY:
${userContext.journalAnalysis ? `
Recent emotional patterns: ${userContext.journalAnalysis.topEmotions.join(', ')}
Mood trend: ${userContext.journalAnalysis.moodTrend} (avg: ${userContext.journalAnalysis.averageMood}/5)
Recent themes: ${userContext.journalAnalysis.recentThemes.join(', ')}
` : ''}

${userContext.habitAnalysis ? `
Habit progress: ${userContext.habitAnalysis.overallSuccessRate.toFixed(1)}% success rate across ${userContext.habitAnalysis.totalHabits} habits
` : ''}

${userContext.routineAnalysis ? `
Routine progress: ${userContext.routineAnalysis.overallCompletionRate.toFixed(1)}% completion rate across ${userContext.routineAnalysis.totalRoutines} routines
` : ''}

RESPONSE STYLE:
- Use a ${userContext.preferences?.tone_of_voice || 'supportive'} tone
- Be encouraging and insightful
- Reference patterns when relevant but naturally
- Keep responses concise but meaningful (2-3 sentences)
- Acknowledge their growth journey

Respond naturally to their journal entry with personalized insights based on their patterns.`;
    } else {
      // Enhanced regular conversational chat with pattern awareness
      systemPrompt = `You are Lumatori Assistant, a personal growth companion with comprehensive understanding of the user's journey.

USER CONTEXT SUMMARY:
${userContext.journalAnalysis ? `
Journal insights: ${userContext.journalAnalysis.totalEntries} entries, recent emotions: ${userContext.journalAnalysis.topEmotions.slice(0, 3).join(', ')}
` : ''}

${userContext.habitAnalysis && userContext.habitAnalysis.totalHabits > 0 ? `
Simple habits: ${userContext.habitAnalysis.totalHabits} active habits with ${userContext.habitAnalysis.overallSuccessRate.toFixed(1)}% success rate
` : ''}

${userContext.routineAnalysis && userContext.routineAnalysis.totalRoutines > 0 ? `
Structured routines: ${userContext.routineAnalysis.totalRoutines} active routines with ${userContext.routineAnalysis.overallCompletionRate.toFixed(1)}% completion rate
` : ''}

JOURNAL SUGGESTION GUIDELINES:
Suggest journaling when the user shares:
- Personal insights, realizations, or "aha" moments
- Significant experiences or emotions
- Goals, aspirations, or future plans  
- Reflections on growth or challenges
- Meaningful quotes, thoughts, or ideas they want to remember

When suggesting journaling, use this exact phrase: "This sounds like something meaningful to capture. Would you like to save this thought in your journal?"

ROUTINE SUGGESTION GUIDELINES:
Suggest creating structured routines when you provide step-by-step guidance for:
- Morning/evening routines
- Workout sequences  
- Meditation practices
- Study/work sessions
- Self-care practices
- Any multi-step processes

When suggesting routines, use this phrase: "This would make a great structured routine in Lumatori! Would you like me to help you create this as a trackable routine with guided steps and reflection prompts?"

PERSONALITY:
- Use a ${userContext.preferences?.tone_of_voice || 'supportive'} tone
- Focus on ${userContext.preferences?.growth_focus || 'personal growth'}
- Be conversational and engaging
- Reference their patterns when relevant and natural
- Provide actionable advice when asked
- **Actively look for routine creation opportunities**

Keep responses helpful, personalized, and conversational.`;
    }

    // Build conversation messages
    const messages = [{ role: 'system', content: systemPrompt }];

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: coachingMode ? 250 : (isJournalEntry ? 200 : 400),
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(JSON.stringify({ 
          error: "Rate limits exceeded, please try again later." 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(JSON.stringify({ 
          error: "AI credits exhausted, please add funds." 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated with enhanced context:', aiResponse);

    return new Response(JSON.stringify({ 
      response: aiResponse
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in conversational-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Enhanced journal analysis function
async function getJournalAnalysis(supabase: any, userId: string): Promise<JournalAnalysis | null> {
  try {
    // Get journal entries with AI analysis data
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !entries || entries.length === 0) {
      console.log('No journal entries found for analysis');
      return null;
    }

    // Calculate comprehensive analysis
    const totalEntries = entries.length;
    
    // Mood analysis
    const moodsAfter = entries.filter(e => e.mood_after).map(e => e.mood_after);
    const aiMoods = entries.filter(e => e.ai_detected_mood).map(e => e.ai_detected_mood);
    const averageMood = moodsAfter.length > 0 
      ? moodsAfter.reduce((sum, mood) => sum + mood, 0) / moodsAfter.length
      : (aiMoods.length > 0 ? aiMoods.reduce((sum, mood) => sum + mood, 0) / aiMoods.length : 3);

    // Mood trend analysis
    const recentMoods = entries.slice(0, 5).map(e => e.mood_after || e.ai_detected_mood).filter(Boolean);
    const olderMoods = entries.slice(5, 10).map(e => e.mood_after || e.ai_detected_mood).filter(Boolean);
    const recentAvg = recentMoods.length > 0 ? recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length : averageMood;
    const olderAvg = olderMoods.length > 0 ? olderMoods.reduce((sum, mood) => sum + mood, 0) / olderMoods.length : averageMood;
    
    let moodTrend = 'stable';
    if (recentAvg > olderAvg + 0.3) moodTrend = 'improving';
    else if (recentAvg < olderAvg - 0.3) moodTrend = 'declining';

    // Emotion analysis
    const allEmotions: string[] = [];
    const emotionCounts: { [key: string]: number } = {};
    const emotionsByPeriod: { [key: string]: { recent: number; older: number } } = {};

    entries.forEach((entry, index) => {
      if (entry.ai_detected_emotions) {
        entry.ai_detected_emotions.forEach((emotion: string) => {
          allEmotions.push(emotion);
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          
          if (!emotionsByPeriod[emotion]) {
            emotionsByPeriod[emotion] = { recent: 0, older: 0 };
          }
          
          if (index < 5) {
            emotionsByPeriod[emotion].recent++;
          } else {
            emotionsByPeriod[emotion].older++;
          }
        });
      }
    });

    const topEmotions = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([emotion]) => emotion);

    const emotionalTrends = Object.entries(emotionsByPeriod)
      .filter(([emotion]) => emotionCounts[emotion] >= 2)
      .map(([emotion, counts]) => {
        let trend = 'stable';
        if (counts.recent > counts.older) trend = 'increasing';
        else if (counts.recent < counts.older) trend = 'decreasing';
        
        return {
          emotion,
          frequency: emotionCounts[emotion],
          trend
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    // Extract themes from content
    const recentThemes = extractThemes(entries.slice(0, 10));

    // Mood alignment analysis
    const alignmentScores = entries
      .filter(e => e.mood_alignment_score !== null)
      .map(e => e.mood_alignment_score);
    const moodAlignment = alignmentScores.length > 0
      ? alignmentScores.reduce((sum, score) => sum + score, 0) / alignmentScores.length
      : 0;

    // Confidence level analysis
    const confidenceLevels = entries
      .filter(e => e.ai_confidence_level !== null)
      .map(e => e.ai_confidence_level);
    const confidenceLevel = confidenceLevels.length > 0
      ? confidenceLevels.reduce((sum, level) => sum + level, 0) / confidenceLevels.length
      : 0;

    // Recent entries for context
    const recentEntries = entries.slice(0, 5).map(entry => ({
      date: entry.created_at.split('T')[0],
      content: entry.content.substring(0, 200),
      mood: entry.mood_after || entry.ai_detected_mood || 3,
      emotions: entry.ai_detected_emotions || [],
      sentiment: entry.ai_sentiment_score || 0
    }));

    return {
      totalEntries,
      averageMood,
      moodTrend,
      topEmotions,
      emotionalTrends,
      recentThemes,
      moodAlignment,
      confidenceLevel,
      recentEntries
    };
  } catch (error) {
    console.error('Error in journal analysis:', error);
    return null;
  }
}

// Enhanced habit analysis function
async function getHabitAnalysis(supabase: any, userId: string): Promise<HabitAnalysis | null> {
  try {
    // Get habits with recent completion data
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (habitsError || !habits || habits.length === 0) {
      console.log('No active habits found for analysis');
      return null;
    }

    // Get completions for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: completions, error: completionsError } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', thirtyDaysAgo.toISOString());

    const completionsByHabit: { [habitId: string]: any[] } = {};
    if (completions) {
      completions.forEach(c => {
        if (!completionsByHabit[c.habit_id]) {
          completionsByHabit[c.habit_id] = [];
        }
        completionsByHabit[c.habit_id].push(c);
      });
    }

    const activeHabits = habits.map(habit => {
      const habitCompletions = completionsByHabit[habit.id] || [];
      const successRate = (habitCompletions.length / 30) * 100;
      const progressPercentage = Math.min((habit.current_streak / habit.target_days) * 100, 100);
      
      // Determine trend based on recent vs older completions
      const recentCompletions = habitCompletions.filter(c => {
        const date = new Date(c.completed_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return date >= sevenDaysAgo;
      }).length;

      const olderCompletions = habitCompletions.filter(c => {
        const date = new Date(c.completed_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        return date >= fourteenDaysAgo && date < sevenDaysAgo;
      }).length;

      let trend = 'stable';
      if (recentCompletions > olderCompletions + 1) trend = 'improving';
      else if (recentCompletions < olderCompletions - 1) trend = 'declining';

      return {
        title: habit.title,
        currentStreak: habit.current_streak,
        longestStreak: habit.longest_streak,
        successRate,
        targetDays: habit.target_days,
        progressPercentage,
        trend,
        recentCompletions
      };
    });

    const overallSuccessRate = activeHabits.length > 0
      ? activeHabits.reduce((sum, h) => sum + h.successRate, 0) / activeHabits.length
      : 0;

    const averageStreak = activeHabits.length > 0
      ? activeHabits.reduce((sum, h) => sum + h.currentStreak, 0) / activeHabits.length
      : 0;

    const improvingHabits = activeHabits
      .filter(h => h.trend === 'improving')
      .map(h => h.title);

    const decliningHabits = activeHabits
      .filter(h => h.trend === 'declining')
      .map(h => h.title);

    return {
      totalHabits: habits.length,
      activeHabits,
      overallSuccessRate,
      averageStreak,
      improvingHabits,
      decliningHabits
    };
  } catch (error) {
    console.error('Error in habit analysis:', error);
    return null;
  }
}

// Enhanced routine analysis function
async function getRoutineAnalysis(supabase: any, userId: string): Promise<RoutineAnalysis | null> {
  try {
    // Get user's active routines
    const { data: routines, error: routinesError } = await supabase
      .from('user_habit_routines')
      .select(`
        *,
        habit_templates (
          title,
          is_coach_recommended
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true);

    if (routinesError || !routines || routines.length === 0) {
      console.log('No active routines found for analysis');
      return null;
    }

    // Get routine completions for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: completions, error: completionsError } = await supabase
      .from('routine_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', thirtyDaysAgo.toISOString());

    const completionsByRoutine: { [routineId: string]: any[] } = {};
    if (completions) {
      completions.forEach(c => {
        if (!completionsByRoutine[c.user_routine_id]) {
          completionsByRoutine[c.user_routine_id] = [];
        }
        completionsByRoutine[c.user_routine_id].push(c);
      });
    }

    const activeRoutines = routines.map(routine => {
      const routineCompletions = completionsByRoutine[routine.id] || [];
      const completionRate = (routineCompletions.length / 30) * 100;
      
      // Determine trend
      const recentCompletions = routineCompletions.filter(c => {
        const date = new Date(c.completed_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return date >= sevenDaysAgo;
      }).length;

      const olderCompletions = routineCompletions.filter(c => {
        const date = new Date(c.completed_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        return date >= fourteenDaysAgo && date < sevenDaysAgo;
      }).length;

      let trend = 'stable';
      if (recentCompletions > olderCompletions + 1) trend = 'improving';
      else if (recentCompletions < olderCompletions - 1) trend = 'declining';

      return {
        title: routine.habit_templates?.title || routine.custom_title || 'Unknown Routine',
        currentStreak: routine.current_streak || 0,
        longestStreak: routine.longest_streak || 0,
        completionRate,
        trend,
        isCoachRecommended: routine.habit_templates?.is_coach_recommended || false
      };
    });

    const overallCompletionRate = activeRoutines.length > 0
      ? activeRoutines.reduce((sum, r) => sum + r.completionRate, 0) / activeRoutines.length
      : 0;

    const averageStreak = activeRoutines.length > 0
      ? activeRoutines.reduce((sum, r) => sum + r.currentStreak, 0) / activeRoutines.length
      : 0;

    const coachRecommendedCount = activeRoutines.filter(r => r.isCoachRecommended).length;

    return {
      totalRoutines: routines.length,
      activeRoutines,
      overallCompletionRate,
      averageStreak,
      coachRecommendedCount
    };
  } catch (error) {
    console.error('Error in routine analysis:', error);
    return null;
  }
}

// Helper function to extract themes from journal entries
function extractThemes(entries: any[]): string[] {
  const themeCounts: { [key: string]: number } = {};
  
  const themeKeywords: { [key: string]: string[] } = {
    'work': ['work', 'job', 'career', 'meeting', 'project', 'deadline', 'boss', 'colleague'],
    'relationships': ['friend', 'family', 'partner', 'relationship', 'love', 'support'],
    'health': ['health', 'exercise', 'workout', 'sleep', 'tired', 'energy', 'diet'],
    'stress': ['stress', 'anxious', 'worried', 'overwhelmed', 'pressure'],
    'growth': ['learn', 'improve', 'goal', 'progress', 'achieve', 'develop'],
    'creativity': ['creative', 'art', 'music', 'write', 'create', 'design'],
    'gratitude': ['grateful', 'thankful', 'appreciate', 'blessed'],
    'mindfulness': ['meditate', 'mindful', 'present', 'calm', 'peace', 'breathe']
  };

  entries.forEach(entry => {
    const content = entry.content.toLowerCase();
    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      if (keywords.some(keyword => content.includes(keyword))) {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      }
    });
  });

  return Object.entries(themeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4)
    .map(([theme]) => theme);
}
