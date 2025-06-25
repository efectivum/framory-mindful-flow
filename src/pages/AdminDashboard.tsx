
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bell, BarChart3, AlertCircle, TrendingUp, Shield, Activity, Database, Server } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: systemHealth, isLoading: healthLoading } = useSystemHealth();

  if (statsLoading) {
    return (
      <AdminLayout title="Admin Dashboard" subtitle="Overview of system status and key metrics">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  if (statsError) {
    return (
      <AdminLayout title="Admin Dashboard" subtitle="Overview of system status and key metrics">
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>Failed to load dashboard data</span>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const statsData = [
    {
      title: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '0',
      change: `+${stats?.growthRate || 0}%`,
      icon: Users,
      color: 'text-blue-400',
    },
    {
      title: 'Beta Users',
      value: stats?.betaUsers.toString() || '0',
      change: `+${stats?.betaGrowth || 0}`,
      icon: Shield,
      color: 'text-purple-400',
    },
    {
      title: 'Active Notifications',
      value: stats?.activeNotifications.toString() || '0',
      change: `${stats?.notificationChange || 0}`,
      icon: Bell,
      color: 'text-green-400',
    },
    {
      title: 'System Health',
      value: `${stats?.systemHealth || 0}%`,
      change: 'Stable',
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
  ];

  return (
    <AdminLayout 
      title="Admin Dashboard" 
      subtitle="Overview of system status and key metrics"
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-gray-400 text-sm">{stat.change}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Status */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <div className="flex items-center justify-center h-24">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    systemHealth?.database.status === 'online' ? 'bg-green-400' :
                    systemHealth?.database.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <p className="text-gray-300 text-sm">Database</p>
                  <p className={`text-xs ${
                    systemHealth?.database.status === 'online' ? 'text-green-400' :
                    systemHealth?.database.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {systemHealth?.database.status || 'Unknown'} • {systemHealth?.database.responseTime || 0}ms
                  </p>
                </div>
                <div className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    systemHealth?.edgeFunctions.status === 'online' ? 'bg-green-400' :
                    systemHealth?.edgeFunctions.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <p className="text-gray-300 text-sm">Edge Functions</p>
                  <p className={`text-xs ${
                    systemHealth?.edgeFunctions.status === 'online' ? 'text-green-400' :
                    systemHealth?.edgeFunctions.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {systemHealth?.edgeFunctions.status || 'Unknown'} • {systemHealth?.edgeFunctions.activeCount || 0} active
                  </p>
                </div>
                <div className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    systemHealth?.apiResponse.status === 'healthy' ? 'bg-green-400' :
                    systemHealth?.apiResponse.status === 'slow' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <p className="text-gray-300 text-sm">API Response</p>
                  <p className={`text-xs ${
                    systemHealth?.apiResponse.status === 'healthy' ? 'text-green-400' :
                    systemHealth?.apiResponse.status === 'slow' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {systemHealth?.apiResponse.averageTime || 0}ms avg
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Errors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-white">
                Send System Notification
              </button>
              <button className="w-full text-left p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-white">
                Export User Data
              </button>
              <button className="w-full text-left p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-white">
                View System Logs
              </button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Recent System Errors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemHealth?.recentErrors.length ? (
                systemHealth.recentErrors.map((error, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    error.severity === 'error' ? 'bg-red-900/20 border-red-800' :
                    error.severity === 'warning' ? 'bg-yellow-900/20 border-yellow-800' :
                    'bg-gray-700/30 border-gray-600'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${
                        error.severity === 'error' ? 'text-red-400' :
                        error.severity === 'warning' ? 'text-yellow-400' : 'text-gray-300'
                      }`}>
                        {error.severity.charAt(0).toUpperCase() + error.severity.slice(1)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{error.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  No recent errors
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
