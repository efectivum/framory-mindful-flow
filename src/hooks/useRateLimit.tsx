
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  retryAfterMs?: number;
}

interface RequestLog {
  timestamp: number;
  count: number;
}

export const useRateLimit = (config: RateLimitConfig) => {
  const { toast } = useToast();
  const requestsRef = useRef<Map<string, RequestLog>>(new Map());
  const [isLimited, setIsLimited] = useState(false);

  const checkRateLimit = useCallback((key: string = 'default'): boolean => {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Clean up old entries
    requestsRef.current.forEach((log, logKey) => {
      if (log.timestamp < windowStart) {
        requestsRef.current.delete(logKey);
      }
    });

    const currentLog = requestsRef.current.get(key);
    
    if (!currentLog || currentLog.timestamp < windowStart) {
      // First request in window or window expired
      requestsRef.current.set(key, { timestamp: now, count: 1 });
      setIsLimited(false);
      return true;
    }

    if (currentLog.count >= config.maxRequests) {
      setIsLimited(true);
      toast({
        title: "Rate limit exceeded",
        description: `Please wait ${Math.ceil((config.retryAfterMs || 60000) / 1000)} seconds before trying again.`,
        variant: "destructive",
      });
      return false;
    }

    // Increment count
    currentLog.count += 1;
    requestsRef.current.set(key, currentLog);
    setIsLimited(false);
    return true;
  }, [config, toast]);

  const getRemainingRequests = useCallback((key: string = 'default'): number => {
    const currentLog = requestsRef.current.get(key);
    if (!currentLog) return config.maxRequests;
    
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    if (currentLog.timestamp < windowStart) {
      return config.maxRequests;
    }
    
    return Math.max(0, config.maxRequests - currentLog.count);
  }, [config]);

  const getTimeUntilReset = useCallback((key: string = 'default'): number => {
    const currentLog = requestsRef.current.get(key);
    if (!currentLog) return 0;
    
    const resetTime = currentLog.timestamp + config.windowMs;
    return Math.max(0, resetTime - Date.now());
  }, [config]);

  return {
    checkRateLimit,
    getRemainingRequests,
    getTimeUntilReset,
    isLimited,
  };
};
