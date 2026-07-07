import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { EmptyState } from "@/components/admin/common/EmptyState";
import {
  getAllSubscribers, updateSubscriberStatus, deleteSubscriber, restoreSubscriber,
  permanentlyDeleteSubscriber, bulkDeleteSubscribers, bulkRestoreSubscribers, bulkUpdateSubscriberStatus,
  type NewsletterStatus,
} from "@/services/newsletter.service";
import { useToast } from "@/hooks/use-toast";
import {
  Mail, Trash2, Loader2, Calendar, Search, RotateCcw, AlertTriangle,
  ArrowLeft, ArrowRight, RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusValue, setBulkStatusValue] = useState<NewsletterStatus>("subscribed");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [permDeleteConfirmId, setPermDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(searchTerm); setCurrentPage(1); }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["admin", "subscribers", {
      page: currentPage, search: debouncedSearch, status: statusFilter,
      source: sourceFilter, trash: viewMode === "trash", sortBy, sortOrder,
    }],
    queryFn: () => getAllSubscribers({
      page: currentPage, limit: itemsPerPage, search: debouncedSearch,
      status: statusFilter, source: sourceFilter, trash: viewMode === "trash", sortBy, sortOrder,
    }),
  });

  const subscribers = apiResponse?.subscribers || [];
  const pagination = apiResponse?.pagination || { total: 0, page: 1, limit: itemsPerPage, totalPages: 1 };

  const refreshQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "subscribers"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "subscribers", "stats"] });
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: NewsletterStatus }) => updateSubscriberStatus(id, status),
    onSuccess: () => { refreshQueries(); toast({ title: "Status Updated", description: "Subscriber status updated." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: () => { refreshQueries(); setDeleteConfirmId(null); setSelectedIds([]); toast({ title: "Moved to Trash", description: "Subscriber moved to trash." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const restoreMutation = useMutation({
    mutationFn: restoreSubscriber,
    onSuccess: () => { refreshQueries(); toast({ title: "Restored", description: "Subscriber restored." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const permDeleteMutation = useMutation({
    mutationFn: permanentlyDeleteSubscriber,
    onSuccess: () => { refreshQueries(); setPermDeleteConfirmId(null); setSelectedIds([]); toast({ title: "Permanently Deleted", description: "Subscriber permanently removed." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteSubscribers,
    onSuccess: () => { refreshQueries(); setSelectedIds([]); toast({ title: "Bulk Delete", description: "Selected subscribers moved to trash." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: bulkRestoreSubscribers,
    onSuccess: () => { refreshQueries(); setSelectedIds([]); toast({ title: "Bulk Restore", description: "Selected subscribers restored." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: NewsletterStatus }) => bulkUpdateSubscriberStatus(ids, status),
    onSuccess: () => { refreshQueries(); setSelectedIds([]); toast({ title: "Bulk Status Updated", description: "Status applied to selected subscribers." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const isActionPending = updateStatusMutation.isPending || deleteMutation.isPending || restoreMutation.isPending ||
    permDeleteMutation.isPending || bulkDeleteMutation.isPending || bulkRestoreMutation.isPending || bulkStatusMutation.isPending;

  const toggleSelect = (id: string) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === subscribers.length ? [] : subscribers.map((s: any) => s._id));

  const handleBulkPermDelete = () => {
    if (selectedIds.length === 0 || isActionPending) return;
    if (window.confirm(`Permanently delete ${selectedIds.length} subscribers?`)) {
      selectedIds.forEach((id) => permDeleteMutation.mutate(id));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={viewMode === "trash" ? "Newsletter Trash Bin" : "Newsletter Subscribers"}
        description={viewMode === "trash" ? "Restore or permanently delete removed subscribers." : "Review subscribed audiences and campaign sources."}
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input placeholder="Search email addresses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-10 pl-10 rounded-xl" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => { setViewMode("active"); setSelectedIds([]); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${viewMode === "active" ? "bg-white shadow-sm" : "text-slate-400"}`}>All</button>
              <button onClick={() => { setViewMode("trash"); setSelectedIds([]); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 ${viewMode === "trash" ? "bg-red-50 text-red-600" : "text-slate-400"}`}><Trash2 className="w-3.5 h-3.5" /> Trash</button>
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-9 px-3 rounded-lg border text-xs font-bold bg-white">
              <option value="createdAt">Sort: Date</option>
              <option value="email">Sort: Email</option>
              <option value="status">Sort: Status</option>
            </select>
            <button onClick={() => setSortOrder((p) => p === "asc" ? "desc" : "asc")} className="h-9 px-3 rounded-lg border text-xs font-bold">{sortOrder === "asc" ? "↑" : "↓"}</button>
          </div>
        </div>

        {viewMode === "active" && (
          <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 items-center justify-between">
            <div className="flex gap-3">
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="h-8 px-2.5 rounded-lg border text-xs font-semibold bg-white">
                <option value="all">All Statuses</option>
                <option value="subscribed">Subscribed</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
              <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }} className="h-8 px-2.5 rounded-lg border text-xs font-semibold bg-white">
                <option value="all">All Sources</option>
                <option value="footer">Footer</option>
                <option value="blog_popup">Blog Popup</option>
                <option value="contact_form">Contact Form</option>
                <option value="hero">Hero</option>
              </select>
            </div>
            <button onClick={() => { setSearchTerm(""); setStatusFilter("all"); setSourceFilter("all"); }} className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
          </div>
        )}

        {selectedIds.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="text-xs font-bold text-emerald-800">{selectedIds.length} selected</span>
            <div className="flex flex-wrap items-center gap-2">
              {viewMode === "active" ? (
                <>
                  <select value={bulkStatusValue} onChange={(e) => setBulkStatusValue(e.target.value as NewsletterStatus)} className="h-8 px-2.5 rounded-lg border text-xs font-bold bg-white">
                    <option value="subscribed">Subscribed</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </select>
                  <Button onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: bulkStatusValue })} disabled={isActionPending} size="sm" className="h-8 text-xs">Apply Status</Button>
                  <Button onClick={() => bulkDeleteMutation.mutate(selectedIds)} disabled={isActionPending} variant="destructive" size="sm" className="h-8 text-xs">Bulk Delete</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => bulkRestoreMutation.mutate(selectedIds)} disabled={isActionPending} size="sm" className="h-8 text-xs">Bulk Restore</Button>
                  <Button onClick={handleBulkPermDelete} disabled={isActionPending} variant="destructive" size="sm" className="h-8 text-xs">Bulk Permanent Delete</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>
      ) : subscribers.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm max-w-5xl">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-4 w-10"><input type="checkbox" checked={selectedIds.length === subscribers.length} onChange={toggleSelectAll} className="accent-emerald-600" /></th>
                  <th className="px-4 py-4 font-bold">Email</th>
                  <th className="px-4 py-4 font-bold">Status</th>
                  <th className="px-4 py-4 font-bold">Source</th>
                  <th className="px-4 py-4 font-bold">Joined</th>
                  <th className="px-4 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.map((item: any) => (
                  <tr key={item._id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.includes(item._id)} onChange={() => toggleSelect(item._id)} className="accent-emerald-600" /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Mail className="w-4 h-4" /></div>
                        <span className="font-bold text-slate-900">{item.email}</span>
                      </div>
                      {viewMode === "trash" && item.deletedAt && <p className="text-[10px] text-red-400 mt-1">Deleted by {item.deletedBy || "Admin"}</p>}
                    </td>
                    <td className="px-4 py-4">
                      {viewMode === "active" ? (
                        <select value={item.status} onChange={(e) => updateStatusMutation.mutate({ id: item._id, status: e.target.value as NewsletterStatus })} className="text-[10px] font-extrabold uppercase px-2 py-1 rounded border bg-white">
                          <option value="subscribed">Subscribed</option>
                          <option value="unsubscribed">Unsubscribed</option>
                        </select>
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-slate-500">{item.status}</span>
                      )}
                    </td>
                    <td className="px-4 py-4"><span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600">{item.source || "Direct"}</span></td>
                    <td className="px-4 py-4 text-xs text-slate-500"><Calendar className="w-3.5 h-3.5 inline mr-1" />{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-right">
                      {viewMode === "active" ? (
                        <Button variant="ghost" size="sm" onClick={() => { setDeleteConfirmId(item._id); setDeleteConfirmEmail(item.email); }} className="text-red-600 h-8"><Trash2 className="w-4 h-4" /></Button>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button variant="outline" size="sm" onClick={() => restoreMutation.mutate(item._id)} className="h-8 text-xs"><RotateCw className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => setPermDeleteConfirmId(item._id)} className="text-red-600 h-8"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-end gap-3 max-w-5xl">
              <span className="text-xs text-slate-500">Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}><ArrowLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" disabled={currentPage >= pagination.totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ArrowRight className="w-4 h-4" /></Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState title={viewMode === "trash" ? "Trash is empty" : "No subscribers found"} description="Newsletter signups will appear here." />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold mb-2">Move to Trash?</h3>
            <p className="text-sm text-slate-600 mb-6">Move <strong>{deleteConfirmEmail}</strong> to trash?</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => deleteMutation.mutate(deleteConfirmId)} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Move to Trash"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {permDeleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-6 h-6 text-red-600" /><h3 className="text-lg font-bold">Permanent Delete</h3></div>
            <p className="text-sm text-slate-600 mb-6">This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPermDeleteConfirmId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => permDeleteMutation.mutate(permDeleteConfirmId)} disabled={permDeleteMutation.isPending}>
                {permDeleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Forever"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
