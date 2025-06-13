
import React from 'react';

interface AppContainerProps {
  children: React.ReactNode;
  width?: 'normal' | 'centered' | 'wide';
}

export const AppContainer: React.FC<AppContainerProps> = ({ 
  children, 
  width = 'normal' 
}) => {
  const getContentClass = () => {
    switch (width) {
      case 'centered':
        return 'app-content-centered';
      case 'wide':
        return 'app-content-wide';
      default:
        return 'app-content';
    }
  };

  return (
    <div className="app-container">
      <div className={getContentClass()}>
        {children}
      </div>
    </div>
  );
};
