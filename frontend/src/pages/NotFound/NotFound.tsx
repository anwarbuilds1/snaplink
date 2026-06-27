import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { Button } from "../../components/common/Button";
import { Link2 } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center transition-colors duration-200">
      <div className="space-y-6 max-w-md">
        <div className="inline-flex bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 p-4 rounded-full border border-brand-100 dark:border-brand-900">
          <Link2 size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">404 - Page Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        <div>
          <Link to={ROUTES.HOME}>
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
