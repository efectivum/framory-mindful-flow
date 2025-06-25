
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemHealthData {
  database: {
    status: 'online' | 'offline' | 'degraded';
    responseTime: number;
    uptime: number;
  };
  edgeFunctions: {
    status: 'online' | 'offline' | 'degraded';
    activeCount: number;
  };
  apiResponse: {
    averageTime: number;
    status: 'healthy' | 'slow' | 'error';
  };
  errorRate: {
    rate: number;
    status: 'low' | 'medium' | 'high';
  };
  recentErrors: Array<{
    message: string;
    timestamp: string;
    severity: string;
  }>;
}

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: async (): Promise<SystemHealthData> => {
      console.log('Checking system health...');

      // Test database connectivity and response time
      const dbStart = Date.now();
      try {
        await supabase.from('profiles').select('id').limit(1);
        const dbResponseTime = Date.now() - dbStart;

        // Get recent errors from last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: recentErrors } = await supabase
          .from('error_logs')
          .select('message, created_at, severity')
          .gte('created_at', yesterday.toISOString())
          .order('created_at', { ascending: false })
          .limit(5);

        // Calculate error rate
        const { count: totalErrors } = await supabase
          .from('error_logs')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString());

        const errorRate = totalErrors || 0;
        const errorRatePercentage = Math.min((errorRate / 1000) * 100, 100); // Normalized

        console.log('System health checked:', {
          dbResponseTime,
          errorRate,
          recentErrorsCount: recentErrors?.length || 0
        });

        return {
          database: {
            status: dbResponseTime < 100 ? 'online' : dbResponseTime < 500 ? 'degraded' : 'offline',
            responseTime: dbResponseTime,
            uptime: 99.9
          },
          edgeFunctions: {
            status: 'online',
            activeCount: 15 // This would come from actual monitoring
          },
          apiResponse: {
            averageTime: dbResponseTime,
            status: dbResponseTime < 100 ? 'healthy' : dbResponseTime < 500 ? 'slow' : 'error'
          },
          errorRate: {
            rate: errorRatePercentage,
            status: errorRatePercentage < 1 ? 'low' : errorRatePercentage < 5 ? 'medium' : 'high'
          },
          recentErrors: recentErrors?.map(error => ({
            message: error.message,
            timestamp: error.created_at,
            severity: error.severity
          })) || []
        };
      } catch (error) {
        console.error('System health check failed:', error);
        return {
          database: {
            status: 'offline',
            responseTime: 0,
            uptime: 0
          },
          edgeFunctions: {
            status: 'offline',
            activeCount: 0
          },
          apiResponse: {
            averageTime: 0,
            status: 'error'
          },
          errorRate: {
            rate: 100,
            status: 'high'
          },
          recentErrors: [{
            message: 'System health check failed',
            timestamp: new Date().toISOString(),
            severity: 'error'
          }]
        };
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
  });
};
