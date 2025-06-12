
import { useIsMobile } from '@/hooks/use-mobile';
import { PageLayout } from '@/components/PageLayout';
import { MobileLayout } from '@/components/MobileLayout';
import { UserPreferencesForm } from '@/components/UserPreferencesForm';
import { ProfileOverview } from '@/components/ProfileOverview';
import { AccountInformation } from '@/components/AccountInformation';
import { AdditionalSettings } from '@/components/AdditionalSettings';
import { PrivacySettings } from '@/components/PrivacySettings';

const Profile = () => {
  const isMobile = useIsMobile();

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
