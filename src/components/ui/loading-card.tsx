
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from './loading-spinner';
import { cn } from '@/lib/utils';

interface LoadingCardProps {
  variant?: 'spinner' | 'skeleton';
  title?: string;
  lines?: number;
  className?: string;
  showHeader?: boolean;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  variant = 'spinner',
  title = 'Loading...',
  lines = 3,
  className,
  showHeader = true
}) => {
  return (
    <Card className={cn('bg-gray-800/50 border-gray-700 backdrop-blur-sm', className)}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {variant === 'spinner' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner size="lg" className="mb-3" />
            <p className="text-gray-400 text-sm">{title}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
