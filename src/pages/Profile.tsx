
import React from 'react';
import { User, Shield, Bell, Palette, Download, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountInformation } from '@/components/AccountInformation';
import { PrivacySettings } from '@/components/PrivacySettings';
import { EmailPreferences } from '@/components/EmailPreferences';
import { AdditionalSettings } from '@/components/AdditionalSettings';
import { AchievementsSection } from '@/components/AchievementsSection';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { useAuth } from '@/hooks/useAuth';
import { FlippableCard } from '@/components/ui/FlippableCard';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';

const Profile = () => {
  const { user } = useAuth();

  const createSettingsCard = (
    icon: React.ReactNode,
    title: string,
    description: string,
    component: React.ReactNode,
    gradient: string
  ) => {
    const front = (
      <div className={`h-full w-full rounded-3xl p-6 flex flex-col justify-between shadow-xl border border-white/10 backdrop-blur-sm app-card-organic cursor-pointer`}
           style={{ background: gradient }}>
        <div className="flex items-center justify-between">
          <div className="text-white/80">{icon}</div>
        </div>
        <div>
          <div className="text-xl font-medium text-white mb-2">{title}</div>
          <div className="text-white/80 text-sm">{description}</div>
        </div>
      </div>
    );

    const back = (
      <div className="h-full w-full rounded-3xl bg-gray-800/60 border border-gray-600/50 backdrop-blur-sm overflow-hidden">
        <div className="h-full w-full overflow-y-auto scrollbar-hide">
          {component}
        </div>
      </div>
    );

    return { front, back };
  };

  const accountCard = createSettingsCard(
    <User className="w-6 h-6" />,
    "Account",
    "Manage your personal information and preferences",
    <AccountInformation />,
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
  );

  const privacyCard = createSettingsCard(
    <Shield className="w-6 h-6" />,
    "Privacy & Data",
    "Control how your data is used and stored",
    <PrivacySettings />,
    "linear-gradient(135deg, #10b981 0%, #059669 100%)"
  );

  const notificationsCard = createSettingsCard(
    <Bell className="w-6 h-6" />,
    "Notifications",
    "Configure email and app notifications",
    <EmailPreferences />,
    "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
  );

  const preferencesCard = createSettingsCard(
    <Palette className="w-6 h-6" />,
    "Preferences",
    "Customize your app experience",
    <AdditionalSettings />,
    "linear-gradient(135deg, #ec4899 0%, #be185d 100%)"
  );

  return (
    <ResponsiveLayout title="Profile" subtitle="Manage your account and preferences">
      <NetworkStatusIndicator />
      <div className="app-content-flow">
        {/* Enhanced Welcome Section */}
        <div className="text-center space-y-6 mb-8">
          <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-breathe app-card-organic" 
               style={{ background: 'var(--app-accent-primary)' }}>
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-hero mb-2">
              Welcome, {user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-subhero">
              Manage your account settings and customize your Lumatori experience
            </p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-8">
          <AchievementsSection />
        </div>

        {/* Enhanced Settings Grid */}
        <ButtonErrorBoundary fallbackMessage="Settings are not available">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <FlippableCard
              frontContent={accountCard.front}
              backContent={accountCard.back}
              height="h-[500px]"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={privacyCard.front}
              backContent={privacyCard.back}
              height="h-[500px]"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={notificationsCard.front}
              backContent={notificationsCard.back}
              height="h-[500px]"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={preferencesCard.front}
              backContent={preferencesCard.back}
              height="h-[500px]"
              className="card-hover"
              flipOnHover={false}
              flipOnClick={true}
            />
          </div>
        </ButtonErrorBoundary>
      </div>
    </ResponsiveLayout>
  );
};

export default Profile;
