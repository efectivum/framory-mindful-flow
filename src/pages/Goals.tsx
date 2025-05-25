
import { Target, Plus, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const Goals = () => {
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

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-700 px-4">
        <SidebarTrigger className="-ml-1" />
      </header>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-xs text-gray-400">{goal.streak} day streak</span>
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
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {Math.floor((goal.progress / 100) * goal.target)} of {goal.target} days
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete Today
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Goals;
