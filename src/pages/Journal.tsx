
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, Mic, Calendar as CalendarIcon, BookOpen, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { CreateJournalDialog } from '@/components/CreateJournalDialog';
import { JournalSearchModal } from '@/components/JournalSearchModal';
import { JournalFilterDropdown } from '@/components/JournalFilterDropdown';
import { VoiceRecordingModal } from '@/components/VoiceRecordingModal';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalFiltering } from '@/hooks/useJournalFiltering';
import { useJournalSearch } from '@/hooks/useJournalSearch';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { QuickAI } from '@/components/QuickAI';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';

const Journal = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { greeting } = useTimeOfDay();

  const { entries, isLoading } = useJournalEntries();
  const {
    filters,
    filteredEntries,
    updateFilter,
    clearAllFilters,
    activeFilterCount
  } = useJournalFiltering(entries);

  const {
    searchQuery,
    searchResults,
    isSearchActive,
    setSearchQuery,
    clearSearch
  } = useJournalSearch(entries);

  const displayEntries = searchQuery ? searchResults : filteredEntries;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleVoiceComplete = (transcript: string) => {
    setShowVoiceModal(false);
    setShowCreateDialog(true);
  };

  if (entries.length === 0 && !isLoading) {
    return (
      <ResponsiveLayout title="Journal" subtitle="Your personal sanctuary for reflection">
        <NetworkStatusIndicator />
        <div className="app-content-flow">
          {/* Enhanced Welcome Section */}
          <div className="text-center space-y-6 pt-6">
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-breathe app-card-organic" 
                 style={{ background: 'var(--app-accent-primary)' }}>
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-hero mb-4">
                {greeting}
              </h1>
              <p className="text-subhero max-w-2xl mx-auto">
                Welcome to your personal sanctuary. Start your journey of self-discovery by writing your first entry.
              </p>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <ButtonErrorBoundary fallbackMessage="Journal actions are not available">
            <div className="space-y-4">
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="btn-organic w-full h-16 text-lg font-semibold glow-primary"
              >
                <Plus className="w-6 h-6 mr-3" />
                Write Your First Entry
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowVoiceModal(true)}
                  className="app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white h-14 rounded-2xl border border-gray-600/30 hover:border-gray-500/40 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Voice Recording
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/coach'}
                  className="app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white h-14 rounded-2xl border border-gray-600/30 hover:border-gray-500/40 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Talk to Coach
                </Button>
              </div>
            </div>
          </ButtonErrorBoundary>

          {showCreateDialog && (
            <CreateJournalDialog 
              onClose={() => setShowCreateDialog(false)}
            />
          )}
          
          {showVoiceModal && (
            <VoiceRecordingModal
              onClose={() => setShowVoiceModal(false)}
              onTranscriptComplete={handleVoiceComplete}
            />
          )}
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Journal" subtitle={`${entries.length} entries in your sanctuary`}>
      <NetworkStatusIndicator />
      <div className="app-content-flow">
        {/* Enhanced Header Actions */}
        <ButtonErrorBoundary fallbackMessage="Journal actions are not available">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="btn-organic flex-1 h-12 glow-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Entry
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSearchModal(true)}
                className="app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white border border-gray-600/30 hover:border-gray-500/40 h-12 px-4"
              >
                <Search className="w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white border border-gray-600/30 hover:border-gray-500/40 h-12 px-4 ${activeFilterCount > 0 ? 'glow-warm' : ''}`}
              >
                <Filter className="w-5 h-5" />
                {activeFilterCount > 0 && <span className="ml-1 text-xs">•</span>}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowVoiceModal(true)}
                className="app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white border border-gray-600/30 hover:border-gray-500/40 h-12 px-4"
              >
                <Mic className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </ButtonErrorBoundary>

        {/* Enhanced Filter Section */}
        {showFilters && (
          <Card className="app-card-organic mb-6 animate-fade-in">
            <CardContent className="p-6">
              <JournalFilterDropdown
                selectedMoods={filters.moods || []}
                selectedDateRange={filters.dateRange}
                selectedTags={filters.tags || []}
                onMoodsChange={(moods) => updateFilter('moods', moods)}
                onDateRangeChange={(dateRange) => updateFilter('dateRange', dateRange)}
                onTagsChange={(tags) => updateFilter('tags', tags)}
                onClearFilters={clearAllFilters}
              />
            </CardContent>
          </Card>
        )}

        {/* Enhanced Search Results */}
        {searchQuery && (
          <Card className="app-card-organic mb-6 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-300 text-sm">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
                <Button variant="ghost" size="sm" onClick={clearSearch} className="text-gray-400 hover:text-white">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Entries Grid */}
        <div className="space-y-4">
          {displayEntries.map(entry => (
            <div key={entry.id} className="animate-fade-in">
              <JournalEntryCard entry={entry} />
            </div>
          ))}
        </div>

        {/* Enhanced Load More */}
        {isLoading && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        {/* Enhanced Quick AI */}
        <QuickAI />

        {/* Enhanced Modals */}
        {showCreateDialog && (
          <CreateJournalDialog 
            onClose={() => setShowCreateDialog(false)}
          />
        )}
        
        {showSearchModal && (
          <JournalSearchModal
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchResults={searchResults}
            isSearching={isSearchActive}
            onClose={() => setShowSearchModal(false)}
          />
        )}
        
        {showVoiceModal && (
          <VoiceRecordingModal
            onClose={() => setShowVoiceModal(false)}
            onTranscriptComplete={handleVoiceComplete}
          />
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default Journal;
