
import { Target, Plus, Clock, CheckCircle, Activity, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ActivityLog } from '@/components/ActivityLog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Goals = () => {
  const { toast } = useToast();
  const [completedToday, setCompletedToday] = useState<number[]>([]);
  const isMobile = useIsMobile();

  const goals = [
    {
      id: 1,
      title: 'Daily Meditation',
      description: 'Meditate for 10 minutes every day',
      progress: 75,
      streak: 12,
      target: 30,
    },
    {
      id: 2,
      title: 'Read 20 Minutes Daily',
      description: 'Read personal development books',
      progress: 40,
      streak: 6,
      target: 30,
    },
    {
      id: 3,
      title: 'Exercise 3x per Week',
      description: 'Regular physical activity',
      progress: 85,
      streak: 4,
      target: 12,
    },
  ];

  const handleMarkComplete = (goalId: number, goalTitle: string) => {
    if (completedToday.includes(goalId)) {
      toast({
        title: "Already completed!",
        description: `You've already marked ${goalTitle} as complete today.`,
      });
      return;
    }

    setCompletedToday(prev => [...prev, goalId]);
    
    toast({
      title: "🎉 Habit completed!",
      description: `Great job completing ${goalTitle} today! Keep up the streak!`,
    });
  };

  // Mobile layout - completely separate from desktop
  if (isMobile) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Goals & Habits</h1>
                <p className="text-gray-600">Track your progress and build lasting habits</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>

            <div className="space-y-6 mb-8">
              {goals.map((goal) => (
                <Card 
                  key={goal.id} 
                  className="bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Target className="w-5 h-5 text-blue-600" />
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span className="font-medium text-orange-600">{goal.streak} day streak</span>
                      </div>
                    </div>
                    <CardTitle className="text-gray-900">{goal.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{goal.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900">{goal.progress}%</span>
                        </div>
                        <Progress 
                          value={goal.progress} 
                          className="h-2" 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {Math.floor((goal.progress / 100) * goal.target)} of {goal.target} days
                        </span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`w-full transition-all duration-300 ${
                              completedToday.includes(goal.id) 
                                ? 'bg-green-600 border-green-500 text-white hover:bg-green-700' 
                                : 'hover:bg-blue-50 hover:border-blue-300 border-gray-300'
                            }`}
                            onClick={() => handleMarkComplete(goal.id, goal.title)}
                            disabled={completedToday.includes(goal.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {completedToday.includes(goal.id) ? 'Completed Today!' : 'Mark Complete Today'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {completedToday.includes(goal.id) 
                              ? 'You\'ve already completed this habit today!'
                              : 'Mark this habit as complete for today to maintain your streak'
                            }
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">This Week</span>
                  <span className="text-gray-900 font-medium">12 activities</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Goals Updated</span>
                  <span className="text-gray-900 font-medium">5 times</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Habits Tracked</span>
                  <span className="text-gray-900 font-medium">8 times</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // Desktop layout - this will only render when wrapped in SidebarProvider
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Goals & Habits</h1>
            <p className="text-gray-400">Track your progress and build lasting habits</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {goals.map((goal) => (
            <Card 
              key={goal.id} 
              className="bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 group"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Target className="w-5 h-5 text-blue-400" />
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="font-medium text-orange-300">{goal.streak} day streak</span>
                  </div>
                </div>
                <CardTitle className="text-white">{goal.title}</CardTitle>
                <p className="text-gray-400 text-sm">{goal.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{goal.progress}%</span>
                    </div>
                    <Progress 
                      value={goal.progress} 
                      className="h-2 group-hover:shadow-md group-hover:shadow-blue-400/50 transition-all duration-300" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {Math.floor((goal.progress / 100) * goal.target)} of {goal.target} days
                    </span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`w-full transition-all duration-300 ${
                          completedToday.includes(goal.id) 
                            ? 'bg-green-600 border-green-500 text-white hover:bg-green-700' 
                            : 'hover:bg-blue-600/20 hover:border-blue-500'
                        }`}
                        onClick={() => handleMarkComplete(goal.id, goal.title)}
                        disabled={completedToday.includes(goal.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {completedToday.includes(goal.id) ? 'Completed Today!' : 'Mark Complete Today'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {completedToday.includes(goal.id) 
                          ? 'You\'ve already completed this habit today!'
                          : 'Mark this habit as complete for today to maintain your streak'
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityLog />
          </div>
          
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">This Week</span>
                  <span className="text-white font-medium">12 activities</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Goals Updated</span>
                  <span className="text-white font-medium">5 times</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Habits Tracked</span>
                  <span className="text-white font-medium">8 times</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Via WhatsApp</span>
                  <span className="text-white font-medium">7 updates</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Recent Achievement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-2">
                  You've maintained your meditation streak for 12 days! Keep it up! 🎉
                </p>
                <span className="text-xs text-green-400">2 hours ago</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
