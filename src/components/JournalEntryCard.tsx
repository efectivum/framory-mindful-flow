
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { JournalEntrySummary } from '@/components/JournalEntrySummary';
import { CleanMoodDisplay } from '@/components/CleanMoodDisplay';
import { CleanEmotionDisplay } from '@/components/CleanEmotionDisplay';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export const JournalEntryCard = ({ entry }: JournalEntryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/journal/entry/${entry.id}`);
  };

  return (
    <Card 
      className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-200 cursor-pointer group hover:border-gray-600/50"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {entry.title && (
              <h3 className="text-lg font-medium text-white mb-1 group-hover:text-blue-300 transition-colors truncate">
                {entry.title}
              </h3>
            )}
            <div className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
            </div>
          </div>
          
          {/* Clean mood indicator in corner */}
          <CleanMoodDisplay entry={entry} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Content summary */}
        <JournalEntrySummary entry={entry} maxLength={140} />
        
        {/* Clean emotion display - max 3 emotions */}
        <CleanEmotionDisplay entry={entry} />
      </CardContent>
    </Card>
  );
};
