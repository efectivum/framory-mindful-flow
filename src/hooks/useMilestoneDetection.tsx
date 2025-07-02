import { useMemo } from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useHabits } from '@/hooks/useHabits';
import { useUserBehaviors } from '@/hooks/useUserBehaviors';
import { useAuth } from '@/hooks/useAuth';
import { differenceInDays, startOfDay, parseISO } from 'date-fns';

export interface Milestone {
  id: string;
  type: 'journal' | 'habit' | 'growth' | 'special';
  category: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  achievedAt?: Date;
  progress: number; // 0-1
  nextTarget?: number;
  celebrationStyle: 'confetti' | 'fire' | 'stars' | 'growth' | 'rainbow';
}

const ACHIEVEMENT_TIMESTAMPS_KEY = 'lumatori_achievement_timestamps';

// Safe localStorage operations
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage access failed:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('localStorage save failed:', error);
    }
  }
};

// Load achievement timestamps from localStorage with error handling
const getStoredAchievementTimestamps = (): Record<string, string> => {
  try {
    const stored = safeLocalStorage.getItem(ACHIEVEMENT_TIMESTAMPS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading achievement timestamps:', error);
    return {};
  }
};

// Save achievement timestamp to localStorage with error handling
const saveAchievementTimestamp = (milestoneId: string, date: Date) => {
  try {
    const timestamps = getStoredAchievementTimestamps();
    const dateString = date.toISOString();
    
    // Only save if not already stored (preserve original achievement date)
    if (!timestamps[milestoneId]) {
      timestamps[milestoneId] = dateString;
      safeLocalStorage.setItem(ACHIEVEMENT_TIMESTAMPS_KEY, JSON.stringify(timestamps));
      console.log(`Achievement timestamp saved for ${milestoneId}:`, dateString);
    }
  } catch (error) {
    console.error('Error saving achievement timestamp:', error);
  }
};

// Get or calculate achievement date
const getAchievementDate = (milestoneId: string, entries: any[], stats: any, habits: any[], milestone: any): Date | undefined => {
  const storedTimestamps = getStoredAchievementTimestamps();
  
  // Return stored date if it exists
  if (storedTimestamps[milestoneId]) {
    try {
      const storedDate = new Date(storedTimestamps[milestoneId]);
      console.log(`Using stored achievement date for ${milestoneId}:`, storedDate);
      return storedDate;
    } catch (error) {
      console.error(`Invalid stored date for ${milestoneId}:`, storedTimestamps[milestoneId]);
    }
  }

  // Calculate achievement date based on milestone type
  let calculatedDate: Date | undefined;

  if (milestone.type === 'journal' && milestoneId.startsWith('entries-')) {
    // For journal entry milestones, use the creation date of the achieving entry
    const targetCount = milestone.target;
    if (entries.length >= targetCount) {
      const achievingEntryIndex = entries.length - targetCount;
      const achievingEntry = entries[achievingEntryIndex];
      if (achievingEntry?.created_at) {
        calculatedDate = parseISO(achievingEntry.created_at);
        console.log(`Calculated journal milestone date for ${milestoneId} from entry:`, calculatedDate);
      }
    }
  } else if (milestone.type === 'journal' && milestoneId.startsWith('streak-')) {
    // For streak milestones, calculate based on current streak
    if (stats.currentStreak >= milestone.target) {
      const streakStartDate = new Date();
      streakStartDate.setDate(streakStartDate.getDate() - stats.currentStreak + milestone.target);
      calculatedDate = streakStartDate;
      console.log(`Calculated streak milestone date for ${milestoneId}:`, calculatedDate);
    }
  } else if (milestone.type === 'habit') {
    // For habit milestones, use habit creation date or calculate streak date
    if (milestoneId === 'first-habit' && habits.length > 0) {
      calculatedDate = parseISO(habits[0].created_at);
      console.log(`Calculated first habit milestone date for ${milestoneId}:`, calculatedDate);
    } else {
      // For habit streak milestones, estimate based on longest streak
      const longestHabitStreak = Math.max(...habits.map(h => h.current_streak), 0);
      if (longestHabitStreak >= milestone.target) {
        const streakDate = new Date();
        streakDate.setDate(streakDate.getDate() - longestHabitStreak + milestone.target);
        calculatedDate = streakDate;
        console.log(`Calculated habit streak milestone date for ${milestoneId}:`, calculatedDate);
      }
    }
  } else if (milestone.type === 'growth') {
    // For growth milestones, use a recent date (these are based on current analysis)
    calculatedDate = new Date();
    calculatedDate.setHours(calculatedDate.getHours() - 1); // Set to 1 hour ago to avoid immediate re-triggering
    console.log(`Calculated growth milestone date for ${milestoneId}:`, calculatedDate);
  }

  // Validate calculated date (not in future, not too old)
  if (calculatedDate) {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (calculatedDate > now) {
      console.warn(`Achievement date for ${milestoneId} is in the future, using current time`);
      calculatedDate = new Date();
    } else if (calculatedDate < oneYearAgo) {
      console.warn(`Achievement date for ${milestoneId} is too old, using one year ago`);
      calculatedDate = oneYearAgo;
    }
    
    // Save the calculated date
    saveAchievementTimestamp(milestoneId, calculatedDate);
  }

  return calculatedDate;
};

export const useMilestoneDetection = () => {
  const { user } = useAuth();
  const { entries, stats, isLoading: entriesLoading } = useJournalEntries();
  const { habits, isLoading: habitsLoading } = useHabits();
  const { insights } = useUserBehaviors();

  // Determine if we're still loading critical data
  const isLoading = entriesLoading || habitsLoading || !user;

  const milestones: Milestone[] = useMemo(() => {
    // Return empty array while loading (don't calculate milestones yet)
    if (isLoading) {
      console.log('Milestones: Still loading data, returning empty array');
      return [];
    }

    // Allow milestones calculation even with 0 entries for new users
    if (!user) {
      console.log('Milestones: No user found');
      return [];
    }

    console.log('Calculating milestones for user:', user.id);
    console.log('Entries count:', entries.length);
    console.log('Current streak:', stats.currentStreak);

    const allMilestones: Milestone[] = [];
    
    try {
      // Journal Writing Milestones
      const journalMilestones = [
        {
          id: 'first-entry',
          type: 'journal' as const,
          category: 'Writing',
          title: 'First Entry',
          description: 'Welcome to your journey of self-reflection!',
          icon: '✨',
          target: 1,
          celebrationStyle: 'confetti' as const
        },
        {
          id: 'entries-10',
          type: 'journal' as const,
          category: 'Writing',
          title: 'Reflection Seeker',
          description: 'You\'ve written 10 journal entries!',
          icon: '📝',
          target: 10,
          celebrationStyle: 'stars' as const
        },
        {
          id: 'entries-25',
          type: 'journal' as const,
          category: 'Writing',
          title: 'Thoughtful Writer',
          description: 'You\'ve written 25 journal entries!',
          icon: '📚',
          target: 25,
          celebrationStyle: 'rainbow' as const
        },
        {
          id: 'entries-50',
          type: 'journal' as const,
          category: 'Writing',
          title: 'Dedicated Journalist',
          description: 'You\'ve written 50 journal entries!',
          icon: '🏆',
          target: 50,
          celebrationStyle: 'confetti' as const
        },
        {
          id: 'entries-100',
          type: 'journal' as const,
          category: 'Writing',
          title: 'Master Reflector',
          description: 'You\'ve written 100 journal entries!',
          icon: '👑',
          target: 100,
          celebrationStyle: 'rainbow' as const
        }
      ];

      journalMilestones.forEach(milestone => {
        try {
          const achieved = entries.length >= milestone.target;
          const progress = Math.min(entries.length / milestone.target, 1);
          const nextTarget = achieved ? undefined : milestone.target;

          let achievedAt: Date | undefined;
          if (achieved) {
            achievedAt = getAchievementDate(milestone.id, entries, stats, habits, milestone);
          }

          allMilestones.push({
            ...milestone,
            achieved,
            progress,
            nextTarget,
            achievedAt
          });
        } catch (error) {
          console.error(`Error processing journal milestone ${milestone.id}:`, error);
        }
      });

      // Streak Milestones
      const streakMilestones = [
        {
          id: 'streak-3',
          type: 'journal' as const,
          category: 'Consistency',
          title: 'Getting Started',
          description: 'You\'ve maintained a 3-day writing streak!',
          icon: '🔥',
          target: 3,
          celebrationStyle: 'fire' as const
        },
        {
          id: 'streak-7',
          type: 'journal' as const,
          category: 'Consistency',
          title: 'Week Warrior',
          description: 'You\'ve maintained a 7-day writing streak!',
          icon: '🚀',
          target: 7,
          celebrationStyle: 'fire' as const
        },
        {
          id: 'streak-14',
          type: 'journal' as const,
          category: 'Consistency',
          title: 'Habit Builder',
          description: 'You\'ve maintained a 14-day writing streak!',
          icon: '⚡',
          target: 14,
          celebrationStyle: 'fire' as const
        },
        {
          id: 'streak-30',
          type: 'journal' as const,
          category: 'Consistency',
          title: 'Consistency Champion',
          description: 'You\'ve maintained a 30-day writing streak!',
          icon: '💎',
          target: 30,
          celebrationStyle: 'rainbow' as const
        },
        {
          id: 'streak-100',
          type: 'journal' as const,
          category: 'Consistency',
          title: 'Legendary Streaker',
          description: 'You\'ve maintained a 100-day writing streak!',
          icon: '🌟',
          target: 100,
          celebrationStyle: 'rainbow' as const
        }
      ];

      streakMilestones.forEach(milestone => {
        try {
          const achieved = stats.currentStreak >= milestone.target;
          const progress = Math.min(stats.currentStreak / milestone.target, 1);
          const nextTarget = achieved ? undefined : milestone.target;

          let achievedAt: Date | undefined;
          if (achieved) {
            achievedAt = getAchievementDate(milestone.id, entries, stats, habits, milestone);
          }

          allMilestones.push({
            ...milestone,
            achieved,
            progress,
            nextTarget,
            achievedAt
          });
        } catch (error) {
          console.error(`Error processing streak milestone ${milestone.id}:`, error);
        }
      });

      // Habit Milestones
      const activeHabits = habits.filter(h => h.is_active);
      if (activeHabits.length > 0) {
        const habitMilestones = [
          {
            id: 'first-habit',
            type: 'habit' as const,
            category: 'Habits',
            title: 'Habit Pioneer',
            description: 'You\'ve created your first habit!',
            icon: '🌱',
            target: 1,
            celebrationStyle: 'growth' as const
          },
          {
            id: 'habit-streak-7',
            type: 'habit' as const,
            category: 'Habits',
            title: 'Habit Starter',
            description: 'You\'ve maintained a 7-day habit streak!',
            icon: '🌿',
            target: 7,
            celebrationStyle: 'growth' as const
          },
          {
            id: 'habit-streak-21',
            type: 'habit' as const,
            category: 'Habits',
            title: 'Habit Former',
            description: 'You\'ve maintained a 21-day habit streak!',
            icon: '🌳',
            target: 21,
            celebrationStyle: 'growth' as const
          },
          {
            id: 'habit-streak-66',
            type: 'habit' as const,
            category: 'Habits',
            title: 'Habit Master',
            description: 'You\'ve maintained a 66-day habit streak!',
            icon: '🏔️',
            target: 66,
            celebrationStyle: 'rainbow' as const
          }
        ];

        const longestHabitStreak = Math.max(...activeHabits.map(h => h.current_streak), 0);

        habitMilestones.forEach(milestone => {
          if (milestone.id === 'first-habit') {
            const achieved = activeHabits.length >= 1;
            let achievedAt: Date | undefined;
            if (achieved) {
              achievedAt = getAchievementDate(milestone.id, entries, stats, habits, milestone);
            }
            
            allMilestones.push({
              ...milestone,
              achieved,
              progress: achieved ? 1 : 0,
              nextTarget: achieved ? undefined : 1,
              achievedAt
            });
          } else {
            const achieved = longestHabitStreak >= milestone.target;
            const progress = Math.min(longestHabitStreak / milestone.target, 1);
            
            let achievedAt: Date | undefined;
            if (achieved) {
              achievedAt = getAchievementDate(milestone.id, entries, stats, habits, milestone);
            }
            
            allMilestones.push({
              ...milestone,
              achieved,
              progress,
              nextTarget: achieved ? undefined : milestone.target,
              achievedAt
            });
          }
        });
      }

      // Growth & Behavioral Milestones
      const growthMilestones = [
        {
          id: 'self-aware',
          type: 'growth' as const,
          category: 'Growth',
          title: 'Self-Aware',
          description: 'You\'ve developed high self-awareness in your reflections!',
          icon: '🧠',
          achieved: insights.selfAwarenessLevel === 'high',
          progress: insights.selfAwarenessLevel === 'high' ? 1 : insights.selfAwarenessLevel === 'moderate' ? 0.6 : 0.3,
          celebrationStyle: 'stars' as const
        },
        {
          id: 'deep-reflector',
          type: 'growth' as const,
          category: 'Growth',
          title: 'Deep Reflector',
          description: 'Your reflections show remarkable depth and insight!',
          icon: '🎯',
          achieved: insights.reflectionDepth === 'deep',
          progress: insights.reflectionDepth === 'deep' ? 1 : insights.reflectionDepth === 'moderate' ? 0.6 : 0.3,
          celebrationStyle: 'stars' as const
        },
        {
          id: 'growth-mindset',
          type: 'growth' as const,
          category: 'Growth',
          title: 'Growth Mindset',
          description: 'You consistently demonstrate a growth mindset!',
          icon: '📈',
          achieved: insights.growthMindsetIndicators > 0.7,
          progress: insights.growthMindsetIndicators,
          celebrationStyle: 'growth' as const
        },
        {
          id: 'data-rich',
          type: 'growth' as const,
          category: 'Growth',
          title: 'Data Rich',
          description: 'You\'ve built a rich foundation of self-reflection data!',
          icon: '💎',
          achieved: insights.dataRichness === 'rich',
          progress: insights.dataRichness === 'rich' ? 1 : insights.dataRichness === 'moderate' ? 0.6 : 0.3,
          celebrationStyle: 'rainbow' as const
        }
      ];

      growthMilestones.forEach(milestone => {
        let achievedAt: Date | undefined;
        if (milestone.achieved) {
          achievedAt = getAchievementDate(milestone.id, entries, stats, habits, milestone);
        }

        allMilestones.push({
          ...milestone,
          nextTarget: milestone.achieved ? undefined : 1,
          achievedAt
        });
      });

    } catch (error) {
      console.error('Error calculating milestones:', error);
      return []; // Return empty array on error
    }

    console.log('Generated milestones:', allMilestones.map(m => ({ id: m.id, achieved: m.achieved, achievedAt: m.achievedAt })));
    return allMilestones;
  }, [entries, stats, habits, insights, user, isLoading]);

  // Get recently achieved milestones (within last 7 days, only newly achieved ones)
  const recentlyAchieved = useMemo(() => {
    if (isLoading || milestones.length === 0) {
      return [];
    }

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // Add minimum age requirement (at least 2 minutes old) to prevent immediate re-triggering
      const twoMinutesAgo = new Date();
      twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);
      
      const recent = milestones.filter(milestone => 
        milestone.achieved && 
        milestone.achievedAt && 
        milestone.achievedAt > sevenDaysAgo &&
        milestone.achievedAt < twoMinutesAgo // Ensure milestone is at least 2 minutes old
      );

      console.log('Recently achieved milestones (filtered):', recent.map(m => ({ 
        id: m.id, 
        achievedAt: m.achievedAt,
        minutesAgo: m.achievedAt ? Math.round((Date.now() - m.achievedAt.getTime()) / (1000 * 60)) : 'unknown'
      })));
      return recent;
    } catch (error) {
      console.error('Error filtering recent achievements:', error);
      return [];
    }
  }, [milestones, isLoading]);

  const nextMilestones = useMemo(() => {
    if (isLoading) return [];
    
    try {
      return milestones
        .filter(milestone => !milestone.achieved && milestone.progress > 0)
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3);
    } catch (error) {
      console.error('Error calculating next milestones:', error);
      return [];
    }
  }, [milestones, isLoading]);

  const achievedByCategory = useMemo(() => {
    if (isLoading) return {};
    
    try {
      return milestones
        .filter(milestone => milestone.achieved)
        .reduce((acc, milestone) => {
          if (!acc[milestone.category]) {
            acc[milestone.category] = [];
          }
          acc[milestone.category].push(milestone);
          return acc;
        }, {} as Record<string, Milestone[]>);
    } catch (error) {
      console.error('Error grouping achievements by category:', error);
      return {};
    }
  }, [milestones, isLoading]);

  return {
    milestones,
    recentlyAchieved,
    nextMilestones,
    achievedByCategory,
    totalAchieved: milestones.filter(m => m.achieved).length,
    totalMilestones: milestones.length,
    overallProgress: milestones.length > 0 ? milestones.filter(m => m.achieved).length / milestones.length : 0,
    isLoading
  };
};
