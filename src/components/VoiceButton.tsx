
import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscription,
  disabled = false,
  className
}) => {
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();

  const handleClick = async () => {
    if (isRecording) {
      const transcription = await stopRecording();
      if (transcription) {
        onTranscription(transcription);
      }
    } else {
      await startRecording();
    }
  };

  const isActive = isRecording || isProcessing;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={cn(
        "text-gray-400 hover:text-blue-300 hover:bg-blue-900 h-10 w-10 rounded-full shrink-0",
        isActive && "text-red-400 bg-red-900/20",
        className
      )}
    >
      {isProcessing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isRecording ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
};
