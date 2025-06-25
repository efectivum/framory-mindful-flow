
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AdminAnalytics() {
  const { data: analytics, isLoading, error } = useAdminAnalytics();

  if (isLoading) {
    return (
      <AdminLayout title="Analytics & Metrics" subtitle="User engagement, feature usage, and system performance">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Analytics & Metrics" subtitle="User engagement, feature usage, and system performance">
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-400">
              <TrendingUp className="w-5 h-5" />
              <span>Failed to load analytics data</span>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Analytics & Metrics" 
      subtitle="User engagement, feature usage, and system performance"
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Active Users</p>
                  <p className="text-2xl font-bold text-white">{analytics?.monthlyActiveUsers.toLocaleString() || '0'}</p>
                  <p className="text-green-400 text-sm">Active this month</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Journal Entries</p>
                  <p className="text-2xl font-bold text-white">{analytics?.journalEntries.toLocaleString() || '0'}</p>
                  <p className="text-green-400 text-sm">This month</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Premium Users</p>
                  <p className="text-2xl font-bold text-white">{analytics?.premiumUsers || '0'}</p>
                  <p className="text-purple-400 text-sm">Beta subscribers</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">User Retention</p>
                  <p className="text-2xl font-bold text-white">{analytics?.userRetention || 0}%</p>
                  <p className="text-emerald-400 text-sm">30-day retention</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Usage */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Feature Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.featureUsage.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{feature.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${feature.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(feature.usage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{feature.usage}%</span>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-400 py-4">
                  No feature usage data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4 h-48">
              {analytics?.userGrowth.map((month, index) => {
                const maxUsers = Math.max(...(analytics.userGrowth.map(m => m.users) || [1]));
                const height = maxUsers > 0 ? (month.users / maxUsers) * 100 : 0;
                
                return (
                  <div key={index} className="flex flex-col items-center justify-end h-full">
                    <div 
                      className="bg-blue-500 w-8 rounded-t transition-all duration-300 flex items-end justify-center"
                      style={{ height: `${height}%` }}
                    >
                      <span className="text-white text-xs mb-1">{month.users}</span>
                    </div>
                    <span className="text-gray-400 text-xs mt-2">{month.month}</span>
                  </div>
                );
              }) || (
                <div className="col-span-6 text-center text-gray-400 py-8">
                  No growth data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
