
import { useState } from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalEntryAnalysis } from '@/hooks/useJournalEntryAnalysis';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { AnalysisStatusButton } from '@/components/AnalysisStatusButton';
import { LoadingCard } from '@/components/ui/loading-card';

const JournalHistory = () => {
  const { entries, isLoading, triggerMissingAnalysis } = useJournalEntries();
  const { isAnalyzing, analysisError } = useJournalEntryAnalysis();

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

  return (
    <ResponsiveLayout 
      title="Journal History" 
      subtitle={`${entries.length} entries total`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Analysis Status */}
        <AnalysisStatusButton
          onTriggerAnalysis={triggerMissingAnalysis}
          isAnalyzing={isAnalyzing}
          hasAnalysisError={!!analysisError}
          entriesNeedingAnalysis={entriesNeedingAnalysis}
        />

        {/* Entries List */}
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-white mb-2">No entries yet</h3>
            <p className="text-gray-400">Start writing your first journal entry to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default JournalHistory;
