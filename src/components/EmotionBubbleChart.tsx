
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, TrendingUp, Brain } from 'lucide-react';

interface EmotionBubbleChartProps {
  emotions: Record<string, number>;
  onEmotionClick?: (emotion: string) => void;
  onViewEntries?: (emotion: string) => void;
  onAskQuestions?: (emotion: string) => void;
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

const emotionInsights: Record<string, { description: string; patterns: string; growth: string }> = {
  joy: {
    description: "Joy represents moments of pure happiness and celebration in your life. It often emerges from achievements, connections with others, or experiencing something meaningful.",
    patterns: "Joy typically appears during social interactions, accomplishments, or when engaging in activities you're passionate about. It tends to be more frequent on weekends and during positive life events.",
    growth: "Cultivating joy involves recognizing and savoring positive moments, practicing gratitude, and engaging in activities that bring you genuine happiness."
  },
  happiness: {
    description: "Happiness reflects your overall sense of well-being and contentment. It's a broader emotional state that encompasses satisfaction with life's various aspects.",
    patterns: "Happiness often correlates with periods of stability, progress toward goals, and meaningful relationships. It tends to be sustained rather than momentary.",
    growth: "Building happiness involves aligning your actions with your values, nurturing relationships, and finding purpose in your daily activities."
  },
  anxiety: {
    description: "Anxiety indicates your mind's response to uncertainty or perceived threats. While challenging, it can also signal that you care deeply about outcomes.",
    patterns: "Anxiety often emerges before important events, during transitions, or when facing unfamiliar situations. It may be more prominent during busy periods or when feeling overwhelmed.",
    growth: "Managing anxiety involves developing coping strategies, practicing mindfulness, and gradually facing fears in manageable steps."
  },
  sadness: {
    description: "Sadness is a natural response to loss, disappointment, or difficult circumstances. It allows for processing and healing from challenging experiences.",
    patterns: "Sadness may appear during significant changes, losses, or when reflecting on past experiences. It often comes in waves and can be triggered by memories or anniversaries.",
    growth: "Processing sadness healthily involves allowing yourself to feel it, seeking support when needed, and finding meaning in difficult experiences."
  },
  stress: {
    description: "Stress reflects your response to pressure and demands. While some stress can be motivating, chronic stress signals the need for better balance and coping strategies.",
    patterns: "Stress often peaks during deadlines, conflicts, or when juggling multiple responsibilities. It may be more intense during certain times of day or specific situations.",
    growth: "Managing stress involves identifying triggers, developing healthy coping mechanisms, and creating boundaries to protect your well-being."
  }
};

export const EmotionBubbleChart = ({ emotions, onEmotionClick, onViewEntries, onAskQuestions }: EmotionBubbleChartProps) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'bubbles' | 'analysis'>('bubbles');

  const maxIntensity = Math.max(...Object.values(emotions));
  const minSize = 60; // Increased for better mobile touch
  const maxSize = 120; // Increased for mobile

  const getBubbleSize = (intensity: number) => {
    const normalizedIntensity = intensity / maxIntensity;
    return minSize + (maxSize - minSize) * normalizedIntensity;
  };

  const getEmotionColor = (emotion: string) => {
    return emotionColors[emotion.toLowerCase()] || 'bg-gray-400';
  };

  const sortedEmotions = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6); // Reduced to 6 for better mobile layout

  const handleEmotionClick = (emotion: string) => {
    setSelectedEmotion(emotion);
    setViewMode('analysis');
    onEmotionClick?.(emotion);
  };

  const handleBack = () => {
    setViewMode('bubbles');
    setSelectedEmotion(null);
  };

  const getEmotionAnalysis = (emotion: string) => {
    const intensity = emotions[emotion];
    const insight = emotionInsights[emotion.toLowerCase()] || {
      description: `${emotion} is an important emotion that reflects your inner experiences and responses to life events.`,
      patterns: `This emotion appears in your journal entries with varying frequency, often connected to specific situations or contexts.`,
      growth: `Understanding and working with this emotion can contribute to your personal growth and emotional awareness.`
    };

    return {
      frequency: intensity,
      maxFrequency: maxIntensity,
      percentage: Math.round((intensity / maxIntensity) * 100),
      ...insight
    };
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
          {viewMode === 'analysis' && selectedEmotion && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-gray-400 hover:text-white p-2 mr-2 touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          {viewMode === 'bubbles' ? 'Emotional Landscape' : `${selectedEmotion} Analysis`}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px] p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {viewMode === 'bubbles' ? (
            <motion.div
              key="bubbles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-4"
            >
              {sortedEmotions.map(([emotion, intensity], index) => {
                const size = getBubbleSize(intensity);
                return (
                  <motion.div
                    key={emotion}
                    className="flex justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                  >
                    <div
                      className={`
                        relative rounded-full cursor-pointer transition-all duration-300 
                        touch-manipulation active:scale-95 
                        ${getEmotionColor(emotion)} opacity-80 active:opacity-100
                        flex items-center justify-center text-white font-medium
                        min-h-[44px] min-w-[44px]
                      `}
                      style={{ 
                        width: `${Math.max(size, 44)}px`, 
                        height: `${Math.max(size, 44)}px`,
                        fontSize: `${Math.max(11, size / 7)}px`
                      }}
                      onClick={() => handleEmotionClick(emotion)}
                      title={`${emotion}: ${intensity.toFixed(1)}/10`}
                    >
                      <div className="text-center px-1">
                        <div className="font-medium capitalize leading-tight">{emotion}</div>
                        <div className="text-xs opacity-90 mt-0.5">{intensity.toFixed(1)}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div className="col-span-2 sm:col-span-3 text-center mt-4">
                <p className="text-gray-400 text-sm">
                  Tap on emotions to explore detailed insights
                </p>
              </div>
            </motion.div>
          ) : selectedEmotion && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              {(() => {
                const analysis = getEmotionAnalysis(selectedEmotion);
                return (
                  <>
                    {/* Header with emotion info */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div 
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getEmotionColor(selectedEmotion)} flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-base sm:text-lg capitalize">
                          {selectedEmotion[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white capitalize">{selectedEmotion}</h3>
                        <p className="text-gray-400 text-sm sm:text-base">
                          {analysis.percentage}% intensity • Appears {analysis.frequency.toFixed(1)} times
                        </p>
                      </div>
                    </div>

                    {/* Analysis sections */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gray-700/30 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-blue-400" />
                          <h4 className="font-medium text-white text-sm sm:text-base">Understanding</h4>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {analysis.description}
                        </p>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <h4 className="font-medium text-white text-sm sm:text-base">Patterns</h4>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {analysis.patterns}
                        </p>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <h4 className="font-medium text-white text-sm sm:text-base">Growth Opportunities</h4>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {analysis.growth}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons - Mobile-first vertical stacking */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        className="min-h-[44px] bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 touch-manipulation text-sm"
                        onClick={() => onViewEntries?.(selectedEmotion)}
                      >
                        Show relevant journal items
                      </Button>
                      <Button 
                        className="min-h-[44px] bg-indigo-600 hover:bg-indigo-700 touch-manipulation text-sm"
                        onClick={() => onAskQuestions?.(selectedEmotion)}
                      >
                        Ask questions
                      </Button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
