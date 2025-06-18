
import React from 'react';
import { LoadingSpinner } from './loading-spinner';
import { cn } from '@/lib/utils';

interface InlineLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showMessage?: boolean;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = 'Loading...',
  size = 'sm',
  className,
  showMessage = true
}) => {
  return (
    <div className={cn('flex items-center gap-2 text-gray-400', className)}>
      <LoadingSpinner size={size} />
      {showMessage && (
        <span className="text-sm">{message}</span>
      )}
    </div>
  );
};
