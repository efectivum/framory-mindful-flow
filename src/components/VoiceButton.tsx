
import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceRecordingModal } from './VoiceRecordingModal';
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
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleTranscriptionComplete = (text: string) => {
    onTranscription(text);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "text-gray-400 hover:text-blue-300 hover:bg-blue-900 h-10 w-10 rounded-full shrink-0",
          className
        )}
      >
        <Mic className="w-5 h-5" />
      </Button>

      <VoiceRecordingModal
        open={showModal}
        onClose={handleClose}
        onTranscriptionComplete={handleTranscriptionComplete}
      />
    </>
  );
};
