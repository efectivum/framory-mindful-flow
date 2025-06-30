
/**
 * Mobile-first utility functions for Lumatori
 */

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768
  );
};

export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const addHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'light'): void => {
  if (!('vibrate' in navigator)) return;
  
  const patterns = {
    light: 50,
    medium: 100,
    heavy: 200
  };
  
  navigator.vibrate(patterns[intensity]);
};

export const preventZoomOnInputFocus = (element: HTMLInputElement | HTMLTextAreaElement): void => {
  const currentFontSize = window.getComputedStyle(element).fontSize;
  const fontSize = parseFloat(currentFontSize);
  
  if (fontSize < 16) {
    element.style.fontSize = '16px';
  }
};

export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
  
  const computedStyle = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0,
    bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
    left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)')) || 0,
    right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)')) || 0,
  };
};

export const optimizeForMobile = {
  /**
   * Add mobile-optimized event listeners
   */
  addTouchEvents: (element: HTMLElement, handlers: {
    onTouchStart?: (e: TouchEvent) => void;
    onTouchEnd?: (e: TouchEvent) => void;
    onTouchMove?: (e: TouchEvent) => void;
  }) => {
    if (handlers.onTouchStart) {
      element.addEventListener('touchstart', handlers.onTouchStart, { passive: true });
    }
    if (handlers.onTouchEnd) {
      element.addEventListener('touchend', handlers.onTouchEnd, { passive: true });
    }
    if (handlers.onTouchMove) {
      element.addEventListener('touchmove', handlers.onTouchMove, { passive: true });
    }
  },

  /**
   * Remove mobile event listeners
   */
  removeTouchEvents: (element: HTMLElement, handlers: {
    onTouchStart?: (e: TouchEvent) => void;
    onTouchEnd?: (e: TouchEvent) => void;
    onTouchMove?: (e: TouchEvent) => void;
  }) => {
    if (handlers.onTouchStart) {
      element.removeEventListener('touchstart', handlers.onTouchStart);
    }
    if (handlers.onTouchEnd) {
      element.removeEventListener('touchend', handlers.onTouchEnd);
    }
    if (handlers.onTouchMove) {
      element.removeEventListener('touchmove', handlers.onTouchMove);
    }
  },

  /**
   * Make an element mobile-friendly
   */
  makeTouchFriendly: (element: HTMLElement) => {
    element.style.touchAction = 'manipulation';
    // Use setProperty for webkit-specific properties to avoid TypeScript errors
    element.style.setProperty('-webkit-tap-highlight-color', 'transparent');
    element.style.userSelect = 'none';
    element.style.setProperty('-webkit-user-select', 'none');
    
    // Ensure minimum touch target size
    const rect = element.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      element.style.minWidth = '44px';
      element.style.minHeight = '44px';
    }
  }
};

/**
 * Mobile-first responsive breakpoints
 */
export const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  isMobile: () => window.matchMedia(breakpoints.mobile).matches,
  isTablet: () => window.matchMedia(breakpoints.tablet).matches,
  isDesktop: () => window.matchMedia(breakpoints.desktop).matches,
};
