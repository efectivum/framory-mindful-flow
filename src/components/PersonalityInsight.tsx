
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Brain } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

export const PersonalityInsight: React.FC = () => {
  const { personalityInsights } = useAnalytics(30);

  if (!personalityInsights) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-purple-300" />
            Personality Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">
            As you continue to journal, we'll uncover insights about your personality traits. Keep writing to learn more about yourself!
          </p>
        </CardContent>
      </Card>
    );
  }

  const topTraits = Object.entries(personalityInsights)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-300" />
          Personality Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(topTraits[0]?.[1] || 0)}/100
          </div>
          <div className="text-gray-400 text-sm capitalize">
            {topTraits[0]?.[0].replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Your strongest trait</div>
        </div>

        <div className="space-y-3">
          {topTraits.map(([trait, score]) => (
            <div key={trait} className="flex items-center justify-between">
              <span className="text-gray-300 capitalize text-sm">
                {trait.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${Math.round(score)}%` }}
                  />
                </div>
                <span className="text-white font-medium text-sm w-8 text-right">{Math.round(score)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 text-center mt-4">
          Based on analysis of your {personalityInsights ? Object.keys(personalityInsights).length : 0} personality dimensions
        </div>
      </CardContent>
    </Card>
  );
};
