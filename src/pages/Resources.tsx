
import { Library, BookOpen, Play, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { useChallenges } from '@/hooks/useChallenges';
import { useNavigate } from 'react-router-dom';
import { LoadingCard } from '@/components/ui/loading-card';

const Resources = () => {
  const navigate = useNavigate();
  const { challenges, isLoadingChallenges, isEnrolledInChallenge } = useChallenges();

  const readings = [
    {
      title: 'The Power of Now',
      author: 'Eckhart Tolle',
      category: 'Mindfulness',
      rating: 4.8,
      readTime: '4 min',
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      category: 'Habits',
      rating: 4.9,
      readTime: '6 min',
    },
    {
      title: 'The Happiness Hypothesis',
      author: 'Jonathan Haidt',
      category: 'Psychology',
      rating: 4.7,
      readTime: '5 min',
    },
  ];

  const videos = [
    {
      title: '10-Minute Morning Meditation',
      instructor: 'Sarah Chen',
      duration: '10:24',
      category: 'Meditation',
    },
    {
      title: 'Building Resilience in Difficult Times',
      instructor: 'Dr. Marcus Webb',
      duration: '15:30',
      category: 'Mental Health',
    },
    {
      title: 'The Science of Goal Achievement',
      instructor: 'Prof. Lisa Rodriguez',
      duration: '12:45',
      category: 'Productivity',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-300';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-300';
      case 'Advanced': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const content = (
    <>
      {/* Daily Challenges */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400" />
          Daily Challenges
        </h2>
        
        {isLoadingChallenges ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <LoadingCard key={i} className="h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
              const isEnrolled = isEnrolledInChallenge(challenge.id);
              
              return (
                <Card key={challenge.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-white text-lg">{challenge.title}</CardTitle>
                      <Badge className={getDifficultyColor(challenge.difficulty)} variant="outline">
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">{challenge.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{challenge.duration_days} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white capitalize">{challenge.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Participants:</span>
                        <span className="text-white">{challenge.participant_count.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/challenge/${challenge.id}`)}
                          className="flex-1"
                        >
                          View Details
                        </Button>
                        {isEnrolled && (
                          <Badge className="bg-green-500/20 text-green-300 px-3 py-1">
                            Enrolled
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Reading Recommendations */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-green-400" />
          Curated Readings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readings.map((reading, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                    {reading.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm">{reading.rating}</span>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-1">{reading.title}</h3>
                <p className="text-gray-400 text-sm mb-3">by {reading.author}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">{reading.readTime} read</span>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Read
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Content */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <Play className="w-6 h-6 text-red-400" />
          Video Guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                    {video.category}
                  </span>
                  <span className="text-gray-400 text-xs">{video.duration}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-4">with {video.instructor}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Play className="w-3 h-3 mr-1" />
                  Watch Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <ResponsiveLayout title="Resources" subtitle="Curated content to support your growth journey">
      {content}
    </ResponsiveLayout>
  );
};

export default Resources;
