import React from 'react';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'compact' | 'spacious' | 'flat';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  variant = 'default',
  interactive = false,
  onClick,
  className = ''
}) => {
  const Component = interactive || onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'mobile-card',
        variant === 'compact' && 'mobile-card-compact',
        variant === 'spacious' && 'mobile-card-spacious',
        variant === 'flat' && 'mobile-card-flat',
        interactive && 'mobile-touch mobile-haptic cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  );
};