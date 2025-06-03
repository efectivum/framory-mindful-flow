
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CreateJournalDialog } from '@/components/CreateJournalDialog';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageLayout } from '@/components/PageLayout';
import { MobileLayout } from '@/components/MobileLayout';
import { useState } from 'react';

const Journal = () => {
  const isMobile = useIsMobile();
  const { entries, isLoading, createEntry, stats } = useJournalEntries();
  const [quickContent, setQuickContent] = useState('');
  const [quickMood, setQuickMood] = useState('');

  const handleQuickEntry = () => {
    if (!quickContent.trim()) return;
    
    createEntry({
      content: quickContent.trim(),
      mood_after: quickMood ? parseInt(quickMood) : undefined,
    });

    setQuickContent('');
    setQuickMood('');
  };

  const content = (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2">
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
            <Textarea
              placeholder="What's on your mind today? AI will analyze your emotional state..."
              className="min-h-32 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              value={quickContent}
              onChange={(e) => setQuickContent(e.target.value)}
            />
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
                Save Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Entries</h2>
          {isLoading ? (
            <div className="text-gray-400">Loading entries...</div>
          ) : entries.length > 0 ? (
            <div className="space-y-4">
              {entries.slice(0, 10).map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No entries yet</h3>
                <p className="text-gray-400 mb-4">Start your journaling journey by creating your first entry.</p>
                <CreateJournalDialog />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">Today's Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              "What three things am I most grateful for today, and how can I carry this gratitude forward?"
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Use This Prompt
            </Button>
          </CardContent>
        </Card>

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

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <p className="text-gray-300 text-sm">Your self-awareness is improving! AI analysis shows good alignment with your reported moods.</p>
                <span className="text-xs text-orange-400">Emotional Intelligence</span>
              </div>
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <p className="text-gray-300 text-sm">Grateful emotions are frequently detected in your entries - keep nurturing this positive pattern!</p>
                <span className="text-xs text-orange-400">Pattern Recognition</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Use MobileLayout for mobile with swipe functionality
  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  // Use PageLayout for desktop
  return (
    <PageLayout title="Journaling" subtitle="Capture your thoughts and reflections with AI mood insights">
      {content}
    </PageLayout>
  );
};

export default Journal;
