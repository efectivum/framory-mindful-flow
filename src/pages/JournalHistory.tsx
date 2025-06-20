
import { useState } from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalEntryAnalysis } from '@/hooks/useJournalEntryAnalysis';
import { useJournalFiltering } from '@/hooks/useJournalFiltering';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { JournalFilterDropdown } from '@/components/JournalFilterDropdown';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { AnalysisStatusButton } from '@/components/AnalysisStatusButton';
import { LoadingCard } from '@/components/ui/loading-card';

const JournalHistory = () => {
  const { entries, isLoading, triggerMissingAnalysis } = useJournalEntries();
  const { isAnalyzing, analysisError } = useJournalEntryAnalysis();
  
  const {
    filters,
    filteredEntries,
    availableTags,
    availableEmotions,
    updateFilter,
    clearAllFilters,
    activeFilterCount,
  } = useJournalFiltering(entries);

  // Calculate entries needing analysis
  const entriesNeedingAnalysis = entries.filter(entry => {
    const wordCount = entry.content.trim().split(' ').length;
    return wordCount >= 50 && !entry.ai_detected_emotions && !entry.ai_detected_mood;
  }).length;

  if (isLoading) {
    return (
      <ResponsiveLayout title="Journal History" subtitle="Loading your entries...">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} className="h-48" />
          ))}
        </div>
      </ResponsiveLayout>
    );
  }

  const getSubtitle = () => {
    const totalCount = entries.length;
    const filteredCount = filteredEntries.length;
    
    if (activeFilterCount === 0) {
      return `${totalCount} entries total`;
    } else {
      return `${filteredCount} of ${totalCount} entries`;
    }
  };

  return (
    <ResponsiveLayout 
      title="Journal History" 
      subtitle={getSubtitle()}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with Analysis Status and Filter */}
        <div className="flex items-center justify-between mb-6">
          <AnalysisStatusButton
            onTriggerAnalysis={triggerMissingAnalysis}
            isAnalyzing={isAnalyzing}
            hasAnalysisError={!!analysisError}
            entriesNeedingAnalysis={entriesNeedingAnalysis}
          />
          
          <JournalFilterDropdown
            filters={filters}
            availableTags={availableTags}
            availableEmotions={availableEmotions}
            activeFilterCount={activeFilterCount}
            onFilterChange={updateFilter}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <div className="mb-4 p-3 bg-gray-800/20 border border-gray-700/30 rounded-lg">
            <div className="flex flex-wrap gap-2 text-sm text-gray-300">
              <span className="text-gray-400">Active filters:</span>
              {filters.status !== 'all' && (
                <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">
                  Status: {filters.status}
                </span>
              )}
              {filters.dateFilter !== 'all' && (
                <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded-full text-xs">
                  Date: {filters.dateFilter}
                </span>
              )}
              {filters.selectedTags.length > 0 && (
                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs">
                  {filters.selectedTags.length} tag{filters.selectedTags.length > 1 ? 's' : ''}
                </span>
              )}
              {filters.selectedEmotions.length > 0 && (
                <span className="px-2 py-1 bg-orange-600/20 text-orange-300 rounded-full text-xs">
                  {filters.selectedEmotions.length} emotion{filters.selectedEmotions.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            {entries.length === 0 ? (
              <>
                <h3 className="text-lg font-semibold text-white mb-2">No entries yet</h3>
                <p className="text-gray-400">Start writing your first journal entry to see it here.</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-white mb-2">No entries match your filters</h3>
                <p className="text-gray-400">Try adjusting your filters to see more entries.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default JournalHistory;
