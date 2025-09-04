import React from 'react';
import { cn } from '@/lib/utils';

interface MobileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'default' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  fullWidth = false
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'mobile-button mobile-touch mobile-haptic',
        variant === 'secondary' && 'mobile-button-secondary',
        variant === 'outline' && 'mobile-button-outline',
        variant === 'ghost' && 'mobile-button-ghost',
        size === 'small' && 'mobile-button-small',
        size === 'large' && 'mobile-button-large',
        fullWidth && 'w-full',
        loading && 'mobile-loading',
        className
      )}
    >
      {children}
    </button>
  );
};