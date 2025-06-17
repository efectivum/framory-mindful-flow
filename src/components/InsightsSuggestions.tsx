
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useHabits } from '@/hooks/useHabits';
import { useNavigate } from 'react-router-dom';

export const InsightsSuggestions: React.FC = () => {
  const { entries, stats } = useJournalEntries();
  const { habits } = useHabits();
  const navigate = useNavigate();

  const suggestions = React.useMemo(() => {
    const suggestions = [];

    // Streak-based suggestions
    if (stats.currentStreak === 0) {
      suggestions.push({
        title: "Start Your Journey",
        description: "Begin building a journaling habit with your first entry today.",
        action: "Start Journaling",
        actionFn: () => navigate('/journal'),
        priority: 1
      });
    } else if (stats.currentStreak < 7) {
      suggestions.push({
        title: "Build Consistency",
        description: "You're on a good start! Aim for 7 days in a row to build momentum.",
        action: "Continue Writing",
        actionFn: () => navigate('/journal'),
        priority: 2
      });
    }

    // Habit-based suggestions
    if (habits.length === 0) {
      suggestions.push({
        title: "Set Your First Goal",
        description: "Create habits to track alongside your journaling for better growth.",
        action: "Create Habit",
        actionFn: () => navigate('/goals'),
        priority: 3
      });
    }

    // Entry analysis suggestions
    if (entries.length >= 5) {
      const recentEntries = entries.slice(0, 5);
      const hasEmotions = recentEntries.some(entry => entry.ai_detected_emotions?.length);
      
      if (!hasEmotions) {
        suggestions.push({
          title: "Express Your Emotions",
          description: "Try writing about how you feel to get deeper emotional insights.",
          action: "Write About Feelings",
          actionFn: () => navigate('/journal'),
          priority: 4
        });
      }
    }

    // Mood tracking suggestions
    const recentMoodEntries = entries.slice(0, 10).filter(entry => entry.mood_after);
    if (recentMoodEntries.length < 5) {
      suggestions.push({
        title: "Track Your Mood",
        description: "Add mood ratings to your entries to see emotional patterns over time.",
        action: "Add Mood Rating",
        actionFn: () => navigate('/journal'),
        priority: 5
      });
    }

    return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }, [entries, habits, stats, navigate]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Suggestions for Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-2">{suggestion.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{suggestion.description}</p>
                <Button 
                  onClick={suggestion.actionFn}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  {suggestion.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
