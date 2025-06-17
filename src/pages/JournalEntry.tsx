
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useQuickAnalysis } from '@/hooks/useQuickAnalysis';
import { MoodDisplay } from '@/components/MoodDisplay';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { DeepReflectionModal } from '@/components/DeepReflectionModal';
import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';

const JournalEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries } = useJournalEntries();
  const { getQuickAnalysis } = useQuickAnalysis();
  const [showDeepReflection, setShowDeepReflection] = useState(false);

  const entry = entries.find(e => e.id === id);
  const { data: analysis } = getQuickAnalysis(id || '');

  if (!entry) {
    return (
      <ResponsiveLayout title="Entry Not Found" subtitle="The journal entry you're looking for doesn't exist.">
        <div className="text-center">
          <Button onClick={() => navigate('/journal')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journal
          </Button>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Journal Entry" subtitle={format(new Date(entry.created_at), 'EEEE, MMMM d, yyyy')}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/journal')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Journal
        </Button>

        {/* Simplified AI Analysis Section */}
        {analysis && (
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Emotions */}
              {entry.ai_detected_emotions && entry.ai_detected_emotions.length > 0 && (
                <div>
                  <h4 className="text-purple-300 font-medium mb-2">Main Emotions</h4>
                  <div className="flex gap-2 flex-wrap">
                    {entry.ai_detected_emotions.slice(0, 5).map((emotion, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Short Summary */}
              {analysis.quick_takeaways && analysis.quick_takeaways.length > 0 && (
                <div>
                  <h4 className="text-blue-300 font-medium mb-2">Summary</h4>
                  <div className="space-y-1">
                    {analysis.quick_takeaways.map((takeaway, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-blue-400 text-sm mt-1">•</span>
                        <span className="text-gray-300 text-sm">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Go Deeper Button */}
              <div className="pt-3 border-t border-gray-600">
                <Button
                  onClick={() => setShowDeepReflection(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Go Deeper
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entry Content */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {entry.title && (
                  <CardTitle className="text-white text-xl mb-2">{entry.title}</CardTitle>
                )}
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}</span>
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                {entry.content}
              </p>
            </div>
            
            {entry.tags && entry.tags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex gap-2 flex-wrap">
                  {entry.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deep Reflection Modal */}
        <DeepReflectionModal
          open={showDeepReflection}
          onClose={() => setShowDeepReflection(false)}
          entry={entry}
        />
      </div>
    </ResponsiveLayout>
  );
};

export default JournalEntry;
