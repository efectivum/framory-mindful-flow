
import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';

const JournalHistory = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const emotionFilter = searchParams.get('emotion');
  const { entries, isLoading, stats } = useJournalEntries();

  const filteredEntries = useMemo(() => {
    if (!emotionFilter) return entries;
    
    return entries.filter(entry => 
      entry.ai_detected_emotions?.some(emotion => 
        emotion.toLowerCase() === emotionFilter.toLowerCase()
      )
    );
  }, [entries, emotionFilter]);

  const clearFilter = () => {
    setSearchParams({});
  };

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
          <h1 className="text-2xl font-bold text-white">
            {emotionFilter ? `${emotionFilter} Entries` : 'Your Entries'}
          </h1>
          <p className="text-gray-400">
            {filteredEntries.length} of {stats.totalCount} entries
            {emotionFilter && ` containing "${emotionFilter}"`}
          </p>
        </div>
      </div>

      {/* Emotion Filter Badge */}
      {emotionFilter && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-900/50 border-blue-700/50 text-blue-200">
            <span className="capitalize">{emotionFilter}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilter}
              className="ml-2 h-4 w-4 p-0 hover:bg-blue-800/50"
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
          <span className="text-gray-400 text-sm">
            Showing entries with this emotion
          </span>
        </div>
      )}

      {/* Stats */}
      {!emotionFilter && (
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
      )}

      {/* Entries */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">Loading entries...</div>
        ) : filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <JournalEntryCard 
              key={entry.id} 
              entry={entry} 
            />
          ))
        ) : emotionFilter ? (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No entries found with "{emotionFilter}"
              </h3>
              <p className="text-gray-400 mb-4">
                Try writing about this emotion or explore other feelings.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={clearFilter}>
                  View All Entries
                </Button>
                <Button onClick={() => navigate('/journal')}>
                  Write New Entry
                </Button>
              </div>
            </CardContent>
          </Card>
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

  // Use ResponsiveLayout always
  return (
    <ResponsiveLayout 
      title={emotionFilter ? `${emotionFilter} Journal Entries` : "Journal History"} 
      subtitle={emotionFilter ? `Exploring your ${emotionFilter} experiences` : "Your personal growth journey"}
    >
      {content}
    </ResponsiveLayout>
  );
};

export default JournalHistory;
