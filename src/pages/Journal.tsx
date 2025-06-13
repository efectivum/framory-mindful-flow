
import React, { useState } from 'react';
import { BookOpen, Mic, History, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageLayout } from '@/components/PageLayout';
import { MobileLayout } from '@/components/MobileLayout';
import { FocusedWritingMode } from '@/components/FocusedWritingMode';
import { JournalEntryAnalysisPage } from '@/components/JournalEntryAnalysisPage';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Journal = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { createEntry, isCreating } = useJournalEntries();
  const [isWritingMode, setIsWritingMode] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  const handleSaveEntry = async (content: string, mood?: number) => {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        createEntry(
          { content, mood_after: mood },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error)
          }
        );
      });
      
      setCurrentEntryId(result.id);
      setIsWritingMode(false);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  };

  const prompts = [
    "What am I grateful for today?",
    "How am I feeling right now?",
    "What did I learn today?",
    "What challenged me today?",
    "What made me smile today?",
    "How can I improve tomorrow?"
  ];

  const handlePromptClick = (prompt: string) => {
    // For now, just open writing mode
    setIsWritingMode(true);
  };

  if (showAnalysis && currentEntryId) {
    return (
      <JournalEntryAnalysisPage 
        entryId={currentEntryId} 
      />
    );
  }

  const content = (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-3">
            What's on your mind?
          </h1>
          <p className="text-gray-400 text-lg">
            Take a moment to reflect and capture your thoughts
          </p>
        </motion.div>

        {/* Main Writing Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/40 transition-all duration-300">
            <CardContent className="p-8">
              <div 
                className="min-h-32 w-full p-4 bg-transparent border-2 border-dashed border-gray-600 rounded-lg cursor-text hover:border-gray-500 transition-colors flex items-center justify-center"
                onClick={() => setIsWritingMode(true)}
              >
                <div className="text-center">
                  <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 text-lg">Click here to start writing</p>
                  <p className="text-gray-500 text-sm mt-2">Or use voice to capture your thoughts</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-6 gap-4">
                <Button
                  onClick={() => setIsWritingMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  disabled={isCreating}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Writing
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsWritingMode(true)}
                  className="border-gray-600 text-gray-300 hover:text-white px-8 py-3"
                  disabled={isCreating}
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Voice Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Writing Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm">Need inspiration? Try one of these prompts:</span>
          </div>
          
          <div className="grid gap-3">
            {prompts.slice(0, 3).map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="text-left p-4 bg-gray-800/20 hover:bg-gray-800/40 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all group"
              >
                <span className="text-gray-300 group-hover:text-white">
                  {prompt}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/journal/history')}
            className="text-gray-400 hover:text-white"
          >
            <History className="w-4 h-4 mr-2" />
            View Past Entries
          </Button>
        </motion.div>
      </div>

      {/* Focused Writing Mode */}
      <FocusedWritingMode
        isOpen={isWritingMode}
        onClose={() => setIsWritingMode(false)}
        onSave={handleSaveEntry}
      />
    </div>
  );

  // Use MobileLayout for mobile with swipe functionality
  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  // Use PageLayout for desktop - but minimal header
  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {content}
    </div>
  );
};

export default Journal;
