
import React from 'react';

interface AppPageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export const AppPageHeader: React.FC<AppPageHeaderProps> = ({
  icon,
  title,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`app-header app-fade-in ${className}`}>
      <div className="app-header-icon">
        {icon}
      </div>
      <h1 className="app-header-title">{title}</h1>
      {subtitle && (
        <p className="app-header-subtitle">{subtitle}</p>
      )}
    </div>
  );
};
