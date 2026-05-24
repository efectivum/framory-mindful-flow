
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
      'flex flex-col items-center justify-center bg-background',
      fullScreen ? 'min-h-screen' : 'min-h-[400px]',
      className
    )}>
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
};
