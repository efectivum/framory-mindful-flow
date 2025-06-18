
import { useState } from 'react';
import { Brain, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InlineLoading } from '@/components/ui/inline-loading';
import { useQuickAnalysis } from '@/hooks/useQuickAnalysis';
import { useSubscription } from '@/hooks/useSubscription';
import { PremiumGate } from '@/components/PremiumGate';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { DeepReflectionModal } from '@/components/DeepReflectionModal';

interface QuickInsightsProps {
  entry: JournalEntry;
}

export const QuickInsights = ({ entry }: QuickInsightsProps) => {
  const [showDeepReflection, setShowDeepReflection] = useState(false);
  const { getQuickAnalysis } = useQuickAnalysis();
  const { data: analysis, isLoading } = getQuickAnalysis(entry.id);
  const { isPremium } = useSubscription();

  if (!isPremium) {
    return (
      <PremiumGate
        feature="AI Analysis"
        description="Get instant AI-powered insights and takeaways from your journal entries."
        className="mt-4"
      />
    );
  }

  if (isLoading) {
    return (
      <InlineLoading 
        message="Loading insights..." 
        className="text-gray-400 text-sm"
      />
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Brain className="w-4 h-4" />
        <span>Analysis will appear automatically after saving</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Emotions */}
      {entry.ai_detected_emotions && entry.ai_detected_emotions.length > 0 && (
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-purple-300 text-sm font-medium mb-2">Main Emotions:</div>
            <div className="flex gap-2 flex-wrap">
              {entry.ai_detected_emotions.slice(0, 5).map((emotion, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                  {emotion}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Short Summary */}
      {analysis.quick_takeaways && analysis.quick_takeaways.length > 0 && (
        <div className="flex items-start gap-2">
          <Brain className="w-4 h-4 text-blue-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-blue-300 text-sm font-medium mb-2">Summary:</div>
            <div className="space-y-1">
              {analysis.quick_takeaways.map((takeaway, index) => (
                <div key={index} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-blue-400 text-xs mt-1">•</span>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Go Deeper Button */}
      <div className="pt-2 border-t border-gray-600">
        <Button
          onClick={() => setShowDeepReflection(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-8 px-4"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Go Deeper
        </Button>
      </div>

      {/* Deep Reflection Modal */}
      <DeepReflectionModal
        open={showDeepReflection}
        onClose={() => setShowDeepReflection(false)}
        entry={entry}
      />
    </div>
  );
};
