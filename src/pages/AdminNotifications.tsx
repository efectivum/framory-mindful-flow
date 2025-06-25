
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Send, Calendar, Users } from 'lucide-react';

export default function AdminNotifications() {
  return (
    <AdminLayout 
      title="Notification Management" 
      subtitle="Manage system notifications, emails, and user communications"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Send className="w-6 h-6 text-blue-400" />
                <h3 className="text-white font-semibold">Send Notification</h3>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Send Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-green-400" />
                <h3 className="text-white font-semibold">Schedule Campaign</h3>
              </div>
              <Button variant="outline" className="w-full">
                Schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-white font-semibold">Bulk Email</h3>
              </div>
              <Button variant="outline" className="w-full">
                Compose
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Notifications */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Pending Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Daily Reminder</p>
                  <p className="text-gray-400 text-sm">Scheduled for 247 users at 9:00 AM</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="destructive">Cancel</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Weekly Insights</p>
                  <p className="text-gray-400 text-sm">Scheduled for 89 users on Sunday</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="destructive">Cancel</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Templates */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Notification Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-700/30 rounded-lg">
                <h4 className="text-white font-medium">Welcome Email</h4>
                <p className="text-gray-400 text-sm">Sent to new users after signup</p>
                <Button size="sm" variant="outline" className="mt-2">Edit Template</Button>
              </div>

              <div className="p-3 bg-gray-700/30 rounded-lg">
                <h4 className="text-white font-medium">Password Reset</h4>
                <p className="text-gray-400 text-sm">Sent for password reset requests</p>
                <Button size="sm" variant="outline" className="mt-2">Edit Template</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
