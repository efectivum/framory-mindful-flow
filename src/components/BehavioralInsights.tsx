
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserBehaviors } from '@/hooks/useUserBehaviors';
import { Brain, Clock, TrendingUp, Target } from 'lucide-react';

export const BehavioralInsights: React.FC = () => {
  const { insights, getOptimalPromptTime, getMotivationStyle, getRecommendedEntryLength } = useUserBehaviors();

  if (insights.dataRichness === 'minimal') {
    return (
      <Card className="bg-card/50 border-border">
        <CardContent className="mobile-card-content">
          <div className="mobile-flex mobile-flex-center mobile-gap-sm text-muted-foreground">
            <Brain className="w-4 h-4" />
            <span className="mobile-text-sm">Keep journaling to unlock behavioral insights!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/20">
      <CardHeader>
        <CardTitle className="text-foreground mobile-flex mobile-flex-center mobile-gap-sm">
          <Brain className="w-5 h-5 text-accent" />
          Your Behavioral Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="mobile-flow">
        {/* Writing Patterns */}
        <div className="mobile-flow-tight">
          <div className="mobile-flex mobile-flex-center mobile-gap-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="mobile-text-sm font-medium text-foreground">Writing Patterns</span>
          </div>
          <div className="mobile-flex mobile-gap-sm mobile-flex-wrap">
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {insights.preferredWritingTime} writer
            </Badge>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {insights.writingConsistency} consistency
            </Badge>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              ~{insights.averageEntryLength} words avg
            </Badge>
          </div>
        </div>

        {/* Mood Patterns */}
        <div className="mobile-flow-tight">
          <div className="mobile-flex mobile-flex-center mobile-gap-sm">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="mobile-text-sm font-medium text-foreground">Emotional Patterns</span>
          </div>
          <div className="mobile-flex mobile-gap-sm mobile-flex-wrap">
            <Badge variant="secondary" className="bg-success/20 text-success">
              {insights.moodTrend} mood trend
            </Badge>
            <Badge variant="secondary" className="bg-success/20 text-success">
              {insights.emotionalComplexity} emotions
            </Badge>
            <Badge variant="secondary" className="bg-success/20 text-success">
              {insights.moodVolatility} volatility
            </Badge>
          </div>
        </div>

        {/* Growth Indicators */}
        <div className="mobile-flow-tight">
          <div className="mobile-flex mobile-flex-center mobile-gap-sm">
            <Target className="w-4 h-4 text-warning" />
            <span className="mobile-text-sm font-medium text-foreground">Growth Indicators</span>
          </div>
          <div className="mobile-flex mobile-gap-sm mobile-flex-wrap">
            <Badge variant="secondary" className="bg-warning/20 text-warning">
              {insights.reflectionDepth} reflection
            </Badge>
            <Badge variant="secondary" className="bg-warning/20 text-warning">
              {insights.selfAwarenessLevel} self-awareness
            </Badge>
            <Badge variant="secondary" className="bg-warning/20 text-warning">
              {Math.round(insights.growthMindsetIndicators * 100)}% growth mindset
            </Badge>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-card/50 rounded-lg mobile-card-content mobile-flow-tight">
          <h4 className="mobile-text-sm font-medium text-foreground">Personalization Insights</h4>
          <div className="mobile-flow-tight mobile-text-xs text-muted-foreground">
            <div>• Optimal prompt time: <span className="text-accent">{getOptimalPromptTime()}</span></div>
            <div>• Motivation style: <span className="text-accent">{getMotivationStyle()}</span></div>
            <div>• Recommended length: <span className="text-accent">{getRecommendedEntryLength()}</span></div>
            <div>• Data richness: <span className="text-accent">{insights.dataRichness}</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
