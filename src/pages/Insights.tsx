
import { TrendingUp, Brain, Heart, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PageLayout } from '@/components/PageLayout';
import { MobileLayout } from '@/components/MobileLayout';
import { useIsMobile } from '@/hooks/use-mobile';

const Insights = () => {
  const isMobile = useIsMobile();

  const moodData = [
    { mood: 'Positive', percentage: 65, color: 'bg-green-500' },
    { mood: 'Neutral', percentage: 25, color: 'bg-yellow-500' },
    { mood: 'Contemplative', percentage: 10, color: 'bg-blue-500' },
  ];

  const themes = [
    { theme: 'Gratitude', frequency: 18, trend: '+12%' },
    { theme: 'Growth', frequency: 15, trend: '+8%' },
    { theme: 'Relationships', frequency: 12, trend: '+5%' },
    { theme: 'Challenges', frequency: 8, trend: '-3%' },
  ];

  const content = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <CardTitle className="text-white">Emotional Wellness</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">8.2/10</div>
            <p className="text-gray-400 text-sm">Average this week</p>
            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-1">Trend: +0.5 from last week</div>
              <Progress value={82} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <CardTitle className="text-white">Growth Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">92%</div>
            <p className="text-gray-400 text-sm">Goal completion rate</p>
            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-1">+15% from last month</div>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white">Mindfulness</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">15 days</div>
            <p className="text-gray-400 text-sm">Meditation streak</p>
            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-1">Personal best: 23 days</div>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Mood Distribution (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.mood}</span>
                    <span className="text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recurring Themes</CardTitle>
            <p className="text-gray-400 text-sm">Most mentioned topics in your journal</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {themes.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{item.theme}</div>
                    <div className="text-gray-400 text-sm">{item.frequency} mentions</div>
                  </div>
                  <div className={`text-sm font-medium ${
                    item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.trend}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Personalized Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="text-blue-300 font-medium mb-2">Growth Pattern</h4>
              <p className="text-gray-300 text-sm">
                You tend to be most reflective in the evenings. Consider scheduling important decisions during this time.
              </p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <h4 className="text-green-300 font-medium mb-2">Strength Identified</h4>
              <p className="text-gray-300 text-sm">
                Your consistency with meditation is excellent. This discipline could be applied to other goals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Use MobileLayout for mobile with swipe functionality
  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  // Use PageLayout for desktop
  return (
    <PageLayout title="Insights" subtitle="Discover patterns in your personal growth journey">
      {content}
    </PageLayout>
  );
};

export default Insights;
