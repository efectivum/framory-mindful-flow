
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Calendar, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useTodayContent } from "@/hooks/useTodayContent";
import React from 'react';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { Card, CardContent } from '@/components/ui/card';
import { FlippableCard } from '@/components/ui/FlippableCard';

const Index = () => {
  const { user, loading } = useAuth();
  const { habits } = useHabits();
  const { entries, stats } = useJournalEntries();
  const { greeting } = useTimeOfDay();
  const todayContent = useTodayContent();
  const [intentionInput, setIntentionInput] = React.useState('');

  // Calculate habit stats
  const activeHabits = habits.filter(habit => habit.is_active);
  const todaysHabits = activeHabits.slice(0, 3);

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
        <div className="text-center max-w-md w-full space-y-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-light mb-4 text-white tracking-tight">
              Welcome to Lumatori
            </h1>
            <p className="text-xl text-gray-400 font-light">
              Your personal growth companion for mindful living
            </p>
          </div>
          <Link to="/auth">
            <Button size="lg" className="px-8 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full h-12">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Create flippable stat cards
  const createStatCard = (
    icon: React.ReactNode,
    title: string,
    value: string | number,
    description: string,
    color: string
  ) => {
    const front = (
      <div className={`h-full w-full rounded-2xl ${color} p-6 flex flex-col justify-between`}>
        <div className="flex items-center justify-between">
          <div className="text-white/80">{icon}</div>
        </div>
        <div>
          <div className="text-3xl font-light text-white mb-1">{value}</div>
          <div className="text-white/70 text-sm">{title}</div>
        </div>
      </div>
    );

    const back = (
      <div className={`h-full w-full rounded-2xl ${color} p-6 flex items-center justify-center`}>
        <p className="text-white/90 text-center font-light">{description}</p>
      </div>
    );

    return { front, back };
  };

  const streakCard = createStatCard(
    <Calendar className="w-6 h-6" />,
    "Day Streak",
    stats.currentStreak,
    "Keep writing daily to maintain your momentum and build lasting habits.",
    "bg-gradient-to-br from-blue-500/80 to-cyan-600/80"
  );

  const entriesCard = createStatCard(
    <BookOpen className="w-6 h-6" />,
    "Total Entries",
    entries.length,
    "Each entry is a step forward in your personal growth journey.",
    "bg-gradient-to-br from-green-500/80 to-emerald-600/80"
  );

  const habitsCard = createStatCard(
    <Target className="w-6 h-6" />,
    "Active Habits",
    activeHabits.length,
    "Small consistent actions lead to remarkable transformations over time.",
    "bg-gradient-to-br from-purple-500/80 to-violet-600/80"
  );

  return (
    <ResponsiveLayout>
      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">{greeting}</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">{todayContent.prompt}</p>
        </div>

        {/* Intention Setting */}
        {todayContent.showIntentionBox && (
          <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm max-w-md mx-auto">
            <CardContent className="p-6">
              {todayContent.intention ? (
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Today's intention</p>
                    <p className="text-white font-medium text-lg">"{todayContent.intention}"</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => todayContent.setIntention("")}
                    className="text-gray-400 hover:text-white"
                  >
                    Change intention
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
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Set your intention for today</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Be present in every moment"
                      value={intentionInput}
                      onChange={e => setIntentionInput(e.target.value)}
                      maxLength={64}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl">
                    Set Intention
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* Interactive Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FlippableCard
            frontContent={streakCard.front}
            backContent={streakCard.back}
            height="h-32"
            className="cursor-pointer"
          />
          <FlippableCard
            frontContent={entriesCard.front}
            backContent={entriesCard.back}
            height="h-32"
            className="cursor-pointer"
          />
          <FlippableCard
            frontContent={habitsCard.front}
            backContent={habitsCard.back}
            height="h-32"
            className="cursor-pointer"
          />
        </div>

        {/* Today's Habits */}
        {todaysHabits.length > 0 && (
          <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-white font-medium mb-4 text-lg">Today's Focus</h3>
              <div className="space-y-3">
                {todaysHabits.map(habit => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-colors"
                  >
                    <span className="text-gray-200 font-medium">{habit.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">🔥 {habit.current_streak}d</span>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-lg">
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
        <div className="space-y-6">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-medium rounded-2xl shadow-lg" asChild>
            <Link to="/journal">
              <Plus className="w-5 h-5 mr-3" />
              Start Journaling
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gray-700/50 hover:bg-gray-600/50 text-white h-12 rounded-xl border border-gray-600/50" asChild>
              <Link to="/goals">
                <Target className="w-4 h-4 mr-2" />
                Manage Habits
              </Link>
            </Button>
            <Button className="bg-gray-700/50 hover:bg-gray-600/50 text-white h-12 rounded-xl border border-gray-600/50" asChild>
              <Link to="/insights">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Insights
              </Link>
            </Button>
            <Button className="bg-gray-700/50 hover:bg-gray-600/50 text-white h-12 rounded-xl border border-gray-600/50" asChild>
              <Link to="/coach">
                <BookOpen className="w-4 h-4 mr-2" />
                Chat with Coach
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
