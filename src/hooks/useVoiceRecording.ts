
import { useState, useRef, useCallback } from 'react';
import { setupAudioAnalyser, calculateAudioLevel, blobToBase64 } from '@/utils/audioUtils';
import { supabase } from '@/integrations/supabase/client';

export type RecordingStatus = 'idle' | 'checking' | 'ready' | 'recording' | 'processing' | 'error';

interface UseVoiceRecordingProps {
  onTranscriptionComplete: (text: string) => void;
  onSuccess: () => void;
  maxRecordingTime?: number;
}

export const useVoiceRecording = ({ 
  onTranscriptionComplete, 
  onSuccess, 
  maxRecordingTime = 15 * 60 
}: UseVoiceRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
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
  }, [isRecording]);

  const startAudioLevelMonitoring = useCallback(() => {
    if (!analyserRef.current) return;
    
    const updateAudioLevel = () => {
      if (analyserRef.current && isRecording) {
        const level = calculateAudioLevel(analyserRef.current);
        setAudioLevel(level);
      }
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  }, [isRecording]);

  const checkMicrophonePermission = useCallback(async () => {
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
      const { audioContext, analyser } = setupAudioAnalyser(stream);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      startAudioLevelMonitoring();
      setStatus('ready');
    } catch (error) {
      console.error('Microphone permission error:', error);
      setStatus('error');
      setErrorMessage('Microphone access denied. Please allow microphone access and try again.');
    }
  }, [startAudioLevelMonitoring]);

  const handleRecordingComplete = useCallback(async (language: string) => {
    if (chunksRef.current.length === 0) return;
    
    setStatus('processing');
    
    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const base64Audio = await blobToBase64(audioBlob);
      
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { 
          audio: base64Audio.split(',')[1],
          language: language 
        }
      });

      if (error) {
        throw new Error(error.message || 'Transcription failed');
      }

      if (data?.text) {
        onTranscriptionComplete(data.text);
        onSuccess();
      } else {
        throw new Error('No transcription received');
      }
      
    } catch (error) {
      console.error('Transcription error:', error);
      setStatus('error');
      setErrorMessage(`Transcription failed: ${error.message}`);
    }
  }, [onTranscriptionComplete, onSuccess]);

  const startRecording = useCallback(async (language: string) => {
    if (!streamRef.current) return;
    
    try {
      chunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => handleRecordingComplete(language);
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('recording');
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxRecordingTime) {
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
  }, [handleRecordingComplete, maxRecordingTime]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRecording]);

  return {
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
  };
};
