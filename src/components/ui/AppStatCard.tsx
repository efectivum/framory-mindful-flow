
import React from 'react';

interface AppStatCardProps {
  value: string | number | React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const AppStatCard: React.FC<AppStatCardProps> = ({
  value,
  label,
  icon,
  color = 'primary',
  className = ''
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'success':
        return 'app-success';
      case 'warning':
        return 'app-warning';
      case 'error':
        return 'app-error';
      default:
        return '';
    }
  };

  return (
    <div className={`app-stat-card ${getColorClass()} ${className}`}>
      {icon && (
        <div className="app-mb-sm">
          {icon}
        </div>
      )}
      <div className="app-stat-value">{value}</div>
      <div className="app-stat-label">{label}</div>
    </div>
  );
};
