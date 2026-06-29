import type { LucideIcon } from "lucide-react";
import { SkeletonLoader } from "../common/SkeletonLoader";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  isLoading?: boolean;
};

export const StatCard = ({ title, value, icon: Icon, description, isLoading }: StatCardProps) => {
  if (isLoading) {
    return <SkeletonLoader variant="rectangular" className="h-[102px] rounded-2xl" />;
  }

  return (
    <div className="glass-card p-5 rounded-2xl flex items-center justify-between transition-all duration-300 hover:border-violet-500/20 hover:shadow-lg dark:hover:shadow-violet-950/10 glow-card-hover">
      <div className="space-y-1.5 min-w-0">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider block truncate">
          {title}
        </span>
        <h3 className="text-2xl font-black text-slate-950 dark:text-white truncate">{value}</h3>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{description}</p>}
      </div>
      <div className="h-11 w-11 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-100 dark:border-violet-900/50 shrink-0 shadow-2xs">
        <Icon size={18} />
      </div>
    </div>
  );
};
