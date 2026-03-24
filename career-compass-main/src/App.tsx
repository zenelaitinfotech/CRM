import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ChatBot from "@/components/ChatBot";

// Public Pages
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";

// Admin Pages
import AdminLayout    from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminJobs      from "./admin/AdminJobs";
import AdminAbout     from "./admin/AdminAbout";
import AdminContact   from "./admin/AdminContact";
import AdminHomePage from "./admin/AdminHomePage";

const queryClient = new QueryClient();

// ── Admin Protected Route ─────────────────────────────────────────────────────
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { token, user } = useAuth();
  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ── Protected Route for Users ─────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ── Main App Content ──────────────────────────────────────────────────────────
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Hide Navbar on admin pages */}
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* ── Public Routes ── */}
        <Route path="/"        element={<Index />} />
        <Route path="/jobs"    element={<Jobs />} />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/signup"  element={<Signup />} />

        {/* ── Protected User Route ── */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ── Admin Routes ── */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index          element={<AdminDashboard />} />
          <Route path="jobs"    element={<AdminJobs />} />
           <Route path="homepage" element={<AdminHomePage />} /> 
          <Route path="about"   element={<AdminAbout />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ── Not Found ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer & widgets only on non-admin pages */}
      {!isAdminPage && <Footer />}
      {!isAdminPage && <AuthModal />}
      {!isAdminPage && <ChatBot />}
    </>
  );
};

// ── Root App ──────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
