
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bell, BarChart3, AlertCircle, TrendingUp, Shield, Activity, Database, Server, RefreshCw } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const { data: systemHealth, isLoading: healthLoading, error: healthError, refetch: refetchHealth } = useSystemHealth();

  console.log('AdminDashboard render:', { 
    statsLoading, 
    healthLoading, 
    statsError: statsError?.message, 
    healthError: healthError?.message,
    stats,
    systemHealth 
  });

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
            <div className="flex items-center gap-2 text-red-400 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>Failed to load dashboard data</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Error: {statsError.message}
            </p>
            <Button 
              onClick={() => refetchStats()}
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
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
      <div className="mobile-flow">
        {/* Stats Grid */}
        <div className="mobile-admin-grid mobile-admin-grid-4">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="mobile-card">
                <div className="mobile-flex mobile-flex-between">
                  <div>
                    <p className="mobile-text-caption text-muted-foreground">{stat.title}</p>
                    <p className="mobile-h2 text-foreground">{stat.value}</p>
                    <p className="mobile-text-caption text-muted-foreground">{stat.change}</p>
                  </div>
                  <Icon className="w-8 h-8 text-accent" />
                </div>
              </div>
            );
          })}
        </div>

        {/* System Status */}
        <div className="mobile-card">
          <div className="mobile-flex mobile-flex-between mobile-section">
            <h3 className="mobile-h3 text-foreground">System Status</h3>
            {healthError && (
              <button 
                onClick={() => refetchHealth()}
                className="mobile-button mobile-button-small mobile-button-outline text-destructive"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </button>
            )}
          </div>
          <div>
            {healthLoading ? (
              <div className="mobile-center">
                <LoadingSpinner />
              </div>
            ) : healthError ? (
              <div className="mobile-stack-center text-destructive">
                <AlertCircle className="w-6 h-6" />
                <p className="mobile-text-body">Failed to load system status</p>
                <p className="mobile-text-caption text-muted-foreground">{healthError.message}</p>
              </div>
            ) : (
              <div className="mobile-admin-grid mobile-admin-grid-3">
                <div className="mobile-stack-center">
                  <div className={`mobile-status-dot ${
                    systemHealth?.database.status === 'online' ? 'mobile-status-online' :
                    systemHealth?.database.status === 'degraded' ? 'mobile-status-warning' : 'mobile-status-error'
                  }`}></div>
                  <p className="mobile-text-body text-foreground">Database</p>
                  <p className={`mobile-text-caption ${
                    systemHealth?.database.status === 'online' ? 'text-success' :
                    systemHealth?.database.status === 'degraded' ? 'text-warning' : 'text-destructive'
                  }`}>
                    {systemHealth?.database.status || 'Unknown'} • {systemHealth?.database.responseTime || 0}ms
                  </p>
                </div>
                <div className="mobile-stack-center">
                  <div className={`mobile-status-dot ${
                    systemHealth?.edgeFunctions.status === 'online' ? 'mobile-status-online' :
                    systemHealth?.edgeFunctions.status === 'degraded' ? 'mobile-status-warning' : 'mobile-status-error'
                  }`}></div>
                  <p className="mobile-text-body text-foreground">Edge Functions</p>
                  <p className={`mobile-text-caption ${
                    systemHealth?.edgeFunctions.status === 'online' ? 'text-success' :
                    systemHealth?.edgeFunctions.status === 'degraded' ? 'text-warning' : 'text-destructive'
                  }`}>
                    {systemHealth?.edgeFunctions.status || 'Unknown'} • {systemHealth?.edgeFunctions.activeCount || 0} active
                  </p>
                </div>
                <div className="mobile-stack-center">
                  <div className={`mobile-status-dot ${
                    systemHealth?.apiResponse.status === 'healthy' ? 'mobile-status-online' :
                    systemHealth?.apiResponse.status === 'slow' ? 'mobile-status-warning' : 'mobile-status-error'
                  }`}></div>
                  <p className="mobile-text-body text-foreground">API Response</p>
                  <p className={`mobile-text-caption ${
                    systemHealth?.apiResponse.status === 'healthy' ? 'text-success' :
                    systemHealth?.apiResponse.status === 'slow' ? 'text-warning' : 'text-destructive'
                  }`}>
                    {systemHealth?.apiResponse.averageTime || 0}ms avg
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Errors */}
        <div className="mobile-admin-grid mobile-admin-grid-2">
          <div className="mobile-card">
            <h3 className="mobile-h3 text-foreground mobile-section">Quick Actions</h3>
            <div className="mobile-flow-tight">
              <button className="mobile-button mobile-button-ghost w-full text-left">
                Send System Notification
              </button>
              <button className="mobile-button mobile-button-ghost w-full text-left">
                Export User Data
              </button>
              <button className="mobile-button mobile-button-ghost w-full text-left">
                View System Logs
              </button>
            </div>
          </div>

          <div className="mobile-card">
            <div className="mobile-flex mobile-flex-center mobile-section">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h3 className="mobile-h3 text-foreground">Recent System Errors</h3>
            </div>
            <div className="mobile-flow-tight">
              {systemHealth?.recentErrors.length ? (
                systemHealth.recentErrors.map((error, index) => (
                  <div key={index} className={`mobile-card mobile-card-compact border ${
                    error.severity === 'error' ? 'border-destructive bg-destructive/10' :
                    error.severity === 'warning' ? 'border-warning bg-warning/10' :
                    'border-border bg-muted/50'
                  }`}>
                    <div className="mobile-flex mobile-flex-between">
                      <span className={`mobile-text-caption font-medium ${
                        error.severity === 'error' ? 'text-destructive' :
                        error.severity === 'warning' ? 'text-warning' : 'text-foreground'
                      }`}>
                        {error.severity.charAt(0).toUpperCase() + error.severity.slice(1)}
                      </span>
                      <span className="mobile-text-caption text-muted-foreground">
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mobile-text-body text-foreground">{error.message}</p>
                  </div>
                ))
              ) : (
                <div className="mobile-center text-muted-foreground">
                  No recent errors
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
