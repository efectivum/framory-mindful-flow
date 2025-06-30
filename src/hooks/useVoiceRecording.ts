
import { useState, useRef, useCallback } from 'react';
import { optimizedBlobToBase64 } from '@/utils/audioUtils';
import { setupAudioAnalyser, calculateAudioLevel } from '@/utils/audioUtils';
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
    console.log('Cleaning up voice recording...');
    
    // Stop recording if in progress
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Clear intervals and animations
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // Stop media stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped audio track:', track.kind);
      });
      streamRef.current = null;
    }
    
    // Reset state
    setIsRecording(false);
    setRecordingTime(0);
    setAudioLevel(0);
    analyserRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const updateAudioLevel = useCallback(() => {
    if (analyserRef.current && isRecording) {
      const level = calculateAudioLevel(analyserRef.current);
      setAudioLevel(level);
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [isRecording]);

  const startAudioLevelMonitoring = useCallback(() => {
    if (!analyserRef.current) {
      console.warn('No analyser available for audio level monitoring');
      return;
    }
    
    console.log('Starting audio level monitoring...');
    updateAudioLevel();
  }, [updateAudioLevel]);

  const checkMicrophonePermission = useCallback(async () => {
    console.log('Checking microphone permission...');
    setStatus('checking');
    setErrorMessage('');
    
    try {
      // First check if we already have a stream
      if (streamRef.current) {
        console.log('Reusing existing stream');
        setStatus('ready');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      console.log('Microphone permission granted, stream created');
      streamRef.current = stream;
      
      // Set up audio analyser for visual feedback
      try {
        const { audioContext, analyser } = setupAudioAnalyser(stream);
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        console.log('Audio analyser set up successfully');
      } catch (analyserError) {
        console.warn('Failed to set up audio analyser:', analyserError);
        // Continue without analyser - recording will still work
      }
      
      setStatus('ready');
    } catch (error) {
      console.error('Microphone permission error:', error);
      setStatus('error');
      setErrorMessage('Microphone access denied. Please allow microphone access and try again.');
    }
  }, []);

  const handleRecordingComplete = useCallback(async (language: string) => {
    if (chunksRef.current.length === 0) {
      console.warn('No audio chunks to process');
      setStatus('error');
      setErrorMessage('No audio data recorded. Please try again.');
      return;
    }
    
    console.log('Processing recording with', chunksRef.current.length, 'chunks');
    setStatus('processing');
    
    const processingStartTime = Date.now();
    
    try {
      // Optimized blob creation - combine chunks more efficiently
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      console.log('Audio blob created, size:', audioBlob.size, 'bytes');
      
      if (audioBlob.size === 0) {
        throw new Error('Audio blob is empty');
      }
      
      // Use optimized base64 conversion
      const base64Audio = await optimizedBlobToBase64(audioBlob);
      console.log('Base64 conversion took:', Date.now() - processingStartTime, 'ms');
      
      const base64Data = base64Audio.split(',')[1];
      if (!base64Data) {
        throw new Error('Failed to extract base64 data');
      }
      
      console.log('Calling speech-to-text function with language:', language);
      console.log('Base64 data length:', base64Data.length);
      const apiStartTime = Date.now();
      
      // Add network connectivity check
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network.');
      }
      
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { 
          audio: base64Data,
          language: language 
        }
      });

      console.log('API call took:', Date.now() - apiStartTime, 'ms');
      console.log('Supabase function response:', { data, error });

      if (error) {
        console.error('Speech-to-text Supabase error:', error);
        throw new Error(`Transcription service error: ${error.message || 'Unknown error'}`);
      }

      if (!data) {
        console.error('No data returned from speech-to-text function');
        throw new Error('No response from transcription service');
      }

      console.log('Transcription result:', data);
      console.log('Total processing time:', Date.now() - processingStartTime, 'ms');
      
      if (data?.text && data.text.trim()) {
        console.log('Transcription successful:', data.text);
        onTranscriptionComplete(data.text);
        onSuccess(); // Only call onSuccess after actual transcription success
        setStatus('idle');
      } else {
        console.warn('Empty transcription received');
        throw new Error('No speech detected in the recording. Please try speaking more clearly.');
      }
      
    } catch (error) {
      console.error('Transcription error details:', error);
      setStatus('error');
      
      // Provide more specific error messages
      let userFriendlyMessage = 'Transcription failed. ';
      
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        userFriendlyMessage += 'Please check your internet connection and try again.';
      } else if (error.message?.includes('timeout')) {
        userFriendlyMessage += 'The request timed out. Please try with a shorter recording.';
      } else if (error.message?.includes('No speech detected')) {
        userFriendlyMessage = error.message;
      } else if (error.message?.includes('service error')) {
        userFriendlyMessage += 'There was an issue with the transcription service. Please try again.';
      } else {
        userFriendlyMessage += `${error.message || 'Please try again.'}`;
      }
      
      setErrorMessage(userFriendlyMessage);
    }
  }, [onTranscriptionComplete, onSuccess]);

  const startRecording = useCallback(async (language: string = 'en') => {
    if (!streamRef.current) {
      console.error('No stream available for recording');
      setStatus('error');
      setErrorMessage('No microphone stream available. Please check permissions.');
      return;
    }
    
    console.log('Starting recording with language:', language);
    
    try {
      // Reset chunks array
      chunksRef.current = [];
      
      // Create MediaRecorder with optimized settings
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 128000 // Optimize for faster processing
      });
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Audio chunk received, size:', event.data.size);
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('MediaRecorder stopped, processing...');
        handleRecordingComplete(language);
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setStatus('error');
        setErrorMessage('Recording error occurred. Please try again.');
      };
      
      // Start recording with larger time slices for better performance
      mediaRecorder.start(500); // Collect data every 500ms instead of 100ms
      setIsRecording(true);
      setStatus('recording');
      setRecordingTime(0);
      
      // Start audio level monitoring
      startAudioLevelMonitoring();
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxRecordingTime) {
            console.log('Max recording time reached, stopping...');
            stopRecording();
            return newTime;
          }
          return newTime;
        });
      }, 1000);
      
      console.log('Recording started successfully');
      
    } catch (error) {
      console.error('Recording start error:', error);
      setStatus('error');
      setErrorMessage('Failed to start recording. Please try again.');
    }
  }, [handleRecordingComplete, maxRecordingTime, startAudioLevelMonitoring]);

  const stopRecording = useCallback(() => {
    console.log('Stopping recording...');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

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
