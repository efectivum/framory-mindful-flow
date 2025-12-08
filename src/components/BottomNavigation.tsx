import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getVisibleNavigationItems } from '@/config/navigation';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get main navigation items (exclude admin for bottom nav)
  const mainNavItems = getVisibleNavigationItems(false);

  const getCurrentPageId = () => {
    const currentPath = location.pathname;
    const currentItem = mainNavItems.find(item => item.path === currentPath);
    return currentItem?.id || 'today';
  };

  const currentPageId = getCurrentPageId();

  const handleNavigation = React.useCallback((path: string) => {
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate(path);
  }, [navigate]);

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {mainNavItems.map((item) => {
          const isActive = currentPageId === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl",
                "min-w-[64px] min-h-[52px]",
                "transition-all duration-200",
                "touch-manipulation",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              aria-label={`Navigate to ${item.title}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive ? "stroke-[2.5]" : "stroke-2"
                )} 
              />
              <span 
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
