import { Link } from "react-router-dom";
import {
  Link2,
  ArrowRight,
  Activity,
  ShieldCheck,
  QrCode,
  Sparkles,
} from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 theme-transition">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-600 text-white p-1.5 rounded-lg flex items-center justify-center">
            <Link2 size={18} />
          </div>
          <span className="font-bold tracking-tight text-lg">
            SnapLink <span className="text-brand-600 font-extrabold"></span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to={ROUTES.DASHBOARD}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-xs transition-all cursor-pointer"
            >
              Go to Dashboard
              <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 text-sm font-medium shadow-xs transition-all cursor-pointer"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center gap-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-xs font-semibold border border-brand-100 dark:border-brand-900 select-none">
          <Sparkles size={12} />
          Portfolio Grade URL Shortening Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none max-w-3xl">
          Shorten your links. <br />
          <span className="text-brand-600">Analyze your reach.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Create custom, lightning-fast short codes backed by Redis caching.
          Track click performance with real-time browser, device, and operating
          system analytics.
        </p>

        <div className="flex gap-4 mt-4">
          <Link
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER}
            className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 text-sm sm:text-base"
          >
            Get Started For Free
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Features grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center text-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Real-time Analytics
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
              Monitor browser, operating system, and geolocation aggregations to
              gain deep insights into your audience.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center text-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <QrCode size={20} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              QR Code Generation
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
              Instantly generate scan-ready, high-resolution QR codes for any
              short link right from your dashboard.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center text-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Secure & Reliable
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
              Ensure smooth operations with access/refresh token rotation,
              rate-limiting, and Redis-backed routing.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} SnapLink Created as a production-grade
        portfolio application.
      </footer>
    </div>
  );
}

export default Home;
