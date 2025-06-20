
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { PersonalityInsightCard } from '@/components/insights/PersonalityInsightCard';
import { MoodInsightCard } from '@/components/insights/MoodInsightCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useFeatureTracking } from '@/hooks/useFeatureTracking';
import { useSubscription } from '@/hooks/useSubscription';
import { Filter, Calendar, Brain, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Insights = () => {
  const navigate = useNavigate();
  const { entries } = useJournalEntries();
  const { trackFeatureUsage } = useFeatureTracking();
  const { isPremium } = useSubscription();
  const [timeRange, setTimeRange] = React.useState<30 | 90 | 365>(30);
  
  const {
    moodTrends,
    personalityInsights,
    totalEntries,
    currentStreak
  } = useAnalytics(timeRange);

  // Track insights page view
  React.useEffect(() => {
    trackFeatureUsage('insights_view', 'analytics', {
      metadata: { page: 'insights', entryCount: entries.length }
    });
  }, [trackFeatureUsage, entries.length]);

  // Create mood data for the mood card
  const moodData = moodTrends.map(trend => ({
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: trend.mood || 0
  }));

  const averageMood = moodData.reduce((sum, data) => sum + data.mood, 0) / moodData.length || 0;
  
  // Determine mood trend
  const moodTrend = moodData.length > 1 ? 
    (moodData[moodData.length - 1].mood > moodData[0].mood ? 'up' : 
     moodData[moodData.length - 1].mood < moodData[0].mood ? 'down' : 'stable') : 'stable';

  const timeRangeOptions = [
    { value: 30, label: '30 days' },
    { value: 90, label: '3 months' },
    { value: 365, label: '1 year' }
  ];

  const handleViewEntries = (emotion: string) => {
    trackFeatureUsage('emotion_filter', 'navigation', {
      metadata: { emotion, source: 'insights' }
    });
    navigate(`/journal-history?emotion=${encodeURIComponent(emotion)}`);
  };

  const handleAskQuestions = (emotion: string) => {
    trackFeatureUsage('ai_chat', 'interaction', {
      metadata: { emotion, source: 'insights' }
    });
    navigate(`/chat?emotion=${encodeURIComponent(emotion)}`);
  };

  return (
    <ResponsiveLayout 
      title="Insights" 
      subtitle="Discover patterns in your personal growth journey"
    >
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header with Time Range Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight">Your Insights</h1>
            <p className="text-gray-400 font-light">Deep insights from your journaling data</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex gap-1">
              {timeRangeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={timeRange === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(option.value as 30 | 90 | 365)}
                  className={`rounded-full ${timeRange === option.value ? 
                    "bg-blue-600 hover:bg-blue-700 text-white" : 
                    "text-gray-400 border-gray-600/50 hover:bg-gray-700/50"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-gray-700/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-2xl font-light text-white">{totalEntries}</div>
                <div className="text-xs text-gray-400">Total Entries</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-gray-700/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-green-400" />
              <div>
                <div className="text-2xl font-light text-white">{currentStreak}</div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border border-gray-700/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <div>
                <div className="text-2xl font-light text-white">{averageMood.toFixed(1)}</div>
                <div className="text-xs text-gray-400">Avg Mood</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-gray-700/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-orange-400" />
              <div>
                <div className="text-2xl font-light text-white">
                  {moodTrend === 'up' ? '↗' : moodTrend === 'down' ? '↘' : '→'}
                </div>
                <div className="text-xs text-gray-400">Mood Trend</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Insight Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PersonalityInsightCard insights={personalityInsights} />
          
          <MoodInsightCard 
            moodData={moodData}
            averageMood={averageMood}
            trend={moodTrend}
          />
        </div>

        {/* Additional insights for premium users */}
        {!isPremium && (
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 text-center backdrop-blur-sm">
            <h3 className="text-xl font-medium text-white mb-4">Unlock Advanced Insights</h3>
            <p className="text-gray-400 mb-6">
              Get deeper personality analysis, emotion patterns, and personalized recommendations with Premium.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
              Upgrade to Premium
            </Button>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default Insights;
