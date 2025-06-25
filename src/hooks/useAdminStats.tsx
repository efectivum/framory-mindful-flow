
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

      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get beta users count
      const { count: betaUsers } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_tier', 'beta');

      // Get active notifications count
      const { count: activeNotifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Calculate growth rates (simplified for now)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: newBetaUsersThisMonth } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_tier', 'beta')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const growthRate = totalUsers ? Math.round((newUsersThisMonth || 0) / totalUsers * 100) : 0;
      const betaGrowth = newBetaUsersThisMonth || 0;

      console.log('Admin stats fetched:', {
        totalUsers: totalUsers || 0,
        betaUsers: betaUsers || 0,
        activeNotifications: activeNotifications || 0,
        growthRate,
        betaGrowth
      });

      return {
        totalUsers: totalUsers || 0,
        betaUsers: betaUsers || 0,
        activeNotifications: activeNotifications || 0,
        systemHealth: 99.9, // This would come from actual monitoring
        growthRate,
        betaGrowth,
        notificationChange: -2 // This would be calculated from historical data
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
