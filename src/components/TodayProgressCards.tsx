import React from "react";
import { AppStatCard } from "@/components/ui/AppStatCard";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { useHabits } from "@/hooks/useHabits";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useWeeklyInsights } from "@/hooks/useWeeklyInsights";
import { useQuickAnalysis } from "@/hooks/useQuickAnalysis";
import { TrendingUp, TrendingDown, FileChartLine, CircleCheck, CircleArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const TodayProgressCards: React.FC = () => {
  const { stats, entries } = useJournalEntries();
  const { habits } = useHabits();
  const { mode } = useTimeOfDay();
  const { weeklyInsights, getLatestInsight } = useWeeklyInsights();

  // Use the latest journal entry for QuickAnalysis
  const latestEntry = entries.length > 0 ? entries[0] : null;
  const { getQuickAnalysis } = useQuickAnalysis();

  // Always call the hook, with suitable enabled flag
  const { data: quickAnalysis } = getQuickAnalysis(latestEntry ? latestEntry.id : "");

  // Habit stats
  const activeHabits = habits.filter((h) => h.is_active);
  const completedHabitsToday = activeHabits.filter(
    (h) => h.current_streak && h.current_streak > 0
  );
  const longestHabitStreak = Math.max(...activeHabits.map((h) => h.longest_streak || 0, 0));

  // Mood trend (simple: up if mood improved in last 2 entries)
  let moodTrend: "up" | "down" | "neutral" = "neutral";
  if (entries.length >= 2) {
    const prev = entries[1].mood_after ?? 0;
    const curr = entries[0].mood_after ?? 0;
    if (curr > prev) moodTrend = "up";
    else if (curr < prev) moodTrend = "down";
  }

  // Latest weekly insight (if exists)
  const latestInsight = getLatestInsight();

  // Helper card layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
      {/* Journal Streak */}
      <AppStatCard
        value={stats.currentStreak}
        label="Journal Streak"
        icon={<CircleCheck className="w-5 h-5 text-green-400" />}
        color="success"
      />
      {/* Entries This Week */}
      <AppStatCard
        value={stats.thisWeekCount}
        label="Entries This Week"
        icon={<FileChartLine className="w-5 h-5 text-blue-400" />}
      />
      {/* Avg. Mood + Trend */}
      <div>
        <AppStatCard
          value={
            <>
              {stats.averageMood ? stats.averageMood.toFixed(1) : "--"}
              <span className="ml-1">{moodTrend === "up"
                ? <TrendingUp className="w-4 h-4 inline text-green-400" />
                : moodTrend === "down"
                  ? <TrendingDown className="w-4 h-4 inline text-red-500" />
                  : ""
              }</span>
            </>
          }
          label="Avg. Mood"
          icon={<CircleArrowUp className="w-5 h-5 text-yellow-400" />}
        />
      </div>
      {/* Longest Habit Streak */}
      <AppStatCard
        value={longestHabitStreak}
        label="Longest Habit Streak"
        icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
      />
      {/* Habits Completed Today */}
      <AppStatCard
        value={`${completedHabitsToday.length}/${activeHabits.length}`}
        label="Habits Today"
        icon={<CircleCheck className="w-5 h-5 text-sky-400" />}
        color={completedHabitsToday.length === activeHabits.length && activeHabits.length > 0 ? "success" : undefined}
      />
      {/* AI Quick Insight */}
      {quickAnalysis && quickAnalysis.quick_takeaways?.length > 0 && (
        <Card className="bg-gray-800/60 border-gray-700/80">
          <CardContent className="p-4">
            <div className="text-xs text-purple-300 font-semibold mb-1 flex items-center gap-2">
              <FileChartLine className="w-4 h-4" /> Latest Insight
              <Badge variant="secondary" className="ml-auto">AI</Badge>
            </div>
            <div className="text-gray-200 text-sm leading-snug">
              <span>{quickAnalysis.quick_takeaways[0]}</span>
              {quickAnalysis.quick_takeaways.length > 1 && (
                <Button
                  variant="link"
                  size="sm"
                  className="ml-2 text-xs px-1 h-6"
                  onClick={() => window.location.href = "/insights"} // Link to insights page
                >
                  See all
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Weekly Insight */}
      {latestInsight && (
        <Card className="bg-gradient-to-br from-purple-700/20 to-pink-700/20 border-purple-700/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-pink-300 font-semibold flex items-center gap-2">
                <FileChartLine className="w-4 h-4" />
                Weekly Insight
              </div>
              <Badge variant="outline" className="text-xs">This Week</Badge>
            </div>
            <div className="text-gray-200 text-xs mb-1">{latestInsight.emotional_summary}</div>
            <div className="text-gray-400 text-xs flex flex-wrap gap-1">
              {latestInsight.growth_observations?.slice(0, 2).map((growth, idx) => (
                <Badge key={idx} className="text-emerald-200 bg-emerald-800/10 border-emerald-500/20 text-xs">{growth}</Badge>
              ))}
            </div>
            <Button
              variant="link"
              size="sm"
              className="mt-2 text-xs p-0 h-6"
              onClick={() => window.location.href = "/insights"}
            >
              View Weekly Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
