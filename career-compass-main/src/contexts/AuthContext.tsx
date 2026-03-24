import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserType {
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: UserType | null;
  token: string | null;
  profile: { name: string; email: string };
  loginWithBackend: (data: { user: UserType; token: string; profile?: any }) => void;
  logout: () => void;
  // ✅ Added three new properties
  openAuthModal: (jobId: string) => void;
  pendingApplyJobId: string | null;
  clearPendingApply: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [profile, setProfile] = useState<{ name: string; email: string }>(() => {
    const saved = localStorage.getItem("profile");
    return saved ? JSON.parse(saved) : { name: "", email: "" };
  });

  // ✅ New state for pending apply
  const [pendingApplyJobId, setPendingApplyJobId] = useState<string | null>(null);

  // ✅ Opens auth modal and saves the job user was trying to apply for
  const openAuthModal = (jobId: string) => {
    setPendingApplyJobId(jobId);
    // Add your existing logic here to open the login/auth modal
    // e.g., setAuthModalOpen(true) if you have one
  };

  // ✅ Clears the pending job after apply modal opens
  const clearPendingApply = () => {
    setPendingApplyJobId(null);
  };

  const loginWithBackend = (data: { user: UserType; token: string; profile?: any }) => {
    setUser(data.user);
    setToken(data.token);
    setProfile(data.profile || { name: data.user.name, email: data.user.email });

    localStorage.setItem("userInfo", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    localStorage.setItem("profile", JSON.stringify(data.profile || { name: data.user.name, email: data.user.email }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setProfile({ name: "", email: "" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        profile,
        loginWithBackend,
        logout,
        // ✅ Pass new values to context
        openAuthModal,
        pendingApplyJobId,
        clearPendingApply,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};