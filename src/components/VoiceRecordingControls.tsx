
import { RotateCcw, Square } from 'lucide-react';
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
  onStop: () => void;
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
  onClose,
  onStop
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

  const shouldShowFinishButton = () => {
    return status === 'recording';
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="w-full max-w-xs">
        <Select value={language} onValueChange={onLanguageChange} disabled={isRecording}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600 max-h-60 overflow-y-auto">
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="et">Estonian</SelectItem>
            <SelectItem value="ru">Russian</SelectItem>
            <SelectItem value="fi">Finnish</SelectItem>
            <SelectItem value="lv">Latvian</SelectItem>
            <SelectItem value="lt">Lithuanian</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
            <SelectItem value="nl">Dutch</SelectItem>
            <SelectItem value="pl">Polish</SelectItem>
            <SelectItem value="sv">Swedish</SelectItem>
            <SelectItem value="no">Norwegian</SelectItem>
            <SelectItem value="da">Danish</SelectItem>
            <SelectItem value="cs">Czech</SelectItem>
            <SelectItem value="sk">Slovak</SelectItem>
            <SelectItem value="hu">Hungarian</SelectItem>
            <SelectItem value="ro">Romanian</SelectItem>
            <SelectItem value="bg">Bulgarian</SelectItem>
            <SelectItem value="hr">Croatian</SelectItem>
            <SelectItem value="sr">Serbian</SelectItem>
            <SelectItem value="sl">Slovenian</SelectItem>
            <SelectItem value="uk">Ukrainian</SelectItem>
            <SelectItem value="el">Greek</SelectItem>
            <SelectItem value="tr">Turkish</SelectItem>
            <SelectItem value="ar">Arabic</SelectItem>
            <SelectItem value="he">Hebrew</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
            <SelectItem value="th">Thai</SelectItem>
            <SelectItem value="vi">Vietnamese</SelectItem>
            <SelectItem value="hi">Hindi</SelectItem>
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
        
        {shouldShowFinishButton() && (
          <Button
            variant="outline"
            onClick={onStop}
            className="bg-red-600 border-red-500 text-white hover:bg-red-700"
          >
            <Square className="w-4 h-4 mr-2" />
            Finish Recording
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
