
import { BookOpen, Plus, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Journal = () => {
  const { user } = useAuth();

  // Fetch WhatsApp insights related to journaling
  const { data: whatsappInsights } = useQuery({
    queryKey: ['whatsapp-journal-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('source_type', 'whatsapp')
        .in('insight_type', ['mood', 'theme'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch recent WhatsApp messages that could be journal-like
  const { data: journalMessages } = useQuery({
    queryKey: ['whatsapp-journal-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('direction', 'inbound')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const entries = [
    {
      id: 1,
      date: '2024-05-25',
      title: 'Morning Reflection',
      preview: 'Today I feel grateful for the small moments...',
      mood: 'Positive',
    },
    {
      id: 2,
      date: '2024-05-24',
      title: 'Evening Thoughts',
      preview: 'Reflecting on today\'s challenges and growth...',
      mood: 'Contemplative',
    },
    {
      id: 3,
      date: '2024-05-23',
      title: 'Weekly Goals Review',
      preview: 'Reviewing my progress on this week\'s objectives...',
      mood: 'Motivated',
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
              <h1 className="text-3xl font-bold text-white mb-2">Journaling</h1>
              <p className="text-gray-400">Capture your thoughts and reflections</p>
            </div>
            <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Quick Reflection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What's on your mind today?"
                    className="min-h-32 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <select className="bg-gray-700 border-gray-600 text-white rounded px-3 py-1 text-sm">
                      <option>Select mood</option>
                      <option>Positive</option>
                      <option>Neutral</option>
                      <option>Contemplative</option>
                      <option>Challenging</option>
                    </select>
                    <Button size="sm">Save Entry</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Recent Entries</h3>
                {entries.map((entry) => (
                  <Card key={entry.id} className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{entry.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {entry.date}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{entry.preview}</p>
                      <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                        {entry.mood}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Today's Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    "What three things am I most grateful for today, and how can I carry this gratitude forward?"
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use This Prompt
                  </Button>
                </CardContent>
              </Card>

              {/* WhatsApp Mood Insights */}
              <Card className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp Insights
                  </CardTitle>
                  <p className="text-gray-400 text-sm">AI analysis from your messages</p>
                </CardHeader>
                <CardContent>
                  {whatsappInsights && whatsappInsights.length > 0 ? (
                    <div className="space-y-3">
                      {whatsappInsights.slice(0, 3).map((insight) => (
                        <div key={insight.id} className="p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              insight.insight_type === 'mood' 
                                ? 'bg-purple-500/20 text-purple-300' 
                                : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {insight.insight_type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(insight.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{insight.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Share your thoughts via WhatsApp to see AI mood and theme insights here!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* WhatsApp Journal Entries */}
              <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp Reflections
                  </CardTitle>
                  <p className="text-gray-400 text-sm">Your thoughts shared via WhatsApp</p>
                </CardHeader>
                <CardContent>
                  {journalMessages && journalMessages.length > 0 ? (
                    <div className="space-y-3">
                      {journalMessages.slice(0, 3).map((message) => (
                        <div key={message.id} className="p-3 bg-gray-800/30 rounded-lg">
                          <p className="text-gray-300 text-sm line-clamp-3">{message.message_content}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(message.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-orange-400">WhatsApp</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Start sharing your thoughts via WhatsApp to see them here!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-teal-600/10 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Writing Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">This Week</span>
                    <span className="text-white font-medium">5 entries</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Streak</span>
                    <span className="text-white font-medium">8 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Entries</span>
                    <span className="text-white font-medium">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">WhatsApp Messages</span>
                    <span className="text-white font-medium">{journalMessages?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Journal;
