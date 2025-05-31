
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ActivityLog } from '@/components/ActivityLog';
import { useIsMobile } from '@/hooks/use-mobile';

const Journal = () => {
  const isMobile = useIsMobile();

  const journalContent = (
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

        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          <div className={isMobile ? '' : 'lg:col-span-2'}>
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

            <ActivityLog />
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
                  <span className="text-gray-400">Via WhatsApp</span>
                  <span className="text-white font-medium">23 entries</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Recent Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-gray-300 text-sm">You seem more reflective on Mondays based on your recent entries.</p>
                    <span className="text-xs text-orange-400">AI Insight</span>
                  </div>
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-gray-300 text-sm">Your mood patterns show improvement when you exercise.</p>
                    <span className="text-xs text-orange-400">AI Insight</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return journalContent;
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-700 px-4">
        <SidebarTrigger className="-ml-1" />
      </header>
      {journalContent}
    </SidebarInset>
  );
};

export default Journal;
