
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AdminAnalytics() {
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
                  <p className="text-2xl font-bold text-white">1,247</p>
                  <p className="text-green-400 text-sm">+12% from last month</p>
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
                  <p className="text-2xl font-bold text-white">15,632</p>
                  <p className="text-green-400 text-sm">+8% this week</p>
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
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-purple-400 text-sm">+5 this month</p>
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
                  <p className="text-2xl font-bold text-white">84%</p>
                  <p className="text-green-400 text-sm">30-day retention</p>
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
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Journaling</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-white text-sm">85%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Habit Tracking</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-white text-sm">72%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">AI Coach</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                  <span className="text-white text-sm">64%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Insights</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-white text-sm">45%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Engagement Timeline */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              Chart visualization would go here
              <br />
              (Integration with recharts for detailed analytics)
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
