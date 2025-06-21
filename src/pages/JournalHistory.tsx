
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalEntryAnalysis } from '@/hooks/useJournalEntryAnalysis';
import { useJournalFiltering } from '@/hooks/useJournalFiltering';
import { useJournalSearch } from '@/hooks/useJournalSearch';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { JournalFilterDropdown } from '@/components/JournalFilterDropdown';
import { JournalSearchModal } from '@/components/JournalSearchModal';
import { JournalSearchBar } from '@/components/JournalSearchBar';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { AnalysisStatusButton } from '@/components/AnalysisStatusButton';
import { LoadingCard } from '@/components/ui/loading-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const JournalHistory = () => {
  const navigate = useNavigate();
  const { entries, isLoading, triggerMissingAnalysis, stats } = useJournalEntries();
  const { isAnalyzing, analysisError } = useJournalEntryAnalysis();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const {
    filters,
    filteredEntries,
    availableTags,
    availableEmotions,
    updateFilter,
    clearAllFilters,
    activeFilterCount,
  } = useJournalFiltering(entries);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearchActive,
    setIsSearchActive,
    clearSearch,
    resultCount,
  } = useJournalSearch(filteredEntries);

  // Calculate entries needing analysis
  const entriesNeedingAnalysis = entries.filter(entry => {
    const wordCount = entry.content.trim().split(' ').length;
    return wordCount >= 50 && !entry.ai_detected_emotions && !entry.ai_detected_mood;
  }).length;

  // Determine which entries to display
  const displayEntries = searchQuery.trim() ? searchResults : filteredEntries;

  if (isLoading) {
    return (
      <ResponsiveLayout title="My Journal" subtitle="Loading your entries...">
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
    
    if (searchQuery.trim()) {
      return `${resultCount} search results`;
    }
    
    const filteredCount = filteredEntries.length;
    
    if (activeFilterCount === 0) {
      return `${totalCount} entries total`;
    } else {
      return `${filteredCount} of ${totalCount} entries`;
    }
  };

  const handleSearchOpen = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsSearchActive(true);
    } else {
      setIsSearchModalOpen(true);
    }
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
    setIsSearchModalOpen(false);
    clearSearch();
  };

  return (
    <ResponsiveLayout 
      title="My Journal" 
      subtitle={getSubtitle()}
    >
      <div className="max-w-4xl mx-auto">
        {/* Mobile Search Bar */}
        {isSearchActive && (
          <div className="md:hidden -mx-4 mb-6">
            <JournalSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClose={handleSearchClose}
              resultCount={resultCount}
            />
          </div>
        )}

        {/* Quick Stats Card - Mobile Focused */}
        {!isSearchActive && (
          <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm shadow-lg rounded-2xl mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{stats.totalEntries}</div>
                  <div className="text-gray-400 text-xs">Total Entries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                  <div className="text-gray-400 text-xs">Day Streak</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.thisWeekEntries}</div>
                  <div className="text-gray-400 text-xs">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Entry Button - Prominent on Mobile */}
        {!isSearchActive && (
          <Button 
            onClick={() => navigate('/journal')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] mb-6"
          >
            <Plus className="w-5 h-5 mr-3" />
            Write New Entry
          </Button>
        )}

        {/* Header with Analysis Status, Search, and Filter */}
        {!isSearchActive && (
          <div className="flex items-center justify-between mb-6">
            <AnalysisStatusButton
              onTriggerAnalysis={triggerMissingAnalysis}
              isAnalyzing={isAnalyzing}
              hasAnalysisError={!!analysisError}
              entriesNeedingAnalysis={entriesNeedingAnalysis}
            />
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearchOpen}
                className="bg-gray-800/40 border-gray-700/50 hover:bg-gray-700/50 text-gray-300"
              >
                <Search className="w-4 h-4" />
              </Button>
              
              <JournalFilterDropdown
                filters={filters}
                availableTags={availableTags}
                availableEmotions={availableEmotions}
                activeFilterCount={activeFilterCount}
                onFilterChange={updateFilter}
                onClearAll={clearAllFilters}
              />
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {activeFilterCount > 0 && !isSearchActive && (
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

        {/* Search Results Info */}
        {searchQuery.trim() && (
          <div className="mb-4 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-300">
                Searching for: <strong>"{searchQuery}"</strong>
              </span>
              <button
                onClick={clearSearch}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Entries List */}
        {displayEntries.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery.trim() ? (
              <>
                <h3 className="text-lg font-semibold text-white mb-2">No search results</h3>
                <p className="text-gray-400">Try different keywords or check your spelling.</p>
              </>
            ) : entries.length === 0 ? (
              <>
                <h3 className="text-lg font-semibold text-white mb-2">Start your journaling journey</h3>
                <p className="text-gray-400 mb-6">Write your first entry to begin tracking your thoughts and growth.</p>
                <Button 
                  onClick={() => navigate('/journal')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Write First Entry
                </Button>
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
            {displayEntries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* Desktop Search Modal */}
        <JournalSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          entries={filteredEntries}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchResults={searchResults}
        />
      </div>
    </ResponsiveLayout>
  );
};

export default JournalHistory;
