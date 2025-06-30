
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

// Store achievement timestamps to prevent regenerating dates
const achievementTimestamps = new Map<string, Date>();

const getOrSetAchievementDate = (milestoneId: string, fallbackDate?: Date): Date => {
  if (achievementTimestamps.has(milestoneId)) {
    return achievementTimestamps.get(milestoneId)!;
  }
  
  const date = fallbackDate || new Date();
  achievementTimestamps.set(milestoneId, date);
  return date;
};

export const useMilestoneDetection = () => {
  const { user } = useAuth();
  const { entries, stats } = useJournalEntries();
  const { habits } = useHabits();
  const { insights } = useUserBehaviors();

  const milestones: Milestone[] = useMemo(() => {
    if (!user || entries.length === 0) return [];

    console.log('Calculating milestones for user:', user.id);
    console.log('Entries count:', entries.length);
    console.log('Current streak:', stats.currentStreak);

    const allMilestones: Milestone[] = [];
    
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
      const achieved = entries.length >= milestone.target;
      const progress = Math.min(entries.length / milestone.target, 1);
      const nextTarget = achieved ? undefined : milestone.target;

      let achievedAt: Date | undefined;
      if (achieved && entries.length >= milestone.target) {
        // Use the creation date of the entry that achieved this milestone
        const achievingEntryIndex = milestone.target - 1;
        const achievingEntry = entries[entries.length - 1 - achievingEntryIndex];
        if (achievingEntry?.created_at) {
          achievedAt = getOrSetAchievementDate(milestone.id, parseISO(achievingEntry.created_at));
        }
      }

      allMilestones.push({
        ...milestone,
        achieved,
        progress,
        nextTarget,
        achievedAt
      });
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
      const achieved = stats.currentStreak >= milestone.target;
      const progress = Math.min(stats.currentStreak / milestone.target, 1);
      const nextTarget = achieved ? undefined : milestone.target;

      let achievedAt: Date | undefined;
      if (achieved) {
        // For streak milestones, use a consistent date based on when the streak was likely achieved
        achievedAt = getOrSetAchievementDate(milestone.id);
      }

      allMilestones.push({
        ...milestone,
        achieved,
        progress,
        nextTarget,
        achievedAt
      });
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
            achievedAt = getOrSetAchievementDate(milestone.id, parseISO(activeHabits[0].created_at));
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
            achievedAt = getOrSetAchievementDate(milestone.id);
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
        achievedAt = getOrSetAchievementDate(milestone.id);
      }

      allMilestones.push({
        ...milestone,
        nextTarget: milestone.achieved ? undefined : 1,
        achievedAt
      });
    });

    console.log('Generated milestones:', allMilestones.map(m => ({ id: m.id, achieved: m.achieved, achievedAt: m.achievedAt })));
    return allMilestones;
  }, [entries, stats, habits, insights, user]);

  // Get recently achieved milestones (within last 7 days, but only newly achieved ones)
  const recentlyAchieved = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recent = milestones.filter(milestone => 
      milestone.achieved && 
      milestone.achievedAt && 
      milestone.achievedAt > sevenDaysAgo
    );

    console.log('Recently achieved milestones:', recent.map(m => ({ id: m.id, achievedAt: m.achievedAt })));
    return recent;
  }, [milestones]);

  // Get next milestones to achieve
  const nextMilestones = useMemo(() => {
    return milestones
      .filter(milestone => !milestone.achieved && milestone.progress > 0)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);
  }, [milestones]);

  // Get achieved milestones by category
  const achievedByCategory = useMemo(() => {
    return milestones
      .filter(milestone => milestone.achieved)
      .reduce((acc, milestone) => {
        if (!acc[milestone.category]) {
          acc[milestone.category] = [];
        }
        acc[milestone.category].push(milestone);
        return acc;
      }, {} as Record<string, Milestone[]>);
  }, [milestones]);

  return {
    milestones,
    recentlyAchieved,
    nextMilestones,
    achievedByCategory,
    totalAchieved: milestones.filter(m => m.achieved).length,
    totalMilestones: milestones.length,
    overallProgress: milestones.length > 0 ? milestones.filter(m => m.achieved).length / milestones.length : 0
  };
};
