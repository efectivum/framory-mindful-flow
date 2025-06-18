
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEmotionColor, getEmotionAnalysis } from '@/utils/emotionUtils';

interface EmotionAnalysisViewProps {
  emotion: string;
  emotions: Record<string, number>;
  onBack: () => void;
  onViewEntries?: (emotion: string) => void;
  onAskQuestions?: (emotion: string) => void;
}

export const EmotionAnalysisView = ({ 
  emotion, 
  emotions, 
  onBack, 
  onViewEntries, 
  onAskQuestions 
}: EmotionAnalysisViewProps) => {
  const analysis = getEmotionAnalysis(emotion, emotions);

  return (
    <motion.div
      key="analysis"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header with emotion info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div 
          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getEmotionColor(emotion)} flex items-center justify-center`}
        >
          <span className="text-white font-bold text-base sm:text-lg capitalize">
            {emotion[0]}
          </span>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white capitalize">{emotion}</h3>
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
          onClick={() => onViewEntries?.(emotion)}
        >
          Show relevant journal items
        </Button>
        <Button 
          className="min-h-[44px] bg-indigo-600 hover:bg-indigo-700 touch-manipulation text-sm"
          onClick={() => onAskQuestions?.(emotion)}
        >
          Ask questions
        </Button>
      </div>
    </motion.div>
  );
};
