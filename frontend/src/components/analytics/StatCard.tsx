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
    return <SkeletonLoader variant="rectangular" className="h-28" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <h3 className="text-2xl font-bold text-slate-950 dark:text-white">{value}</h3>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <div className="h-12 w-12 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-100/50 dark:border-brand-900/50">
        <Icon size={20} />
      </div>
    </div>
  );
};
