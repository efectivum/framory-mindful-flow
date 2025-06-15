
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { TimeOfDayMode } from '@/hooks/useTimeOfDay';

const suggestions: Record<TimeOfDayMode, string[]> = {
  morning: [
    "Review your goals for the day.",
    "Try a 5-minute meditation to start fresh.",
    "What's one small thing you're grateful for right now?",
  ],
  midday: [
    "Take a short walk to clear your head.",
    "How are you feeling? Log a quick mood check.",
    "Drink a glass of water and stretch for a minute.",
  ],
  evening: [
    "Reflect on one win from today.",
    "What's on your mind? Write a short journal entry.",
    "Plan one thing you're looking forward to tomorrow.",
  ],
  night: [
    "Disconnect from screens 30 minutes before bed.",
    "Read a few pages of a book.",
    "Listen to some calming music.",
  ],
};

export const SmartSuggestions: React.FC = () => {
  const { mode } = useTimeOfDay();
  const [suggestion, setSuggestion] = React.useState('');

  React.useEffect(() => {
    const dailySuggestions = suggestions[mode];
    setSuggestion(dailySuggestions[Math.floor(Math.random() * dailySuggestions.length)]);
  }, [mode]);

  return (
    <Card className="bg-gradient-to-br from-indigo-500/20 to-blue-600/20 border-indigo-500/30">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-300" />
          For you
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-200">{suggestion}</p>
      </CardContent>
    </Card>
  );
};
