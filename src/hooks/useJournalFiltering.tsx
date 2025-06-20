
import { useState, useMemo } from 'react';
import { JournalEntry } from '@/hooks/useJournalEntries';

export type FilterStatus = 'all' | 'analyzed' | 'drafts' | 'archived';
export type DateFilter = 'all' | 'today' | 'this-week' | 'this-month' | 'custom';

export interface JournalFilters {
  status: FilterStatus;
  dateFilter: DateFilter;
  selectedTags: string[];
  selectedEmotions: string[];
  customDateRange?: { start: Date; end: Date };
}

const initialFilters: JournalFilters = {
  status: 'all',
  dateFilter: 'all',
  selectedTags: [],
  selectedEmotions: [],
};

export const useJournalFiltering = (entries: JournalEntry[]) => {
  const [filters, setFilters] = useState<JournalFilters>(initialFilters);

  // Extract available tags and emotions from entries
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach(entry => {
      entry.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [entries]);

  const availableEmotions = useMemo(() => {
    const emotionSet = new Set<string>();
    entries.forEach(entry => {
      entry.ai_detected_emotions?.forEach(emotion => emotionSet.add(emotion));
    });
    return Array.from(emotionSet).sort();
  }, [entries]);

  // Filter entries based on current filters
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Status filter
      if (filters.status !== 'all') {
        switch (filters.status) {
          case 'analyzed':
            if (!entry.ai_detected_emotions && !entry.ai_detected_mood) return false;
            break;
          case 'drafts':
            const wordCount = entry.content.trim().split(' ').length;
            if (wordCount >= 50) return false;
            break;
          case 'archived':
            if (!entry.deleted_at) return false;
            break;
        }
      }

      // Date filter
      if (filters.dateFilter !== 'all') {
        const entryDate = new Date(entry.created_at);
        const now = new Date();
        
        switch (filters.dateFilter) {
          case 'today':
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
            if (entryDay.getTime() !== today.getTime()) return false;
            break;
          case 'this-week':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);
            if (entryDate < weekStart) return false;
            break;
          case 'this-month':
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            if (entryDate < monthStart) return false;
            break;
          case 'custom':
            if (filters.customDateRange) {
              if (entryDate < filters.customDateRange.start || entryDate > filters.customDateRange.end) return false;
            }
            break;
        }
      }

      // Tags filter
      if (filters.selectedTags.length > 0) {
        if (!entry.tags || !filters.selectedTags.some(tag => entry.tags!.includes(tag))) return false;
      }

      // Emotions filter
      if (filters.selectedEmotions.length > 0) {
        if (!entry.ai_detected_emotions || !filters.selectedEmotions.some(emotion => entry.ai_detected_emotions!.includes(emotion))) return false;
      }

      return true;
    });
  }, [entries, filters]);

  const updateFilter = (key: keyof JournalFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.dateFilter !== 'all') count++;
    if (filters.selectedTags.length > 0) count++;
    if (filters.selectedEmotions.length > 0) count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredEntries,
    availableTags,
    availableEmotions,
    updateFilter,
    clearAllFilters,
    activeFilterCount,
  };
};
