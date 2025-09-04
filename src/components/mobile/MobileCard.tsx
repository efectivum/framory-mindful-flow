import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  elevated?: boolean;
}

export const MobileCard = ({ 
  children, 
  className, 
  interactive = false, 
  elevated = false 
}: MobileCardProps) => {
  return (
    <div className={cn(
      // Mobile-first base styles
      "bg-card text-card-foreground rounded-lg border border-border",
      "p-4 w-full",
      // Interactive states
      interactive && "card-hover cursor-pointer",
      // Elevation
      elevated && "shadow-lg",
      className
    )}>
      {children}
    </div>
  );
};