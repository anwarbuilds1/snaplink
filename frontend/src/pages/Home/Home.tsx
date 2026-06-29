import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Link2,
  ArrowRight,
  Activity,
  ShieldCheck,
  QrCode,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  Lock,
} from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useCreateUrl } from "../../hooks/useUrls";
import { buildShortUrl } from "../../utils/shortUrl";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { toast } from "sonner";
import { QrCodeModalContent } from "../../components/urls/QrCodeModalContent";

const landingSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "Please enter a URL to shorten")
    .url("Please enter a valid URL (include http:// or https://)"),
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

type LandingFormValues = z.infer<typeof landingSchema>;

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const createMutation = useCreateUrl();
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shortenedResult, setShortenedResult] = useState<{
    originalUrl: string;
    shortCode: string;
    _id: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LandingFormValues>({
    resolver: zodResolver(landingSchema),
    defaultValues: {
      originalUrl: "",
      customAlias: "",
      expiresAt: "",
    },
  });

  const onSubmit = async (data: LandingFormValues) => {
    if (!isAuthenticated) {
      // Show auth warning modal and pre-fill URL on register redirect
      setShowAuthModal(true);
      return;
    }

    try {
      const payload = {
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || undefined,
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt).toISOString()
          : undefined,
      };
      const result = await createMutation.mutateAsync(payload);
      if (result && result.data) {
        setShortenedResult({
          originalUrl: result.data.originalUrl,
          shortCode: result.data.shortCode,
          _id: result.data._id,
        });
        toast.success("Link shortened successfully!");
        reset();
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errMsg = error.response?.data?.message ?? "Failed to shorten URL.";
      toast.error(errMsg);
    }
  };

  const handleCopy = async () => {
    if (!shortenedResult) return;
    const shortUrl = buildShortUrl(shortenedResult.shortCode);
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 theme-transition bg-ambient-glow">
      {/* Header */}
      <header className="h-16 border-b border-slate-200/80 dark:border-slate-900 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-1.5 rounded-lg flex items-center justify-center shadow-md shadow-violet-500/20">
            <Link2 size={18} />
          </div>
          <span className="font-bold tracking-tight text-lg">
            SnapLink <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 font-extrabold">.</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to={ROUTES.DASHBOARD}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium shadow-md shadow-violet-500/10 hover:shadow-violet-500/25 transition-all cursor-pointer"
            >
              Go to Dashboard
              <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 text-sm font-medium shadow-sm transition-all cursor-pointer"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center justify-center gap-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 text-xs font-semibold border border-violet-100 dark:border-violet-900/50 select-none animate-fade-in">
          <Sparkles size={12} />
          Portfolio Grade URL Shortening Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none max-w-3xl text-center">
          Shorten your links. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500">
            Analyze your reach.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl text-center leading-relaxed">
          Create custom, lightning-fast short codes backed by Redis caching.
          Track click performance with real-time browser and operating system analytics.
        </p>

        {/* Shortener Box */}
        <div className="w-full max-w-2xl mt-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="glass-card p-6 rounded-2xl shadow-xl space-y-4 border border-slate-200/80 dark:border-slate-800/80"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Paste your long link here..."
                  error-state={errors.originalUrl ? "true" : "false"}
                  className={`w-full px-4 py-3 text-sm bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500 placeholder-slate-450 dark:placeholder-slate-500 transition-all ${
                    errors.originalUrl
                      ? "border-red-500 focus:ring-red-500 text-red-900 dark:text-red-400"
                      : "border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                  }`}
                  {...register("originalUrl")}
                />
                {errors.originalUrl && (
                  <span className="text-xs text-red-500 mt-1 block pl-1">
                    {errors.originalUrl.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-md shadow-violet-600/10 hover:shadow-violet-600/25 transition-all text-sm h-[46px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Shorten
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Advanced toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer"
              >
                {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Advanced Options
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-150 dark:border-slate-850/60 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Custom Alias (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. my-custom-link"
                      className="px-3.5 py-2 text-xs bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-500 text-slate-900 dark:text-slate-100 placeholder-slate-450 dark:placeholder-slate-500 transition-all"
                      {...register("customAlias")}
                    />
                    {errors.customAlias && (
                      <span className="text-xs text-red-500 pl-1">{errors.customAlias.message}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      className="px-3.5 py-2 text-xs bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-500 text-slate-900 dark:text-slate-100 placeholder-slate-450 dark:placeholder-slate-500 transition-all"
                      {...register("expiresAt")}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Success Box */}
          {shortenedResult && (
            <div className="mt-6 glass-card p-5 rounded-2xl shadow-lg border border-violet-500/20 dark:border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 relative overflow-hidden animate-in zoom-in-95 duration-300">
              <button
                onClick={() => setShortenedResult(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Your short link is ready!</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-850">
                  <span className="font-mono font-bold text-slate-900 dark:text-white px-2.5 py-1.5 truncate text-sm select-all">
                    {buildShortUrl(shortenedResult.shortCode)}
                  </span>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleCopy}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <a
                      href={buildShortUrl(shortenedResult.shortCode)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors cursor-pointer"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <span className="text-slate-450 truncate max-w-xs font-medium">
                    Original URL: {shortenedResult.originalUrl}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowQrModal(true)}
                      className="inline-flex items-center gap-1 font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                    >
                      <QrCode size={13} />
                      View QR Code
                    </button>
                    <Link
                      to={ROUTES.DASHBOARD}
                      className="inline-flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:underline"
                    >
                      View Analytics
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16">
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:border-violet-500/20 hover:shadow-lg dark:hover:shadow-violet-950/20 hover:-translate-y-0.5 glow-card-hover">
            <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-xs">
              <Activity size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Real-time Analytics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Monitor browser, operating system, and geolocation aggregations to
              gain deep insights into your audience.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:border-violet-500/20 hover:shadow-lg dark:hover:shadow-violet-950/20 hover:-translate-y-0.5 glow-card-hover">
            <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-xs">
              <QrCode size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              QR Code Generation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Instantly generate scan-ready, high-resolution QR codes for any
              short link right from your dashboard.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:border-violet-500/20 hover:shadow-lg dark:hover:shadow-violet-950/20 hover:-translate-y-0.5 glow-card-hover">
            <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Secure & Reliable
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Ensure smooth operations with access/refresh token rotation,
              rate-limiting, and Redis-backed routing.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-405 font-medium z-10 bg-white/30 dark:bg-transparent backdrop-blur-xs">
        &copy; {new Date().getFullYear()} SnapLink. Created as a production-grade portfolio application.
      </footer>

      {/* QR Code Modal (Local UI overlays) */}
      {showQrModal && shortenedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setShowQrModal(false)}
          />
          <div className="relative glass-card p-6 rounded-2xl shadow-xl w-full max-w-sm border border-slate-200/80 dark:border-slate-800/80 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">QR Code Options</h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <QrCodeModalContent urlId={shortenedResult._id} />
          </div>
        </div>
      )}

      {/* Auth Prompt Modal (Local UI overlays) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/45 dark:bg-slate-950/65 backdrop-blur-xs"
            onClick={() => setShowAuthModal(false)}
          />
          <div className="relative glass-card p-6 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200/80 dark:border-slate-850/80 animate-in zoom-in-95 duration-205 flex flex-col items-center text-center gap-4">
            <div className="h-12 w-12 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-100 dark:border-violet-900/50">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentication Required</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed font-medium">
                Create a free account or log in to shorten links, customize aliases, track performance, and generate QR codes.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-850 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate(ROUTES.REGISTER);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-violet-600/10 transition-all cursor-pointer"
              >
                Sign Up Free
              </button>
            </div>
            <p className="text-[11px] text-slate-450 font-medium">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate(ROUTES.LOGIN);
                }}
                className="text-violet-600 dark:text-violet-400 font-bold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
