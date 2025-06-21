
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEmotionColor, getEmotionAnalysis } from '@/utils/emotionUtils';

interface EmotionBubbleCardProps {
  emotions: Record<string, number>;
  onViewEntries?: (emotion: string) => void;
  onAskQuestions?: (emotion: string) => void;
}

export const EmotionBubbleCard: React.FC<EmotionBubbleCardProps> = ({
  emotions,
  onViewEntries,
  onAskQuestions
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  
  const maxIntensity = Math.max(...Object.values(emotions));
  const minSize = 60;
  const maxSize = 120;

  const getBubbleSize = (intensity: number) => {
    const normalizedIntensity = intensity / maxIntensity;
    return minSize + (maxSize - minSize) * normalizedIntensity;
  };

  const sortedEmotions = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const handleBubbleClick = (emotion: string) => {
    setSelectedEmotion(selectedEmotion === emotion ? null : emotion);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg">Emotional Landscape</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {!selectedEmotion ? (
            <motion.div
              key="bubbles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                        hover:scale-110 active:scale-95 
                        ${getEmotionColor(emotion)} opacity-80 hover:opacity-100
                        flex items-center justify-center text-white font-medium
                        min-h-[44px] min-w-[44px]
                      `}
                      style={{ 
                        width: `${Math.max(size, 44)}px`, 
                        height: `${Math.max(size, 44)}px`,
                        fontSize: `${Math.max(11, size / 7)}px`
                      }}
                      onClick={() => handleBubbleClick(emotion)}
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
            </motion.div>
          ) : (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-12 h-12 rounded-full ${getEmotionColor(selectedEmotion)} flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-lg capitalize">
                      {selectedEmotion[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white capitalize">{selectedEmotion}</h3>
                    <p className="text-gray-400">
                      {((emotions[selectedEmotion] / maxIntensity) * 100).toFixed(0)}% intensity • {emotions[selectedEmotion].toFixed(1)} occurrences
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEmotion(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-3">
                {(() => {
                  const analysis = getEmotionAnalysis(selectedEmotion, emotions);
                  return (
                    <>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-blue-400" />
                          <h4 className="font-medium text-white">Understanding</h4>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {analysis.description}
                        </p>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <h4 className="font-medium text-white">Patterns</h4>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {analysis.patterns}
                        </p>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <h4 className="font-medium text-white">Growth Opportunities</h4>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {analysis.growth}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
                  onClick={() => onViewEntries?.(selectedEmotion)}
                >
                  View Journal Entries
                </Button>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => onAskQuestions?.(selectedEmotion)}
                >
                  Ask Questions
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
