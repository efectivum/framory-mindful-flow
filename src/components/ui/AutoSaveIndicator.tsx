
import React, { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  status: 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  className?: string;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ 
  status, 
  lastSaved, 
  className 
}) => {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (status === 'saving' || status === 'error') {
      setShowIndicator(true);
    } else if (status === 'saved') {
      setShowIndicator(true);
      const timer = setTimeout(() => setShowIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!showIndicator) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Clock className="w-4 h-4 animate-spin" />,
          text: 'Saving...',
          className: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
        };
      case 'saved':
        return {
          icon: <Check className="w-4 h-4" />,
          text: lastSaved ? `Saved ${formatTime(lastSaved)}` : 'Saved',
          className: 'text-green-400 bg-green-400/10 border-green-400/20'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Save failed',
          className: 'text-red-400 bg-red-400/10 border-red-400/20'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
      "border backdrop-blur-sm animate-fade-in",
      config.className,
      className
    )}>
      {config.icon}
      {config.text}
    </div>
  );
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
};
