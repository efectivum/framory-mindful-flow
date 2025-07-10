import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodSelector } from '@/components/mood/MoodSelector';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { PenLine, Heart, CheckCircle } from 'lucide-react';

interface DailyMoodCheckProps {
  onMoodLogged: (logged: boolean) => void;
}

export const DailyMoodCheck: React.FC<DailyMoodCheckProps> = ({ onMoodLogged }) => {
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if mood already logged today (simplified - in real app would check from API)
  useEffect(() => {
    const today = new Date().toDateString();
    const savedMood = localStorage.getItem(`mood_${today}`);
    if (savedMood) {
      setTodayMood(parseInt(savedMood));
      onMoodLogged(true);
    }
  }, [onMoodLogged]);

  const handleMoodSelect = (mood: number) => {
    const today = new Date().toDateString();
    localStorage.setItem(`mood_${today}`, mood.toString());
    setTodayMood(mood);
    setShowMoodSelector(false);
    setShowJournalPrompt(true);
    onMoodLogged(true);
    
    toast({
      title: "Mood logged! ✨",
      description: "Thank you for checking in with yourself",
    });
  };

  const handleJournalYes = () => {
    navigate('/journal', { 
      state: { 
        initialMood: todayMood,
        prompt: "How are you feeling right now? What's on your mind?"
      }
    });
  };

  const handleJournalSkip = () => {
    setShowJournalPrompt(false);
  };

  if (todayMood && !showJournalPrompt) {
    return (
      <Card className="app-card-organic animate-fade-in mb-6">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="text-green-300 font-medium">Mood logged for today</p>
          </div>
          <p className="text-gray-400 text-sm">
            You can always add more thoughts in your journal
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/journal')}
            className="mt-3 text-gray-400 hover:text-white"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Write in journal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="app-card-organic animate-fade-in mb-6">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-4 flex items-center justify-center animate-breathe">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white font-semibold text-xl mb-2">
              How are you feeling?
            </h2>
            <p className="text-gray-400">
              Take a moment to check in with yourself
            </p>
          </div>
          
          <Button
            size="lg"
            onClick={() => setShowMoodSelector(true)}
            className="btn-organic w-full max-w-xs glow-primary"
          >
            Check my mood
          </Button>
        </CardContent>
      </Card>

      {/* Mood Selector Modal */}
      <AnimatePresence>
        {showMoodSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md">
              <MoodSelector
                onMoodSelect={handleMoodSelect}
                title="How are you feeling right now?"
                subtitle="Your feelings are valid and important"
                size="md"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journal Prompt Modal */}
      <AnimatePresence>
        {showJournalPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card className="app-card-organic">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 mx-auto mb-4 flex items-center justify-center">
                      <PenLine className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      Would you like to journal about this?
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Writing about your feelings can help you process them
                    </p>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="ghost"
                      onClick={handleJournalSkip}
                      className="text-gray-400 hover:text-white"
                    >
                      Skip for now
                    </Button>
                    <Button
                      onClick={handleJournalYes}
                      className="btn-organic glow-primary"
                    >
                      Yes, let's write
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};