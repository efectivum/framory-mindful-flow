
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEmotionColor, getEmotionAnalysis } from '@/utils/emotionUtils';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleViewEntries = () => {
    if (onViewEntries) {
      onViewEntries(emotion);
    } else {
      // Default behavior: navigate to journal with emotion filter
      navigate(`/journal?emotion=${encodeURIComponent(emotion)}`);
    }
  };

  const handleAskQuestions = () => {
    if (onAskQuestions) {
      onAskQuestions(emotion);
    } else {
      // Default behavior: navigate to coach with emotion context
      navigate(`/coach?topic=${encodeURIComponent(`Help me understand my ${emotion} feelings`)}`);
    }
  };

  return (
    <motion.div
      key="analysis"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="mobile-flow"
    >
      {/* Header with emotion info */}
      <div className="mobile-flex mobile-flex-center">
        <div 
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${getEmotionColor(emotion)} mobile-flex mobile-flex-center`}
        >
          <span className="text-white font-bold text-base md:text-lg capitalize">
            {emotion[0]}
          </span>
        </div>
        <div>
          <h3 className="mobile-h3 text-foreground capitalize">{emotion}</h3>
          <p className="mobile-text-body text-muted-foreground">
            {analysis.percentage}% intensity • Appears {analysis.frequency.toFixed(1)} times
          </p>
        </div>
      </div>

      {/* Analysis sections */}
      <div className="mobile-flow-tight">
        <div className="mobile-card mobile-card-compact">
          <div className="mobile-flex mobile-flex-center mobile-section">
            <Brain className="w-4 h-4 text-accent" />
            <h4 className="mobile-text-body font-medium text-foreground">Understanding</h4>
          </div>
          <p className="mobile-text-body text-foreground leading-relaxed">
            {analysis.description}
          </p>
        </div>

        <div className="mobile-card mobile-card-compact">
          <div className="mobile-flex mobile-flex-center mobile-section">
            <TrendingUp className="w-4 h-4 text-success" />
            <h4 className="mobile-text-body font-medium text-foreground">Patterns</h4>
          </div>
          <p className="mobile-text-body text-foreground leading-relaxed">
            {analysis.patterns}
          </p>
        </div>

        <div className="mobile-card mobile-card-compact">
          <div className="mobile-flex mobile-flex-center mobile-section">
            <Calendar className="w-4 h-4 text-primary" />
            <h4 className="mobile-text-body font-medium text-foreground">Growth Opportunities</h4>
          </div>
          <p className="mobile-text-body text-foreground leading-relaxed">
            {analysis.growth}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mobile-stack mobile-flow-tight">
        <button 
          className="mobile-button mobile-button-outline mobile-touch"
          onClick={handleViewEntries}
        >
          Show relevant journal items
        </button>
        <button 
          className="mobile-button mobile-touch"
          onClick={handleAskQuestions}
        >
          Ask questions
        </button>
      </div>
    </motion.div>
  );
};
