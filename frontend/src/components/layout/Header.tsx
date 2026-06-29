import { Sun, Moon, Monitor, Menu } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

type HeaderProps = {
  title: string;
  onOpenMobileSidebar?: () => void;
};

export const Header = ({ title, onOpenMobileSidebar }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-850/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-sm font-bold tracking-tight text-slate-950 dark:text-white uppercase">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme switcher */}
        <div className="flex items-center border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-0.5 bg-slate-50 dark:bg-slate-950/40 backdrop-blur-xs">
          <button
            onClick={() => setTheme("light")}
            title="Light mode"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === "light"
                ? "bg-white dark:bg-slate-800 text-violet-650 dark:text-violet-400 shadow-xs"
                : "text-slate-400 hover:text-slate-650 dark:hover:text-slate-300"
            }`}
          >
            <Sun size={14} />
          </button>
          <button
            onClick={() => setTheme("dark")}
            title="Dark mode"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === "dark"
                ? "bg-white dark:bg-slate-800 text-violet-650 dark:text-violet-400 shadow-xs"
                : "text-slate-400 hover:text-slate-650 dark:hover:text-slate-300"
            }`}
          >
            <Moon size={14} />
          </button>
          <button
            onClick={() => setTheme("system")}
            title="System mode"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === "system"
                ? "bg-white dark:bg-slate-800 text-violet-650 dark:text-violet-400 shadow-xs"
                : "text-slate-400 hover:text-slate-650 dark:hover:text-slate-300"
            }`}
          >
            <Monitor size={14} />
          </button>
        </div>

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800/80">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-xs select-none">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-450 leading-none mt-1.5 font-medium">{user.email}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
