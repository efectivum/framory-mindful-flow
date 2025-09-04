import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
  centered?: boolean;
  padded?: boolean;
}

export const MobileLayout = ({ 
  children, 
  className, 
  fullHeight = true, 
  centered = false, 
  padded = true 
}: MobileLayoutProps) => {
  return (
    <div className={cn(
      // Mobile-first base styles
      "w-full bg-background",
      fullHeight && "min-h-screen",
      centered && "flex items-center justify-center",
      padded && "px-4 py-6",
      className
    )}>
      {children}
    </div>
  );
};