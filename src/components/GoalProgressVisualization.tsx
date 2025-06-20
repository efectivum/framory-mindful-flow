
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GoalProgress } from '@/hooks/useAnalytics';

interface GoalProgressVisualizationProps {
  goals: GoalProgress[];
}

export const GoalProgressVisualization: React.FC<GoalProgressVisualizationProps> = ({ goals }) => {
  if (goals.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-gray-400">
            <p>Create habits to track your progress</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return 'text-green-400';
      case 'declining':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Target className="w-5 h-5" />
          Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.habitId} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">{goal.title}</h4>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${getTrendColor(goal.monthlyTrend)} border-current`}
                  >
                    {getTrendIcon(goal.monthlyTrend)}
                    <span className="ml-1 capitalize">{goal.monthlyTrend}</span>
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{goal.completionRate.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={goal.completionRate} 
                  className="h-2 bg-gray-700"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Current streak: {goal.streak} days</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">This week:</span>
                  <div className="flex gap-1">
                    {goal.weeklyProgress.map((completed, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          completed ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
