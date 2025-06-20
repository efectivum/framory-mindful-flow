
import { useState, useMemo } from 'react';
import { JournalEntry } from '@/hooks/useJournalEntries';

export const useJournalSearch = (entries: JournalEntry[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Search entries based on content, title, and tags
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return entries;

    const query = searchQuery.toLowerCase();
    return entries.filter(entry => {
      // Search in content
      if (entry.content.toLowerCase().includes(query)) return true;
      
      // Search in title
      if (entry.title?.toLowerCase().includes(query)) return true;
      
      // Search in tags
      if (entry.tags?.some(tag => tag.toLowerCase().includes(query))) return true;
      
      // Search in detected emotions
      if (entry.ai_detected_emotions?.some(emotion => emotion.toLowerCase().includes(query))) return true;
      
      return false;
    });
  }, [entries, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearchActive,
    setIsSearchActive,
    clearSearch,
    hasResults: searchResults.length > 0,
    resultCount: searchResults.length,
  };
};
