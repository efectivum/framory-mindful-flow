
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
  const colorStyles = {
    primary: 'bg-gray-800/60 border-gray-700/80 hover:border-blue-400/50',
    success: 'bg-gradient-to-br from-emerald-500/10 via-gray-900/5 to-gray-900/10 border-emerald-500/20',
    warning: 'bg-gradient-to-br from-yellow-500/10 via-gray-900/5 to-gray-900/10 border-yellow-500/20',
    error: 'bg-gradient-to-br from-red-500/10 via-gray-900/5 to-gray-900/10 border-red-500/20',
  };
  
  const baseClasses = "flex-shrink-0 text-center transition-all duration-300 transform hover:-translate-y-px p-3 rounded-2xl border backdrop-blur-sm flex flex-col items-center justify-center min-w-[120px] md:flex-1 md:min-w-0";

  return (
    <div className={`${baseClasses} ${colorStyles[color as keyof typeof colorStyles]} ${className}`}>
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-xl font-bold text-white leading-none flex items-center gap-1">{value}</div>
      <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1.5">{label}</div>
    </div>
  );
};
