
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EmotionBreakdownProps {
  emotions: Record<string, number>;
  title?: string;
}

export const EmotionBreakdown = ({ emotions, title = "Emotion Analysis" }: EmotionBreakdownProps) => {
  const getEmotionColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      'joy': 'bg-yellow-500',
      'happiness': 'bg-yellow-500',
      'gratitude': 'bg-green-500',
      'contentment': 'bg-blue-500',
      'excitement': 'bg-orange-500',
      'love': 'bg-pink-500',
      'sadness': 'bg-blue-700',
      'anxiety': 'bg-red-500',
      'stress': 'bg-red-600',
      'frustration': 'bg-red-400',
      'anger': 'bg-red-700',
      'fear': 'bg-purple-600',
      'exhaustion': 'bg-gray-600',
      'neutral': 'bg-gray-400',
      'calm': 'bg-teal-500',
      'peace': 'bg-green-400',
      'hope': 'bg-sky-500',
      'optimism': 'bg-yellow-400',
    };
    
    return colorMap[emotion.toLowerCase()] || 'bg-gray-500';
  };

  const sortedEmotions = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEmotions.map(([emotion, percentage]) => (
            <div key={emotion} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300 capitalize">{emotion}</span>
                <span className="text-white font-medium">{Math.round(percentage)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${getEmotionColor(emotion)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
