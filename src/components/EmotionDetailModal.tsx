
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MessageCircle, TrendingUp, Clock } from 'lucide-react';
import { JournalEntry } from '@/hooks/useJournalEntries';

interface EmotionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emotion: string;
  entries: JournalEntry[];
  onViewEntries: () => void;
  onAskQuestions: () => void;
}

export const EmotionDetailModal: React.FC<EmotionDetailModalProps> = ({
  isOpen,
  onClose,
  emotion,
  entries,
  onViewEntries,
  onAskQuestions,
}) => {
  const emotionEntries = entries.filter(entry => 
    entry.ai_detected_emotions?.some(e => e.toLowerCase() === emotion.toLowerCase())
  );

  const getEmotionInsights = () => {
    if (emotionEntries.length === 0) {
      return {
        frequency: "Not detected yet",
        recentTrend: "No data available",
        commonContext: "Write more entries to see patterns",
        suggestions: "Continue journaling to build emotional insights"
      };
    }

    const frequency = emotionEntries.length;
    const totalEntries = entries.length;
    const percentage = Math.round((frequency / totalEntries) * 100);
    
    // Analyze recent trend (last 7 days vs previous 7 days)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const recentEntries = emotionEntries.filter(entry => new Date(entry.created_at) > weekAgo);
    const previousEntries = emotionEntries.filter(entry => {
      const date = new Date(entry.created_at);
      return date > twoWeeksAgo && date <= weekAgo;
    });
    
    let trend = "stable";
    if (recentEntries.length > previousEntries.length) {
      trend = "increasing";
    } else if (recentEntries.length < previousEntries.length) {
      trend = "decreasing";
    }

    // Simple context analysis based on common words
    const commonWords = emotionEntries
      .flatMap(entry => entry.content.toLowerCase().split(/\s+/))
      .filter(word => word.length > 4)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const topWords = Object.entries(commonWords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);

    return {
      frequency: `${frequency} times (${percentage}% of entries)`,
      recentTrend: trend,
      commonContext: topWords.length > 0 ? topWords.join(", ") : "Various contexts",
      suggestions: frequency > 5 ? "Strong emotional pattern detected" : "Building emotional awareness"
    };
  };

  const insights = getEmotionInsights();
  
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: 'text-yellow-400',
      happiness: 'text-yellow-400',
      gratitude: 'text-green-400',
      love: 'text-pink-400',
      excitement: 'text-orange-400',
      peace: 'text-blue-300',
      hope: 'text-purple-300',
      anxiety: 'text-red-400',
      stress: 'text-red-500',
      sadness: 'text-blue-600',
      anger: 'text-red-600',
      frustration: 'text-orange-600',
      worry: 'text-yellow-600',
      fear: 'text-gray-600',
      loneliness: 'text-indigo-600',
      confusion: 'text-gray-500',
      neutral: 'text-gray-400',
      calm: 'text-blue-200',
      contentment: 'text-green-300',
      pride: 'text-purple-400',
    };
    return colors[emotion.toLowerCase()] || 'text-gray-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className={`text-2xl capitalize ${getEmotionColor(emotion)}`}>
            {emotion}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Emotion Summary */}
          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Frequency</p>
                    <p className="text-white">{insights.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Recent Trend</p>
                    <p className="text-white capitalize">{insights.recentTrend}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Insights</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Common Context</p>
                  <p className="text-gray-200">{insights.commonContext}</p>
                </div>
              </div>
              <div className="bg-gray-700/30 p-3 rounded-lg">
                <p className="text-gray-200">{insights.suggestions}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={onViewEntries}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              See Relevant Entries ({emotionEntries.length})
            </Button>
            <Button 
              onClick={onAskQuestions}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Questions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
