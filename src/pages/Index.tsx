import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DashboardWidget } from '@/components/DashboardWidget';
import { Target, BookOpen, TrendingUp, Plus, Calendar, Heart, Clock } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageLayout } from '@/components/PageLayout';
import { MobileLayout } from '@/components/MobileLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useJournalAnalysis } from '@/hooks/useJournalAnalysis';
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useTodayContent } from "@/hooks/useTodayContent";
import React from 'react';

const Index = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const { habits } = useHabits();
  const { entries, stats } = useJournalEntries();
  const { summaryData } = useJournalAnalysis();

  // Today View logic
  const { greeting } = useTimeOfDay();
  const todayContent = useTodayContent();
  const [intentionInput, setIntentionInput] = React.useState('');

  // Calculate habit stats
  const activeHabits = habits.filter(habit => habit.is_active);
  const longestStreak = Math.max(...activeHabits.map(habit => habit.current_streak), 0);
  const avgProgress = activeHabits.length > 0 
    ? Math.round((activeHabits.reduce((sum, habit) => sum + (habit.current_streak / habit.target_days * 100), 0) / activeHabits.length))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Welcome to Framory
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8">
            Your personal growth companion for mindful living
          </p>
          <Link to="/auth">
            <Button size="lg" className="px-8 w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // DYNAMIC TODAY VIEW - replaces static content
  const todayView = (
    <div>
      {/* Greeting & prompt */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{greeting}</h1>
        <p className="text-md md:text-lg text-gray-300">{todayContent.prompt}</p>
      </div>
      {/* Intention input for morning mode */}
      {todayContent.showIntentionBox && (
        <div className="my-4 flex flex-col items-center max-w-md mx-auto">
          {todayContent.intention ? (
            <div className="bg-green-950/60 border border-green-700 text-green-200 px-4 py-3 rounded-xl w-full text-center mb-2">
              <span>
                <strong>Your intention:</strong> {todayContent.intention}
              </span>
              <Button
                className="ml-2 text-xs px-2 h-7"
                variant="ghost"
                onClick={() => todayContent.setIntention("")}
              >
                Change
              </Button>
            </div>
          ) : (
            <form
              className="w-full flex flex-col gap-2"
              onSubmit={e => {
                e.preventDefault();
                if (intentionInput.trim()) {
                  todayContent.setIntention(intentionInput.trim());
                  setIntentionInput('');
                }
              }}
            >
              <input
                type="text"
                className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="e.g. Be present in every moment"
                value={intentionInput}
                onChange={e => setIntentionInput(e.target.value)}
                maxLength={64}
                autoFocus
              />
              <Button
                className="w-full md:w-auto bg-blue-700 text-white rounded-lg mt-1"
                type="submit"
                size="sm"
              >
                Set Intention
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Suggestion sentence */}
      {todayContent.suggestion && (
        <div className="text-sm text-gray-400 my-2 text-center">{todayContent.suggestion}</div>
      )}

      {/* Reflection summary block for midday/evening */}
      {todayContent.showReflectionSummary && (
        <div className="my-8">
          <h2 className="text-lg font-semibold text-white mb-1">Recent Reflections</h2>
          <div className="space-y-2">
            {entries.slice(0, 2).map((entry) => (
              <div
                className="p-3 bg-gray-800/60 rounded-lg border border-gray-700 text-gray-200"
                key={entry.id}
              >
                <div className="font-medium mb-1 truncate">{entry.title || "Journal Entry"}</div>
                <div className="text-xs text-gray-400 line-clamp-2">{entry.content.slice(0, 75)}...</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(entry.created_at).toLocaleDateString()}</div>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="text-gray-500 text-center text-xs">No recent reflections. Write your first entry today!</div>
            )}
          </div>
        </div>
      )}

      {/* Quick mood check (midday/evening) */}
      {todayContent.showMoodCheck && (
        <div className="my-6">
          <h3 className="text-white mb-1 font-semibold">How's your mood?</h3>
          {/* Simple quick mood input: emoji dropdown, to be replaced with better picker/logic */}
          <div className="flex items-center gap-3 justify-center">
            <span className="text-2xl cursor-pointer">😊</span>
            <span className="text-2xl cursor-pointer">😐</span>
            <span className="text-2xl cursor-pointer">😢</span>
            {/* (Add onClick logic to store mood in the future) */}
          </div>
        </div>
      )}

      {/* Habit completion (evening) */}
      {todayContent.showHabits && (
        <div className="my-6">
          <h3 className="text-white font-semibold mb-2">Today's Habits</h3>
          <div className="flex flex-wrap gap-2">
            {habits.length > 0 ? (
              habits.map(habit => (
                <div
                  key={habit.id}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                    habit.is_active ? 'bg-gradient-to-r from-green-900 to-green-800 border-green-700 text-green-100' : 'bg-gray-800 border-gray-700 text-gray-400'
                  }`}
                >
                  {habit.name}
                  {habit.current_streak ? <span className="ml-2 text-xs">🔥{habit.current_streak}d</span> : ""}
                </div>
              ))
            ) : (
              <div className="text-gray-400">No tracked habits today</div>
            )}
          </div>
        </div>
      )}

      {/* Main actions, always */
      }
      <div className="mt-8 mb-10 space-y-4">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
          <Link to="/journal">Start Journaling</Link>
        </Button>
        <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white" asChild>
          <Link to="/goals">Review Goals</Link>
        </Button>
      </div>
    </div>
  );

  // Use MobileLayout for mobile with swipe functionality
  if (isMobile) {
    return <MobileLayout>{todayView}</MobileLayout>;
  }

  // Use PageLayout for desktop with Today View as main content
  return (
    <PageLayout>
      {todayView}
    </PageLayout>
  );
};

export default Index;
