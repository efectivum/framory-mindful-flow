
import { User, Settings, Bell, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

const Profile = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Profile Overview */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-gray-900">{user?.email?.split('@')[0] || 'User'}</CardTitle>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">47</div>
                  <div className="text-gray-600 text-sm">Days Active</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">127</div>
                    <div className="text-gray-600 text-xs">Journal Entries</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">8</div>
                    <div className="text-gray-600 text-xs">Active Goals</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-medium">Daily Reminders</div>
                    <div className="text-gray-600 text-sm">Get reminded to journal daily</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-medium">Goal Progress</div>
                    <div className="text-gray-600 text-sm">Updates on your habit streaks</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-medium">Weekly Insights</div>
                    <div className="text-gray-600 text-sm">Personalized growth insights</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-medium">WhatsApp Nudges</div>
                    <div className="text-gray-600 text-sm">Quick reflection prompts via WhatsApp</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Timezone</label>
                  <select className="w-full bg-white border-gray-300 text-gray-900 rounded px-3 py-2">
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (Central European Time)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Preferred Reminder Time</label>
                  <select className="w-full bg-white border-gray-300 text-gray-900 rounded px-3 py-2">
                    <option>Morning (9:00 AM)</option>
                    <option>Afternoon (2:00 PM)</option>
                    <option>Evening (7:00 PM)</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Theme</label>
                  <select className="w-full bg-white border-gray-300 text-gray-900 rounded px-3 py-2">
                    <option>Light (Current)</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-medium">Data Analytics</div>
                    <div className="text-gray-600 text-sm">Help improve Framory with usage data</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-medium">AI Insights</div>
                    <div className="text-gray-600 text-sm">Allow AI analysis of your entries</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="pt-4 border-t border-gray-300">
                  <Button variant="outline" className="w-full mb-2">
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout - with sidebar support
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-700 px-4">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-white">{user?.email?.split('@')[0] || 'User'}</CardTitle>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">47</div>
                    <div className="text-gray-400 text-sm">Days Active</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-white">127</div>
                      <div className="text-gray-400 text-xs">Journal Entries</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">8</div>
                      <div className="text-gray-400 text-xs">Active Goals</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Settings */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Daily Reminders</div>
                      <div className="text-gray-400 text-sm">Get reminded to journal daily</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Goal Progress</div>
                      <div className="text-gray-400 text-sm">Updates on your habit streaks</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Weekly Insights</div>
                      <div className="text-gray-400 text-sm">Personalized growth insights</div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">WhatsApp Nudges</div>
                      <div className="text-gray-400 text-sm">Quick reflection prompts via WhatsApp</div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Timezone</label>
                    <select className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European Time)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Preferred Reminder Time</label>
                    <select className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2">
                      <option>Morning (9:00 AM)</option>
                      <option>Afternoon (2:00 PM)</option>
                      <option>Evening (7:00 PM)</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Theme</label>
                    <select className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2">
                      <option>Dark (Current)</option>
                      <option>Light</option>
                      <option>Auto</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy & Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Data Analytics</div>
                      <div className="text-gray-400 text-sm">Help improve Framory with usage data</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">AI Insights</div>
                      <div className="text-gray-400 text-sm">Allow AI analysis of your entries</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <Button variant="outline" className="w-full mb-2">
                      <Download className="w-4 h-4 mr-2" />
                      Export My Data
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Profile;
