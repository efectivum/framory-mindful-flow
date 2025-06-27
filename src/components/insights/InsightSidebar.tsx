
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { RecurringTopics } from '@/components/RecurringTopics';
import { MiniCalendar } from '@/components/MiniCalendar';

interface InsightSidebarProps {
  totalEntries: number;
  totalWords: number;
  currentStreak: number;
}

export const InsightSidebar: React.FC<InsightSidebarProps> = ({
  totalEntries,
  totalWords,
  currentStreak
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm shadow-lg rounded-2xl">
        <CardContent className="p-0">
          <MiniCalendar />
        </CardContent>
      </Card>

      <RecurringTopics />

      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm shadow-lg rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-300" />
            Growth Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
              <div className="text-2xl font-bold text-white mb-1">{totalEntries}</div>
              <div className="text-gray-400 text-sm">Total Entries</div>
            </div>
            <div className="text-center p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
              <div className="text-2xl font-bold text-white mb-1">{totalWords.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Words Written</div>
            </div>
          </div>
          <div className="text-center text-gray-300 text-sm">
            You've been on this journey for <span className="font-semibold text-purple-300">{Math.max(1, currentStreak)}</span> days
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
