
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
    <nav className="mobile-fixed mobile-bottom-0 left-0 right-0 z-50 mobile-hidden desktop-hidden" style={{ height: 'var(--bottom-nav-height)' }}>
      <div className="mobile-bg-card backdrop-blur-xl mobile-border mobile-shadow-floating">
        <div className="mobile-flex mobile-flex-around mobile-content-spacing">
          {mainNavItems.map((item) => {
            const isActive = currentPageId === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.title)}
                className={cn(
                  "mobile-touchable mobile-haptic mobile-stack-center mobile-gesture-zone",
                  "transition-all duration-300 mobile-flex-1",
                  "mobile-focus-visible mobile-relative overflow-hidden",
                  isActive 
                    ? "mobile-text-accent mobile-bg-accent mobile-shadow-floating" 
                    : "mobile-text-muted"
                )}
                aria-label={`Navigate to ${item.title}`}
                role="tab"
                aria-selected={isActive}
              >
                {isActive && (
                  <div className="mobile-absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-xl" />
                )}
                
                <Icon 
                  className={cn(
                    "mobile-w-4 mobile-h-4 transition-all duration-300",
                    isActive ? "stroke-2" : "stroke-[1.5]"
                  )} 
                />
                <span 
                  className={cn(
                    "mobile-text-caption font-medium leading-tight transition-all duration-300 text-center",
                    isActive ? "mobile-text-accent" : "mobile-text-muted"
                  )}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="mobile-safe-bottom" />
      </div>
    </nav>
  );
};
