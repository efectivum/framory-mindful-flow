
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  resolved: boolean;
}

interface ErrorStats {
  totalErrors: number;
  criticalErrors: number;
  errorRate: number;
  topErrors: { message: string; count: number }[];
}

export const useErrorTracking = () => {
  const { user } = useAuth();
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [stats, setStats] = useState<ErrorStats>({
    totalErrors: 0,
    criticalErrors: 0,
    errorRate: 0,
    topErrors: []
  });

  const logError = useCallback(async (
    error: Error | string,
    severity: ErrorLog['severity'] = 'medium',
    context?: Record<string, any>
  ) => {
    const errorLog: Omit<ErrorLog, 'id'> = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: user?.id,
      severity,
      context,
      resolved: false,
    };

    // Store locally first
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullErrorLog = { ...errorLog, id: errorId };
    
    setErrors(prev => [fullErrorLog, ...prev.slice(0, 49)]); // Keep last 50 errors

    // Send to backend for persistent storage
    try {
      const { error: dbError } = await supabase
        .from('error_logs')
        .insert([{
          id: errorId,
          user_id: user?.id,
          message: errorLog.message,
          stack: errorLog.stack,
          severity: errorLog.severity,
          context: errorLog.context || {},
          url: errorLog.url,
          user_agent: errorLog.userAgent,
          created_at: new Date(errorLog.timestamp).toISOString(),
        }]);

      if (dbError) {
        console.error('Failed to log error to database:', dbError);
      }
    } catch (e) {
      console.error('Error tracking system failed:', e);
    }

    // Update stats
    setStats(prev => ({
      totalErrors: prev.totalErrors + 1,
      criticalErrors: prev.criticalErrors + (severity === 'critical' ? 1 : 0),
      errorRate: prev.errorRate, // Would need time-based calculation
      topErrors: prev.topErrors, // Would need aggregation
    }));

    // Auto-report critical errors
    if (severity === 'critical') {
      console.error('CRITICAL ERROR:', errorLog);
      // Could integrate with external monitoring service here
    }
  }, [user]);

  const markErrorResolved = useCallback(async (errorId: string) => {
    setErrors(prev => prev.map(error => 
      error.id === errorId ? { ...error, resolved: true } : error
    ));

    try {
      await supabase
        .from('error_logs')
        .update({ resolved: true })
        .eq('id', errorId);
    } catch (e) {
      console.error('Failed to mark error as resolved:', e);
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Set up global error handlers
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logError(event.error || event.message, 'high', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      logError(
        event.reason instanceof Error ? event.reason : String(event.reason),
        'high',
        { type: 'unhandled_promise_rejection' }
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, [logError]);

  return {
    errors,
    stats,
    logError,
    markErrorResolved,
    clearErrors,
  };
};
