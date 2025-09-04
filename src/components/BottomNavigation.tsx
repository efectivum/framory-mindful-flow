
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getVisibleNavigationItems } from '@/config/navigation';
import { useAdmin } from '@/hooks/useAdmin';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAdmin();
  
  // Get all main navigation items (exclude admin for mobile)
  const mainNavItems = getVisibleNavigationItems(false);

  const getCurrentPageId = () => {
    const currentPath = location.pathname;
    const currentItem = mainNavItems.find(item => item.path === currentPath);
    return currentItem?.id || 'today';
  };

  const currentPageId = getCurrentPageId();

  const handleNavigation = React.useCallback((path: string, title: string) => {
    console.log(`Bottom nav clicked: ${title} (${path})`);
    
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback to window.location if navigate fails
      window.location.href = path;
    }
  }, [navigate]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ height: 'var(--bottom-nav-height)' }}>
      <div className="bg-card/90 backdrop-blur-xl border-t border-border shadow-2xl">
        <div className="mobile-flex mobile-flex-around px-1 py-1">
          {mainNavItems.map((item) => {
            const isActive = currentPageId === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.title)}
                className={cn(
                  "mobile-touch mobile-haptic mobile-flex mobile-flex-col mobile-flex-center",
                  "p-2 rounded-xl transition-all duration-300 min-w-12 min-h-14 flex-1 max-w-16",
                  "mobile-focus-visible relative overflow-hidden",
                  isActive 
                    ? "text-primary bg-primary/10 shadow-lg" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
                aria-label={`Navigate to ${item.title}`}
                role="tab"
                aria-selected={isActive}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-xl" />
                )}
                
                <Icon 
                  className={cn(
                    "w-4 h-4 mb-1 transition-all duration-300",
                    isActive ? "stroke-2" : "stroke-[1.5]"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs font-medium leading-tight transition-all duration-300 text-center",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="mobile-safe-bottom h-1" />
      </div>
    </nav>
  );
};
