
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmotionBubbleChartProps {
  emotions: Record<string, number>;
  onEmotionClick?: (emotion: string) => void;
}

const emotionColors: Record<string, string> = {
  joy: 'bg-yellow-400',
  happiness: 'bg-yellow-400',
  gratitude: 'bg-green-400',
  love: 'bg-pink-400',
  excitement: 'bg-orange-400',
  peace: 'bg-blue-300',
  hope: 'bg-purple-300',
  anxiety: 'bg-red-400',
  stress: 'bg-red-500',
  sadness: 'bg-blue-600',
  anger: 'bg-red-600',
  frustration: 'bg-orange-600',
  worry: 'bg-yellow-600',
  fear: 'bg-gray-600',
  loneliness: 'bg-indigo-600',
  confusion: 'bg-gray-500',
  neutral: 'bg-gray-400',
  calm: 'bg-blue-200',
  contentment: 'bg-green-300',
  pride: 'bg-purple-400',
};

export const EmotionBubbleChart = ({ emotions, onEmotionClick }: EmotionBubbleChartProps) => {
  const maxIntensity = Math.max(...Object.values(emotions));
  const minSize = 40;
  const maxSize = 120;

  const getBubbleSize = (intensity: number) => {
    const normalizedIntensity = intensity / maxIntensity;
    return minSize + (maxSize - minSize) * normalizedIntensity;
  };

  const getEmotionColor = (emotion: string) => {
    return emotionColors[emotion.toLowerCase()] || 'bg-gray-400';
  };

  const sortedEmotions = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12); // Show top 12 emotions

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Emotional Landscape</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-[300px] flex flex-wrap items-center justify-center gap-4 p-4">
          {sortedEmotions.map(([emotion, intensity], index) => {
            const size = getBubbleSize(intensity);
            return (
              <motion.div
                key={emotion}
                className={`
                  relative rounded-full cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg
                  ${getEmotionColor(emotion)} opacity-80 hover:opacity-100
                  flex items-center justify-center text-white font-medium text-sm
                `}
                style={{ 
                  width: `${size}px`, 
                  height: `${size}px`,
                  fontSize: `${Math.max(10, size / 8)}px`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ scale: 1.1, opacity: 1 }}
                onClick={() => onEmotionClick?.(emotion)}
                title={`${emotion}: ${intensity.toFixed(1)}/10`}
              >
                <div className="text-center">
                  <div className="font-medium capitalize">{emotion}</div>
                  <div className="text-xs opacity-90">{intensity.toFixed(1)}</div>
                </div>
                
                {/* Floating animation for top emotions */}
                {index < 3 && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Click on emotions to explore related journal entries
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
