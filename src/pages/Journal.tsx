
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Mic, Calendar as CalendarIcon, BookOpen, Sparkles, ChevronDown } from 'lucide-react';
import { MobilePage, MobileContent, MobileSection } from '@/components/layouts/MobileLayout';
import { MobileCard } from '@/components/ui/MobileCard';
import { MobileButton } from '@/components/ui/MobileButton';
import { JournalEntryCard } from '@/components/JournalEntryCard';

import { JournalSearchModal } from '@/components/JournalSearchModal';
import { JournalFilterDropdown } from '@/components/JournalFilterDropdown';
import { VoiceRecordingModal } from '@/components/VoiceRecordingModal';
import { SmartSearch } from '@/components/ui/SmartSearch';
import { LoadingCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalFiltering } from '@/hooks/useJournalFiltering';
import { useJournalSearch } from '@/hooks/useJournalSearch';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { QuickAI } from '@/components/QuickAI';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';

const Journal = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { greeting } = useTimeOfDay();
  const navigate = useNavigate();

  const { entries, isLoading } = useJournalEntries();
  const {
    filters,
    filteredEntries,
    availableTags,
    availableEmotions,
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
    navigate('/journal/new', { state: { initialContent: transcript } });
  };

  const handleSmartSearch = (query: string, searchFilters: any[]) => {
    setSearchQuery(query);
    // Apply smart filters here if needed
  };

  if (entries.length === 0 && !isLoading) {
    return (
      <MobilePage>
        <MobileContent padded>
          <NetworkStatusIndicator />
          <div className="mobile-flow">
            {/* Welcome Section */}
            <MobileSection>
              <div className="mobile-stack-center">
                <div className="mobile-touch mobile-haptic" style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: 'var(--app-radius-lg)', 
                  background: 'var(--app-gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="mobile-h1">{greeting}</h1>
                  <p className="mobile-body" style={{ color: 'var(--app-text-secondary)' }}>
                    Welcome to your personal sanctuary. Start your journey of self-discovery by writing your first entry.
                  </p>
                </div>
              </div>
            </MobileSection>

            {/* Action Buttons */}
            <MobileSection>
              <div className="mobile-flow">
                <MobileButton 
                  onClick={() => navigate('/journal/new')}
                  variant="primary"
                  size="large"
                  fullWidth
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Write Your First Entry
                </MobileButton>
                
                <div className="mobile-grid-auto-fit">
                  <MobileButton
                    onClick={() => setShowVoiceModal(true)}
                    variant="secondary"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Voice Recording
                  </MobileButton>
                  
                  <MobileButton
                    onClick={() => window.location.href = '/coach'}
                    variant="secondary"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Talk to Coach
                  </MobileButton>
                </div>
              </div>
            </MobileSection>

            <VoiceRecordingModal
              open={showVoiceModal}
              onClose={() => setShowVoiceModal(false)}
              onTranscriptionComplete={handleVoiceComplete}
            />
          </div>
        </MobileContent>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <MobileContent padded>
        <NetworkStatusIndicator />
        <div className="mobile-flow">
          {/* Header Actions */}
          <MobileSection>
            <ButtonErrorBoundary fallbackMessage="Journal actions are not available">
              <div className="mobile-flex mobile-flex-row gap-3">
                <MobileButton 
                  onClick={() => navigate('/journal/new')}
                  variant="primary"
                  className="mobile-flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Entry
                </MobileButton>
                
                <MobileButton
                  onClick={() => setShowVoiceModal(true)}
                  variant="outline"
                >
                  <Mic className="w-4 h-4" />
                </MobileButton>
              </div>
            </ButtonErrorBoundary>
          </MobileSection>

          {/* Smart Search */}
          <MobileSection>
            <SmartSearch
              onSearch={handleSmartSearch}
              onClear={clearSearch}
              availableTags={availableTags}
              availableEmotions={availableEmotions}
            />
          </MobileSection>

          {/* Filter Section */}
          {showFilters && (
            <MobileSection>
              <MobileCard>
                <JournalFilterDropdown
                  filters={filters}
                  availableTags={availableTags}
                  availableEmotions={availableEmotions}
                  activeFilterCount={activeFilterCount}
                  onFilterChange={updateFilter}
                  onClearAll={clearAllFilters}
                />
              </MobileCard>
            </MobileSection>
          )}

          {/* Search Results */}
          {searchQuery && (
            <MobileSection>
              <MobileCard>
                <div className="mobile-flex mobile-flex-between">
                  <p className="mobile-body-sm" style={{ color: 'var(--app-text-secondary)' }}>
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                  <MobileButton variant="ghost" onClick={clearSearch}>
                    Clear
                  </MobileButton>
                </div>
              </MobileCard>
            </MobileSection>
          )}

          {/* Entries Grid */}
          <MobileSection>
            <div className="mobile-flow">
              {isLoading ? (
                <>
                  <LoadingCardSkeleton />
                  <LoadingCardSkeleton />
                  <LoadingCardSkeleton />
                </>
              ) : (
                displayEntries.map(entry => (
                  <JournalEntryCard key={entry.id} entry={entry} />
                ))
              )}
            </div>
          </MobileSection>

          {/* Load More */}
          {isLoading && (
            <MobileSection>
              <div ref={loadMoreRef} className="mobile-center">
                <div className="mobile-flex gap-2" style={{ color: 'var(--app-text-muted)' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--app-accent-primary)' }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ 
                    background: 'var(--app-accent-primary)', 
                    animationDelay: '0.2s' 
                  }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ 
                    background: 'var(--app-accent-primary)', 
                    animationDelay: '0.4s' 
                  }}></div>
                </div>
              </div>
            </MobileSection>
          )}

          {/* Quick AI */}
          <MobileSection>
            <QuickAI />
          </MobileSection>

          {/* Modals */}
          <JournalSearchModal
            isOpen={showSearchModal}
            onClose={() => setShowSearchModal(false)}
            entries={entries}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchResults={searchResults}
          />
          
          <VoiceRecordingModal
            open={showVoiceModal}
            onClose={() => setShowVoiceModal(false)}
            onTranscriptionComplete={handleVoiceComplete}
          />
        </div>
      </MobileContent>
    </MobilePage>
  );
};

export default Journal;
