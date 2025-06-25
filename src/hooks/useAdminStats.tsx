
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  betaUsers: number;
  activeNotifications: number;
  systemHealth: number;
  growthRate: number;
  betaGrowth: number;
  notificationChange: number;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      console.log('Fetching admin stats...');

      try {
        // Get total users count
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) {
          console.error('Error fetching total users:', usersError);
          throw new Error(`Failed to fetch users: ${usersError.message}`);
        }

        // Get beta users count
        const { count: betaUsers, error: betaError } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_tier', 'beta');

        if (betaError) {
          console.error('Error fetching beta users:', betaError);
          // Don't throw, continue with default value
        }

        // Get active notifications count
        const { count: activeNotifications, error: notifError } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (notifError) {
          console.error('Error fetching notifications:', notifError);
          // Don't throw, continue with default value
        }

        // Calculate growth rates (simplified for now)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: newUsersThisMonth, error: growthError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString());

        if (growthError) {
          console.error('Error fetching growth data:', growthError);
        }

        const { count: newBetaUsersThisMonth, error: betaGrowthError } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_tier', 'beta')
          .gte('created_at', thirtyDaysAgo.toISOString());

        if (betaGrowthError) {
          console.error('Error fetching beta growth data:', betaGrowthError);
        }

        const growthRate = totalUsers ? Math.round((newUsersThisMonth || 0) / totalUsers * 100) : 0;
        const betaGrowth = newBetaUsersThisMonth || 0;

        const stats = {
          totalUsers: totalUsers || 0,
          betaUsers: betaUsers || 0,
          activeNotifications: activeNotifications || 0,
          systemHealth: 99.9, // This would come from actual monitoring
          growthRate,
          betaGrowth,
          notificationChange: -2 // This would be calculated from historical data
        };

        console.log('Admin stats fetched successfully:', stats);
        return stats;

      } catch (error) {
        console.error('Admin stats fetch failed:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
