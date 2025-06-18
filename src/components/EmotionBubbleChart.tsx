
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EmotionBubbleGrid } from './EmotionBubbleGrid';
import { EmotionAnalysisView } from './EmotionAnalysisView';

interface EmotionBubbleChartProps {
  emotions: Record<string, number>;
  onEmotionClick?: (emotion: string) => void;
  onViewEntries?: (emotion: string) => void;
  onAskQuestions?: (emotion: string) => void;
}

export const EmotionBubbleChart = ({ emotions, onEmotionClick, onViewEntries, onAskQuestions }: EmotionBubbleChartProps) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'bubbles' | 'analysis'>('bubbles');

  const handleEmotionClick = (emotion: string) => {
    setSelectedEmotion(emotion);
    setViewMode('analysis');
    onEmotionClick?.(emotion);
  };

  const handleBack = () => {
    setViewMode('bubbles');
    setSelectedEmotion(null);
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
            <EmotionBubbleGrid 
              emotions={emotions}
              onEmotionClick={handleEmotionClick}
            />
          ) : selectedEmotion && (
            <EmotionAnalysisView
              emotion={selectedEmotion}
              emotions={emotions}
              onBack={handleBack}
              onViewEntries={onViewEntries}
              onAskQuestions={onAskQuestions}
            />
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
