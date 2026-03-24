import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, Info, Mail, LogOut, Home } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/admin",           icon: LayoutDashboard },
  { label: "Jobs",      path: "/admin/jobs",      icon: Briefcase       },
  { label: "Home Page", path: "/admin/homepage",  icon: Home            },
  { label: "About",     path: "/admin/about",     icon: Info            },
  { label: "Contact",   path: "/admin/contact",   icon: Mail            },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col bg-gray-900 text-white">
        <div className="border-b border-gray-700 px-6 py-5">
          <h2 className="text-lg font-bold tracking-wide text-white">Admin Panel</h2>
          <p className="text-xs text-gray-400 mt-0.5">CRM Job Shopee</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-700 px-3 py-4">
          <button
            onClick={logoutHandler}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
            {navItems.find((n) => n.path === location.pathname)?.label ?? "Admin"}
          </h1>
          <span className="text-sm text-gray-400">Admin User</span>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;