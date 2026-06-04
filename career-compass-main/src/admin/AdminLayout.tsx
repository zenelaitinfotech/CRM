import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, Info, Mail, LogOut, Home, FileSpreadsheet, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

const navItems = [
  { label: "Dashboard",    path: "/admin",              icon: LayoutDashboard },
  { label: "Applied Jobs", path: "/admin/applications", icon: FileSpreadsheet },
  { label: "Jobs",         path: "/admin/jobs",         icon: Briefcase       },
  { label: "Home Page",    path: "/admin/homepage",     icon: Home            },
  { label: "About",        path: "/admin/about",        icon: Info            },
  { label: "Contact",      path: "/admin/contact",      icon: Mail            },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden" 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "md:w-16" : "md:w-60"} w-60`}
      >
        <div className="flex items-center justify-between border-b border-gray-700 px-4 py-5 h-16 shrink-0">
          <div className={`overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-full opacity-100"}`}>
            <h2 className="text-sm font-bold tracking-wide text-white whitespace-nowrap">Admin Panel</h2>
            <p className="text-[10px] text-gray-400">CRM Job Shopee</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Desktop Collapse Toggle Icon */}
            <button 
              onClick={() => setCollapsed(!collapsed)} 
              className="hidden md:flex text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition"
              title={collapsed ? "Expand Menu" : "Collapse Menu"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Close Sidebar Button for Mobile */}
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="text-gray-400 hover:text-white md:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setSidebarOpen(false); // Close on selection on mobile
                }}
                className={`flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-all w-full ${
                  collapsed ? "md:justify-center px-0" : "px-4"
                } ${
                  active
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon size={17} className="shrink-0" />
                <span className={`transition-all duration-300 ${collapsed ? "md:w-0 md:opacity-0 md:hidden" : "w-auto opacity-100"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-700 p-2">
          <button
            onClick={logoutHandler}
            className={`flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all w-full ${
              collapsed ? "md:justify-center px-0" : "px-4"
            }`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={17} className="shrink-0" />
            <span className={`transition-all duration-300 ${collapsed ? "md:w-0 md:opacity-0 md:hidden" : "w-auto opacity-100"}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="border-b border-gray-200 bg-white px-4 py-4 md:px-8 flex items-center justify-between shadow-sm h-16 shrink-0">
          <div className="flex items-center gap-3">
            {/* Burger Menu Button (Mobile opens drawer, Desktop toggles collapse) */}
            <button 
              onClick={() => {
                if (window.innerWidth >= 768) {
                  setCollapsed(!collapsed);
                } else {
                  setSidebarOpen(true);
                }
              }} 
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              {navItems.find((n) => n.path === location.pathname)?.label ?? "Admin"}
            </h1>
          </div>
          <span className="text-sm text-gray-400 font-medium">Admin User</span>
        </header>

        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;