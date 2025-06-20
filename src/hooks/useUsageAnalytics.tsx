
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UsageData {
  featureName: string;
  category: string;
  usageCount: number;
  lastUsed: string;
}

interface SubscriptionMetrics {
  totalFeatureUsage: number;
  mostUsedFeature: string;
  dailyUsage: Array<{ date: string; usage: number }>;
  featureBreakdown: UsageData[];
}

export const useUsageAnalytics = (timeRange: 'week' | 'month' | 'year' = 'month') => {
  const { user } = useAuth();

  const { data: usageData, isLoading, error } = useQuery({
    queryKey: ['usage-analytics', user?.id, timeRange],
    queryFn: async (): Promise<SubscriptionMetrics> => {
      if (!user) throw new Error('No user found');

      const startDate = new Date();
      if (timeRange === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (timeRange === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      // Get feature usage data
      const { data: usageRecords } = await supabase
        .from('premium_feature_usage')
        .select('feature_name, feature_category, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (!usageRecords) {
        return {
          totalFeatureUsage: 0,
          mostUsedFeature: '',
          dailyUsage: [],
          featureBreakdown: []
        };
      }

      // Process feature breakdown
      const featureMap = new Map<string, UsageData>();
      const dailyUsageMap = new Map<string, number>();

      usageRecords.forEach(record => {
        const key = record.feature_name;
        const date = new Date(record.created_at).toDateString();

        // Feature breakdown
        if (featureMap.has(key)) {
          const existing = featureMap.get(key)!;
          existing.usageCount++;
          existing.lastUsed = record.created_at;
        } else {
          featureMap.set(key, {
            featureName: record.feature_name,
            category: record.feature_category,
            usageCount: 1,
            lastUsed: record.created_at
          });
        }

        // Daily usage
        dailyUsageMap.set(date, (dailyUsageMap.get(date) || 0) + 1);
      });

      const featureBreakdown = Array.from(featureMap.values())
        .sort((a, b) => b.usageCount - a.usageCount);

      const dailyUsage = Array.from(dailyUsageMap.entries())
        .map(([date, usage]) => ({ date, usage }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return {
        totalFeatureUsage: usageRecords.length,
        mostUsedFeature: featureBreakdown[0]?.featureName || '',
        dailyUsage,
        featureBreakdown
      };
    },
    enabled: !!user
  });

  return {
    usageData,
    isLoading,
    error
  };
};
