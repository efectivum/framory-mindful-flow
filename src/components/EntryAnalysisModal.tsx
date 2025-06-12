
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, Star } from 'lucide-react';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { useJournalAnalysis, JournalEntryAnalysis } from '@/hooks/useJournalAnalysis';
import { MoodDisplay } from '@/components/MoodDisplay';
import { formatDistanceToNow } from 'date-fns';

interface EntryAnalysisModalProps {
  entry: JournalEntry | null;
  open: boolean;
  onClose: () => void;
}

export const EntryAnalysisModal = ({ entry, open, onClose }: EntryAnalysisModalProps) => {
  const { generateEntryAnalysis, isEntryLoading, entryData } = useJournalAnalysis();
  const [analysis, setAnalysis] = useState<JournalEntryAnalysis | null>(null);

  useEffect(() => {
    if (entry && open) {
      generateEntryAnalysis(entry);
    }
  }, [entry, open, generateEntryAnalysis]);

  useEffect(() => {
    if (entryData) {
      setAnalysis(entryData);
    }
  }, [entryData]);

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Entry Deep Analysis</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Entry Header */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {entry.title && (
                    <h3 className="text-lg font-semibold text-white mb-1">{entry.title}</h3>
                  )}
                  <p className="text-sm text-gray-400">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </p>
                </div>
                <MoodDisplay 
                  userMood={entry.mood_after}
                  aiMood={entry.ai_detected_mood}
                  aiEmotions={entry.ai_detected_emotions}
                  aiConfidence={entry.ai_confidence_level}
                  alignmentScore={entry.mood_alignment_score}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 whitespace-pre-wrap">{entry.content}</p>
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-3">
                  {entry.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {isEntryLoading ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <Brain className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-400">Analyzing your entry...</p>
              </CardContent>
            </Card>
          ) : analysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Insights */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.insights.map((insight, index) => (
                      <div key={index} className="p-3 bg-gray-800/30 rounded-lg">
                        <p className="text-gray-300 text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emotional Themes */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Emotional Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.emotionalThemes.map((theme, index) => (
                      <Badge key={index} variant="outline" className="text-purple-300 border-purple-500/50">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cognitive Patterns */}
              <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-600/10 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Thinking Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.cognitivePatterns.map((pattern, index) => (
                      <div key={index} className="text-gray-300 text-sm">
                        • {pattern}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Growth Suggestions */}
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Growth Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-gray-300 text-sm">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Scores */}
              <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Analysis Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Emotional Complexity</span>
                        <span className="text-white">{analysis.emotionalComplexity}/10</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${analysis.emotionalComplexity * 10}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Self-Awareness</span>
                        <span className="text-white">{analysis.selfAwareness}/10</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${analysis.selfAwareness * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Growth Indicators & Concerns */}
              <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-600/10 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Additional Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.growthIndicators.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-green-300 font-medium mb-2 flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Growth Indicators
                      </h4>
                      <div className="space-y-1">
                        {analysis.growthIndicators.map((indicator, index) => (
                          <div key={index} className="text-gray-300 text-sm">
                            • {indicator}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysis.concerns.length > 0 && (
                    <div>
                      <h4 className="text-orange-300 font-medium mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Areas for Attention
                      </h4>
                      <div className="space-y-1">
                        {analysis.concerns.map((concern, index) => (
                          <div key={index} className="text-gray-300 text-sm">
                            • {concern}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <Brain className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Click analyze to get AI insights for this entry</p>
                <Button onClick={() => entry && generateEntryAnalysis(entry)}>
                  Analyze Entry
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
