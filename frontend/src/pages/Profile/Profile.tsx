import { Layout } from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth";
import { useDashboardStats } from "../../hooks/useAnalytics";
import { User, Mail, Calendar, Globe, MousePointerClick } from "lucide-react";
import { StatCard } from "../../components/analytics/StatCard";

type RegisterStats = {
  totalUrls: number;
  totalClicks: number;
};

function Profile() {
  const { user } = useAuth();
  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats();

  const totalUrls = (statsData?.data as RegisterStats)?.totalUrls ?? 0;
  const totalClicks = (statsData?.data as RegisterStats)?.totalClicks ?? 0;

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
    <Layout title="Profile">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          View your account information and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="glass-card border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-6 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-violet-500/20 border-0 select-none">
              {getInitials(user?.name)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Member</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-150 dark:border-slate-850/60 text-xs font-semibold">
            <div className="flex items-center gap-3 text-slate-650 dark:text-slate-350">
              <User size={16} className="text-slate-400 shrink-0" />
              <span>{user?.name}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-650 dark:text-slate-350">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-650 dark:text-slate-350">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <span>Joined: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Activity summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Account Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard title="URLs Shortened" value={totalUrls} icon={Globe} isLoading={isStatsLoading} />
              <StatCard title="Total Link Clicks" value={totalClicks} icon={MousePointerClick} isLoading={isStatsLoading} />
            </div>
          </div>

          <div className="glass-card border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Developer Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              This application interacts with the backend using OAuth-based Bearer credentials. To modify API keys or
              view webhook parameters, visit the Settings page.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
