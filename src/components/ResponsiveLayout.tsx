import React from "react";
import { BottomNavigation } from "@/components/BottomNavigation";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  hideBottomNav?: boolean;
}

/**
 * Mindsera-style unified layout with bottom navigation on all screen sizes
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title,
  subtitle,
  showHeader = true,
  hideBottomNav = false,
}) => {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Main content area */}
      <main className="flex flex-col min-h-screen pb-20">
        {/* Header */}
        {showHeader && (title || subtitle) && (
          <header className="px-4 pt-6 pb-4 sm:px-6 sm:pt-8">
            <div className="max-w-2xl mx-auto">
              {title && (
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </header>
        )}

        {/* Content */}
        <div className="flex-1 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom navigation - visible on all screen sizes */}
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
};
