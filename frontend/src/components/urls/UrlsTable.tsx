import { Link } from "react-router-dom";
import type { UrlData } from "../../types";
import { ROUTES } from "../../constants/routes";
import { buildShortUrl, getShortPath } from "../../utils/shortUrl";
import {
  Copy,
  ExternalLink,
  QrCode,
  Edit3,
  Trash2,
  BarChart3,
} from "lucide-react";

type UrlsTableProps = {
  urls: UrlData[];
  onCopy: (shortCode: string) => void;
  onQrCode: (id: string) => void;
  onEdit: (url: UrlData) => void;
  onDelete: (id: string) => void;
};

export const UrlsTable = ({
  urls,
  onCopy,
  onQrCode,
  onEdit,
  onDelete,
}: UrlsTableProps) => {
  const now = new Date();

  return (
    <table className="w-full text-left border-collapse select-none">
      <thead>
        <tr className="border-b border-slate-200/80 dark:border-slate-850/80 text-[10px] font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider bg-slate-50/40 dark:bg-slate-950/30">
          <th className="px-6 py-4">Original URL</th>
          <th className="px-6 py-4">Short Link</th>
          <th className="px-6 py-4 text-center">Clicks</th>
          <th className="px-6 py-4">Created</th>
          <th className="px-6 py-4">Expiration</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60 text-xs text-slate-700 dark:text-slate-350 font-medium">
        {urls.map((url) => {
          const shortUrl = buildShortUrl(url.shortCode);
          const isExpired =
            !url.isActive || (url.expiresAt && new Date(url.expiresAt) <= now);

          return (
            <tr
              key={url._id}
              className="hover:bg-slate-100/40 dark:hover:bg-slate-900/30 transition-colors"
            >
              <td className="px-6 py-4 max-w-xs truncate font-bold text-slate-900 dark:text-white">
                {url.originalUrl}
              </td>
              <td className="px-6 py-4 font-mono font-bold text-slate-650 dark:text-slate-400">
                {getShortPath(url.shortCode)}
              </td>
              <td className="px-6 py-4 text-center font-black text-slate-900 dark:text-white">
                {url.clickCount}
              </td>
              <td className="px-6 py-4 text-slate-450 dark:text-slate-500 font-semibold">
                {new Date(url.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-slate-450 dark:text-slate-500 font-semibold">
                {url.expiresAt
                  ? new Date(url.expiresAt).toLocaleDateString()
                  : "Never"}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isExpired
                      ? "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30"
                      : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
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
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer transition-colors"
                  >
                    <Copy size={13} />
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Open Link"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer transition-colors"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => onQrCode(url._id)}
                    title="View QR Code"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer transition-colors"
                  >
                    <QrCode size={13} />
                  </button>
                  <button
                    onClick={() => onEdit(url)}
                    title="Edit Original URL"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer transition-colors"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(url._id)}
                    title="Delete URL"
                    className="p-1.5 rounded-lg border border-slate-205 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-650 dark:hover:text-rose-400 cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                  <Link
                    to={`${ROUTES.ANALYTICS}?id=${url._id}`}
                    title="View Analytics"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer transition-colors"
                  >
                    <BarChart3 size={13} />
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
