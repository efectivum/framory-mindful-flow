
import { Calendar, TrendingUp, Heart, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeeklyInsight } from '@/hooks/useWeeklyInsights';
import { motion } from 'framer-motion';

interface WeeklyInsightCardProps {
  insight: WeeklyInsight;
  isLatest?: boolean;
}

export const WeeklyInsightCard = ({ insight, isLatest = false }: WeeklyInsightCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${
        isLatest 
          ? 'bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30' 
          : 'bg-gray-800/50 border-gray-700'
      } backdrop-blur-sm hover:shadow-lg transition-all duration-300`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Week of {formatDate(insight.week_start_date)}
              {isLatest && <Badge variant="secondary" className="ml-2">Latest</Badge>}
            </CardTitle>
            <div className="text-gray-400 text-sm">
              {insight.entry_count} entries
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Emotional Summary */}
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              Your Emotional Journey
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {insight.emotional_summary}
            </p>
          </div>

          {/* Growth Observations */}
          {insight.growth_observations && insight.growth_observations.length > 0 && (
            <div>
              <h4 className="text-green-300 font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Growth Highlights
              </h4>
              <div className="space-y-1">
                {insight.growth_observations.map((observation, index) => (
                  <div key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-green-400 text-xs mt-1">✨</span>
                    <span>{observation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Patterns */}
          {insight.key_patterns && insight.key_patterns.length > 0 && (
            <div>
              <h4 className="text-blue-300 font-medium mb-2">Key Patterns</h4>
              <div className="space-y-1">
                {insight.key_patterns.slice(0, 3).map((pattern, index) => (
                  <div key={index} className="text-gray-300 text-sm">
                    • {pattern}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {insight.recommendations && insight.recommendations.length > 0 && (
            <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <h4 className="text-indigo-300 font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Personalized Suggestions
              </h4>
              <div className="space-y-1">
                {insight.recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="text-gray-300 text-sm">
                    • {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood Average */}
          {insight.average_mood > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Average Mood</span>
              <span className="text-white font-medium">{insight.average_mood.toFixed(1)}/5</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
