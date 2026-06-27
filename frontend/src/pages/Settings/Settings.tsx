import { Layout } from "../../components/layout/Layout";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";
import { toast } from "sonner";

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

      <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Application Theme</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select how TinyURL Pro looks in your browser</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-semibold gap-2 cursor-pointer transition-all ${
                  theme === "light"
                    ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400"
                    : "border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Sun size={18} />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-semibold gap-2 cursor-pointer transition-all ${
                  theme === "dark"
                    ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400"
                    : "border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Moon size={18} />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-semibold gap-2 cursor-pointer transition-all ${
                  theme === "system"
                    ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400"
                    : "border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Monitor size={18} />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">API Thresholds</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your API requests are rate limited to ensure service stability
            </p>
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 rounded-lg flex justify-between text-xs font-medium">
              <span className="text-slate-500">Rate Limit Limit</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">100 requests per 15 minutes</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Settings;
