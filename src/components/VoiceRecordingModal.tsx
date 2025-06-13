
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
    onTranscriptionComplete: (text: string) => {
      console.log('Voice transcription completed:', text);
      onTranscriptionComplete(text);
    },
    onSuccess: () => {
      console.log('Voice recording successful');
      onClose();
      toast({
        title: "Success!",
        description: "Voice recording transcribed successfully!",
      });
    }
  });

  // Handle modal open/close
  useEffect(() => {
    if (open) {
      console.log('Voice recording modal opened');
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        checkMicrophonePermission();
      }, 100);
    } else {
      console.log('Voice recording modal closed');
      // Only cleanup when modal is actually closed
      cleanup();
    }
  }, [open]);

  // Handle modal close cleanup
  useEffect(() => {
    return () => {
      if (!open) {
        cleanup();
      }
    };
  }, [open, cleanup]);

  const handleStartRecording = () => {
    console.log('Starting recording with language:', language);
    startRecording(language);
  };

  const handleClose = () => {
    console.log('Closing voice recording modal');
    if (isRecording) {
      stopRecording();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
            onClose={handleClose}
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
