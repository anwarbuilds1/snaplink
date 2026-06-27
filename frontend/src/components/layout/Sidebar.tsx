import { NavLink } from "react-router-dom";
import { LayoutDashboard, Link2, BarChart3, User, Settings, LogOut, Link } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";

type SidebarProps = {
  onClose?: () => void;
};

export const Sidebar = ({ onClose }: SidebarProps) => {
  const { logout } = useAuth();

  const navItems = [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "URLs", path: ROUTES.URLS, icon: Link2 },
    { label: "Analytics", path: ROUTES.ANALYTICS, icon: BarChart3 },
    { label: "Profile", path: ROUTES.PROFILE, icon: User },
    { label: "Settings", path: ROUTES.SETTINGS, icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full">
      {/* Brand logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 gap-2.5">
        <div className="bg-brand-600 text-white p-1.5 rounded-lg flex items-center justify-center">
          <Link size={18} />
        </div>
        <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg">
          Anwar Builds <span className="text-brand-600 font-extrabold"></span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${isActive
                ? "bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};
