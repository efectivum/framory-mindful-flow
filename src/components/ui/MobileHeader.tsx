import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title?: string;
  onBack?: () => void;
  backTo?: string;
  showBack?: boolean;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  onBack,
  backTo,
  showBack = true,
  children,
  className = '',
  actions
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={cn('mobile-header mobile-safe-top', className)}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="mobile-header-back mobile-touch mobile-haptic"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {title && (
          <h1 className="mobile-header-title">{title}</h1>
        )}
        
        {children}
      </div>
      
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
};

interface MobileHeaderActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export const MobileHeaderAction: React.FC<MobileHeaderActionProps> = ({
  children,
  onClick,
  variant = 'secondary',
  disabled = false,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'mobile-header-action mobile-touch mobile-haptic',
        variant === 'primary' && 'mobile-header-action-primary',
        variant === 'secondary' && 'mobile-header-action-secondary',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};