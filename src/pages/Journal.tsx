
import { BookOpen, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const Journal = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
