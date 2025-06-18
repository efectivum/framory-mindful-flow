
import React from 'react';
import { LoadingSpinner } from './loading-spinner';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  className,
  fullScreen = true
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
      fullScreen ? 'min-h-screen' : 'min-h-[400px]',
      className
    )}>
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-gray-300 text-lg">{message}</p>
    </div>
  );
};
