
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

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get monthly active users (users who created journal entries in last 30 days)
      const { data: activeUsersData } = await supabase
        .from('journal_entries')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const monthlyActiveUsers = new Set(activeUsersData?.map(entry => entry.user_id) || []).size;

      // Get total journal entries this month
      const { count: journalEntries } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())
        .is('deleted_at', null);

      // Get premium users (beta tier for now)
      const { count: premiumUsers } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_tier', 'beta');

      // Calculate feature usage based on actual data
      const { count: totalJournalUsers } = await supabase
        .from('journal_entries')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())
        .is('deleted_at', null);

      const { count: totalHabitUsers } = await supabase
        .from('habits')
        .select('user_id', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: totalChatUsers } = await supabase
        .from('chat_sessions')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      const totalUsers = monthlyActiveUsers || 1; // Avoid division by zero

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
          usage: Math.round(((monthlyActiveUsers || 0) / totalUsers) * 60), // Estimated
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

      // Calculate retention (simplified - users active this month vs last month)
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const { data: lastMonthActiveUsers } = await supabase
        .from('journal_entries')
        .select('user_id')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      const lastMonthActiveCount = new Set(lastMonthActiveUsers?.map(entry => entry.user_id) || []).size;
      const userRetention = lastMonthActiveCount > 0 ? Math.round((monthlyActiveUsers / lastMonthActiveCount) * 100) : 0;

      console.log('Admin analytics fetched:', {
        monthlyActiveUsers,
        journalEntries: journalEntries || 0,
        premiumUsers: premiumUsers || 0,
        userRetention,
        featureUsage
      });

      return {
        monthlyActiveUsers,
        journalEntries: journalEntries || 0,
        premiumUsers: premiumUsers || 0,
        userRetention: Math.min(userRetention, 100),
        featureUsage,
        userGrowth
      };
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
