
import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  hideBottomNav?: boolean;
}

/**
 * Enhanced mobile-first layout with organic styling and consistent spacing
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title,
  subtitle,
  showHeader = true,
  hideBottomNav = false,
}) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-x-hidden font-inter" style={{ background: 'var(--app-bg-primary)' }}>
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Main area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Enhanced Mobile Header */}
          {showHeader && (title || subtitle) && (
            <header className="app-card-organic border-b border-gray-700/30 md:hidden animate-fade-in">
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  {title && <h1 className="text-hero">{title}</h1>}
                  {subtitle && <p className="text-subhero mt-2">{subtitle}</p>}
                </div>
              </div>
            </header>
          )}

          {/* Enhanced Desktop Header */}
          {showHeader && (title || subtitle) && (
            <header className="hidden md:block app-card-organic border-b border-gray-700/30 animate-fade-in">
              <div className="flex items-center justify-between p-8">
                <div>
                  {title && <h1 className="text-3xl font-semibold text-white gradient-text">{title}</h1>}
                  {subtitle && <p className="text-gray-400 text-lg mt-2 text-premium">{subtitle}</p>}
                </div>
              </div>
            </header>
          )}

          {/* Enhanced Content with organic mobile spacing */}
          <div className="flex-1 app-mobile-page md:p-8 pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        </main>

        {/* Enhanced Bottom navigation (mobile only) */}
        {!hideBottomNav && <BottomNavigation />}
      </div>
    </SidebarProvider>
  );
};
