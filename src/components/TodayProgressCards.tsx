
import React from "react";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useWeeklyInsights } from "@/hooks/useWeeklyInsights";
import { useQuickAnalysis } from "@/hooks/useQuickAnalysis";
import { useProgressStats } from "@/hooks/useProgressStats";
import { StatCardRow } from "@/components/StatCardRow";
import { AIInsightCard, WeeklyInsightCard } from "@/components/InsightCard";
import { CircleCheck, FileChartLine, TrendingUp, TrendingDown, CircleArrowUp } from "lucide-react";
import { AppStatCard } from "@/components/ui/AppStatCard";

export const TodayProgressCards: React.FC = () => {
  const { stats, entries, activeHabits, completedHabitsToday, longestHabitStreak, moodTrend } =
    useProgressStats();
  const { mode } = useTimeOfDay();
  const { weeklyInsights, getLatestInsight } = useWeeklyInsights();

  // Use the latest journal entry for QuickAnalysis
  const latestEntry = entries.length > 0 ? entries[0] : null;
  const { getQuickAnalysis } = useQuickAnalysis();
  const { data: quickAnalysis } = getQuickAnalysis(latestEntry ? latestEntry.id : "");

  const statCards = [
    {
      value: stats.currentStreak,
      label: "Journal Streak",
      icon: <CircleCheck className="w-5 h-5 text-green-400" />,
      color: "success" as const,
    },
    {
      value: stats.thisWeekCount,
      label: "Entries This Week",
      icon: <FileChartLine className="w-5 h-5 text-blue-400" />,
    },
    {
      value: (
        <>
          {stats.averageMood ? stats.averageMood.toFixed(1) : "--"}
          <span className="ml-1">
            {moodTrend === "up" ? (
              <TrendingUp className="w-4 h-4 inline text-green-400" />
            ) : moodTrend === "down" ? (
              <TrendingDown className="w-4 h-4 inline text-red-500" />
            ) : (
              ""
            )}
          </span>
        </>
      ),
      label: "Avg. Mood",
      icon: <CircleArrowUp className="w-5 h-5 text-yellow-400" />,
    },
    {
      value: longestHabitStreak,
      label: "Longest Habit Streak",
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    },
    {
      value: `${completedHabitsToday.length}/${activeHabits.length}`,
      label: "Habits Today",
      icon: <CircleCheck className="w-5 h-5 text-sky-400" />,
      color:
        completedHabitsToday.length === activeHabits.length && activeHabits.length > 0
          ? "success" as const
          : undefined,
    },
  ];

  const latestInsight = getLatestInsight();

  // Mobile-first: horizontal scroll by default, grid at desktop via CSS only
  return (
    <div className="w-full mb-4">
      <StatCardRow statCards={statCards} />
      <AIInsightCard quickAnalysis={quickAnalysis} />
      <WeeklyInsightCard latestInsight={latestInsight} />
    </div>
  );
};
