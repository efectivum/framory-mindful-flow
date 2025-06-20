
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Heart } from 'lucide-react';
import { EmotionAnalysis } from '@/hooks/useAnalytics';

interface EnhancedEmotionAnalysisProps {
  emotions: EmotionAnalysis[];
}

export const EnhancedEmotionAnalysis: React.FC<EnhancedEmotionAnalysisProps> = ({ emotions }) => {
  if (emotions.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Emotion Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-gray-400">
            <p>Write journal entries to analyze your emotions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      'joy': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'happiness': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'love': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'gratitude': 'bg-green-500/20 text-green-300 border-green-500/30',
      'excitement': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'sadness': 'bg-blue-700/20 text-blue-300 border-blue-700/30',
      'anxiety': 'bg-red-500/20 text-red-300 border-red-500/30',
      'stress': 'bg-red-600/20 text-red-300 border-red-600/30',
      'anger': 'bg-red-700/20 text-red-300 border-red-700/30',
      'fear': 'bg-purple-600/20 text-purple-300 border-purple-600/30',
      'calm': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      'peace': 'bg-green-400/20 text-green-300 border-green-400/30',
    };
    
    return colorMap[emotion.toLowerCase()] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const dominantEmotion = emotions[0];
  const emergingEmotions = emotions.filter(e => e.trend === 'up').slice(0, 3);
  const decliningEmotions = emotions.filter(e => e.trend === 'down').slice(0, 3);

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Emotion Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dominant Emotion */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Most Frequent</h4>
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge className={getEmotionColor(dominantEmotion.emotion)}>
                {dominantEmotion.emotion}
              </Badge>
              <span className="text-gray-300 text-sm">
                {dominantEmotion.frequency} occurrences
              </span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(dominantEmotion.trend)}
              <span className="text-xs text-gray-400">
                {dominantEmotion.correlation}x
              </span>
            </div>
          </div>
        </div>

        {/* Trending Up */}
        {emergingEmotions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-green-400 font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Emerging Patterns
            </h4>
            <div className="space-y-2">
              {emergingEmotions.map((emotion) => (
                <div key={emotion.emotion} className="flex items-center justify-between">
                  <Badge className={getEmotionColor(emotion.emotion)}>
                    {emotion.emotion}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{emotion.frequency} times</span>
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Down */}
        {decliningEmotions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-blue-400 font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Declining Patterns
            </h4>
            <div className="space-y-2">
              {decliningEmotions.map((emotion) => (
                <div key={emotion.emotion} className="flex items-center justify-between">
                  <Badge className={getEmotionColor(emotion.emotion)}>
                    {emotion.emotion}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{emotion.frequency} times</span>
                    <TrendingDown className="w-3 h-3 text-blue-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Emotions Grid */}
        <div className="space-y-3">
          <h4 className="text-gray-300 font-medium">All Detected Emotions</h4>
          <div className="flex flex-wrap gap-2">
            {emotions.map((emotion) => (
              <div key={emotion.emotion} className="flex items-center gap-1">
                <Badge className={getEmotionColor(emotion.emotion)}>
                  {emotion.emotion}
                </Badge>
                {getTrendIcon(emotion.trend)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
