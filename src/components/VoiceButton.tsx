
import { useState } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceRecordingModal } from './VoiceRecordingModal';

interface VoiceButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceButton = ({ onTranscription, disabled = false, className = "" }: VoiceButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTranscriptionComplete = (text: string) => {
    onTranscription(text);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        disabled={disabled}
        className={`text-gray-400 hover:text-white p-2 ${className}`}
        title="Voice input"
      >
        <Mic className="w-4 h-4" />
      </Button>
      
      <VoiceRecordingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTranscriptionComplete={handleTranscriptionComplete}
      />
    </>
  );
};
