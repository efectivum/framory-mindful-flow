
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { JournalEntry } from '@/hooks/useJournalEntries';

interface JournalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: JournalEntry[];
}

export const JournalSearchModal = ({
  isOpen,
  onClose,
  entries,
  searchQuery,
  onSearchChange,
  searchResults,
}: JournalSearchModalProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const delayedUpdate = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);

    return () => clearTimeout(delayedUpdate);
  }, [localQuery, onSearchChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-gray-700 text-white p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search your journal entries..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {localQuery.trim() === '' ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Search your journal</h3>
              <p className="text-gray-500">Start typing to find entries by content, title, tags, or emotions</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-300 mb-2">No results found</h3>
              <p className="text-gray-500">Try different keywords or check your spelling</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-400 mb-4">
                Found {searchResults.length} {searchResults.length === 1 ? 'entry' : 'entries'}
              </div>
              {searchResults.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
