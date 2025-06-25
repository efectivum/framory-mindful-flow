
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bell, BarChart3, AlertCircle, TrendingUp, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      title: 'Beta Users',
      value: '23',
      change: '+3',
      icon: Shield,
      color: 'text-purple-400',
    },
    {
      title: 'Active Notifications',
      value: '15',
      change: '-2',
      icon: Bell,
      color: 'text-green-400',
    },
    {
      title: 'System Health',
      value: '99.9%',
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
          {stats.map((stat) => {
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

        {/* Quick Actions & Recent Activity */}
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
              <CardTitle className="text-white">Recent Admin Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Beta user added: user@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Weekly insights generated</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Bell className="w-4 h-4 text-green-400" />
                <span className="text-sm">Notification campaign sent</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="text-gray-300 text-sm">Database</p>
                <p className="text-green-400 text-xs">Online</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="text-gray-300 text-sm">Edge Functions</p>
                <p className="text-green-400 text-xs">Online</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="text-gray-300 text-sm">Email Service</p>
                <p className="text-green-400 text-xs">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
