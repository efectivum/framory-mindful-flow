
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

  const getCurrentPage = () => {
    const path = location.pathname.slice(1) || 'dashboard';
    if (path === '') return 'dashboard';
    return path;
  };

  const handlePageChange = (page: string) => {
    const route = page === 'dashboard' ? '/' : `/${page}`;
    navigate(route);
  };

  const pages = ['dashboard', 'goals', 'journal', 'insights', 'chat'];
  const currentPage = getCurrentPage();
  const currentIndex = pages.indexOf(currentPage);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const nextIndex = Math.min(currentIndex + 1, pages.length - 1);
      if (nextIndex !== currentIndex) {
        handlePageChange(pages[nextIndex]);
      }
    },
    onSwipedRight: () => {
      const prevIndex = Math.max(currentIndex - 1, 0);
      if (prevIndex !== currentIndex) {
        handlePageChange(pages[prevIndex]);
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
  });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <div {...handlers} className="h-full w-full">
        <div className="h-full w-full pb-16">
          {children}
        </div>
      </div>

      <BottomNavigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
