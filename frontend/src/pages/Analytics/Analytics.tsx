/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { useMyUrls } from "../../hooks/useUrls";
import { useUrlAnalytics } from "../../hooks/useAnalytics";
import { StatCard } from "../../components/analytics/StatCard";
import { MousePointerClick, Globe, Monitor, HelpCircle } from "lucide-react";
import { SkeletonLoader } from "../../components/common/SkeletonLoader";

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

  const renderPercentageList = (data: Record<string, number> = {}, icon: React.ReactNode) => {
    const items = Object.entries(data).sort((a, b) => b[1] - a[1]);

    if (items.length === 0) {
      return <div className="py-8 text-center text-sm text-slate-400">No browser or OS data recorded yet.</div>;
    }

    return (
      <div className="space-y-4">
        {items.map(([name, clicks]) => {
          const percent = totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0;
          return (
            <div key={name} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  {icon}
                  {name || "Unknown"}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {clicks} clicks ({percent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout title="Detailed Analytics">
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
          <div className="h-10 w-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
        ) : urls.length === 0 ? (
          <div className="text-sm text-slate-500">No links to select.</div>
        ) : (
          <select
            value={selectedUrlId}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700 dark:text-slate-200 font-medium max-w-xs cursor-pointer"
          >
            {urls.map((u) => (
              <option key={u._id} value={u._id}>
                /{u.shortCode} ({u.originalUrl.substring(0, 30)}...)
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedUrlId ? (
        <div className="space-y-6">
          {/* Selected URL overview */}
          {selectedUrl && (
            <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row gap-4 justify-between md:items-center shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-brand-600">Target Destination</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-2xl">
                  {selectedUrl.originalUrl}
                </p>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 flex gap-4">
                <div>
                  Created: <span className="font-bold">{new Date(selectedUrl.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  Status:{" "}
                  <span className={`font-bold ${selectedUrl.isActive ? "text-green-600" : "text-red-500"}`}>
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

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Browsers Card */}
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Top Browsers</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Percentage breakdown of client browsers</p>
              </div>
              {isAnalyticsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((n) => (
                    <SkeletonLoader key={n} variant="text" />
                  ))}
                </div>
              ) : (
                renderPercentageList(analytics?.topBrowsers, <Globe size={13} />)
              )}
            </div>

            {/* Operating Systems Card */}
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Top Operating Systems</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Percentage breakdown of client operating systems
                </p>
              </div>
              {isAnalyticsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((n) => (
                    <SkeletonLoader key={n} variant="text" />
                  ))}
                </div>
              ) : (
                renderPercentageList(analytics?.topOperatingSystems, <Monitor size={13} />)
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
          <HelpCircle size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-sm font-semibold">No URL selected</p>
          <p className="text-xs text-slate-450 mt-1 font-medium">Create a shortened URL first to monitor analytics.</p>
        </div>
      )}
    </Layout>
  );
}

export default Analytics;
