
import { User, Settings, Bell, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { CopyableText } from '@/components/CopyableText';
import { PageLayout } from '@/components/PageLayout';
import { MobileLayout } from '@/components/MobileLayout';

const Profile = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const content = (
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
            <CardTitle className="text-white">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Your Email
              </label>
              <CopyableText text={user?.email || 'No email available'} />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                User ID
              </label>
              <CopyableText text={user?.id || 'No ID available'} />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Current URL
              </label>
              <CopyableText text={window.location.href} />
            </div>
          </CardContent>
        </Card>

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
  );

  // Use MobileLayout for mobile with swipe functionality
  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  // Use PageLayout for desktop
  return (
    <PageLayout title="Profile" subtitle="Manage your account and preferences">
      {content}
    </PageLayout>
  );
};

export default Profile;
