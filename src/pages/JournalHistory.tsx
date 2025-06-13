
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileLayout } from '@/components/MobileLayout';
import { PageLayout } from '@/components/PageLayout';

const JournalHistory = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { entries, isLoading, stats } = useJournalEntries();

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/journal')}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Journal
        </Button>
        
        <div className="text-right">
          <h1 className="text-2xl font-bold text-white">Your Entries</h1>
          <p className="text-gray-400">{stats.totalCount} entries total</p>
        </div>
      </div>

      {/* Stats */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-teal-600/10 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.thisWeekCount}</div>
            <div className="text-gray-400 text-sm">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
            <div className="text-gray-400 text-sm">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.totalCount}</div>
            <div className="text-gray-400 text-sm">Total Entries</div>
          </div>
          {stats.averageMood > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.averageMood.toFixed(1)}</div>
              <div className="text-gray-400 text-sm">Avg Mood</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entries */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">Loading entries...</div>
        ) : entries.length > 0 ? (
          entries.map((entry) => (
            <JournalEntryCard 
              key={entry.id} 
              entry={entry} 
            />
          ))
        ) : (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No entries yet</h3>
              <p className="text-gray-400 mb-4">Start your journaling journey today.</p>
              <Button onClick={() => navigate('/journal')}>
                Write Your First Entry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  return (
    <PageLayout title="Journal History" subtitle="Your personal growth journey">
      {content}
    </PageLayout>
  );
};

export default JournalHistory;
