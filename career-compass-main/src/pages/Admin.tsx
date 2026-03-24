import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// This page lives at /pages/Admin.tsx
// It redirects admin users to the admin panel
// and non-admin users back to login

const Admin = () => {
  const { token, user } = useAuth();

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/admin" replace />;
};

export default Admin;
