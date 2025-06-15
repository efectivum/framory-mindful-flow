
import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNavigation } from "@/components/BottomNavigation";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

/**
 * Mobile-first layout: 
 * - Sidebar hidden by default, visible via CSS only on md+.
 * - BottomNavigation visible by default, hidden on md+.
 * - Page header shown if provided.
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title,
  subtitle,
  showHeader = true,
}) => {
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar (desktop only, by CSS) */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      {/* Main area */}
      <main className="flex-1 flex flex-col">
        {showHeader && (title || subtitle) && (
          <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
            <div className="flex items-center justify-between p-4">
              <div>
                {title && <h1 className="text-xl font-semibold text-white">{title}</h1>}
                {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
              </div>
            </div>
          </header>
        )}
        <div className="flex-1 p-4 lg:p-6 pb-20 md:pb-6">{children}</div>
      </main>
      {/* Bottom navigation (mobile by default) */}
      <BottomNavigation />
    </div>
  );
};
