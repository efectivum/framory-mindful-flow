
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { VoiceRecordingButton } from './VoiceRecordingButton';
import { VoiceRecordingControls } from './VoiceRecordingControls';

interface VoiceRecordingModalProps {
  open: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceRecordingModal = ({ open, onClose, onTranscriptionComplete }: VoiceRecordingModalProps) => {
  const [language, setLanguage] = useState('et');
  const { toast } = useToast();

  const {
    isRecording,
    recordingTime,
    audioLevel,
    status,
    errorMessage,
    maxRecordingTime,
    checkMicrophonePermission,
    startRecording,
    stopRecording,
    cleanup
  } = useVoiceRecording({
    onTranscriptionComplete,
    onSuccess: () => {
      onClose();
      toast({
        title: "Success!",
        description: "Voice recording transcribed successfully!",
      });
    }
  });

  useEffect(() => {
    if (open) {
      checkMicrophonePermission();
    } else {
      cleanup();
    }
    
    return cleanup;
  }, [open, checkMicrophonePermission, cleanup]);

  const handleStartRecording = () => {
    startRecording(language);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md mx-auto h-screen sm:h-auto sm:max-h-[600px] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Voice Recording</DialogTitle>
          <DialogDescription>
            Record your voice message and it will be transcribed to text automatically.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-6">
          <VoiceRecordingControls
            language={language}
            onLanguageChange={setLanguage}
            isRecording={isRecording}
            recordingTime={recordingTime}
            maxRecordingTime={maxRecordingTime}
            status={status}
            errorMessage={errorMessage}
            onRetry={checkMicrophonePermission}
            onClose={onClose}
          />

          <VoiceRecordingButton
            isRecording={isRecording}
            status={status}
            audioLevel={audioLevel}
            recordingTime={recordingTime}
            maxRecordingTime={maxRecordingTime}
            onStart={handleStartRecording}
            onStop={stopRecording}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
