
import React from 'react';
import { User, Shield, Bell, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { AccountInformation } from '@/components/AccountInformation';
import { PrivacySettings } from '@/components/PrivacySettings';
import { EmailPreferences } from '@/components/EmailPreferences';
import { AdditionalSettings } from '@/components/AdditionalSettings';
import { AchievementsSection } from '@/components/AchievementsSection';
import { useAuth } from '@/hooks/useAuth';
import { FlippableCard } from '@/components/ui/FlippableCard';

const Profile = () => {
  const { user } = useAuth();

  const createSettingsCard = (
    icon: React.ReactNode,
    title: string,
    description: string,
    component: React.ReactNode,
    accentColor: string
  ) => {
    const front = (
      <div className="h-full w-full card-serene p-6 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accentColor}`}>
          {icon}
        </div>
        <div className="mt-auto">
          <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    );

    const back = (
      <div className="h-full w-full card-serene overflow-hidden">
        <div className="h-full w-full overflow-y-auto p-1">
          {component}
        </div>
      </div>
    );

    return { front, back };
  };

  const accountCard = createSettingsCard(
    <User className="w-5 h-5 text-primary" />,
    "Account",
    "Manage your personal information",
    <AccountInformation />,
    "bg-primary/10"
  );

  const privacyCard = createSettingsCard(
    <Shield className="w-5 h-5 text-success" />,
    "Privacy & Data",
    "Control your data and privacy",
    <PrivacySettings />,
    "bg-success/10"
  );

  const notificationsCard = createSettingsCard(
    <Bell className="w-5 h-5 text-warning" />,
    "Notifications",
    "Configure email settings",
    <EmailPreferences />,
    "bg-warning/10"
  );

  const preferencesCard = createSettingsCard(
    <Palette className="w-5 h-5 text-accent-foreground" />,
    "Preferences",
    "Customize your experience",
    <AdditionalSettings />,
    "bg-accent"
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ResponsiveLayout>
      <motion.div 
        className="space-y-6 py-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Welcome, {user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your Lumatori experience
            </p>
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div variants={itemVariants}>
          <AchievementsSection />
        </motion.div>

        {/* Settings Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FlippableCard
              frontContent={accountCard.front}
              backContent={accountCard.back}
              height="h-[420px]"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={privacyCard.front}
              backContent={privacyCard.back}
              height="h-[420px]"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={notificationsCard.front}
              backContent={notificationsCard.back}
              height="h-[420px]"
              flipOnHover={false}
              flipOnClick={true}
            />
            <FlippableCard
              frontContent={preferencesCard.front}
              backContent={preferencesCard.back}
              height="h-[420px]"
              flipOnHover={false}
              flipOnClick={true}
            />
          </div>
        </motion.div>
      </motion.div>
    </ResponsiveLayout>
  );
};

export default Profile;
