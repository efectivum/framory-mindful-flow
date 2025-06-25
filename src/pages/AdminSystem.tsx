
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminAuditLog } from '@/components/admin/AdminAuditLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Activity, Database, Server } from 'lucide-react';

export default function AdminSystem() {
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
                  <p className="text-lg font-bold text-green-400">Online</p>
                  <p className="text-gray-400 text-xs">99.9% uptime</p>
                </div>
                <Database className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Edge Functions</p>
                  <p className="text-lg font-bold text-green-400">Active</p>
                  <p className="text-gray-400 text-xs">15 functions</p>
                </div>
                <Server className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">API Response</p>
                  <p className="text-lg font-bold text-green-400">45ms</p>
                  <p className="text-gray-400 text-xs">Average</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Error Rate</p>
                  <p className="text-lg font-bold text-yellow-400">0.1%</p>
                  <p className="text-gray-400 text-xs">Last 24h</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
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
              <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-400 font-medium">Authentication Error</span>
                  <span className="text-gray-400 text-sm">2 hours ago</span>
                </div>
                <p className="text-gray-300 text-sm">Invalid session token detected</p>
              </div>

              <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-400 font-medium">API Timeout</span>
                  <span className="text-gray-400 text-sm">5 hours ago</span>
                </div>
                <p className="text-gray-300 text-sm">OpenAI API request timed out</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Audit Log */}
        <AdminAuditLog />
      </div>
    </AdminLayout>
  );
}
