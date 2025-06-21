
import React from 'react';
import { InsightCard } from '@/components/ui/InsightCard';
import { TrendingUp, HelpCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface MoodData {
  date: string;
  mood: number;
}

interface MoodInsightCardProps {
  moodData: MoodData[];
  averageMood: number;
  trend: 'up' | 'down' | 'stable';
}

export const MoodInsightCard: React.FC<MoodInsightCardProps> = ({
  moodData,
  averageMood,
  trend
}) => {
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  const trendText = trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable';

  const frontContent = (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-4xl font-light text-white">{averageMood.toFixed(1)}</div>
          <div className={`text-sm ${trendColor} flex items-center gap-1`}>
            <TrendingUp className="w-4 h-4" />
            {trendText}
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moodData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis hide />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const backContent = (
    <div className="space-y-4 p-6">
      <h3 className="text-xl font-medium text-white mb-4">Mood Analysis</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Average Mood</div>
          <div className="text-2xl font-medium text-white">{averageMood.toFixed(1)}/5</div>
        </div>
        
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Trend</div>
          <div className={`text-lg font-medium ${trendColor}`}>{trendText}</div>
        </div>
        
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Insights</div>
          <p className="text-gray-300 text-sm">
            {getMoodInsight(averageMood, trend)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <InsightCard
      title="Mood Trends"
      timeframe="This week"
      helpIcon={<HelpCircle className="w-3 h-3" />}
      frontContent={frontContent}
      backContent={backContent}
    />
  );
};

function getMoodInsight(average: number, trend: 'up' | 'down' | 'stable'): string {
  if (trend === 'up') {
    return "Your mood has been improving this week. Keep up the positive momentum with the activities and habits that are working for you.";
  }
  
  if (trend === 'down') {
    return "Your mood has been declining recently. Consider reflecting on potential stressors and focusing on self-care activities.";
  }
  
  if (average > 4) {
    return "You're maintaining a consistently positive mood. Your current strategies and habits seem to be working well.";
  }
  
  if (average < 3) {
    return "Your mood has been lower than usual. Consider reaching out for support or trying new wellness activities.";
  }
  
  return "Your mood has been relatively stable this week. Small positive changes to your routine might help boost your overall wellbeing.";
}
