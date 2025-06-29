
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserBehaviors } from '@/hooks/useUserBehaviors';
import { Brain, Clock, TrendingUp, Target } from 'lucide-react';

export const BehavioralInsights: React.FC = () => {
  const { insights, getOptimalPromptTime, getMotivationStyle, getRecommendedEntryLength } = useUserBehaviors();

  if (insights.dataRichness === 'minimal') {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Brain className="w-4 h-4" />
            <span className="text-sm">Keep journaling to unlock behavioral insights!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Your Behavioral Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Writing Patterns */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Writing Patterns</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              {insights.preferredWritingTime} writer
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              {insights.writingConsistency} consistency
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              ~{insights.averageEntryLength} words avg
            </Badge>
          </div>
        </div>

        {/* Mood Patterns */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-gray-300">Emotional Patterns</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {insights.moodTrend} mood trend
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {insights.emotionalComplexity} emotions
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {insights.moodVolatility} volatility
            </Badge>
          </div>
        </div>

        {/* Growth Indicators */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Growth Indicators</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
              {insights.reflectionDepth} reflection
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
              {insights.selfAwarenessLevel} self-awareness
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
              {Math.round(insights.growthMindsetIndicators * 100)}% growth mindset
            </Badge>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Personalization Insights</h4>
          <div className="space-y-1 text-xs text-gray-400">
            <div>• Optimal prompt time: <span className="text-purple-300">{getOptimalPromptTime()}</span></div>
            <div>• Motivation style: <span className="text-purple-300">{getMotivationStyle()}</span></div>
            <div>• Recommended length: <span className="text-purple-300">{getRecommendedEntryLength()}</span></div>
            <div>• Data richness: <span className="text-purple-300">{insights.dataRichness}</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
