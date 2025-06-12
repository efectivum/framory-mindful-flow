import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecordingModalProps {
  open: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceRecordingModal = ({ open, onClose, onTranscriptionComplete }: VoiceRecordingModalProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'recording' | 'processing' | 'error'>('idle');
  const [language, setLanguage] = useState('et');
  const [errorMessage, setErrorMessage] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  const MAX_RECORDING_TIME = 15 * 60; // 15 minutes in seconds

  useEffect(() => {
    if (open) {
      checkMicrophonePermission();
    } else {
      cleanup();
    }
    
    return cleanup;
  }, [open]);

  const cleanup = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsRecording(false);
    setRecordingTime(0);
    setAudioLevel(0);
    setStatus('idle');
    setErrorMessage('');
  };

  const checkMicrophonePermission = async () => {
    setStatus('checking');
    setErrorMessage('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      setupAudioAnalyser(stream);
      setStatus('ready');
    } catch (error) {
      console.error('Microphone permission error:', error);
      setStatus('error');
      setErrorMessage('Microphone access denied. Please allow microphone access and try again.');
    }
  };

  const setupAudioAnalyser = (stream: MediaStream) => {
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    
    analyserRef.current.fftSize = 256;
    startAudioLevelMonitoring();
  };

  const startAudioLevelMonitoring = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (analyserRef.current && isRecording) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
      }
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  };

  const startRecording = async () => {
    if (!streamRef.current) return;
    
    try {
      chunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = handleRecordingComplete;
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('recording');
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Recording start error:', error);
      setStatus('error');
      setErrorMessage('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handleRecordingComplete = async () => {
    if (chunksRef.current.length === 0) return;
    
    setStatus('processing');
    
    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const base64Audio = await blobToBase64(audioBlob);
      
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { 
          audio: base64Audio.split(',')[1], // Remove data:audio/webm;base64, prefix
          language: language 
        }
      });

      if (error) {
        throw new Error(error.message || 'Transcription failed');
      }

      if (data?.text) {
        onTranscriptionComplete(data.text);
        onClose();
        toast({
          title: "Success!",
          description: "Voice recording transcribed successfully!",
        });
      } else {
        throw new Error('No transcription received');
      }
      
    } catch (error) {
      console.error('Transcription error:', error);
      setStatus('error');
      setErrorMessage(`Transcription failed: ${error.message}`);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const getProgressPercentage = () => {
    return (recordingTime / MAX_RECORDING_TIME) * 100;
  };

  const getCloseButtonText = () => {
    switch (status) {
      case 'ready': return 'Close';
      case 'error': return 'Cancel';
      default: return 'Close';
    }
  };

  const shouldShowCloseButton = () => {
    // Hide close button during recording and processing
    return status !== 'recording' && status !== 'processing';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md mx-auto h-screen sm:h-auto sm:max-h-[600px] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-6">
          {/* Language Selection */}
          <div className="w-full max-w-xs">
            <Select value={language} onValueChange={setLanguage} disabled={isRecording}>
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

          {/* Recording Button */}
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
                onClick={isRecording ? stopRecording : startRecording}
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

          {/* Timer */}
          {isRecording && (
            <div className="text-2xl font-mono text-white">
              {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
            </div>
          )}

          {/* Status Message */}
          <div className="text-center text-gray-300 max-w-xs">
            {getStatusMessage()}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {status === 'error' && (
              <Button
                variant="outline"
                onClick={checkMicrophonePermission}
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
      </DialogContent>
    </Dialog>
  );
};
