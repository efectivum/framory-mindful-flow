
import { Target, Plus, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Goals = () => {
  const { user } = useAuth();

  // Fetch WhatsApp insights related to goals
  const { data: whatsappInsights } = useQuery({
    queryKey: ['whatsapp-goal-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('source_type', 'whatsapp')
        .eq('insight_type', 'progress')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch recent WhatsApp messages for context
  const { data: recentMessages } = useQuery({
    queryKey: ['recent-whatsapp-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

          {/* WhatsApp Integration Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights from WhatsApp */}
            <Card className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  WhatsApp Progress Insights
                </CardTitle>
                <p className="text-gray-400 text-sm">AI analysis from your WhatsApp check-ins</p>
              </CardHeader>
              <CardContent>
                {whatsappInsights && whatsappInsights.length > 0 ? (
                  <div className="space-y-3">
                    {whatsappInsights.map((insight) => (
                      <div key={insight.id} className="p-3 bg-gray-800/30 rounded-lg">
                        <p className="text-gray-300 text-sm">{insight.content}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(insight.created_at).toLocaleDateString()}
                          </span>
                          {insight.confidence_score && (
                            <span className="text-xs text-green-400">
                              {Math.round(insight.confidence_score * 100)}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    No WhatsApp insights yet. Start sharing your progress via WhatsApp to see AI analysis here!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent WhatsApp Activity */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Recent WhatsApp Activity
                </CardTitle>
                <p className="text-gray-400 text-sm">Your latest check-ins and updates</p>
              </CardHeader>
              <CardContent>
                {recentMessages && recentMessages.length > 0 ? (
                  <div className="space-y-3">
                    {recentMessages.map((message) => (
                      <div key={message.id} className="p-3 bg-gray-800/30 rounded-lg">
                        <p className="text-gray-300 text-sm line-clamp-2">{message.message_content}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleDateString()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            message.direction === 'inbound' 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {message.direction}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    No WhatsApp messages yet. Connect your WhatsApp to start tracking progress!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Goals;
