
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface JournalSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  resultCount?: number;
}

export const JournalSearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onClose,
  resultCount 
}: JournalSearchBarProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700/50 p-4 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search your journal entries..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
          autoFocus
        />
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {searchQuery.trim() && (
        <div className="text-xs text-gray-400 mt-2">
          {resultCount === 0 ? 'No results found' : `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`}
        </div>
      )}
    </div>
  );
};
