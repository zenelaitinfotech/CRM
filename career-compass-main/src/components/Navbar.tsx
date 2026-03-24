import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="CRM Job Shopee" className="h-10 w-10 rounded object-cover" />
          <span className="text-xl font-bold text-primary">CRM Job Shopee</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">About</Link>
          <Link to="/jobs" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Jobs</Link>
          <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Contact</Link>
          {user && (
            <Link to="/profile" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Profile</Link>
          )}

          {/* Admin link — only visible to admin users */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" /> {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>
                <LogOut className="mr-1 h-4 w-4" /> Sign Out
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")}>Sign In</Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <Link to="/"        onClick={() => setMobileOpen(false)} className="text-sm font-medium">Home</Link>
            <Link to="/about"   onClick={() => setMobileOpen(false)} className="text-sm font-medium">About</Link>
            <Link to="/jobs"    onClick={() => setMobileOpen(false)} className="text-sm font-medium">Jobs</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Contact</Link>
            {user && (
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Profile</Link>
            )}

            {/* Admin link mobile */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-red-500"
              >
                Admin
              </Link>
            )}

            {user ? (
              <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}>
                <LogOut className="mr-1 h-4 w-4" /> Sign Out
              </Button>
            ) : (
              <Button size="sm" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
