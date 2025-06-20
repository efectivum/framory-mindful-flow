
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

interface FeatureUsageContext {
  entryId?: string;
  habitId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export const useFeatureTracking = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();

  const trackFeatureUsage = useCallback(async (
    featureName: string,
    featureCategory: string,
    context: FeatureUsageContext = {}
  ) => {
    if (!user) return;

    try {
      await supabase.from('premium_feature_usage').insert({
        user_id: user.id,
        feature_name: featureName,
        feature_category: featureCategory,
        usage_context: context.metadata || {},
        session_id: context.sessionId || crypto.randomUUID()
      });

      // Track subscription analytics
      if (subscription?.subscribed) {
        await supabase.from('subscription_analytics').insert({
          user_id: user.id,
          metric_type: 'feature_usage',
          metric_value: 1,
          metric_data: {
            feature_name: featureName,
            feature_category: featureCategory,
            subscription_tier: subscription.subscription_tier || 'premium'
          }
        });
      }
    } catch (error) {
      console.error('Failed to track feature usage:', error);
    }
  }, [user, subscription]);

  const checkFeatureLimit = useCallback(async (featureName: string): Promise<{ 
    allowed: boolean; 
    usage: number; 
    limit: number; 
    resetDate?: Date;
  }> => {
    if (!user) return { allowed: false, usage: 0, limit: 0 };

    try {
      const tier = subscription?.subscription_tier || 'free';
      
      // Get feature limit
      const { data: limitData } = await supabase
        .from('feature_limits')
        .select('*')
        .eq('subscription_tier', tier)
        .eq('feature_name', featureName)
        .single();

      if (!limitData) return { allowed: true, usage: 0, limit: -1 };

      // If unlimited (-1), always allow
      if (limitData.limit_value === -1) {
        return { allowed: true, usage: 0, limit: -1 };
      }

      // Get current usage based on reset period
      let startDate = new Date();
      if (limitData.reset_period === 'monthly') {
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
      } else if (limitData.reset_period === 'weekly') {
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
      } else {
        // Daily reset
        startDate.setHours(0, 0, 0, 0);
      }

      const { count } = await supabase
        .from('premium_feature_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('feature_name', featureName)
        .gte('created_at', startDate.toISOString());

      const usage = count || 0;
      const allowed = usage < limitData.limit_value;

      // Calculate reset date
      const resetDate = new Date(startDate);
      if (limitData.reset_period === 'monthly') {
        resetDate.setMonth(resetDate.getMonth() + 1);
      } else if (limitData.reset_period === 'weekly') {
        resetDate.setDate(resetDate.getDate() + 7);
      } else {
        resetDate.setDate(resetDate.getDate() + 1);
      }

      return {
        allowed,
        usage,
        limit: limitData.limit_value,
        resetDate
      };
    } catch (error) {
      console.error('Failed to check feature limit:', error);
      return { allowed: false, usage: 0, limit: 0 };
    }
  }, [user, subscription]);

  return {
    trackFeatureUsage,
    checkFeatureLimit
  };
};
