
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
    onSwipedLeft: () => {
      const nextIndex = Math.min(currentIndex + 1, pages.length - 1);
      if (nextIndex !== currentIndex && nextIndex >= 0) {
        navigate(pages[nextIndex].path);
      }
    },
    onSwipedRight: () => {
      const prevIndex = Math.max(currentIndex - 1, 0);
      if (prevIndex !== currentIndex && prevIndex >= 0) {
        navigate(pages[prevIndex].path);
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
  });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <div {...handlers} className="h-full w-full">
        <div className="h-full w-full pb-16 overflow-y-auto">
          {children}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};
