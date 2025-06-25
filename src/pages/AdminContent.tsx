
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminContent() {
  return (
    <AdminLayout 
      title="Content Management" 
      subtitle="Manage challenges, templates, and coaching protocols"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Plus className="w-6 h-6 text-blue-400" />
                <h3 className="text-white font-semibold">Create Challenge</h3>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                New Challenge
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-green-400" />
                <h3 className="text-white font-semibold">Journal Template</h3>
              </div>
              <Button variant="outline" className="w-full">
                New Template
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Plus className="w-6 h-6 text-purple-400" />
                <h3 className="text-white font-semibold">Coaching Protocol</h3>
              </div>
              <Button variant="outline" className="w-full">
                New Protocol
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Challenges */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Active Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">30-Day Mindfulness Challenge</p>
                  <p className="text-gray-400 text-sm">147 participants • 85% completion rate</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Gratitude Practice</p>
                  <p className="text-gray-400 text-sm">89 participants • 92% completion rate</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Templates */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Journal Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">Daily Reflection</h4>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Used by 456 users this month</p>
              </div>

              <div className="p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">Goal Setting</h4>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Used by 234 users this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
