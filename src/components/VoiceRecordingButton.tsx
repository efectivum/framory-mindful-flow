
import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecordingStatus } from '@/hooks/useVoiceRecording';

interface VoiceRecordingButtonProps {
  isRecording: boolean;
  status: RecordingStatus;
  audioLevel: number;
  recordingTime: number;
  maxRecordingTime: number;
  onStart: () => void;
  onStop: () => void;
}

export const VoiceRecordingButton = ({
  isRecording,
  status,
  audioLevel,
  recordingTime,
  maxRecordingTime,
  onStart,
  onStop
}: VoiceRecordingButtonProps) => {
  const getProgressPercentage = () => {
    return (recordingTime / maxRecordingTime) * 100;
  };

  return (
    <div className="relative">
      <div 
        className={`w-32 h-32 rounded-full border-4 transition-all duration-300 ${
          isRecording 
            ? 'border-red-500 bg-red-500/20' 
            : status === 'ready' 
              ? 'border-green-500 bg-green-500/20' 
              : 'border-gray-500 bg-gray-500/20'
        }`}
        style={{
          transform: `scale(${1 + audioLevel * 0.2})`,
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-full rounded-full hover:bg-transparent"
          onClick={isRecording ? onStop : onStart}
          disabled={status !== 'ready' && status !== 'recording'}
        >
          {isRecording ? (
            <Square className="w-12 h-12 text-red-400" />
          ) : status === 'ready' ? (
            <Mic className="w-12 h-12 text-green-400" />
          ) : (
            <MicOff className="w-12 h-12 text-gray-400" />
          )}
        </Button>
      </div>
      
      {/* Progress Ring */}
      {isRecording && (
        <svg className="absolute inset-0 w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-red-500"
            strokeDasharray={`${getProgressPercentage() * 3.77} 377`}
          />
        </svg>
      )}
    </div>
  );
};
