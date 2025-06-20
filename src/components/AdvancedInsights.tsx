
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
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
          <p className="text-gray-400">Deep insights from your journaling data</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1">
            {timeRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(option.value as 30 | 90 | 365)}
                className={timeRange === option.value ? 
                  "bg-blue-600 hover:bg-blue-700" : 
                  "text-gray-400 border-gray-600 hover:bg-gray-700"
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{totalEntries}</div>
                <div className="text-xs text-gray-400">Total Entries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{currentStreak}</div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{goalProgress.length}</div>
                <div className="text-xs text-gray-400">Active Goals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {weeklyInsights.entriesThisWeek}
                </div>
                <div className="text-xs text-gray-400">This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="mood" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="mood" className="data-[state=active]:bg-blue-600">
            Mood Trends
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-blue-600">
            Goal Progress
          </TabsTrigger>
          <TabsTrigger value="emotions" className="data-[state=active]:bg-blue-600">
            Emotions
          </TabsTrigger>
          <TabsTrigger value="personality" className="data-[state=active]:bg-blue-600">
            Personality
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mood" className="space-y-6">
          <MoodTrendChart data={moodTrends} timeRange={timeRange} />
          
          {weeklyInsights.moodImprovement !== 0 && (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className={`w-5 h-5 ${
                    weeklyInsights.moodImprovement > 0 ? 'text-green-400' : 'text-red-400'
                  }`} />
                  <div>
                    <div className="text-white font-medium">
                      {weeklyInsights.moodImprovement > 0 ? 'Mood Improving' : 'Mood Declining'}
                    </div>
                    <div className="text-gray-400 text-sm">
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

        <TabsContent value="emotions" className="space-y-6">
          <EnhancedEmotionAnalysis emotions={emotionAnalysis} />
          
          {Object.keys(weeklyInsights.topEmotionsThisWeek).length > 0 && (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">This Week's Emotional Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(weeklyInsights.topEmotionsThisWeek)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([emotion, count]) => (
                      <Badge key={emotion} variant="outline" className="text-purple-300 border-purple-500/30">
                        {emotion} ({count})
                      </Badge>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="personality" className="space-y-6">
          <PersonalityRadarChart insights={personalityInsights} />
          
          {personalityInsights && (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Strongest Traits</div>
                    <div className="space-y-1">
                      {Object.entries(personalityInsights)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([trait, score]) => (
                          <div key={trait} className="flex justify-between">
                            <span className="text-gray-300 capitalize">
                              {trait.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-white font-medium">{score}/100</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Growth Areas</div>
                    <div className="space-y-1">
                      {Object.entries(personalityInsights)
                        .sort(([,a], [,b]) => a - b)
                        .slice(0, 2)
                        .map(([trait, score]) => (
                          <div key={trait} className="flex justify-between">
                            <span className="text-gray-300 capitalize">
                              {trait.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-white font-medium">{score}/100</span>
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
