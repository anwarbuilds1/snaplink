import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "../../components/layout/Layout";
import { StatCard } from "../../components/analytics/StatCard";
import { useDashboardStats } from "../../hooks/useAnalytics";
import { useMyUrls, useCreateUrl } from "../../hooks/useUrls";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { ROUTES } from "../../constants/routes";
import { toast } from "sonner";
import {
  Globe,
  MousePointerClick,
  CheckCircle2,
  Clock,
  QrCode,
  Plus,
  ArrowRight,
  ExternalLink,
  Copy,
  TrendingUp,
} from "lucide-react";

const quickUrlSchema = z.object({
  originalUrl: z.string().min(1, "URL is required").url("Please enter a valid URL"),
  customAlias: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || (val.length >= 3 && val.length <= 30), {
      message: "Alias must be between 3 and 30 characters",
    })
    .refine((val) => !val || /^[a-zA-Z0-9_-]+$/.test(val), {
      message: "Alias must contain only alphanumeric characters, dashes, or underscores",
    }),
  expiresAt: z.string().optional(),
});

type QuickUrlValues = z.infer<typeof quickUrlSchema>;

function Dashboard() {
  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats();
  const { data: urlsData, isLoading: isUrlsLoading } = useMyUrls(1, 100);
  const createMutation = useCreateUrl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickUrlValues>({
    resolver: zodResolver(quickUrlSchema),
    defaultValues: {
      originalUrl: "",
      customAlias: "",
      expiresAt: "",
    },
  });

  const onSubmit = async (data: QuickUrlValues) => {
    try {
      const payload = {
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
      };
      await createMutation.mutateAsync(payload);
      toast.success("Short URL created successfully!");
      setIsModalOpen(false);
      reset();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errMsg = error.response?.data?.message ?? "Failed to shorten URL.";
      toast.error(errMsg);
    }
  };

  const handleCopy = async (shortCode: string) => {
    const base = import.meta.env.VITE_SHORT_BASE_URL ?? "http://localhost:5000";
    const fullShortUrl = `${base}/${shortCode}`;
    const success = await copyToClipboard(fullShortUrl);
    if (success) {
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy link.");
    }
  };

  // Calculations
  const urls = urlsData?.data ?? [];
  const totalUrls = statsData?.data?.totalUrls ?? 0;
  const totalClicks = statsData?.data?.totalClicks ?? 0;
  const topUrl = statsData?.data?.topUrl;

  const now = new Date();
  const activeUrlsCount = urls.filter((u) => u.isActive && (!u.expiresAt || new Date(u.expiresAt) > now)).length;

  const expiredUrlsCount = urls.filter((u) => !u.isActive || (u.expiresAt && new Date(u.expiresAt) <= now)).length;

  const qrGeneratedCount = activeUrlsCount;

  const recentUrls = urls.slice(0, 5);
  const isLoading = isStatsLoading || isUrlsLoading;

  return (
    <Layout title="Dashboard">
      {/* Header quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Real-time highlights of your shortened URLs
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            id="quick-shorten-btn"
            variant="primary"
            className="flex items-center gap-1.5"
          >
            <Plus size={16} />
            Quick Shorten
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total URLs" value={totalUrls} icon={Globe} isLoading={isLoading} />
        <StatCard title="Total Clicks" value={totalClicks} icon={MousePointerClick} isLoading={isLoading} />
        <StatCard title="Active URLs" value={activeUrlsCount} icon={CheckCircle2} isLoading={isLoading} />
        <StatCard title="Expired URLs" value={expiredUrlsCount} icon={Clock} isLoading={isLoading} />
        <StatCard title="QR Generated" value={qrGeneratedCount} icon={QrCode} isLoading={isLoading} />
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent URLs Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Recent URLs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your latest shortened links</p>
            </div>
            <Link
              to={ROUTES.URLS}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
            >
              Manage all URLs
              <ArrowRight size={12} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentUrls.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No URLs created yet. Click "Quick Shorten" to get started.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentUrls.map((url) => {
                const base = import.meta.env.VITE_SHORT_BASE_URL ?? "http://localhost:5000";
                const shortUrl = `${base}/${url.shortCode}`;
                return (
                  <div key={url._id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                          /{url.shortCode}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-105 dark:bg-slate-800 text-slate-500 font-medium">
                          {url.clickCount} clicks
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-md">
                        {url.originalUrl}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => void handleCopy(url.shortCode)}
                        title="Copy Short URL"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        <Copy size={14} />
                      </button>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Open Short Link"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top URL & Quick Stats Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Top Performing URL</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Most clicked link in your account
              </p>
            </div>

            {isLoading ? (
              <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
            ) : topUrl ? (
              <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-brand-700 dark:text-brand-400 uppercase tracking-wide">
                    Short Code
                  </span>
                  <p className="text-lg font-bold text-slate-950 dark:text-white">/{topUrl.shortCode}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">Clicks</span>
                  <div className="flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 text-lg">
                    <TrendingUp size={16} />
                    {topUrl.clicks}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No click data recorded yet.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Tip: Share your short URLs on social media or emails to track traffic stats.
          </div>
        </div>
      </div>

      {/* Quick Shorten Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Quick URL Shortener">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            id="quick-url-original"
            label="Original URL"
            type="url"
            placeholder="https://example.com/very-long-link-path"
            error={errors.originalUrl?.message}
            disabled={createMutation.isPending}
            {...register("originalUrl")}
          />

          <Input
            id="quick-url-alias"
            label="Custom Alias (Optional)"
            type="text"
            placeholder="my-cool-link"
            error={errors.customAlias?.message}
            disabled={createMutation.isPending}
            {...register("customAlias")}
          />

          <Input
            id="quick-url-expiry"
            label="Expiration Date (Optional)"
            type="datetime-local"
            error={errors.expiresAt?.message}
            disabled={createMutation.isPending}
            {...register("expiresAt")}
          />

          <Button
            type="submit"
            id="quick-url-submit"
            className="w-full"
            isLoading={createMutation.isPending}
            disabled={createMutation.isPending}
          >
            Create Short URL
          </Button>
        </form>
      </Modal>
    </Layout>
  );
}

export default Dashboard;
