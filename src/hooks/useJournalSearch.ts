
import { useState, useMemo, useCallback } from 'react';
import { JournalEntry } from '@/hooks/useJournalEntries';

export const useJournalSearch = (entries: JournalEntry[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Search entries based on content, title, and tags - now more comprehensive
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return entries;

    const query = searchQuery.toLowerCase().trim();
    const searchTerms = query.split(' ').filter(term => term.length > 0);
    
    return entries.filter(entry => {
      const searchableText = [
        entry.content,
        entry.title || '',
        ...(entry.tags || []),
        ...(entry.ai_detected_emotions || [])
      ].join(' ').toLowerCase();
      
      // Match if ANY search term is found
      return searchTerms.some(term => searchableText.includes(term));
    });
  }, [entries, searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchActive(false);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    searchResults,
    isSearchActive,
    setIsSearchActive,
    clearSearch,
    hasResults: searchResults.length > 0,
    resultCount: searchResults.length,
  };
};
