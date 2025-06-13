
import React from 'react';

interface AppCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick
}) => {
  const baseClass = variant === 'glass' ? 'app-card-glass' : 'app-card';
  const hoverClass = hover ? '' : 'hover:transform-none hover:shadow-lg';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClass} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface AppCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const AppCardContent: React.FC<AppCardContentProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`app-card-content ${className}`}>
      {children}
    </div>
  );
};

interface AppCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const AppCardHeader: React.FC<AppCardHeaderProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`app-card-header ${className}`}>
      {children}
    </div>
  );
};
