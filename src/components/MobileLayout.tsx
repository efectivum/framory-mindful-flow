
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { BottomNavigation } from './BottomNavigation';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pages = [
    { path: '/', name: 'dashboard' },
    { path: '/goals', name: 'goals' },
    { path: '/journal', name: 'journal' },
    { path: '/chat', name: 'chat' },
    { path: '/profile', name: 'profile' },
  ];

  const currentIndex = pages.findIndex(page => page.path === location.pathname);

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      // Add stricter conditions to prevent accidental navigation
      if (eventData.absX < 120 || eventData.velocity < 0.3) return;
      
      const nextIndex = Math.min(currentIndex + 1, pages.length - 1);
      if (nextIndex !== currentIndex && nextIndex >= 0) {
        console.log(`Swipe navigation: ${pages[currentIndex]?.name} -> ${pages[nextIndex].name}`);
        navigate(pages[nextIndex].path);
      }
    },
    onSwipedRight: (eventData) => {
      // Add stricter conditions to prevent accidental navigation
      if (eventData.absX < 120 || eventData.velocity < 0.3) return;
      
      const prevIndex = Math.max(currentIndex - 1, 0);
      if (prevIndex !== currentIndex && prevIndex >= 0) {
        console.log(`Swipe navigation: ${pages[currentIndex]?.name} -> ${pages[prevIndex].name}`);
        navigate(pages[prevIndex].path);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
    delta: 100, // Minimum distance for swipe recognition
    swipeDuration: 500, // Maximum time for swipe
    touchEventOptions: { passive: false },
  });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div {...handlers} className="h-full w-full">
        <div className="h-full w-full pb-16 overflow-y-auto p-6">
          {children}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};
