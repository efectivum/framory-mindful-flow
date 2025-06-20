
import { UserPreferencesForm } from '@/components/UserPreferencesForm';
import { ProfileOverview } from '@/components/ProfileOverview';
import { AccountInformation } from '@/components/AccountInformation';
import { AdditionalSettings } from '@/components/AdditionalSettings';
import { PrivacySettings } from '@/components/PrivacySettings';
import { SessionManagement } from '@/components/SessionManagement';
import { EmailPreferences } from '@/components/EmailPreferences';
import { SubscriptionDashboard } from '@/components/SubscriptionDashboard';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const content = (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
        <TabsTrigger value="overview" className="text-gray-300">Overview</TabsTrigger>
        <TabsTrigger value="subscription" className="text-gray-300">Subscription</TabsTrigger>
        <TabsTrigger value="settings" className="text-gray-300">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileOverview />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <AccountInformation />
            <SessionManagement />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="subscription" className="space-y-6">
        <SubscriptionDashboard />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <EmailPreferences />
            <UserPreferencesForm />
          </div>
          <div className="space-y-6">
            <AdditionalSettings />
            <PrivacySettings />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <ResponsiveLayout title="Profile" subtitle="Manage your account and preferences">
      {content}
    </ResponsiveLayout>
  );
};

export default Profile;
