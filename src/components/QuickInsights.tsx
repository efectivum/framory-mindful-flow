
import { useState } from 'react';
import { Brain, MessageCircle, Sparkles, TrendingUp } from 'lucide-react';
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
  const { isPremium, isBeta } = useSubscription();

  // AI insights are premium-only
  if (!isPremium && !isBeta) {
    return (
      <PremiumGate
        feature="AI Analysis"
        description="Get instant AI-powered insights and takeaways from your journal entries."
        className="mt-4"
      />
    );
  }

  // Content length check for smart analysis
  const wordCount = entry.content.trim().split(' ').length;
  const shouldShowAnalysis = wordCount >= 50; // Minimum threshold for meaningful analysis

  if (!shouldShowAnalysis) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Brain className="w-4 h-4" />
        <span>Entry too short for analysis (minimum 50 words)</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <InlineLoading 
        message="Analyzing insights..." 
        className="text-gray-400 text-sm"
      />
    );
  }

  // Show mood analysis even without quick analysis
  const hasAIData = entry.ai_detected_emotions || entry.ai_detected_mood || analysis;

  if (!hasAIData) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Brain className="w-4 h-4" />
        <span>Analysis in progress...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Clean Emotion Display - Only show top 5 emotions */}
      {entry.ai_detected_emotions && entry.ai_detected_emotions.length > 0 && (
        <div className="space-y-2">
          <div className="text-purple-300 text-sm font-medium">Emotions Detected</div>
          <div className="flex gap-2 flex-wrap">
            {entry.ai_detected_emotions.slice(0, 5).map((emotion, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full text-sm"
              >
                {emotion}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Mood Analysis */}
      {entry.ai_detected_mood && (
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-green-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-green-300 text-sm font-medium mb-1">Mood Rating</div>
            <div className="text-gray-300 text-sm">
              {entry.ai_detected_mood}/5
              {entry.ai_confidence_level && (
                <span className="text-gray-400 ml-2">
                  ({Math.round(entry.ai_confidence_level * 100)}% confidence)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Concise Key Insights - Max 3 for clean display */}
      {analysis?.quick_takeaways && analysis.quick_takeaways.length > 0 && (
        <div className="flex items-start gap-2">
          <Brain className="w-4 h-4 text-blue-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-blue-300 text-sm font-medium mb-2">Key Insights</div>
            <div className="space-y-2">
              {analysis.quick_takeaways.slice(0, 3).map((takeaway, index) => (
                <div key={index} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-blue-400 text-xs mt-1">•</span>
                  <span className="leading-relaxed">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Growth Indicators - Max 2 for clean display */}
      {analysis?.growth_indicators && analysis.growth_indicators.length > 0 && (
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-green-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-green-300 text-sm font-medium mb-2">Growth Signals</div>
            <div className="space-y-1">
              {analysis.growth_indicators.slice(0, 2).map((indicator, index) => (
                <div key={index} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-green-400 text-xs mt-1">✨</span>
                  <span>{indicator}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Go Deeper Button - Only for substantial content */}
      {wordCount >= 100 && (
        <div className="pt-2 border-t border-gray-600">
          <Button
            onClick={() => setShowDeepReflection(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-8 px-4"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Go Deeper
          </Button>
        </div>
      )}

      {/* Deep Reflection Modal */}
      <DeepReflectionModal
        open={showDeepReflection}
        onClose={() => setShowDeepReflection(false)}
        entry={entry}
      />
    </div>
  );
};
