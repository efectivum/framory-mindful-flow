import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  withNav?: boolean;
  fullscreen?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  className = '',
  withNav = true,
  fullscreen = false
}) => {
  return (
    <div className={cn(
      'mobile-layout',
      withNav && 'mobile-layout-with-nav',
      fullscreen && 'mobile-layout-fullscreen',
      className
    )}>
      {children}
    </div>
  );
};

interface MobilePageProps {
  children: React.ReactNode;
  className?: string;
}

export const MobilePage: React.FC<MobilePageProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <div className={cn('mobile-page mobile-safe-horizontal', className)}>
      {children}
    </div>
  );
};

interface MobileContentProps {
  children: React.ReactNode;
  padded?: boolean;
  className?: string;
}

export const MobileContent: React.FC<MobileContentProps> = ({ 
  children, 
  padded = false,
  className = ''
}) => {
  return (
    <div className={cn(
      padded ? 'mobile-content-padded' : 'mobile-content',
      className
    )}>
      {children}
    </div>
  );
};

interface MobileSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileSection: React.FC<MobileSectionProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <div className={cn('mobile-section', className)}>
      {children}
    </div>
  );
};