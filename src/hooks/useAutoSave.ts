
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAutoSaveOptions {
  delay?: number;
  onSave: (data: any) => Promise<void>;
  onError?: (error: Error) => void;
}

export const useAutoSave = (data: any, options: UseAutoSaveOptions) => {
  const { delay = 2000, onSave, onError } = options;
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef(data);
  const { toast } = useToast();

  const saveData = useCallback(async () => {
    try {
      setStatus('saving');
      await onSave(data);
      setStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      setStatus('error');
      console.error('Auto-save failed:', error);
      
      if (onError) {
        onError(error as Error);
      } else {
        toast({
          title: "Auto-save failed",
          description: "Your changes couldn't be saved automatically. Please try saving manually.",
          variant: "destructive",
        });
      }
    }
  }, [data, onSave, onError, toast]);

  useEffect(() => {
    // Don't auto-save if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    // Don't auto-save empty data
    if (!data || (typeof data === 'string' && !data.trim()) || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return;
    }

    previousDataRef.current = data;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveData();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, saveData]);

  const manualSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveData();
  }, [saveData]);

  return {
    status,
    lastSaved,
    manualSave
  };
};
