import { Layout } from "../../components/layout/Layout";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/common/Button";

function Settings() {
  const { theme, setTheme } = useTheme();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings updated successfully!");
  };

  return (
    <Layout title="Settings">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Preferences & Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Customize your experience and manage configuration
        </p>
      </div>

      <div className="max-w-2xl bg-white/70 dark:bg-slate-900/65 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Application Theme</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select how SnapLink looks in your browser</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-bold gap-2 cursor-pointer transition-all ${
                  theme === "light"
                    ? "border-violet-500 bg-violet-50/50 dark:bg-violet-955/20 text-violet-650 dark:text-violet-400 shadow-2xs"
                    : "border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                <Sun size={18} />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-bold gap-2 cursor-pointer transition-all ${
                  theme === "dark"
                    ? "border-violet-500 bg-violet-50/50 dark:bg-violet-955/20 text-violet-650 dark:text-violet-400 shadow-2xs"
                    : "border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                <Moon size={18} />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-bold gap-2 cursor-pointer transition-all ${
                  theme === "system"
                    ? "border-violet-500 bg-violet-50/50 dark:bg-violet-955/20 text-violet-650 dark:text-violet-400 shadow-2xs"
                    : "border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                <Monitor size={18} />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="pt-6 border-t border-slate-150 dark:border-slate-850/60 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">API Thresholds</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Your API requests are rate limited to ensure service stability
            </p>
            <div className="bg-slate-50/50 dark:bg-slate-950/45 border border-slate-200 dark:border-slate-850/80 p-3.5 rounded-xl flex justify-between text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">Rate Limit Limit</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">100 requests per 15 minutes</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
            >
              Save Preferences
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Settings;
