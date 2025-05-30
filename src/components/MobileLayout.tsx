
import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { BottomNavigation } from './BottomNavigation';
import { SwipeContainer } from './SwipeContainer';
import { SidePanel } from './SidePanel';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  currentPage,
  onPageChange,
}) => {
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const pages = ['dashboard', 'goals', 'journal', 'insights', 'chat'];
  const currentIndex = pages.indexOf(currentPage);

  const handlers = useSwipeable({
    onSwipedUp: () => {
      const nextIndex = Math.min(currentIndex + 1, pages.length - 1);
      onPageChange(pages[nextIndex]);
    },
    onSwipedDown: () => {
      const prevIndex = Math.max(currentIndex - 1, 0);
      onPageChange(pages[prevIndex]);
    },
    onSwipedLeft: () => {
      setShowRightPanel(true);
    },
    onSwipedRight: () => {
      setShowSidePanel(true);
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
  });

  // Add haptic feedback for mobile
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [currentPage]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Side Panel - Menu */}
      <SidePanel
        isOpen={showSidePanel}
        onClose={() => setShowSidePanel(false)}
        type="menu"
      />

      {/* Right Panel - Notifications */}
      <SidePanel
        isOpen={showRightPanel}
        onClose={() => setShowRightPanel(false)}
        type="notifications"
      />

      {/* Main Content */}
      <div {...handlers} className="h-full w-full">
        <SwipeContainer currentPage={currentPage}>
          {children}
        </SwipeContainer>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};
