import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Link2,
  BarChart3,
  User,
  Settings,
  LogOut,
  Link,
} from "lucide-react";
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
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-900 bg-white/90 dark:bg-slate-950/40 backdrop-blur-md flex flex-col h-full z-20">
      {/* Brand logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200/80 dark:border-slate-900 gap-2.5">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-1.5 rounded-lg flex items-center justify-center shadow-md shadow-violet-500/20">
          <Link size={18} />
        </div>
        <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg">
          SnapLink <span className="text-violet-500 font-extrabold">.</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-violet-500/10 to-indigo-500/10 dark:from-violet-950/30 dark:to-indigo-950/10 text-violet-600 dark:text-violet-400 shadow-2xs border-l-2 border-violet-600 dark:border-violet-500 pl-2.5"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-slate-200"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-900">
        <button
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};
