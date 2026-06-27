import { Link } from "react-router-dom";
import type { UrlData } from "../../types";
import { ROUTES } from "../../constants/routes";
import { Copy, ExternalLink, QrCode, Edit3, Trash2, BarChart3 } from "lucide-react";

type UrlsTableProps = {
  urls: UrlData[];
  onCopy: (shortCode: string) => void;
  onQrCode: (id: string) => void;
  onEdit: (url: UrlData) => void;
  onDelete: (id: string) => void;
};

export const UrlsTable = ({ urls, onCopy, onQrCode, onEdit, onDelete }: UrlsTableProps) => {
  const now = new Date();

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
          <th className="px-6 py-3.5">Original URL</th>
          <th className="px-6 py-3.5">Short Link</th>
          <th className="px-6 py-3.5 text-center">Clicks</th>
          <th className="px-6 py-3.5">Created</th>
          <th className="px-6 py-3.5">Expiration</th>
          <th className="px-6 py-3.5">Status</th>
          <th className="px-6 py-3.5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-350">
        {urls.map((url) => {
          const base = import.meta.env.VITE_SHORT_BASE_URL ?? "http://localhost:5000";
          const shortUrl = `${base}/${url.shortCode}`;
          const isExpired = !url.isActive || (url.expiresAt && new Date(url.expiresAt) <= now);

          return (
            <tr key={url._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-905 dark:text-white">
                {url.originalUrl}
              </td>
              <td className="px-6 py-4 font-mono font-medium text-slate-650 dark:text-slate-400">
                /{url.shortCode}
              </td>
              <td className="px-6 py-4 text-center font-bold text-slate-900 dark:text-white">
                {url.clickCount}
              </td>
              <td className="px-6 py-4 text-xs text-slate-400 dark:text-slate-500">
                {new Date(url.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-xs text-slate-400 dark:text-slate-500">
                {url.expiresAt ? new Date(url.expiresAt).toLocaleDateString() : "Never"}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isExpired
                      ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                      : "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                  }`}
                >
                  {isExpired ? "Expired" : "Active"}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => onCopy(url.shortCode)}
                    title="Copy Link"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    <Copy size={14} />
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Open Link"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => onQrCode(url._id)}
                    title="View QR Code"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    <QrCode size={14} />
                  </button>
                  <button
                    onClick={() => onEdit(url)}
                    title="Edit Original URL"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(url._id)}
                    title="Delete URL"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-650 dark:hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                  <Link
                    to={`${ROUTES.ANALYTICS}?id=${url._id}`}
                    title="View Analytics"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    <BarChart3 size={14} />
                  </Link>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
