
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
 * Mobile-first layout with consistent spacing and navigation
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Main area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          {showHeader && (title || subtitle) && (
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 md:hidden">
              <div className="flex items-center justify-center p-4">
                <div className="text-center">
                  {title && <h1 className="text-lg font-semibold text-white">{title}</h1>}
                  {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
                </div>
              </div>
            </header>
          )}

          {/* Desktop Header */}
          {showHeader && (title || subtitle) && (
            <header className="hidden md:block bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
              <div className="flex items-center justify-between p-6">
                <div>
                  {title && <h1 className="text-2xl font-semibold text-white">{title}</h1>}
                  {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
                </div>
              </div>
            </header>
          )}

          {/* Content with consistent mobile spacing */}
          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </div>
        </main>

        {/* Bottom navigation (mobile only) */}
        {!hideBottomNav && <BottomNavigation />}
      </div>
    </SidebarProvider>
  );
};
