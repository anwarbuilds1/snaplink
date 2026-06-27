import { Layout } from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth";
import { useDashboardStats } from "../../hooks/useAnalytics";
import { User, Mail, Calendar, Globe, MousePointerClick } from "lucide-react";
import { StatCard } from "../../components/analytics/StatCard";

function Profile() {
  const { user } = useAuth();
  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats();

  const totalUrls = statsData?.data?.totalUrls ?? 0;
  const totalClicks = statsData?.data?.totalClicks ?? 0;

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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-400 flex items-center justify-center text-2xl font-bold border-2 border-brand-200 dark:border-brand-900 select-none">
              {getInitials(user?.name)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Member</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
            <div className="flex items-center gap-3 text-slate-650 dark:text-slate-300">
              <User size={16} className="text-slate-400" />
              <span>{user?.name}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-650 dark:text-slate-300 font-medium">
              <Mail size={16} className="text-slate-400" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-650 dark:text-slate-300">
              <Calendar size={16} className="text-slate-400" />
              <span>Joined: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Activity summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Account Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard title="URLs Shortened" value={totalUrls} icon={Globe} isLoading={isStatsLoading} />
              <StatCard title="Total Link Clicks" value={totalClicks} icon={MousePointerClick} isLoading={isStatsLoading} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
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
