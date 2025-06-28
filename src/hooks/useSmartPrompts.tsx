
import { useMemo } from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useHabits } from '@/hooks/useHabits';
import { useTimeOfDay, TimeOfDayMode } from '@/hooks/useTimeOfDay';
import { subDays, format } from 'date-fns';

interface SmartPromptData {
  hasHistoryData: boolean;
  recentMoodTrend: 'positive' | 'negative' | 'neutral' | null;
  averageEntryLength: number;
  writingFrequency: 'daily' | 'regular' | 'sporadic' | 'new';
  lastEntryDaysAgo: number;
  topEmotions: string[];
  habitProgress: 'excellent' | 'good' | 'needs-attention' | 'none';
}

export const useSmartPrompts = () => {
  const { entries, stats } = useJournalEntries();
  const { habits, todayCompletions } = useHabits();
  const { mode } = useTimeOfDay();

  const analysisData: SmartPromptData = useMemo(() => {
    const hasHistoryData = entries.length >= 3;
    
    if (!hasHistoryData) {
      return {
        hasHistoryData: false,
        recentMoodTrend: null,
        averageEntryLength: 0,
        writingFrequency: 'new',
        lastEntryDaysAgo: 0,
        topEmotions: [],
        habitProgress: habits.length > 0 ? 'good' : 'none'
      };
    }

    // Analyze recent mood trend (last 7 entries)
    const recentEntries = entries.slice(0, 7);
    const moodValues = recentEntries.map(e => e.mood_after || e.ai_detected_mood || 3);
    const avgMood = moodValues.reduce((sum, mood) => sum + mood, 0) / moodValues.length;
    const recentMoodTrend = avgMood > 3.5 ? 'positive' : avgMood < 2.5 ? 'negative' : 'neutral';

    // Calculate average entry length
    const totalWords = entries.reduce((sum, entry) => sum + entry.content.split(' ').length, 0);
    const averageEntryLength = totalWords / entries.length;

    // Determine writing frequency
    const daysSinceFirst = entries.length > 0 ? 
      Math.floor((new Date().getTime() - new Date(entries[entries.length - 1].created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const writingFrequency = stats.currentStreak >= 7 ? 'daily' : 
                           entries.length / Math.max(daysSinceFirst, 1) > 0.5 ? 'regular' : 'sporadic';

    // Last entry timing
    const lastEntryDaysAgo = entries.length > 0 ? 
      Math.floor((new Date().getTime() - new Date(entries[0].created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // Top emotions from recent entries
    const emotionCounts: Record<string, number> = {};
    recentEntries.forEach(entry => {
      entry.ai_detected_emotions?.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });
    const topEmotions = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion);

    // Habit progress assessment
    const activeHabits = habits.filter(h => h.is_active);
    const completionRate = activeHabits.length > 0 ? todayCompletions.length / activeHabits.length : 0;
    const habitProgress = activeHabits.length === 0 ? 'none' :
                         completionRate >= 0.8 ? 'excellent' :
                         completionRate >= 0.5 ? 'good' : 'needs-attention';

    return {
      hasHistoryData,
      recentMoodTrend,
      averageEntryLength,
      writingFrequency,
      lastEntryDaysAgo,
      topEmotions,
      habitProgress
    };
  }, [entries, stats, habits, todayCompletions]);

  const generateSmartPrompt = (mode: TimeOfDayMode, data: SmartPromptData): string => {
    if (!data.hasHistoryData) {
      return generateGenericPrompt(mode);
    }

    return generatePersonalizedPrompt(mode, data);
  };

  const generateGenericPrompt = (mode: TimeOfDayMode): string => {
    const prompts = {
      morning: [
        "What's your main intention for today?",
        "How are you feeling as you start this new day?",
        "What's one thing you're looking forward to today?",
        "Take a moment to check in with yourself this morning."
      ],
      midday: [
        "How is your day unfolding so far?",
        "What's been on your mind today?",
        "Take a breath and reflect on this moment.",
        "How are you feeling right now?"
      ],
      evening: [
        "What stood out to you about today?",
        "How are you feeling as the day winds down?",
        "What's one thing you learned about yourself today?",
        "Let's reflect on your day together."
      ],
      night: [
        "What's on your mind as you prepare for rest?",
        "How was your day overall?",
        "What are you grateful for today?",
        "Take a moment to unwind and reflect."
      ]
    };

    const modePrompts = prompts[mode];
    return modePrompts[Math.floor(Math.random() * modePrompts.length)];
  };

  const generatePersonalizedPrompt = (mode: TimeOfDayMode, data: SmartPromptData): string => {
    // Long gap prompts
    if (data.lastEntryDaysAgo > 3) {
      return mode === 'morning' ? 
        "Welcome back! What's been happening in your world?" :
        "It's been a while since your last entry. How have you been?";
    }

    // Mood-based prompts
    if (data.recentMoodTrend === 'negative' && mode === 'morning') {
      return "Let's start fresh today. What's one small thing that might bring you joy?";
    }
    
    if (data.recentMoodTrend === 'positive' && mode === 'evening') {
      return "You've been in a good space lately! What's contributing to this positive energy?";
    }

    // Writing pattern prompts
    if (data.writingFrequency === 'daily' && data.averageEntryLength < 50) {
      return mode === 'morning' ? 
        "Your consistent writing is amazing! Want to explore a thought more deeply today?" :
        "You're so consistent with journaling! What's really on your mind right now?";
    }

    // Emotion-based prompts
    if (data.topEmotions.length > 0) {
      const emotion = data.topEmotions[0];
      if (emotion === 'anxious' || emotion === 'stressed') {
        return "I notice you've been feeling some stress lately. Want to explore what's behind it?";
      }
      if (emotion === 'grateful' || emotion === 'happy') {
        return "You've been expressing gratitude recently. What else are you appreciating right now?";
      }
    }

    // Habit integration prompts
    if (data.habitProgress === 'excellent' && mode === 'evening') {
      return "You're crushing your habits! How is this consistency affecting other areas of your life?";
    }
    
    if (data.habitProgress === 'needs-attention' && mode === 'morning') {
      return "Let's check in on your goals. What's making it challenging to stay consistent?";
    }

    // Default personalized prompts
    const personalizedPrompts = {
      morning: [
        "Based on your recent entries, what feels most important to focus on today?",
        "Your writing shows such thoughtfulness. What's emerging for you this morning?",
        "I've noticed some patterns in your reflections. What's present for you right now?"
      ],
      midday: [
        "How does this moment compare to what you wrote about recently?",
        "Your recent entries show growth. What are you noticing about yourself today?",
        "What would surprise your past self about how you're feeling right now?"
      ],
      evening: [
        "Looking at your recent growth, what feels different about today?",
        "Your journal shows such self-awareness. What did you discover about yourself today?",
        "What thread from your recent entries feels relevant to today's experience?"
      ],
      night: [
        "As someone who reflects thoughtfully, what's settling in your mind tonight?",
        "Your recent entries show wisdom. What insight came up for you today?",
        "What would you tell the version of yourself from your earlier entries?"
      ]
    };

    const modePrompts = personalizedPrompts[mode];
    return modePrompts[Math.floor(Math.random() * modePrompts.length)];
  };

  const generateSmartSuggestion = (mode: TimeOfDayMode, data: SmartPromptData): string => {
    if (!data.hasHistoryData) {
      const genericSuggestions = {
        morning: "Start with whatever feels most present for you right now.",
        midday: "Even a few words about this moment can be valuable.",
        evening: "Reflect on one thing that stood out today.",
        night: "Let your thoughts flow freely onto the page."
      };
      return genericSuggestions[mode];
    }

    // Personalized suggestions based on data
    if (data.averageEntryLength > 200) {
      return "Your detailed reflections are powerful. Trust your instinct to dive deep.";
    }
    
    if (data.averageEntryLength < 50) {
      return "Sometimes a few genuine words are all you need. Quality over quantity.";
    }
    
    if (data.writingFrequency === 'daily') {
      return "Your consistency is building real self-awareness. Keep following your curiosity.";
    }

    return "Your unique perspective comes through in your writing. Trust what wants to be expressed.";
  };

  const smartPrompt = generateSmartPrompt(mode, analysisData);
  const smartSuggestion = generateSmartSuggestion(mode, analysisData);

  return {
    smartPrompt,
    smartSuggestion,
    analysisData,
    hasPersonalizedData: analysisData.hasHistoryData
  };
};
