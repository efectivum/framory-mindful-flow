
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJournalAnalysis } from '@/hooks/useJournalAnalysis';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { Heart } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const EmotionTrends: React.FC = () => {
  const { summaryData, generateSummaryAnalysis, isSummaryLoading } = useJournalAnalysis();
  const { entries } = useJournalEntries();

  React.useEffect(() => {
    if (!summaryData && !isSummaryLoading && entries.length > 0) {
        generateSummaryAnalysis(entries);
    }
  }, [entries, summaryData, isSummaryLoading, generateSummaryAnalysis]);
  
  const emotions = summaryData?.emotionBreakdown;

  if (isSummaryLoading && !emotions) {
      return null;
  }
  
  if (!emotions || Object.keys(emotions).length === 0) {
    return null;
  }
  
  const sortedEmotions = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" />
          Recent Emotions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <RechartsBarChart data={sortedEmotions} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={80} />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
              contentStyle={{
                background: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4b5563',
                color: '#e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="value" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={15} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
