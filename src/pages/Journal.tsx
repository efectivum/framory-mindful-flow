
import { BookOpen, Brain, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CreateJournalDialog } from '@/components/CreateJournalDialog';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { VoiceButton } from '@/components/VoiceButton';
import { EmotionBreakdown } from '@/components/EmotionBreakdown';
import { EmotionBubbleChart } from '@/components/EmotionBubbleChart';
import { WeeklyInsightCard } from '@/components/WeeklyInsightCard';
import { EntryAnalysisModal } from '@/components/EntryAnalysisModal';
import { useJournalEntries, JournalEntry } from '@/hooks/useJournalEntries';
import { useJournalAnalysis } from '@/hooks/useJournalAnalysis';
import { useWeeklyInsights } from '@/hooks/useWeeklyInsights';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageLayout } from '@/components/PageLayout';
import { MobileLayout } from '@/components/MobileLayout';
import { useState } from 'react';

const Journal = () => {
  const isMobile = useIsMobile();
  const { entries, isLoading, createEntry, stats } = useJournalEntries();
  const { generateSummaryAnalysis, isSummaryLoading, summaryData } = useJournalAnalysis();
  const { weeklyInsights, generateWeeklyInsight, isGenerating, getLatestInsight } = useWeeklyInsights();
  const [quickContent, setQuickContent] = useState('');
  const [quickMood, setQuickMood] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const handleQuickEntry = () => {
    if (!quickContent.trim()) return;
    
    createEntry({
      content: quickContent.trim(),
      mood_after: quickMood ? parseInt(quickMood) : undefined,
    });

    setQuickContent('');
    setQuickMood('');
  };

  const handleVoiceTranscription = (text: string) => {
    if (quickContent.trim()) {
      setQuickContent(prev => prev + ' ' + text);
    } else {
      setQuickContent(text);
    }
  };

  const handleAnalyzeEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowAnalysisModal(true);
  };

  const handleGenerateSummary = () => {
    if (entries.length > 0) {
      generateSummaryAnalysis(entries.slice(0, 10));
    }
  };

  const handleGenerateWeeklyInsight = () => {
    if (entries.length >= 3) {
      const weekEntries = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDate > weekAgo;
      });
      generateWeeklyInsight(weekEntries.length > 0 ? weekEntries : entries.slice(0, 7));
    }
  };

  const latestInsight = getLatestInsight();

  const content = (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {/* Quick Reflection Card */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Quick Reflection
              </CardTitle>
              <CreateJournalDialog />
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                placeholder="What's on your mind today? AI will analyze your emotional state and provide personalized insights..."
                className="min-h-32 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pr-12"
                value={quickContent}
                onChange={(e) => setQuickContent(e.target.value)}
              />
              <div className="absolute top-2 right-2">
                <VoiceButton onTranscription={handleVoiceTranscription} />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <select 
                className="bg-gray-700 border-gray-600 text-white rounded px-3 py-1 text-sm"
                value={quickMood}
                onChange={(e) => setQuickMood(e.target.value)}
              >
                <option value="">Select your mood</option>
                <option value="5">😄 Excellent</option>
                <option value="4">😊 Good</option>
                <option value="3">😐 Neutral</option>
                <option value="2">😕 Low</option>
                <option value="1">😞 Very Low</option>
              </select>
              <Button 
                size="sm" 
                onClick={handleQuickEntry}
                disabled={!quickContent.trim()}
              >
                Save & Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Insight Card */}
        {latestInsight && (
          <div className="mb-6">
            <WeeklyInsightCard insight={latestInsight} isLatest={true} />
          </div>
        )}

        {/* AI Summary Analysis */}
        {entries.length > 2 && (
          <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border-gray-700/50 backdrop-blur-sm mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Analysis Hub
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleGenerateSummary}
                    disabled={isSummaryLoading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSummaryLoading ? 'Analyzing...' : 'Recent Summary'}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleGenerateWeeklyInsight}
                    disabled={isGenerating}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    {isGenerating ? 'Generating...' : 'Weekly Insight'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {summaryData && (
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Personalized Summary</h4>
                    <p className="text-gray-300 text-sm">{summaryData.summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/30 rounded-lg">
                      <h4 className="text-green-300 font-medium mb-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Your Strengths
                      </h4>
                      <div className="space-y-1">
                        {summaryData.strengths.map((strength, index) => (
                          <div key={index} className="text-gray-300 text-sm">• {strength}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-800/30 rounded-lg">
                      <h4 className="text-blue-300 font-medium mb-2">Key Insights</h4>
                      <div className="space-y-1">
                        {summaryData.keyInsights.slice(0, 3).map((insight, index) => (
                          <div key={index} className="text-gray-300 text-sm">• {insight}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {summaryData.recommendations.length > 0 && (
                    <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                      <h4 className="text-indigo-300 font-medium mb-2">Personalized Recommendations</h4>
                      <div className="space-y-1">
                        {summaryData.recommendations.map((rec, index) => (
                          <div key={index} className="text-gray-300 text-sm">• {rec}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Journal Entries */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Entries</h2>
          {isLoading ? (
            <div className="text-gray-400">Loading entries...</div>
          ) : entries.length > 0 ? (
            <div className="space-y-4">
              {entries.slice(0, 10).map((entry) => (
                <JournalEntryCard 
                  key={entry.id} 
                  entry={entry} 
                  onAnalyze={handleAnalyzeEntry}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No entries yet</h3>
                <p className="text-gray-400 mb-4">Start your personalized journaling journey with AI insights.</p>
                <CreateJournalDialog />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Emotion Bubble Chart */}
        {summaryData?.emotionBreakdown && (
          <EmotionBubbleChart emotions={summaryData.emotionBreakdown} />
        )}

        {/* Emotion Breakdown */}
        {summaryData?.emotionBreakdown && (
          <EmotionBreakdown emotions={summaryData.emotionBreakdown} />
        )}

        {/* Today's Prompt */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">Today's Personalized Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              "What three things brought you joy today, and how can you create more moments like these?"
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Use This Prompt
            </Button>
          </CardContent>
        </Card>

        {/* Mood Insights */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-teal-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">Mood Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">This Week</span>
              <span className="text-white font-medium">{stats.thisWeekCount} entries</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current Streak</span>
              <span className="text-white font-medium">{stats.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Entries</span>
              <span className="text-white font-medium">{stats.totalCount}</span>
            </div>
            {stats.averageMood > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Your Avg Mood</span>
                <span className="text-white font-medium">{stats.averageMood.toFixed(1)}/5</span>
              </div>
            )}
            {stats.averageAiMood > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">AI Avg Mood</span>
                <span className="text-white font-medium">{stats.averageAiMood.toFixed(1)}/5</span>
              </div>
            )}
            {stats.averageAlignment > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Mood Alignment</span>
                <span className="text-white font-medium">{Math.round(stats.averageAlignment * 100)}%</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">Personalized AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <p className="text-gray-300 text-sm">Your emotional self-awareness is growing! I can see you're becoming more in tune with your feelings.</p>
                <span className="text-xs text-orange-400">Growth Recognition</span>
              </div>
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <p className="text-gray-300 text-sm">I notice gratitude appears frequently in your writing - this positive pattern is strengthening your resilience!</p>
                <span className="text-xs text-orange-400">Pattern Insight</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Insights History */}
        {weeklyInsights.length > 1 && (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg">Previous Weeks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyInsights.slice(1, 4).map((insight) => (
                  <div key={insight.id} className="p-3 bg-gray-700/30 rounded-lg">
                    <div className="text-white font-medium text-sm mb-1">
                      Week of {new Date(insight.week_start_date).toLocaleDateString()}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {insight.entry_count} entries • Avg mood: {insight.average_mood?.toFixed(1)}/5
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Entry Analysis Modal */}
      <EntryAnalysisModal
        entry={selectedEntry}
        open={showAnalysisModal}
        onClose={() => {
          setShowAnalysisModal(false);
          setSelectedEntry(null);
        }}
      />
    </div>
  );

  // Use MobileLayout for mobile with swipe functionality
  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  // Use PageLayout for desktop
  return (
    <PageLayout title="AI-Powered Journaling" subtitle="Capture thoughts, discover patterns, and grow with personalized insights">
      {content}
    </PageLayout>
  );
};

export default Journal;
