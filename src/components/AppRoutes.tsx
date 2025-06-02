
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "../pages/Index";
import Auth from "../pages/Auth";
import CompleteSignup from "../pages/CompleteSignup";
import Goals from "../pages/Goals";
import Journal from "../pages/Journal";
import Insights from "../pages/Insights";
import Resources from "../pages/Resources";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Chat from "../pages/Chat";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/complete-signup" element={<CompleteSignup />} />
      <Route path="/goals" element={
        <ProtectedRoute>
          <Goals />
        </ProtectedRoute>
      } />
      <Route path="/journal" element={
        <ProtectedRoute>
          <Journal />
        </ProtectedRoute>
      } />
      <Route path="/insights" element={
        <ProtectedRoute>
          <Insights />
        </ProtectedRoute>
      } />
      <Route path="/resources" element={<Resources />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
