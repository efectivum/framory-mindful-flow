
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Brain } from 'lucide-react';
import { PersonalityInsights } from '@/hooks/useAnalytics';

interface PersonalityRadarChartProps {
  insights: PersonalityInsights | null;
}

export const PersonalityRadarChart: React.FC<PersonalityRadarChartProps> = ({ insights }) => {
  if (!insights) {
    return (
      <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white text-mobile-lg md:text-lg flex items-center gap-2 text-premium-bold">
            <Brain className="w-5 h-5" />
            Personality Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-gray-400">
            <p className="text-premium text-mobile-sm md:text-sm text-center">Write more entries to unlock personality insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = [
    { trait: 'Emotional\nStability', value: Math.round(insights.emotionalStability), fullMark: 100 },
    { trait: 'Openness', value: Math.round(insights.openness), fullMark: 100 },
    { trait: 'Conscientiousness', value: Math.round(insights.conscientiousness), fullMark: 100 },
    { trait: 'Extraversion', value: Math.round(insights.extraversion), fullMark: 100 },
    { trait: 'Agreeableness', value: Math.round(insights.agreeableness), fullMark: 100 },
    { trait: 'Self-Reflection', value: Math.round(insights.selfReflectionLevel), fullMark: 100 },
  ];

  const chartConfig = {
    value: {
      label: "Score",
      color: "#8b5cf6",
    },
  };

  return (
    <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm shadow-lg rounded-2xl">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="text-white text-mobile-lg md:text-lg flex items-center gap-2 text-premium-bold">
          <Brain className="w-5 h-5" />
          Personality Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xs mx-auto mb-6">
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis 
                    dataKey="trait" 
                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                    className="text-xs font-medium"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#6b7280', fontSize: 9, fontWeight: 500 }}
                    tickCount={4}
                  />
                  <Radar
                    name="Personality"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="w-full space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {data.map((item) => (
                <div key={item.trait} className="flex items-center justify-between py-2 px-3 bg-gray-700/20 rounded-lg">
                  <span className="text-gray-300 text-sm font-medium text-premium">
                    {item.trait.replace('\n', ' ')}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold text-sm w-8 text-right text-premium-bold">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
