/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { useMyUrls } from "../../hooks/useUrls";
import { useUrlAnalytics } from "../../hooks/useAnalytics";
import { StatCard } from "../../components/analytics/StatCard";
import { MousePointerClick, Monitor, HelpCircle } from "lucide-react";
import { getShortPath } from "../../utils/shortUrl";

// High-fidelity custom SVG Donut Chart Component
// Helper function to build segments without mutating render scope variables
const getSegments = (
  items: [string, number][],
  total: number,
  circumference: number,
  colors: string[]
) => {
  let accumulatedPercent = 0;
  return items.map(([name, count], index) => {
    const percent = total > 0 ? (count / total) * 100 : 0;
    const strokeDashoffset = circumference - (percent / 100) * circumference;
    const rotation = (accumulatedPercent / 100) * 360 - 90; // Start at top (-90 deg)
    accumulatedPercent += percent;

    return {
      name: name || "Unknown",
      count,
      percent,
      color: colors[index % colors.length],
      strokeDashoffset,
      rotation,
    };
  });
};

const DonutChart = ({ data }: { data: Record<string, number> }) => {
  const items = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = items.reduce((acc, [, val]) => acc + val, 0);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (total === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-450 dark:text-slate-500 font-semibold">
        No statistics recorded yet.
      </div>
    );
  }

  // Curated premium color palette
  const colors = [
    "#7c3aed", // Violet-600
    "#3b82f6", // Blue-500
    "#ec4899", // Pink-500
    "#10b981", // Emerald-500
    "#f59e0b", // Amber-500
    "#64748b", // Slate-500
  ];

  const r = 38;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * r; // ~238.76

  const segments = getSegments(items, total, circumference, colors);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2 select-none">
      {/* SVG Donut Circle */}
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Base Background Track */}
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            className="stroke-slate-100/70 dark:stroke-slate-950/40"
            strokeWidth={strokeWidth}
          />
          {/* Donut Segments */}
          {segments.map((seg, i) => (
            <circle
              key={seg.name}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={hoveredIndex === i ? strokeWidth + 2 : strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={seg.strokeDashoffset}
              transform={`rotate(${seg.rotation} 50 50)`}
              strokeLinecap="round"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          {hoveredIndex !== null ? (
            <>
              <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider truncate max-w-[60px]">
                {segments[hoveredIndex].name}
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                {Math.round(segments[hoveredIndex].percent)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider">
                Total
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                {total}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend Block */}
      <div className="flex-1 space-y-2 w-full">
        {segments.map((seg, i) => (
          <div
            key={seg.name}
            className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl border border-transparent transition-all ${
              hoveredIndex === i
                ? "bg-slate-100/50 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-850/50"
                : ""
            }`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 min-w-0">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="truncate max-w-[100px]">{seg.name}</span>
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white shrink-0 pl-2">
              {seg.count} ({Math.round(seg.percent)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlParamId = searchParams.get("id");

  const { data: urlsResponse, isLoading: isUrlsLoading } = useMyUrls(1, 100);
  const [selectedUrlId, setSelectedUrlId] = useState<string>("");

  const urls = useMemo(() => urlsResponse?.data ?? [], [urlsResponse]);

  useEffect(() => {
    if (urlParamId) {
      setSelectedUrlId(urlParamId);
    } else if (urls.length > 0 && !selectedUrlId) {
      setSelectedUrlId(urls[0]._id);
    }
  }, [urlParamId, urls, selectedUrlId]);

  const { data: analyticsRes, isLoading: isAnalyticsLoading } = useUrlAnalytics(selectedUrlId, !!selectedUrlId);

  const handleUrlChange = (id: string) => {
    setSelectedUrlId(id);
    setSearchParams(id ? { id } : {});
  };

  const selectedUrl = urls.find((u) => u._id === selectedUrlId);
  const analytics = analyticsRes?.data;
  const totalClicks = analytics?.totalClicks ?? 0;

  return (
    <Layout title="Analytics">
      {/* Header selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Link Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Inspect browser and OS statistics per shortened link
          </p>
        </div>

        {/* URL selector */}
        {isUrlsLoading ? (
          <div className="h-10 w-48 bg-slate-100/50 dark:bg-slate-800/40 animate-pulse rounded-xl" />
        ) : urls.length === 0 ? (
          <div className="text-xs text-slate-500 font-bold">No links to select.</div>
        ) : (
          <select
            value={selectedUrlId}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850/85 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 dark:text-slate-200 font-bold max-w-xs cursor-pointer transition-all"
          >
            {urls.map((u) => (
              <option key={u._id} value={u._id}>
                {`${getShortPath(u.shortCode)} (${u.originalUrl.substring(0, 20)}...)`}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedUrlId ? (
        <div className="space-y-6">
          {/* Selected URL overview */}
          {selectedUrl && (
            <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row gap-4 justify-between md:items-center shadow-md border border-slate-200/80 dark:border-slate-800/80 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400">Target Destination</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-2xl">
                  {selectedUrl.originalUrl}
                </p>
              </div>
              <div className="text-xs text-slate-450 dark:text-slate-500 flex gap-4 shrink-0 font-medium">
                <div>
                  Created: <span className="font-bold text-slate-700 dark:text-slate-350">{new Date(selectedUrl.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  Status:{" "}
                  <span className={`font-bold ${selectedUrl.isActive ? "text-green-600" : "text-rose-505"}`}>
                    {selectedUrl.isActive ? "Active" : "Expired"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stats count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Clicks Inspected" value={totalClicks} icon={MousePointerClick} isLoading={isAnalyticsLoading} />
            <StatCard
              title="Active User Devices"
              value={
                Object.keys(analytics?.topOperatingSystems ?? {}).length +
                Object.keys(analytics?.topBrowsers ?? {}).length
              }
              icon={Monitor}
              isLoading={isAnalyticsLoading}
            />
          </div>

          {/* Breakdown cards containing the custom Donut Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Browsers Chart Card */}
            <div className="glass-card p-6 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800/80 space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Top Browsers</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 font-medium">Percentage breakdown of client browsers</p>
              </div>
              {isAnalyticsLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-650" />
                  <p className="text-xs text-slate-450 font-semibold">Loading browsers chart...</p>
                </div>
              ) : (
                <DonutChart data={analytics?.topBrowsers ?? {}} />
              )}
            </div>

            {/* Operating Systems Chart Card */}
            <div className="glass-card p-6 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800/80 space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Top Operating Systems</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 font-medium">
                  Percentage breakdown of client operating systems
                </p>
              </div>
              {isAnalyticsLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-650" />
                  <p className="text-xs text-slate-450 font-semibold">Loading OS chart...</p>
                </div>
              ) : (
                <DonutChart data={analytics?.topOperatingSystems ?? {}} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/30 dark:bg-slate-950/20">
          <HelpCircle size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-sm font-semibold">No URL selected</p>
          <p className="text-xs text-slate-450 mt-1 font-medium">Create a shortened URL first to monitor analytics.</p>
        </div>
      )}
    </Layout>
  );
}

export default Analytics;
