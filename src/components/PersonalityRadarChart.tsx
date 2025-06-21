
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
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Personality Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-gray-400">
            <p>Write more entries to unlock personality insights</p>
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
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Personality Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="px-2">
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis 
                  dataKey="trait" 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  className="text-xs"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  tickCount={5}
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
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs px-2">
          {data.map((item) => (
            <div key={item.trait} className="flex justify-between">
              <span className="text-gray-400">{item.trait.replace('\n', ' ')}</span>
              <span className="text-white font-medium">{item.value}/100</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
