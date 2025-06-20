
import { UserPreferencesForm } from '@/components/UserPreferencesForm';
import { ProfileOverview } from '@/components/ProfileOverview';
import { AccountInformation } from '@/components/AccountInformation';
import { AdditionalSettings } from '@/components/AdditionalSettings';
import { PrivacySettings } from '@/components/PrivacySettings';
import { SessionManagement } from '@/components/SessionManagement';
import { EmailPreferences } from '@/components/EmailPreferences';
import { SubscriptionDashboard } from '@/components/SubscriptionDashboard';
import { BetaUserManagement } from '@/components/BetaUserManagement';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/hooks/useAdmin';
import { Shield } from 'lucide-react';
import React, { useMemo } from 'react';

const Profile = React.memo(() => {
  const { isAdmin, isLoading: adminLoading } = useAdmin();

  // Memoize tab count to prevent recalculation
  const tabCount = useMemo(() => isAdmin ? 4 : 3, [isAdmin]);

  const content = (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className={`grid w-full grid-cols-${tabCount} bg-gray-800/50`}>
        <TabsTrigger value="overview" className="text-gray-300">Overview</TabsTrigger>
        <TabsTrigger value="subscription" className="text-gray-300">Subscription</TabsTrigger>
        <TabsTrigger value="settings" className="text-gray-300">Settings</TabsTrigger>
        {!adminLoading && isAdmin && (
          <TabsTrigger value="admin" className="text-gray-300">
            <Shield className="w-4 h-4 mr-1" />
            Admin
          </TabsTrigger>
        )}
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

      {!adminLoading && isAdmin && (
        <TabsContent value="admin" className="space-y-6">
          <BetaUserManagement />
        </TabsContent>
      )}
    </Tabs>
  );

  return (
    <ResponsiveLayout title="Profile" subtitle="Manage your account and preferences">
      {content}
    </ResponsiveLayout>
  );
});

Profile.displayName = 'Profile';

export default Profile;
