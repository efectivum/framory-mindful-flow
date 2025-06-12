
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecordingStatus } from '@/hooks/useVoiceRecording';
import { formatTime } from '@/utils/audioUtils';

interface VoiceRecordingControlsProps {
  language: string;
  onLanguageChange: (language: string) => void;
  isRecording: boolean;
  recordingTime: number;
  maxRecordingTime: number;
  status: RecordingStatus;
  errorMessage: string;
  onRetry: () => void;
  onClose: () => void;
}

export const VoiceRecordingControls = ({
  language,
  onLanguageChange,
  isRecording,
  recordingTime,
  maxRecordingTime,
  status,
  errorMessage,
  onRetry,
  onClose
}: VoiceRecordingControlsProps) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'checking': return 'Checking microphone access...';
      case 'ready': return 'Ready to record. Tap the microphone to start.';
      case 'recording': return 'Listening... Speak now.';
      case 'processing': return 'Processing your recording...';
      case 'error': return errorMessage || 'An error occurred.';
      default: return '';
    }
  };

  const getCloseButtonText = () => {
    switch (status) {
      case 'ready': return 'Close';
      case 'error': return 'Cancel';
      default: return 'Close';
    }
  };

  const shouldShowCloseButton = () => {
    return status !== 'recording' && status !== 'processing';
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="w-full max-w-xs">
        <Select value={language} onValueChange={onLanguageChange} disabled={isRecording}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="et">Estonian</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ru">Russian</SelectItem>
            <SelectItem value="fi">Finnish</SelectItem>
            <SelectItem value="lv">Latvian</SelectItem>
            <SelectItem value="lt">Lithuanian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timer */}
      {isRecording && (
        <div className="text-2xl font-mono text-white text-center">
          {formatTime(recordingTime)} / {formatTime(maxRecordingTime)}
        </div>
      )}

      {/* Status Message */}
      <div className="text-center text-gray-300 max-w-xs">
        {getStatusMessage()}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {status === 'error' && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        
        {shouldShowCloseButton() && (
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            {getCloseButtonText()}
          </Button>
        )}
      </div>
    </div>
  );
};
