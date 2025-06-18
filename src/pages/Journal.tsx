import React, { useState } from 'react';
import { BookOpen, Mic, History, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useMobileModal } from '@/hooks/useMobileModal';
import { FocusedWritingMode } from '@/components/FocusedWritingMode';
import { MoodCaptureStep } from '@/components/MoodCaptureStep';
import { CoachingChoiceStep } from '@/components/CoachingChoiceStep';
import { JournalEntryAnalysisPage } from '@/components/JournalEntryAnalysisPage';
import { VoiceRecordingModal } from '@/components/VoiceRecordingModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';

type FlowState = 'writing' | 'coaching-choice' | 'mood-capture' | 'analysis' | 'closed';
type ActionType = 'finish' | 'go-deeper' | 'finalize-after-choice';

const Journal = () => {
  const navigate = useNavigate();
  const { createEntry, isCreating } = useJournalEntries();
  const { isModalOpen, openModal, closeModal } = useMobileModal();
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [flowState, setFlowState] = useState<FlowState>('closed');
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [initialContent, setInitialContent] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [actionType, setActionType] = useState<ActionType>('finish');

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
      
      if (actionType === 'go-deeper') {
        setFlowState('analysis');
      } else {
        setFlowState('closed');
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    console.log('Voice transcription received:', text);
    setIsVoiceMode(false);
    setInitialContent(text);
    setFlowState('writing');
    openModal();
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
    setInitialContent(prompt + '\n\n');
    setFlowState('writing');
    openModal();
  };

  const handleStartWriting = () => {
    setInitialContent('');
    setFlowState('writing');
    openModal();
  };

  const handleFinish = (content: string) => {
    setEntryContent(content);
    setActionType('finish');
    setFlowState('mood-capture');
  };

  const handleGoDeeper = (content: string) => {
    setEntryContent(content);
    setActionType('go-deeper');
    setFlowState('coaching-choice');
  };

  const handleChatWithCoach = () => {
    // Navigate to coach with journal content as context
    navigate('/coach', { 
      state: { 
        journalContext: entryContent,
        contextType: 'journal-entry' 
      } 
    });
  };

  const handleFinalizeEntry = () => {
    setActionType('finalize-after-choice');
    setFlowState('mood-capture');
  };

  const handleMoodSelect = (mood?: number) => {
    handleSaveEntry(entryContent, mood);
  };

  const handleMoodSkip = () => {
    handleSaveEntry(entryContent);
  };

  const handleCloseAll = () => {
    setFlowState('closed');
    closeModal();
    setInitialContent('');
    setEntryContent('');
  };

  if (flowState === 'analysis' && currentEntryId) {
    return (
      <JournalEntryAnalysisPage 
        entryId={currentEntryId} 
      />
    );
  }

  const content = (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 pb-24 md:pb-6">
      <div className="w-full max-w-2xl space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            What's on your mind?
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
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
            <CardContent className="p-6 md:p-8">
              <div 
                className="min-h-32 w-full p-4 bg-transparent border-2 border-dashed border-gray-600 rounded-lg cursor-text hover:border-gray-500 transition-colors flex items-center justify-center touch-manipulation"
                onClick={handleStartWriting}
              >
                <div className="text-center">
                  <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 text-base md:text-lg">Click here to start writing</p>
                  <p className="text-gray-500 text-sm mt-2">Or use voice to capture your thoughts</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center mt-6 gap-3 sm:gap-4 mobile-touch-spacing">
                <Button
                  onClick={handleStartWriting}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-10 py-3 min-h-[44px] text-base mobile-button haptic-light"
                  disabled={isCreating}
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Start Writing
                </Button>
                
                <Button
                  onClick={() => setIsVoiceMode(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 min-h-[44px] min-w-[44px] mobile-button haptic-light"
                  disabled={isCreating}
                  title="Voice Note"
                >
                  <Mic className="w-5 h-5" />
                  <span className="ml-2 sm:hidden">Voice Note</span>
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
          
          <div className="grid gap-3 mobile-touch-spacing">
            {prompts.slice(0, 3).map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="text-left p-4 bg-gray-800/20 hover:bg-gray-800/40 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all group min-h-[44px] touch-manipulation haptic-light"
              >
                <span className="text-gray-300 group-hover:text-white text-sm md:text-base">
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
            className="text-gray-400 hover:text-white min-h-[44px] px-6 py-3 mobile-button"
          >
            <History className="w-4 h-4 mr-2" />
            View Past Entries
          </Button>
        </motion.div>
      </div>

      {/* Focused Writing Mode */}
      <FocusedWritingMode
        isOpen={flowState === 'writing'}
        onClose={handleCloseAll}
        onFinish={handleFinish}
        onGoDeeper={handleGoDeeper}
        initialContent={initialContent}
      />

      {/* Coaching Choice Step */}
      <CoachingChoiceStep
        isVisible={flowState === 'coaching-choice'}
        onChatWithCoach={handleChatWithCoach}
        onFinalizeEntry={handleFinalizeEntry}
      />

      {/* Mood Capture Step */}
      <MoodCaptureStep
        isVisible={flowState === 'mood-capture'}
        onMoodSelect={handleMoodSelect}
        onSkip={handleMoodSkip}
      />

      {/* Voice Recording Modal */}
      <VoiceRecordingModal
        open={isVoiceMode}
        onClose={() => setIsVoiceMode(false)}
        onTranscriptionComplete={handleVoiceTranscription}
      />
    </div>
  );

  return (
    <ResponsiveLayout title="Journal" hideBottomNav={isModalOpen}>
      {content}
    </ResponsiveLayout>
  );
};

export default Journal;
