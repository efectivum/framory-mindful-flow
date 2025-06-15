import { UserPreferencesForm } from '@/components/UserPreferencesForm';
import { ProfileOverview } from '@/components/ProfileOverview';
import { AccountInformation } from '@/components/AccountInformation';
import { AdditionalSettings } from '@/components/AdditionalSettings';
import { PrivacySettings } from '@/components/PrivacySettings';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';

const Profile = () => {
  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Overview */}
      <div className="lg:col-span-1">
        <ProfileOverview />
      </div>

      {/* Settings */}
      <div className="lg:col-span-2 space-y-6">
        <AccountInformation />
        <UserPreferencesForm />
        <AdditionalSettings />
        <PrivacySettings />
      </div>
    </div>
  );

  // Always use ResponsiveLayout
  return (
    <ResponsiveLayout title="Profile" subtitle="Manage your account and preferences">
      {content}
    </ResponsiveLayout>
  );
};

export default Profile;
