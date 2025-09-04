
import React from 'react';
import { User, Shield, Bell, Palette, Download, Trophy } from 'lucide-react';
import { MobilePage, MobileContent, MobileSection } from '@/components/layouts/MobileLayout';
import { MobileCard } from '@/components/ui/MobileCard';
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
    <MobilePage>
      <MobileContent padded>
        <NetworkStatusIndicator />
        <div className="mobile-flow">
          {/* Welcome Section */}
          <MobileSection>
            <div className="mobile-stack-center">
              <div className="mobile-touch mobile-haptic" style={{ 
                width: '96px', 
                height: '96px', 
                borderRadius: 'var(--app-radius-lg)', 
                background: 'var(--app-gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="mobile-h1">
                  Welcome, {user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="mobile-body" style={{ color: 'var(--app-text-secondary)' }}>
                  Manage your account settings and customize your Lumatori experience
                </p>
              </div>
            </div>
          </MobileSection>

          {/* Achievements Section */}
          <MobileSection>
            <AchievementsSection />
          </MobileSection>

          {/* Settings Grid */}
          <MobileSection>
            <ButtonErrorBoundary fallbackMessage="Settings are not available">
              <div className="mobile-grid-auto-fit">
                <FlippableCard
                  frontContent={accountCard.front}
                  backContent={accountCard.back}
                  height="h-[500px]"
                  className="mobile-touch mobile-haptic"
                  flipOnHover={false}
                  flipOnClick={true}
                />
                <FlippableCard
                  frontContent={privacyCard.front}
                  backContent={privacyCard.back}
                  height="h-[500px]"
                  className="mobile-touch mobile-haptic"
                  flipOnHover={false}
                  flipOnClick={true}
                />
                <FlippableCard
                  frontContent={notificationsCard.front}
                  backContent={notificationsCard.back}
                  height="h-[500px]"
                  className="mobile-touch mobile-haptic"
                  flipOnHover={false}
                  flipOnClick={true}
                />
                <FlippableCard
                  frontContent={preferencesCard.front}
                  backContent={preferencesCard.back}
                  height="h-[500px]"
                  className="mobile-touch mobile-haptic"
                  flipOnHover={false}
                  flipOnClick={true}
                />
              </div>
            </ButtonErrorBoundary>
          </MobileSection>
        </div>
      </MobileContent>
    </MobilePage>
  );
};

export default Profile;
