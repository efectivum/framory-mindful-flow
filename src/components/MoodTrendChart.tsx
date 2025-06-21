
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MoodTrend } from '@/hooks/useAnalytics';

interface MoodTrendChartProps {
  data: MoodTrend[];
  timeRange: 30 | 90 | 365;
}

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ data, timeRange }) => {
  const validData = data.filter(d => d.mood > 0);
  
  if (validData.length === 0) {
    return (
      <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white text-mobile-lg md:text-lg text-premium-bold">Mood Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-gray-400">
            <p className="text-premium text-mobile-sm md:text-sm text-center">Start journaling to see your mood trends</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgMood = validData.reduce((sum, d) => sum + d.mood, 0) / validData.length;
  const firstHalf = validData.slice(0, Math.floor(validData.length / 2));
  const secondHalf = validData.slice(Math.floor(validData.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.mood, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.mood, 0) / secondHalf.length;
  const trendDirection = secondHalfAvg > firstHalfAvg ? 'up' : 'down';
  const trendPercentage = Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100);

  const chartConfig = {
    mood: {
      label: "Mood",
      color: "#3b82f6",
    },
  };

  return (
    <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm shadow-lg rounded-2xl">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="text-white text-mobile-lg md:text-lg flex items-center justify-between text-premium-bold">
          Mood Trends ({timeRange} days)
          <div className="flex items-center gap-2 text-mobile-sm md:text-sm">
            {trendDirection === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}>
              {trendPercentage.toFixed(1)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="mb-4">
          <div className="text-2xl font-bold text-white text-premium-bold">{avgMood.toFixed(1)}/5</div>
          <div className="text-gray-400 text-mobile-sm md:text-sm text-premium">Average mood</div>
        </div>
        
        <div className="px-2">
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={validData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  style={{ fontWeight: 500 }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[1, 5]}
                  style={{ fontWeight: 500 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
