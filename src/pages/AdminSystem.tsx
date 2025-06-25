
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminAuditLog } from '@/components/admin/AdminAuditLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Activity, Database, Server } from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AdminSystem() {
  const { data: systemHealth, isLoading, error } = useSystemHealth();

  if (isLoading) {
    return (
      <AdminLayout title="System Management" subtitle="Monitor system health, errors, and audit logs">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="System Management" subtitle="Monitor system health, errors, and audit logs">
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Failed to load system health data</span>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
      case 'low':
        return 'text-green-400';
      case 'degraded':
      case 'slow':
      case 'medium':
        return 'text-yellow-400';
      case 'offline':
      case 'error':
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <AdminLayout 
      title="System Management" 
      subtitle="Monitor system health, errors, and audit logs"
    >
      <div className="space-y-6">
        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Database</p>
                  <p className={`text-lg font-bold ${getStatusColor(systemHealth?.database.status || '')}`}>
                    {systemHealth?.database.status?.charAt(0).toUpperCase() + (systemHealth?.database.status?.slice(1) || '')}
                  </p>
                  <p className="text-gray-400 text-xs">{systemHealth?.database.uptime}% uptime</p>
                </div>
                <Database className={`w-8 h-8 ${getStatusColor(systemHealth?.database.status || '')}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Edge Functions</p>
                  <p className={`text-lg font-bold ${getStatusColor(systemHealth?.edgeFunctions.status || '')}`}>
                    {systemHealth?.edgeFunctions.status?.charAt(0).toUpperCase() + (systemHealth?.edgeFunctions.status?.slice(1) || '')}
                  </p>
                  <p className="text-gray-400 text-xs">{systemHealth?.edgeFunctions.activeCount} functions</p>
                </div>
                <Server className={`w-8 h-8 ${getStatusColor(systemHealth?.edgeFunctions.status || '')}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">API Response</p>
                  <p className={`text-lg font-bold ${getStatusColor(systemHealth?.apiResponse.status || '')}`}>
                    {systemHealth?.apiResponse.averageTime}ms
                  </p>
                  <p className="text-gray-400 text-xs">Average</p>
                </div>
                <Activity className={`w-8 h-8 ${getStatusColor(systemHealth?.apiResponse.status || '')}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Error Rate</p>
                  <p className={`text-lg font-bold ${getStatusColor(systemHealth?.errorRate.status || '')}`}>
                    {systemHealth?.errorRate.rate.toFixed(1)}%
                  </p>
                  <p className="text-gray-400 text-xs">Last 24h</p>
                </div>
                <AlertTriangle className={`w-8 h-8 ${getStatusColor(systemHealth?.errorRate.status || '')}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Errors */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
                        {error.severity.charAt(0).toUpperCase() + error.severity.slice(1)} Error
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(error.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{error.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No recent errors found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admin Audit Log */}
        <AdminAuditLog />
      </div>
    </AdminLayout>
  );
}
