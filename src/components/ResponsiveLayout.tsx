
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
      <div className="mobile-layout mobile-layout-with-nav mobile-w-full mobile-min-h-screen">
        {/* Desktop Sidebar */}
        <div className="mobile-hidden desktop-block">
          <AppSidebar />
        </div>

        {/* Main area */}
        <main className="mobile-flex-1 mobile-flex mobile-flex-col">
          {/* Mobile Header */}
          {showHeader && (title || subtitle) && (
            <header className="mobile-header-compact desktop-hidden">
              <div className="mobile-stack-center">
                {title && <h1 className="mobile-h1 text-foreground">{title}</h1>}
                {subtitle && <p className="mobile-text-body text-muted-foreground">{subtitle}</p>}
              </div>
            </header>
          )}

          {/* Desktop Header */}
          {showHeader && (title || subtitle) && (
            <header className="mobile-hidden desktop-block mobile-card border-b border-border">
              <div className="mobile-flex mobile-flex-between p-8">
                <div>
                  {title && <h1 className="mobile-h1 text-foreground">{title}</h1>}
                  {subtitle && <p className="mobile-text-body text-muted-foreground">{subtitle}</p>}
                </div>
              </div>
            </header>
          )}

          {/* Content */}
          <div className="mobile-flex-1 mobile-content-spacing">
            <div className="mobile-container">
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
