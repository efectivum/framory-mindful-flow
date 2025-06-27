
import React from 'react';
import { TrendingUp, Brain, Calendar, Target, Sparkles, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useHabits } from '@/hooks/useHabits';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { MoodTrendChart } from '@/components/MoodTrendChart';
import { PersonalityRadarChart } from '@/components/PersonalityRadarChart';
import { RecurringTopics } from '@/components/RecurringTopics';
import { MiniCalendar } from '@/components/MiniCalendar';
import { PremiumGate } from '@/components/PremiumGate';
import { FlippableCard } from '@/components/ui/FlippableCard';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';

const Insights = () => {
  const { entries, stats } = useJournalEntries();
  const { habits } = useHabits();
  const { 
    moodTrends, 
    personalityInsights, 
    totalEntries, 
    currentStreak 
  } = useAnalytics(30);

  const activeHabits = habits.filter(habit => habit.is_active);
  const totalWords = entries.reduce((sum, entry) => sum + (entry.content?.split(' ').length || 0), 0);
  const averageWordsPerEntry = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;

  const createInsightCard = (
    icon: React.ReactNode,
    title: string,
    value: string | number,
    description: string,
    gradient: string,
    details: string
  ) => {
    const front = (
      <div className={`h-full w-full rounded-3xl p-6 flex flex-col justify-between shadow-xl border border-white/10 backdrop-blur-sm app-card-organic`}
           style={{ background: gradient }}>
        <div className="flex items-center justify-between">
          <div className="text-white/80">{icon}</div>
          <Badge variant="outline" className="text-white/80 border-white/20">
            Insight
          </Badge>
        </div>
        <div>
          <div className="text-3xl font-light text-white mb-2 animate-gentle-pulse">{value}</div>
          <div className="text-white/80 text-sm font-medium">{title}</div>
          <div className="text-white/60 text-xs mt-1">{description}</div>
        </div>
      </div>
    );

    const back = (
      <div className={`h-full w-full rounded-3xl p-6 flex items-center justify-center shadow-xl border border-white/10 backdrop-blur-sm`}
           style={{ background: gradient }}>
        <div className="text-center space-y-3">
          <div className="text-white/80 text-lg font-medium">{title}</div>
          <p className="text-white/90 text-sm leading-relaxed">{details}</p>
        </div>
      </div>
    );

    return { front, back };
  };

  const streakCard = createInsightCard(
    <Calendar className="w-6 h-6" />,
    "Writing Streak",
    `${currentStreak} days`,
    "Consistency builds momentum",
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    "Your writing streak shows your commitment to self-reflection. Each day you write, you're building a stronger connection with yourself."
  );

  const wordsCard = createInsightCard(
    <Brain className="w-6 h-6" />,
    "Average Words",
    averageWordsPerEntry,
    "Per journal entry",
    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    "The depth of your entries reflects your willingness to explore your thoughts. Longer entries often lead to deeper insights."
  );

  const habitsCard = createInsightCard(
    <Target className="w-6 h-6" />,
    "Active Habits",
    activeHabits.length,
    "Building consistency",
    "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    "Your habits are the foundation of personal growth. Each habit represents a commitment to becoming your best self."
  );

  return (
    <ResponsiveLayout title="Insights" subtitle="Discover patterns in your journey">
      <NetworkStatusIndicator />
      <div className="app-content-flow">
        {/* Enhanced Overview Stats */}
        <ButtonErrorBoundary fallbackMessage="Overview statistics are not available">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
            <FlippableCard
              frontContent={streakCard.front}
              backContent={streakCard.back}
              height="h-44"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={wordsCard.front}
              backContent={wordsCard.back}
              height="h-44"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={habitsCard.front}
              backContent={habitsCard.back}
              height="h-44"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
          </div>
        </ButtonErrorBoundary>

        {entries.length === 0 ? (
          <div className="text-center space-y-6 pt-12">
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-breathe app-card-organic" 
                 style={{ background: 'var(--app-accent-primary)' }}>
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-hero mb-4">Start Your Journey</h3>
              <p className="text-subhero max-w-2xl mx-auto">
                Your insights will appear here as you write more journal entries and build habits. Start by creating your first entry.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Charts and Analytics */}
            <div className="space-y-6">
              <MoodTrendChart data={moodTrends} timeRange={30} />

              <PremiumGate 
                feature="Advanced Analytics" 
                description="Get deeper insights into your emotional patterns and growth trends."
                showPreview={true}
              >
                <PersonalityRadarChart insights={personalityInsights} />
              </PremiumGate>
            </div>

            {/* Enhanced Sidebar Insights */}
            <div className="space-y-6">
              <Card className="app-card-organic animate-fade-in">
                <CardContent className="p-0">
                  <MiniCalendar />
                </CardContent>
              </Card>

              <RecurringTopics />

              <Card className="app-card-organic animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-300" />
                    Growth Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                      <div className="text-2xl font-bold text-white mb-1">{totalEntries}</div>
                      <div className="text-gray-400 text-sm">Total Entries</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                      <div className="text-2xl font-bold text-white mb-1">{totalWords.toLocaleString()}</div>
                      <div className="text-gray-400 text-sm">Words Written</div>
                    </div>
                  </div>
                  <div className="text-center text-gray-300 text-sm">
                    You've been on this journey for <span className="font-semibold text-purple-300">{Math.max(1, currentStreak)}</span> days
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default Insights;
