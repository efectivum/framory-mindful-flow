
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
        // Check admin status first
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin', {
          user_id_param: (await supabase.auth.getUser()).data.user?.id
        });

        if (adminError) {
          console.error('Admin check failed:', adminError);
          throw new Error(`Admin check failed: ${adminError.message}`);
        }

        if (!adminCheck) {
          console.error('User is not an admin');
          throw new Error('Access denied: Admin privileges required');
        }

        console.log('Admin access confirmed, fetching stats...');

        // Get total users count
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) {
          console.error('Error fetching total users:', usersError);
          throw new Error(`Failed to fetch users: ${usersError.message}`);
        }

        console.log('Total users found:', totalUsers);

        // Get beta users count with detailed logging
        const { count: betaUsers, error: betaError } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_tier', 'beta');

        if (betaError) {
          console.error('Error fetching beta users:', betaError);
          throw new Error(`Failed to fetch beta users: ${betaError.message}`);
        }

        console.log('Beta users found:', betaUsers);

        // Let's also check what subscribers exist
        const { data: allSubscribers, error: allSubError } = await supabase
          .from('subscribers')
          .select('email, subscription_tier')
          .limit(10);

        if (allSubError) {
          console.error('Error fetching all subscribers for debug:', allSubError);
        } else {
          console.log('All subscribers (first 10):', allSubscribers);
        }

        // Get active notifications count
        const { count: activeNotifications, error: notifError } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (notifError) {
          console.error('Error fetching notifications:', notifError);
          // Don't throw for notifications, just log and continue
        }

        // Calculate growth rates
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
          systemHealth: 99.9,
          growthRate,
          betaGrowth,
          notificationChange: -2
        };

        console.log('Admin stats compiled successfully:', stats);
        return stats;

      } catch (error) {
        console.error('Admin stats fetch failed:', error);
        throw error;
      }
    },
    refetchInterval: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
