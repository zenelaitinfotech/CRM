import { useNavigate } from "react-router-dom";
import { Briefcase, Info, Mail, User, ArrowRight, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const cards = [
  {
    label:  "Manage Jobs",
    desc:   "Create, edit and delete job listings",
    icon:   Briefcase,
    path:   "/admin/jobs",
    color:  "bg-blue-50 text-blue-600",
    border: "hover:border-blue-400",
  },
  {
    label:  "Home Page",
    desc:   "Select and manage featured jobs on homepage",
    icon:   Home,
    path:   "/admin/homepage",
    color:  "bg-yellow-50 text-yellow-600",
    border: "hover:border-yellow-400",
  },
  {
    label:  "Edit About",
    desc:   "Update company info, mission & vision cards",
    icon:   Info,
    path:   "/admin/about",
    color:  "bg-green-50 text-green-600",
    border: "hover:border-green-400",
  },
  {
    label:  "Contact",
    desc:   "View and manage contact form submissions",
    icon:   Mail,
    path:   "/admin/contact",
    color:  "bg-orange-50 text-orange-600",
    border: "hover:border-orange-400",
  },
  {
    label:  "Profile",
    desc:   "View and update your admin profile",
    icon:   User,
    path:   "/profile",
    color:  "bg-purple-50 text-purple-600",
    border: "hover:border-purple-400",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name ?? "Admin"} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your job portal from here. Select a section below to get started.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, desc, icon: Icon, path, color, border }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`group flex flex-col items-start gap-4 rounded-xl border-2 border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:shadow-md ${border}`}
          >
            <div className={`rounded-lg p-3 ${color}`}>
              <Icon size={22} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
            </div>
            <ArrowRight
              size={16}
              className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-500"
            />
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-sm text-green-800">
        💡 <strong>Tip:</strong> Use the sidebar on the left to quickly switch between sections at any time.
      </div>
    </div>
  );
};

export default AdminDashboard;