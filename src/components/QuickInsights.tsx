
import { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, Sparkles, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuickAnalysis } from '@/hooks/useQuickAnalysis';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickInsightsProps {
  entry: JournalEntry;
}

export const QuickInsights = ({ entry }: QuickInsightsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getQuickAnalysis, generateQuickAnalysis, isGenerating } = useQuickAnalysis();
  const { data: analysis, isLoading } = getQuickAnalysis(entry.id);

  const handleGenerateAnalysis = () => {
    generateQuickAnalysis(entry);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Brain className="w-4 h-4 animate-pulse" />
        <span>Loading insights...</span>
      </div>
    );
  }

  if (!analysis) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleGenerateAnalysis}
        disabled={isGenerating}
        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
      >
        <Brain className="w-4 h-4 mr-1" />
        {isGenerating ? 'Analyzing...' : 'Generate AI Insights'}
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quick Takeaways Preview */}
      <div className="flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-purple-400 mt-0.5" />
        <div className="flex-1">
          <div className="text-purple-300 text-sm font-medium mb-1">Quick Takeaways:</div>
          <div className="text-gray-300 text-sm">
            {analysis.quick_takeaways[0]}
            {analysis.quick_takeaways.length > 1 && !isExpanded && (
              <span className="text-gray-500"> and {analysis.quick_takeaways.length - 1} more...</span>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white p-1 h-auto"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Expanded Analysis */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-700/30 border-gray-600">
              <CardContent className="p-4 space-y-4">
                {/* All Takeaways */}
                {analysis.quick_takeaways.length > 1 && (
                  <div>
                    <h5 className="text-purple-300 font-medium mb-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Key Takeaways
                    </h5>
                    <div className="space-y-1">
                      {analysis.quick_takeaways.map((takeaway, index) => (
                        <div key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-purple-400 text-xs mt-1">•</span>
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emotional Insights */}
                {analysis.emotional_insights && analysis.emotional_insights.length > 0 && (
                  <div>
                    <h5 className="text-blue-300 font-medium mb-2">Emotional Insights</h5>
                    <div className="space-y-1">
                      {analysis.emotional_insights.map((insight, index) => (
                        <div key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-blue-400 text-xs mt-1">💙</span>
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Growth Indicators */}
                {analysis.growth_indicators && analysis.growth_indicators.length > 0 && (
                  <div>
                    <h5 className="text-green-300 font-medium mb-2 flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Growth Signals
                    </h5>
                    <div className="space-y-1">
                      {analysis.growth_indicators.map((indicator, index) => (
                        <div key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-green-400 text-xs mt-1">🌱</span>
                          <span>{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Suggestions */}
                {analysis.action_suggestions && analysis.action_suggestions.length > 0 && (
                  <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <h5 className="text-indigo-300 font-medium mb-2 flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" />
                      Suggested Actions
                    </h5>
                    <div className="space-y-1">
                      {analysis.action_suggestions.map((suggestion, index) => (
                        <div key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-indigo-400 text-xs mt-1">→</span>
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence Score */}
                {analysis.confidence_score && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">AI Confidence</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(analysis.confidence_score * 100)}%
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
