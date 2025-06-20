
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { JournalEntrySummary } from '@/components/JournalEntrySummary';
import { CleanMoodDisplay } from '@/components/CleanMoodDisplay';
import { CleanEmotionDisplay } from '@/components/CleanEmotionDisplay';
import { Brain, FileText, Archive } from 'lucide-react';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export const JournalEntryCard = ({ entry }: JournalEntryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/journal/entry/${entry.id}`);
  };

  // Determine entry status
  const getEntryStatus = () => {
    if (entry.deleted_at) return 'archived';
    
    const wordCount = entry.content.trim().split(' ').length;
    if (wordCount < 50) return 'draft';
    
    if (entry.ai_detected_emotions || entry.ai_detected_mood) return 'analyzed';
    
    return 'pending';
  };

  const status = getEntryStatus();

  const getStatusBadge = () => {
    switch (status) {
      case 'analyzed':
        return (
          <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/30">
            <Brain className="w-3 h-3 mr-1" />
            Analyzed
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300 border-yellow-600/30">
            <FileText className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="secondary" className="bg-gray-600/20 text-gray-400 border-gray-600/30">
            <Archive className="w-3 h-3 mr-1" />
            Archived
          </Badge>
        );
      default:
        return null;
    }
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
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}</span>
              {getStatusBadge()}
            </div>
          </div>
          
          {/* Clean mood indicator in corner */}
          <CleanMoodDisplay entry={entry} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Key Points Summary - Now properly extracts key insights */}
        <JournalEntrySummary entry={entry} maxLength={140} />
        
        {/* Clean emotion display - max 3 emotions */}
        <CleanEmotionDisplay entry={entry} />
        
        {/* Tags display */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs bg-gray-700/30 border-gray-600/50 text-gray-300"
              >
                {tag}
              </Badge>
            ))}
            {entry.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-gray-700/30 border-gray-600/50 text-gray-400"
              >
                +{entry.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
