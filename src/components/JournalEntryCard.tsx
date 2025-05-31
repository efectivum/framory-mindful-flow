
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JournalEntry } from '@/hooks/useJournalEntries';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export const JournalEntryCard = ({ entry }: JournalEntryCardProps) => {
  const getMoodEmoji = (mood: number) => {
    const moodMap = {
      1: '😞',
      2: '😕',
      3: '😐',
      4: '😊',
      5: '😄',
    };
    return moodMap[mood as keyof typeof moodMap] || '';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {entry.title && (
              <h3 className="text-lg font-semibold text-white mb-1">{entry.title}</h3>
            )}
            <p className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="flex gap-2">
            {entry.mood_before && (
              <div className="text-center">
                <div className="text-lg">{getMoodEmoji(entry.mood_before)}</div>
                <div className="text-xs text-gray-400">Before</div>
              </div>
            )}
            {entry.mood_after && (
              <div className="text-center">
                <div className="text-lg">{getMoodEmoji(entry.mood_after)}</div>
                <div className="text-xs text-gray-400">After</div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-3 whitespace-pre-wrap">{entry.content}</p>
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {entry.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
