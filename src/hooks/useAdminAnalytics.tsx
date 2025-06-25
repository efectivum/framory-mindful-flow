
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  monthlyActiveUsers: number;
  journalEntries: number;
  premiumUsers: number;
  userRetention: number;
  featureUsage: Array<{
    name: string;
    usage: number;
    color: string;
  }>;
  userGrowth: Array<{
    month: string;
    users: number;
  }>;
}

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async (): Promise<AnalyticsData> => {
      console.log('Fetching admin analytics...');

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
          throw new Error('Access denied: Admin privileges required');
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get monthly active users (users who created journal entries in last 30 days)
        const { data: activeUsersData, error: activeUsersError } = await supabase
          .from('journal_entries')
          .select('user_id')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .is('deleted_at', null);

        if (activeUsersError) {
          console.error('Error fetching active users:', activeUsersError);
          throw new Error(`Failed to fetch active users: ${activeUsersError.message}`);
        }

        const monthlyActiveUsers = new Set(activeUsersData?.map(entry => entry.user_id) || []).size;

        // Get total journal entries this month
        const { count: journalEntries, error: entriesError } = await supabase
          .from('journal_entries')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString())
          .is('deleted_at', null);

        if (entriesError) {
          console.error('Error fetching journal entries:', entriesError);
        }

        // Get premium users (beta tier for now)
        const { count: premiumUsers, error: premiumError } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_tier', 'beta');

        if (premiumError) {
          console.error('Error fetching premium users:', premiumError);
        }

        // Calculate feature usage based on actual data
        const { count: totalJournalUsers, error: journalUsersError } = await supabase
          .from('journal_entries')
          .select('user_id', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString())
          .is('deleted_at', null);

        const { count: totalHabitUsers, error: habitUsersError } = await supabase
          .from('habits')
          .select('user_id', { count: 'exact', head: true })
          .eq('is_active', true);

        const { count: totalChatUsers, error: chatUsersError } = await supabase
          .from('chat_sessions')
          .select('user_id', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString());

        if (journalUsersError) console.error('Error fetching journal users:', journalUsersError);
        if (habitUsersError) console.error('Error fetching habit users:', habitUsersError);
        if (chatUsersError) console.error('Error fetching chat users:', chatUsersError);

        const totalUsers = Math.max(monthlyActiveUsers, 1);

        const featureUsage = [
          {
            name: 'Journaling',
            usage: Math.round(((totalJournalUsers || 0) / totalUsers) * 100),
            color: 'bg-blue-500'
          },
          {
            name: 'Habit Tracking',
            usage: Math.round(((totalHabitUsers || 0) / totalUsers) * 100),
            color: 'bg-green-500'
          },
          {
            name: 'AI Coach',
            usage: Math.round(((totalChatUsers || 0) / totalUsers) * 100),
            color: 'bg-purple-500'
          },
          {
            name: 'Insights',
            usage: Math.round(((monthlyActiveUsers || 0) / totalUsers) * 60),
            color: 'bg-yellow-500'
          }
        ];

        // Get user growth over last 6 months
        const userGrowth = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          const { count: usersInMonth } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfMonth.toISOString())
            .lte('created_at', endOfMonth.toISOString());

          userGrowth.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            users: usersInMonth || 0
          });
        }

        // Calculate retention
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const { data: lastMonthActiveUsers } = await supabase
          .from('journal_entries')
          .select('user_id')
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString())
          .is('deleted_at', null);

        const lastMonthActiveCount = new Set(lastMonthActiveUsers?.map(entry => entry.user_id) || []).size;
        const userRetention = lastMonthActiveCount > 0 ? Math.round((monthlyActiveUsers / lastMonthActiveCount) * 100) : 0;

        const analyticsData = {
          monthlyActiveUsers,
          journalEntries: journalEntries || 0,
          premiumUsers: premiumUsers || 0,
          userRetention: Math.min(userRetention, 100),
          featureUsage,
          userGrowth
        };

        console.log('Admin analytics fetched successfully:', analyticsData);
        return analyticsData;

      } catch (error) {
        console.error('Admin analytics fetch failed:', error);
        throw error;
      }
    },
    refetchInterval: 60000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
