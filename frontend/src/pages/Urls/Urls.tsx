import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { useMyUrls, useCreateUrl, useUpdateUrl, useDeleteUrl } from "../../hooks/useUrls";
import type { UrlData } from "../../types";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { toast } from "sonner";
import { Search, Plus } from "lucide-react";

// Sub-components
import { QrCodeModalContent } from "../../components/urls/QrCodeModalContent";
import { CreateUrlModal } from "../../components/modals/CreateUrlModal";
import { EditUrlModal } from "../../components/modals/EditUrlModal";
import { UrlsTable } from "../../components/urls/UrlsTable";
import { Pagination } from "../../components/common/Pagination";

function Urls() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Queries & Mutations
  const { data: urlsResponse, isLoading, error } = useMyUrls(page, limit);
  const createMutation = useCreateUrl();
  const updateMutation = useUpdateUrl();
  const deleteMutation = useDeleteUrl();

  // Filter/Sort State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all");
  const [sortBy, setSortBy] = useState<"date" | "clicks" | "name">("date");

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editUrl, setEditUrl] = useState<UrlData | null>(null);
  const [qrUrlId, setQrUrlId] = useState<string | null>(null);

  // Handlers
  const handleCreateSubmit = async (data: { originalUrl: string; customAlias?: string; expiresAt?: string }) => {
    try {
      const payload = {
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
      };
      await createMutation.mutateAsync(payload);
      toast.success("Short URL created!");
      setIsCreateOpen(false);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errMsg = error.response?.data?.message ?? "Failed to create short URL.";
      toast.error(errMsg);
    }
  };

  const handleEditSubmit = async (data: { originalUrl: string }) => {
    if (!editUrl) return;
    try {
      await updateMutation.mutateAsync({
        id: editUrl._id,
        originalUrl: data.originalUrl,
      });
      toast.success("URL updated successfully!");
      setEditUrl(null);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errMsg = error.response?.data?.message ?? "Failed to update URL.";
      toast.error(errMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this shortened URL?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("URL deleted successfully!");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errMsg = error.response?.data?.message ?? "Failed to delete URL.";
      toast.error(errMsg);
    }
  };

  const handleCopy = async (shortCode: string) => {
    const base = import.meta.env.VITE_SHORT_BASE_URL ?? "http://localhost:5000";
    const fullUrl = `${base}/${shortCode}`;
    const success = await copyToClipboard(fullUrl);
    if (success) toast.success("Copied short link!");
    else toast.error("Failed to copy link.");
  };

  // Processing client-side filter/sorting over fetched page array
  const originalUrls = urlsResponse?.data ?? [];
  const now = new Date();

  const filteredUrls = originalUrls
    .filter((url) => {
      const matchesSearch =
        url.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
        url.shortCode.toLowerCase().includes(search.toLowerCase());

      const isUrlExpired = !url.isActive || (url.expiresAt && new Date(url.expiresAt) <= now);

      if (statusFilter === "active") return matchesSearch && !isUrlExpired;
      if (statusFilter === "expired") return matchesSearch && isUrlExpired;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "clicks") return b.clickCount - a.clickCount;
      if (sortBy === "name") return a.shortCode.localeCompare(b.shortCode);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // date
    });

  const pagination = urlsResponse?.pagination ?? { page: 1, totalPages: 1 };

  return (
    <Layout title="URL Management">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Links</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium font-semibold">Create and manage your shortened URLs</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5 self-start sm:self-auto">
          <Plus size={16} />
          Shorten URL
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "expired")}
            className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="expired">Expired Only</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "clicks" | "name")}
            className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
          >
            <option value="date">Sort: Created Date</option>
            <option value="clicks">Sort: Total Clicks</option>
            <option value="name">Sort: Short Code</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-600 mx-auto mb-3"></div>
            Loading URLs...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Failed to load URL list.</div>
        ) : filteredUrls.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 dark:text-slate-400">
            No shortened URLs match your criteria.
          </div>
        ) : (
          <UrlsTable
            urls={filteredUrls}
            onCopy={handleCopy}
            onQrCode={setQrUrlId}
            onEdit={setEditUrl}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      {/* Create Modal */}
      <CreateUrlModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
      />

      {/* Edit Modal */}
      <EditUrlModal
        isOpen={!!editUrl}
        onClose={() => setEditUrl(null)}
        onSubmit={handleEditSubmit}
        isPending={updateMutation.isPending}
        defaultUrl={editUrl?.originalUrl}
      />

      {/* QR Code Modal */}
      <Modal isOpen={!!qrUrlId} onClose={() => setQrUrlId(null)} title="QR Code Options">
        {qrUrlId && <QrCodeModalContent urlId={qrUrlId} />}
      </Modal>
    </Layout>
  );
}

export default Urls;
