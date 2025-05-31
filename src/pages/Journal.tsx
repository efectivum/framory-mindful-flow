
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ActivityLog } from '@/components/ActivityLog';
import { CreateJournalDialog } from '@/components/CreateJournalDialog';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useIsMobile } from '@/hooks/use-mobile';
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

  const journalContent = (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Journaling</h1>
            <p className="text-gray-400">Capture your thoughts and reflections</p>
          </div>
          <CreateJournalDialog />
        </div>

        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          <div className={isMobile ? '' : 'lg:col-span-2'}>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Quick Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What's on your mind today?"
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
                    <option value="">Select mood</option>
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
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-gray-700/50">
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

            <Card className="bg-gradient-to-br from-blue-500/10 to-teal-600/10 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Writing Stats</CardTitle>
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
                    <span className="text-gray-400">Avg Mood</span>
                    <span className="text-white font-medium">{stats.averageMood.toFixed(1)}/5</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Recent Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-gray-300 text-sm">You seem more reflective on Mondays based on your recent entries.</p>
                    <span className="text-xs text-orange-400">AI Insight</span>
                  </div>
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-gray-300 text-sm">Your mood patterns show improvement when you exercise.</p>
                    <span className="text-xs text-orange-400">AI Insight</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return journalContent;
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-700 px-4">
        <SidebarTrigger className="-ml-1" />
      </header>
      {journalContent}
    </SidebarInset>
  );
};

export default Journal;
