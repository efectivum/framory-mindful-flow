import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, BookOpen, Lightbulb, Target, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useQuickAnalysis } from '@/hooks/useQuickAnalysis';
import { MoodDisplay } from '@/components/MoodDisplay';
import { motion } from 'framer-motion';

interface JournalEntryAnalysisPageProps {
  entryId?: string;
}

export const JournalEntryAnalysisPage: React.FC<JournalEntryAnalysisPageProps> = ({ entryId }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries } = useJournalEntries();
  const { getQuickAnalysis } = useQuickAnalysis();

  const currentEntryId = entryId || id;
  const entry = entries.find(e => e.id === currentEntryId);
  const { data: analysis } = getQuickAnalysis(currentEntryId || '');

  if (!entry) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400 mb-4">Entry not found</p>
            <Button onClick={() => navigate('/journal')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasAIAnalysis = entry.ai_detected_emotions || entry.ai_detected_mood || analysis;
  
  const suggestedTopics = [
    "What patterns do you notice in your thoughts today?",
    "How did your emotions shift throughout the day?", 
    "What would you like to explore deeper?",
    "What challenged you most today?",
    "What are you grateful for right now?",
    "How can you build on today's insights?"
  ];

  const shouldRecommendChat = entry.ai_detected_emotions?.some(emotion => 
    ['stress', 'anxiety', 'overwhelm', 'frustration', 'worry'].includes(emotion.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/journal')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journal
          </Button>
          
          <div className="text-right">
            <h1 className="text-2xl font-bold text-white">Entry Saved!</h1>
            <p className="text-gray-400">
              {hasAIAnalysis ? "Here's what we discovered" : "AI analysis in progress..."}
            </p>
          </div>
        </motion.div>

        {/* Entry Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">Your Entry</CardTitle>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {entry.mood_after && (
                  <MoodDisplay 
                    userMood={entry.mood_after}
                    aiMood={entry.ai_detected_mood}
                    aiEmotions={entry.ai_detected_emotions}
                    aiConfidence={entry.ai_confidence_level}
                    alignmentScore={entry.mood_alignment_score}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed line-clamp-4">
                {entry.content}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Analysis */}
        {hasAIAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Mood & Emotions */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Detected Mood */}
                {entry.ai_detected_mood && (
                  <div>
                    <h4 className="text-blue-300 font-medium mb-2">Detected Mood</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{entry.ai_detected_mood}/5</span>
                      {entry.ai_confidence_level && (
                        <span className="text-gray-400 text-sm">
                          ({Math.round(entry.ai_confidence_level * 100)}% confidence)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Detected Emotions */}
                {entry.ai_detected_emotions && entry.ai_detected_emotions.length > 0 && (
                  <div>
                    <h4 className="text-purple-300 font-medium mb-2">Emotions Detected</h4>
                    <div className="flex gap-2 flex-wrap">
                      {entry.ai_detected_emotions.map((emotion, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Insights */}
                {analysis?.quick_takeaways && analysis.quick_takeaways.length > 0 && (
                  <div>
                    <h4 className="text-green-300 font-medium mb-2">Key Insights</h4>
                    <div className="space-y-2">
                      {analysis.quick_takeaways.map((takeaway, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-green-400 text-sm mt-1">✨</span>
                          <span className="text-gray-300 text-sm">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Growth Indicators */}
            {analysis?.growth_indicators && analysis.growth_indicators.length > 0 && (
              <Card className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Growth Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.growth_indicators.map((indicator, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-green-400 text-sm mt-1">🌱</span>
                        <span className="text-gray-300 text-sm">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Chat Recommendation */}
        {shouldRecommendChat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border-indigo-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Suggested Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  I notice some patterns that might benefit from a deeper conversation. 
                  Would you like to explore these thoughts with your AI coach?
                </p>
                <Button 
                  onClick={() => navigate('/chat')}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Start Conversation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Next Writing Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Continue Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {suggestedTopics.slice(0, 4).map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => navigate('/journal')}
                    className="text-left p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg border border-gray-600 transition-colors group"
                  >
                    <span className="text-gray-300 group-hover:text-white text-sm">
                      {topic}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={() => navigate('/journal')}
                  variant="outline"
                  className="w-full"
                >
                  Write Another Entry
                </Button>
                <Button 
                  onClick={() => navigate('/journal/history')}
                  variant="outline"
                  className="w-full"
                >
                  View All Entries
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
