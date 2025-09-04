
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Brain, 
  BarChart3,
  Filter
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MoodTrendChart } from './MoodTrendChart';
import { GoalProgressVisualization } from './GoalProgressVisualization';
import { PersonalityRadarChart } from './PersonalityRadarChart';
import { EnhancedEmotionAnalysis } from './EnhancedEmotionAnalysis';

export const AdvancedInsights: React.FC = () => {
  const [timeRange, setTimeRange] = useState<30 | 90 | 365>(30);
  const {
    moodTrends,
    emotionAnalysis,
    goalProgress,
    personalityInsights,
    weeklyInsights,
    totalEntries,
    currentStreak
  } = useAnalytics(timeRange);

  const timeRangeOptions = [
    { value: 30, label: '30 days' },
    { value: 90, label: '3 months' },
    { value: 365, label: '1 year' }
  ];

  return (
    <div className="mobile-flow-loose">
      {/* Header with Time Range Selector */}
      <div className="mobile-flex mobile-flex-between mobile-flex-wrap mobile-gap-md">
        <div className="mobile-flow-tight">
          <h2 className="mobile-h1 text-foreground">Advanced Analytics</h2>
          <p className="mobile-text-base text-muted-foreground">Deep insights from your journaling data</p>
        </div>
        <div className="mobile-flex mobile-flex-center mobile-gap-sm">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="mobile-flex mobile-gap-xs">
            {timeRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(option.value as 30 | 90 | 365)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mobile-admin-grid-1 mobile-admin-grid-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary-variant/10 border-border/50">
          <CardContent className="mobile-card-content">
            <div className="mobile-flex mobile-flex-center mobile-gap-md">
              <BarChart3 className="w-8 h-8 text-primary" />
              <div className="mobile-flow-tight">
                <div className="mobile-h2 text-foreground">{totalEntries}</div>
                <div className="mobile-text-xs text-muted-foreground">Total Entries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success-variant/10 border-border/50">
          <CardContent className="mobile-card-content">
            <div className="mobile-flex mobile-flex-center mobile-gap-md">
              <Calendar className="w-8 h-8 text-success" />
              <div className="mobile-flow-tight">
                <div className="mobile-h2 text-foreground">{currentStreak}</div>
                <div className="mobile-text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent-variant/10 border-border/50">
          <CardContent className="mobile-card-content">
            <div className="mobile-flex mobile-flex-center mobile-gap-md">
              <Target className="w-8 h-8 text-accent" />
              <div className="mobile-flow-tight">
                <div className="mobile-h2 text-foreground">{goalProgress.length}</div>
                <div className="mobile-text-xs text-muted-foreground">Active Goals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning-variant/10 border-border/50">
          <CardContent className="mobile-card-content">
            <div className="mobile-flex mobile-flex-center mobile-gap-md">
              <Brain className="w-8 h-8 text-warning" />
              <div className="mobile-flow-tight">
                <div className="mobile-h2 text-foreground">
                  {weeklyInsights.entriesThisWeek}
                </div>
                <div className="mobile-text-xs text-muted-foreground">This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="mood" className="mobile-flow-lg">
        <TabsList className="mobile-admin-grid-4 bg-card/50">
          <TabsTrigger value="mood" className="data-[state=active]:bg-primary">
            Mood Trends
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-primary">
            Goal Progress
          </TabsTrigger>
          <TabsTrigger value="emotions" className="data-[state=active]:bg-primary">
            Emotions
          </TabsTrigger>
          <TabsTrigger value="personality" className="data-[state=active]:bg-primary">
            Personality
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mood" className="mobile-flow-lg">
          <MoodTrendChart data={moodTrends} timeRange={timeRange} />
          
          {weeklyInsights.moodImprovement !== 0 && (
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="mobile-card-content">
                <div className="mobile-flex mobile-flex-center mobile-gap-md">
                  <TrendingUp className={`w-5 h-5 ${
                    weeklyInsights.moodImprovement > 0 ? 'text-success' : 'text-destructive'
                  }`} />
                  <div className="mobile-flow-tight">
                    <div className="text-foreground font-medium">
                      {weeklyInsights.moodImprovement > 0 ? 'Mood Improving' : 'Mood Declining'}
                    </div>
                    <div className="text-muted-foreground mobile-text-sm">
                      {Math.abs(weeklyInsights.moodImprovement).toFixed(1)} point change this week
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <GoalProgressVisualization goals={goalProgress} />
        </TabsContent>

        <TabsContent value="emotions" className="mobile-flow-lg">
          <EnhancedEmotionAnalysis emotions={emotionAnalysis} />
          
          {Object.keys(weeklyInsights.topEmotionsThisWeek).length > 0 && (
            <Card className="mobile-card bg-card/50 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="mobile-text-primary mobile-text-lg">This Week's Emotional Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mobile-flex mobile-flex-wrap mobile-gap-sm">
                  {Object.entries(weeklyInsights.topEmotionsThisWeek)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([emotion, count]) => (
                      <Badge key={emotion} variant="outline" className="mobile-text-primary border-primary/30">
                        {emotion} ({count})
                      </Badge>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="personality" className="mobile-flow-lg">
          <PersonalityRadarChart insights={personalityInsights} />
          
          {personalityInsights && (
            <Card className="mobile-card bg-card/50 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="mobile-text-primary mobile-text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="mobile-flow-md">
                <div className="mobile-admin-grid-1 mobile-admin-grid-2 mobile-gap-lg">
                  <div className="mobile-flow-tight">
                    <div className="mobile-text-sm mobile-text-muted">Strongest Traits</div>
                    <div className="mobile-flow-xs">
                      {Object.entries(personalityInsights)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([trait, score]) => (
                          <div key={trait} className="mobile-flex mobile-flex-between">
                            <span className="mobile-text-muted capitalize">
                              {trait.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="mobile-text-primary font-medium">{score}/100</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  
                  <div className="mobile-flow-tight">
                    <div className="mobile-text-sm mobile-text-muted">Growth Areas</div>
                    <div className="mobile-flow-xs">
                      {Object.entries(personalityInsights)
                        .sort(([,a], [,b]) => a - b)
                        .slice(0, 2)
                        .map(([trait, score]) => (
                          <div key={trait} className="mobile-flex mobile-flex-between">
                            <span className="mobile-text-muted capitalize">
                              {trait.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="mobile-text-primary font-medium">{score}/100</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
