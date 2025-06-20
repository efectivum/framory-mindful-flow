
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Trophy, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { useChallenges } from '@/hooks/useChallenges';
import { useAuth } from '@/hooks/useAuth';

export const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getChallengeById, 
    isEnrolledInChallenge, 
    enrollInChallenge, 
    isEnrolling,
    userChallenges 
  } = useChallenges();

  const challenge = getChallengeById(id || '');
  const isEnrolled = isEnrolledInChallenge(id || '');
  const userChallenge = userChallenges.find(uc => uc.challenge_id === id);

  if (!challenge) {
    return (
      <ResponsiveLayout title="Challenge Not Found">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-white mb-2">Challenge not found</h3>
          <Button onClick={() => navigate('/resources')} variant="outline">
            Back to Resources
          </Button>
        </div>
      </ResponsiveLayout>
    );
  }

  const handleEnroll = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    enrollInChallenge(challenge.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-300';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-300';
      case 'Advanced': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <ResponsiveLayout title={challenge.title}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/resources')}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline" className="text-gray-300">
              {challenge.category}
            </Badge>
          </div>
        </div>

        {/* Challenge Overview */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-2xl">{challenge.title}</CardTitle>
            <p className="text-gray-300 text-lg">{challenge.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-semibold">{challenge.duration_days} Days</p>
                <p className="text-gray-400 text-sm">Duration</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-semibold">{challenge.participant_count.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Participants</p>
              </div>
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-semibold">{challenge.success_rate || 85}%</p>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-semibold">{challenge.difficulty}</p>
                <p className="text-gray-400 text-sm">Difficulty</p>
              </div>
            </div>

            {/* Progress for enrolled users */}
            {isEnrolled && userChallenge && (
              <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-blue-300 font-semibold">Your Progress</h4>
                  <span className="text-blue-300 text-sm">
                    Day {userChallenge.current_day} of {challenge.duration_days}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(userChallenge.current_day / challenge.duration_days) * 100}%` }}
                  />
                </div>
                <p className="text-gray-300 text-sm mt-2">
                  {userChallenge.total_completions} days completed
                </p>
              </div>
            )}

            {/* Enrollment Button */}
            {!isEnrolled && (
              <Button 
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
              >
                {isEnrolling ? 'Enrolling...' : 'Join Challenge'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              What's Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {challenge.what_included.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Benefits You'll Gain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {challenge.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips (if available) */}
        {challenge.tips && challenge.tips.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Tips for Success</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {challenge.tips.map((tip, index) => (
                  <li key={index} className="text-gray-300">
                    <span className="text-blue-400 font-medium">{index + 1}.</span> {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </ResponsiveLayout>
  );
};
