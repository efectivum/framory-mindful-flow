
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useTodayContent } from "@/hooks/useTodayContent";
import React from 'react';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { user, loading } = useAuth();
  const { habits } = useHabits();
  const { entries, stats } = useJournalEntries();
  const { greeting } = useTimeOfDay();
  const todayContent = useTodayContent();
  const [intentionInput, setIntentionInput] = React.useState('');

  // Calculate habit stats
  const activeHabits = habits.filter(habit => habit.is_active);
  const todaysHabits = activeHabits.slice(0, 3); // Show first 3 habits

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

  return (
    <ResponsiveLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{greeting}</h1>
          <p className="text-md md:text-lg text-gray-300">{todayContent.prompt}</p>
        </div>

        {/* Intention Setting */}
        {todayContent.showIntentionBox && (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm max-w-md mx-auto">
            <CardContent className="p-4">
              {todayContent.intention ? (
                <div className="text-center">
                  <p className="text-green-300 mb-2">
                    <strong>Today's intention:</strong> {todayContent.intention}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => todayContent.setIntention("")}
                    className="text-gray-400 hover:text-white"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (intentionInput.trim()) {
                      todayContent.setIntention(intentionInput.trim());
                      setIntentionInput('');
                    }
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Be present in every moment"
                    value={intentionInput}
                    onChange={e => setIntentionInput(e.target.value)}
                    maxLength={64}
                    autoFocus
                  />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Set Intention
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              <p className="text-gray-300 text-sm">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{entries.length}</div>
              <p className="text-gray-300 text-sm">Total Entries</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{activeHabits.length}</div>
              <p className="text-gray-300 text-sm">Active Habits</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Habits */}
        {todaysHabits.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">Today's Habits</h3>
              <div className="space-y-2">
                {todaysHabits.map(habit => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600"
                  >
                    <span className="text-gray-200">{habit.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">🔥 {habit.current_streak}d</span>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Actions */}
        <div className="space-y-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg" asChild>
            <Link to="/journal">
              <Plus className="w-5 h-5 mr-2" />
              Start Journaling
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="bg-gray-700 hover:bg-gray-600 text-white h-10" asChild>
              <Link to="/goals">Manage Habits</Link>
            </Button>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white h-10" asChild>
              <Link to="/insights">View Insights</Link>
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
