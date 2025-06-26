
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Calendar, BookOpen, Target, TrendingUp, Loader2 } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useTodayContent } from "@/hooks/useTodayContent";
import React from 'react';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { Card, CardContent } from '@/components/ui/card';
import { FlippableCard } from '@/components/ui/FlippableCard';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { DynamicHomepageFeatures } from '@/components/DynamicHomepageFeatures';

const Index = () => {
  const { user, loading } = useAuth();
  const { habits, completeHabit, isCompleting, todayCompletions } = useHabits();
  const { entries, stats } = useJournalEntries();
  const { greeting } = useTimeOfDay();
  const todayContent = useTodayContent();
  const { toast } = useToast();
  const [intentionInput, setIntentionInput] = React.useState('');
  const [isSettingIntention, setIsSettingIntention] = React.useState(false);

  // Debug logging for streak
  React.useEffect(() => {
    console.log('Homepage stats:', stats);
    console.log('Entries:', entries.length);
    console.log('Current streak from stats:', stats.currentStreak);
  }, [stats, entries]);

  // Calculate habit stats and filter out completed habits
  const activeHabits = habits.filter(habit => habit.is_active);
  const uncompletedHabits = activeHabits.filter(habit => !todayCompletions.includes(habit.id));
  const todaysHabits = uncompletedHabits.slice(0, 3);

  const handleSetIntention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentionInput.trim()) return;
    
    setIsSettingIntention(true);
    try {
      await todayContent.setIntention(intentionInput.trim());
      setIntentionInput('');
      toast({
        title: "Intention Set! ✨",
        description: "Your daily intention has been saved.",
      });
    } catch (error) {
      console.error('Failed to set intention:', error);
      toast({
        title: "Failed to set intention",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSettingIntention(false);
    }
  };

  const handleHabitComplete = async (habitId: string) => {
    try {
      await completeHabit({ habitId });
      toast({
        title: "Great job! 🎉",
        description: "Habit completed successfully!",
      });
    } catch (error) {
      console.error('Failed to complete habit:', error);
      toast({
        title: "Couldn't complete habit",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--app-bg-primary)' }}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <div className="text-lg text-white font-medium">Loading your sanctuary...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--app-bg-primary)' }}>
        <div className="text-center max-w-md w-full space-y-8">
          <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-breathe" 
               style={{ background: 'var(--app-accent-primary)' }}>
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-hero mb-4">
              Welcome to Lumatori
            </h1>
            <p className="text-subhero">
              Your personal sanctuary for mindful growth and reflection
            </p>
          </div>
          <ButtonErrorBoundary fallbackMessage="Authentication not available">
            <Button 
              size="lg" 
              className="btn-organic w-full h-14 text-lg font-medium shadow-2xl glow-primary" 
              asChild
            >
              <Link to="/auth">
                Begin Your Journey
              </Link>
            </Button>
          </ButtonErrorBoundary>
        </div>
      </div>
    );
  }

  // Create enhanced stat cards with organic design
  const createStatCard = (
    icon: React.ReactNode,
    title: string,
    value: string | number,
    description: string,
    gradient: string
  ) => {
    const front = (
      <div className={`h-full w-full rounded-3xl p-6 flex flex-col justify-between shadow-xl border border-white/10 backdrop-blur-sm app-card-organic`}
           style={{ background: gradient }}>
        <div className="flex items-center justify-between">
          <div className="text-white/80">{icon}</div>
        </div>
        <div>
          <div className="text-3xl font-light text-white mb-2 animate-gentle-pulse">{value}</div>
          <div className="text-white/80 text-sm font-medium">{title}</div>
        </div>
      </div>
    );

    const back = (
      <div className={`h-full w-full rounded-3xl p-6 flex items-center justify-center shadow-xl border border-white/10 backdrop-blur-sm`}
           style={{ background: gradient }}>
        <p className="text-white/90 text-center font-light text-sm leading-relaxed">{description}</p>
      </div>
    );

    return { front, back };
  };

  // Debug the streak value before using it
  const currentStreak = stats.currentStreak || 0;
  console.log('Using streak value:', currentStreak);

  const streakCard = createStatCard(
    <Calendar className="w-6 h-6" />,
    "Day Streak",
    currentStreak,
    "Keep writing daily to maintain your momentum and build lasting habits.",
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
  );

  const entriesCard = createStatCard(
    <BookOpen className="w-6 h-6" />,
    "Total Entries",
    entries.length,
    "Each entry is a step forward in your personal growth journey.",
    "linear-gradient(135deg, #10b981 0%, #059669 100%)"
  );

  const habitsCard = createStatCard(
    <Target className="w-6 h-6" />,
    "Active Habits",
    activeHabits.length,
    "Small consistent actions lead to remarkable transformations over time.",
    "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
  );

  return (
    <ResponsiveLayout showHeader={false}>
      <div className="app-content-flow">
        {/* Enhanced Welcome Section */}
        <div className="text-center space-y-6 pt-6">
          <h1 className="text-hero animate-fade-in">{greeting}</h1>
          <p className="text-subhero max-w-2xl mx-auto animate-fade-in">
            {todayContent.prompt}
          </p>
        </div>

        {todayContent.showIntentionBox && (
          <ButtonErrorBoundary fallbackMessage="Intention setting is not available">
            <Card className="app-card-organic max-w-md mx-auto animate-fade-in">
              <CardContent className="p-6">
                {todayContent.intention ? (
                  <div className="text-center space-y-4">
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm font-medium">Today's intention</p>
                      <p className="text-white font-medium text-lg gradient-text-warm">"{todayContent.intention}"</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => todayContent.setIntention("")}
                      className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-2xl transition-all duration-300"
                    >
                      Change intention
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSetIntention} className="space-y-5">
                    <div>
                      <label className="block text-gray-400 text-sm mb-3 font-medium">Set your intention for today</label>
                      <input
                        type="text"
                        className="w-full bg-gray-700/30 border border-gray-600/30 rounded-2xl px-5 py-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="e.g. Be present in every moment"
                        value={intentionInput}
                        onChange={e => setIntentionInput(e.target.value)}
                        maxLength={64}
                        autoFocus
                        disabled={isSettingIntention}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="btn-organic w-full glow-primary"
                      disabled={isSettingIntention || !intentionInput.trim()}
                    >
                      {isSettingIntention ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Setting...
                        </>
                      ) : (
                        'Set Intention'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </ButtonErrorBoundary>
        )}

        {/* Enhanced Interactive Stats Cards */}
        <ButtonErrorBoundary fallbackMessage="Statistics are not available">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <FlippableCard
              frontContent={streakCard.front}
              backContent={streakCard.back}
              height="h-36"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={entriesCard.front}
              backContent={entriesCard.back}
              height="h-36"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={habitsCard.front}
              backContent={habitsCard.back}
              height="h-36"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
          </div>
        </ButtonErrorBoundary>

        {/* Dynamic Homepage Features - Time-aware content */}
        <DynamicHomepageFeatures />

        {activeHabits.length > 0 && (
          <ButtonErrorBoundary fallbackMessage="Habit tracking is not available">
            <Card className="app-card-organic animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-5 text-lg gradient-text">Today's Focus</h3>
                
                {todaysHabits.length > 0 ? (
                  <div className="space-y-4">
                    {todaysHabits.map(habit => (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between p-5 bg-gray-700/20 rounded-2xl border border-gray-600/20 hover:border-gray-500/40 transition-all duration-300 hover:bg-gray-700/30 card-hover"
                      >
                        <span className="text-gray-200 font-medium">{habit.title}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-400 font-medium">🔥 {habit.current_streak}d</span>
                          <Button 
                            size="sm" 
                            className="btn-organic bg-green-600 hover:bg-green-700 glow-success"
                            onClick={() => handleHabitComplete(habit.id)}
                            disabled={isCompleting}
                          >
                            {isCompleting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Completing...
                              </>
                            ) : (
                              'Complete'
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-4 animate-breathe">🎉</div>
                    <p className="text-gray-300 font-semibold mb-2 text-lg">All habits completed!</p>
                    <p className="text-gray-400 text-sm">Great job staying consistent today!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </ButtonErrorBoundary>
        )}

        {/* Enhanced Main Actions */}
        <ButtonErrorBoundary fallbackMessage="Navigation buttons are not available">
          <div className="space-y-8">
            <Button className="btn-organic w-full h-16 text-lg font-semibold glow-primary" asChild>
              <Link to="/journal">
                <Plus className="w-6 h-6 mr-3" />
                Start Journaling
              </Link>
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Button className="app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white h-14 rounded-2xl border border-gray-600/30 hover:border-gray-500/40 shadow-lg hover:shadow-xl transition-all duration-300 card-hover" asChild>
                <Link to="/goals">
                  <Target className="w-5 h-5 mr-2" />
                  Manage Habits
                </Link>
              </Button>
              <Button className="app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white h-14 rounded-2xl border border-gray-600/30 hover:border-gray-500/40 shadow-lg hover:shadow-xl transition-all duration-300 card-hover" asChild>
                <Link to="/insights">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View Insights
                </Link>
              </Button>
              <Button className="app-card-organic bg-gray-700/30 hover:bg-gray-600/40 text-white h-14 rounded-2xl border border-gray-600/30 hover:border-gray-500/40 shadow-lg hover:shadow-xl transition-all duration-300 card-hover" asChild>
                <Link to="/coach">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Chat with Coach
                </Link>
              </Button>
            </div>
          </div>
        </ButtonErrorBoundary>
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
