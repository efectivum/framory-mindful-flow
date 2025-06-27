
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      <CardHeader className="px-6 pt-6 pb-3">
        <div className="flex flex-col space-y-3">
          <CardTitle className="text-white text-mobile-lg md:text-lg text-premium-bold">
            Mood Trends ({timeRange} days)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${
                trendDirection === 'up' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}
            >
              {trendDirection === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {trendPercentage.toFixed(1)}% trend
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="mb-6">
          <div className="text-3xl font-bold text-white text-premium-bold mb-1">{avgMood.toFixed(1)}/5</div>
          <div className="text-gray-400 text-mobile-sm md:text-sm text-premium">Average mood this period</div>
        </div>
        
        <div className="h-48 -mx-2">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
