
import { useState } from 'react';
import { RotateCcw, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useJournalRecovery } from '@/hooks/useJournalRecovery';
import { formatDistanceToNow } from 'date-fns';

export const RecoveryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { deletedEntries, isLoading, restoreEntry, permanentlyDelete, isRestoring, isDeleting } = useJournalRecovery();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Recently Deleted
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-white">Recently Deleted Entries</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Loading deleted entries...</div>
          ) : !deletedEntries || deletedEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No deleted entries found. Deleted entries are kept for 30 days.
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {deletedEntries.map((entry) => (
                  <div key={entry.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {entry.title && (
                          <h3 className="text-white font-medium truncate mb-1">
                            {entry.title}
                          </h3>
                        )}
                        <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                          {entry.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                          </span>
                          <span>
                            Deleted {formatDistanceToNow(new Date(entry.deleted_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => restoreEntry(entry.id)}
                          disabled={isRestoring}
                          className="text-green-400 border-green-400/50 hover:bg-green-400/10"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => permanentlyDelete(entry.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete Forever
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
            <p className="text-yellow-300 text-sm">
              💡 Deleted entries are automatically removed after 30 days. 
              Restore important entries before they're permanently deleted.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
