
import { useAuth } from '@/hooks/useAuth';
import { UserButton } from '@/components/UserButton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardWidget } from '@/components/DashboardWidget';
import { Target, BookOpen, TrendingUp, Plus, Calendar, Heart, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHabits } from '@/hooks/useHabits';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import MobileIndex from './MobileIndex';

const Index = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const { habits } = useHabits();
  const { entries, stats } = useJournalEntries();

  // Calculate habit stats
  const activeHabits = habits.filter(habit => habit.is_active);
  const longestStreak = Math.max(...activeHabits.map(habit => habit.current_streak), 0);
  const avgProgress = activeHabits.length > 0 
    ? Math.round((activeHabits.reduce((sum, habit) => sum + (habit.current_streak / habit.target_days * 100), 0) / activeHabits.length))
    : 0;

  // Show mobile version on small screens
  if (isMobile) {
    return <MobileIndex />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-white hover:bg-gray-700" />
                <div>
                  <h1 className="text-xl font-semibold text-white">Good morning! 👋</h1>
                  <p className="text-gray-400 text-sm">Ready to continue your growth journey?</p>
                </div>
              </div>
            </div>
          </header>
          
          <div className="p-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Link to="/journal">
                <Button className="h-16 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-left justify-start w-full">
                  <Plus className="w-6 h-6 mr-3" />
                  <div>
                    <div className="font-medium">Add New Entry</div>
                    <div className="text-sm opacity-90">Quick journal reflection</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/goals">
                <Button variant="outline" className="h-16 border-gray-600 text-white hover:bg-gray-700/50 text-left justify-start w-full">
                  <Target className="w-6 h-6 mr-3" />
                  <div>
                    <div className="font-medium">Track Progress</div>
                    <div className="text-sm opacity-70">Update your goals</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/journal">
                <Button variant="outline" className="h-16 border-gray-600 text-white hover:bg-gray-700/50 text-left justify-start w-full">
                  <BookOpen className="w-6 h-6 mr-3" />
                  <div>
                    <div className="font-medium">Daily Prompt</div>
                    <div className="text-sm opacity-70">Guided reflection</div>
                  </div>
                </Button>
              </Link>
            </div>

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardWidget
                title="Current Streak"
                value={longestStreak > 0 ? `${longestStreak} days` : "Start today!"}
                description={activeHabits.length > 0 ? "Longest habit streak" : "Create your first habit"}
                icon={Target}
                gradient="from-blue-500/10 to-purple-600/10"
              />
              
              <DashboardWidget
                title="This Week"
                value={stats.thisWeekCount}
                description="Journal entries"
                icon={BookOpen}
                gradient="from-green-500/10 to-teal-600/10"
              />
              
              <DashboardWidget
                title="Mood Score"
                value={stats.averageMood > 0 ? `${stats.averageMood.toFixed(1)}/5` : "No data"}
                description="Average this week"
                icon={Heart}
                gradient="from-pink-500/10 to-red-600/10"
              />
              
              <DashboardWidget
                title="Goals Progress"
                value={`${avgProgress}%`}
                description="Average completion"
                icon={TrendingUp}
                gradient="from-yellow-500/10 to-orange-600/10"
              />
            </div>

            {/* Recent Activity & Quick Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Reflections</h3>
                <div className="space-y-3">
                  {entries.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-white font-medium mb-1">
                        {entry.title || 'Journal Entry'}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {entry.content.length > 60 
                          ? `${entry.content.substring(0, 60)}...` 
                          : entry.content}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {entries.length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                      No journal entries yet. Start writing to see your reflections here!
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Today's Focus
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg border border-blue-500/20">
                    <div className="text-white font-medium mb-1">Complete Your Habits</div>
                    <div className="text-gray-400 text-sm">
                      You have {activeHabits.length} active habits to track today
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-green-500/10 to-teal-600/10 rounded-lg border border-green-500/20">
                    <div className="text-white font-medium mb-1">Daily Reflection</div>
                    <div className="text-gray-400 text-sm">
                      Take a moment to journal about your day
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-lg border border-purple-500/20">
                    <div className="text-white font-medium mb-1">Growth Tip</div>
                    <div className="text-gray-400 text-sm">
                      Small consistent actions lead to remarkable transformations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
