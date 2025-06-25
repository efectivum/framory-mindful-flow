import React, { useState } from 'react';
import { Plus, Search, Mic, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalFiltering } from '@/hooks/useJournalFiltering';
import { useJournalSearch } from '@/hooks/useJournalSearch';
import { useMobileModal } from '@/hooks/useMobileModal';
import { FocusedWritingMode } from '@/components/FocusedWritingMode';
import { MoodCaptureStep } from '@/components/MoodCaptureStep';
import { VoiceRecordingModal } from '@/components/VoiceRecordingModal';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { JournalFilterDropdown } from '@/components/JournalFilterDropdown';
import { JournalSearchBar } from '@/components/JournalSearchBar';
import { AnalysisStatusButton } from '@/components/AnalysisStatusButton';
import { LoadingCard } from '@/components/ui/loading-card';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

type FlowState = 'writing' | 'mood-capture' | 'closed';

const Journal = () => {
  const navigate = useNavigate();
  const { entries, createEntry, isCreating, isLoading, stats, triggerMissingAnalysis } = useJournalEntries();
  const { isModalOpen, openModal, closeModal } = useMobileModal();
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [flowState, setFlowState] = useState<FlowState>('closed');
  const [initialContent, setInitialContent] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

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

  const prompts = [
    "What am I grateful for today?",
    "How am I feeling right now?",
    "What did I learn today?",
    "What challenged me today?",
  ];

  const handleSaveEntry = async (content: string, mood?: number) => {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        createEntry(
          { content, mood_after: mood },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error)
          }
        );
      });
      
      setFlowState('closed');
      closeModal();
      // Navigate to the new entry
      navigate(`/journal/entry/${result.id}`);
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    console.log('Voice transcription received:', text);
    setIsVoiceMode(false);
    setInitialContent(text);
    setFlowState('writing');
    openModal();
  };

  const handlePromptClick = (prompt: string) => {
    setInitialContent(prompt + '\n\n');
    setFlowState('writing');
    openModal();
  };

  const handleStartWriting = () => {
    setInitialContent('');
    setFlowState('writing');
    openModal();
  };

  const handleFinish = (content: string) => {
    setEntryContent(content);
    setFlowState('mood-capture');
  };

  const handleMoodSelect = (mood?: number) => {
    handleSaveEntry(entryContent, mood);
  };

  const handleMoodSkip = () => {
    handleSaveEntry(entryContent);
  };

  const handleCloseAll = () => {
    setFlowState('closed');
    closeModal();
    setInitialContent('');
    setEntryContent('');
  };

  const handleSearchOpen = () => {
    setIsSearchActive(true);
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
    clearSearch();
  };

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

  return (
    <ResponsiveLayout 
      title="My Journal" 
      subtitle={getSubtitle()}
      hideBottomNav={isModalOpen}
    >
      <div className="max-w-4xl mx-auto space-y-6">
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

        {/* Hero Section - New Entry */}
        {!isSearchActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Quick Stats */}
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm shadow-lg rounded-2xl">
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

            {/* Primary Action - New Entry */}
            <Button 
              onClick={handleStartWriting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] mb-6"
              disabled={isCreating}
            >
              <Plus className="w-6 h-6 mr-3" />
              Write New Entry
            </Button>

            {/* Voice Recording Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => setIsVoiceMode(true)}
                variant="outline"
                className="bg-gray-800/40 border-gray-700/50 hover:bg-gray-700/50 text-gray-300 px-6 py-3 rounded-xl"
                disabled={isCreating}
              >
                <Mic className="w-5 h-5 mr-2" />
                Voice Note
              </Button>
            </div>

            {/* Writing Prompts */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm">Need inspiration?</span>
              </div>
              
              <div className="grid gap-2">
                {prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left p-3 bg-gray-800/20 hover:bg-gray-800/40 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all group min-h-[44px] touch-manipulation"
                  >
                    <span className="text-gray-300 group-hover:text-white text-sm">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filter Controls */}
        {!isSearchActive && (
          <div className="flex items-center justify-between">
            <AnalysisStatusButton
              onTriggerAnalysis={triggerMissingAnalysis}
              isAnalyzing={false}
              hasAnalysisError={false}
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
          <div className="p-3 bg-gray-800/20 border border-gray-700/30 rounded-lg">
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
          <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
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
                  onClick={handleStartWriting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
                  disabled={isCreating}
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

        {/* Focused Writing Mode */}
        <FocusedWritingMode
          isOpen={flowState === 'writing'}
          onClose={handleCloseAll}
          onFinish={handleFinish}
          onGoDeeper={handleFinish} // Simplified to just finish for now
          initialContent={initialContent}
        />

        {/* Mood Capture Step */}
        <MoodCaptureStep
          isVisible={flowState === 'mood-capture'}
          onMoodSelect={handleMoodSelect}
          onSkip={handleMoodSkip}
        />

        {/* Voice Recording Modal */}
        <VoiceRecordingModal
          open={isVoiceMode}
          onClose={() => setIsVoiceMode(false)}
          onTranscriptionComplete={handleVoiceTranscription}
        />
      </div>
    </ResponsiveLayout>
  );
};

export default Journal;
