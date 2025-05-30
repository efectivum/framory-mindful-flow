
import { useState, useEffect } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "../pages/Index";
import Auth from "../pages/Auth";
import CompleteSignup from "../pages/CompleteSignup";
import Goals from "../pages/Goals";
import Journal from "../pages/Journal";
import Insights from "../pages/Insights";
import Resources from "../pages/Resources";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import { MobileLayout } from "@/components/MobileLayout";
import Chat from "../pages/Chat";

export const AppRoutes = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const location = useLocation();

  // Update current page based on route
  useEffect(() => {
    const path = location.pathname.slice(1) || 'dashboard';
    if (path === '') setCurrentPage('dashboard');
    else if (path === 'goals') setCurrentPage('goals');
    else if (path === 'journal') setCurrentPage('journal');
    else if (path === 'insights') setCurrentPage('insights');
    else if (path === 'chat') setCurrentPage('chat');
    else if (path === 'profile') setCurrentPage('profile');
  }, [location]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // Navigate programmatically
    window.history.pushState({}, '', `/${page === 'dashboard' ? '' : page}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Layout */}
        <div className="hidden md:flex w-full">
          <AppSidebar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/complete-signup" element={<CompleteSignup />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden w-full">
          <MobileLayout
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/complete-signup" element={<CompleteSignup />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MobileLayout>
        </div>
      </div>
    </SidebarProvider>
  );
};
