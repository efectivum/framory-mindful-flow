
import { useState, useRef } from 'react';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve('');
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        try {
          // For now, return empty string - can be enhanced later
          resolve('Voice recording processed');
        } catch (error) {
          console.error('Failed to process recording:', error);
          resolve('');
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);
    });
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording
  };
};
