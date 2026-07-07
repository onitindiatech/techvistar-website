import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { EmptyState } from "@/components/admin/common/EmptyState";
import {
  getAllContacts, updateContactStatus, deleteContact, restoreContact,
  permanentlyDeleteContact, bulkDeleteContacts, bulkRestoreContacts, bulkUpdateContactStatus,
  type ContactStatus,
} from "@/services/contact.service";
import { useToast } from "@/hooks/use-toast";
import {
  Trash2, Loader2, Phone, Building, MessageSquare, Search, RotateCcw,
  AlertTriangle, ArrowLeft, ArrowRight, RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CONTACT_STATUSES: ContactStatus[] = ['new', 'in-progress', 'resolved', 'archived'];

const Contacts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusValue, setBulkStatusValue] = useState<ContactStatus>("in-progress");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState("");
  const [permDeleteConfirmId, setPermDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["admin", "contacts", {
      page: currentPage, search: debouncedSearch, status: statusFilter,
      trash: viewMode === "trash", sortBy, sortOrder,
    }],
    queryFn: () => getAllContacts({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      status: statusFilter,
      trash: viewMode === "trash",
      sortBy,
      sortOrder,
    }),
  });

  const contacts = apiResponse?.contacts || [];
  const pagination = apiResponse?.pagination || { total: 0, page: 1, limit: itemsPerPage, totalPages: 1 };

  const refreshQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "contacts", "stats"] });
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactStatus }) => updateContactStatus(id, status),
    onSuccess: () => {
      refreshQueries();
      toast({ title: "Inquiry Updated", description: "Inquiry status updated successfully." });
    },
    onError: (err: Error) => toast({ title: "Error updating inquiry", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      refreshQueries();
      setDeleteConfirmId(null);
      setSelectedIds([]);
      toast({ title: "Inquiry Deleted", description: "Inquiry moved to Trash." });
    },
    onError: (err: Error) => toast({ title: "Error deleting inquiry", description: err.message, variant: "destructive" }),
  });

  const restoreMutation = useMutation({
    mutationFn: restoreContact,
    onSuccess: () => {
      refreshQueries();
      toast({ title: "Inquiry Restored", description: "Inquiry restored successfully." });
    },
    onError: (err: Error) => toast({ title: "Error restoring inquiry", description: err.message, variant: "destructive" }),
  });

  const permDeleteMutation = useMutation({
    mutationFn: permanentlyDeleteContact,
    onSuccess: () => {
      refreshQueries();
      setPermDeleteConfirmId(null);
      setSelectedIds([]);
      toast({ title: "Inquiry Permanently Deleted", description: "Inquiry permanently removed." });
    },
    onError: (err: Error) => toast({ title: "Error deleting inquiry", description: err.message, variant: "destructive" }),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteContacts,
    onSuccess: () => { refreshQueries(); setSelectedIds([]); toast({ title: "Bulk Delete", description: "Selected inquiries moved to Trash." }); },
    onError: (err: Error) => toast({ title: "Bulk delete failed", description: err.message, variant: "destructive" }),
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: bulkRestoreContacts,
    onSuccess: () => { refreshQueries(); setSelectedIds([]); toast({ title: "Bulk Restore", description: "Selected inquiries restored." }); },
    onError: (err: Error) => toast({ title: "Bulk restore failed", description: err.message, variant: "destructive" }),
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: ContactStatus }) => bulkUpdateContactStatus(ids, status),
    onSuccess: () => { refreshQueries(); setSelectedIds([]); toast({ title: "Bulk Status Updated", description: "Status applied to selected inquiries." }); },
    onError: (err: Error) => toast({ title: "Bulk status failed", description: err.message, variant: "destructive" }),
  });

  const isActionPending =
    updateStatusMutation.isPending || deleteMutation.isPending || restoreMutation.isPending ||
    permDeleteMutation.isPending || bulkDeleteMutation.isPending || bulkRestoreMutation.isPending || bulkStatusMutation.isPending;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === contacts.length ? [] : contacts.map((c: any) => c._id));
  };

  const handleBulkPermDelete = () => {
    if (selectedIds.length === 0 || isActionPending) return;
    if (window.confirm(`Permanently delete ${selectedIds.length} inquiries?`)) {
      selectedIds.forEach((id) => permDeleteMutation.mutate(id));
    }
  };

  const statusLabel = (s: string) => {
    if (s === 'new') return 'New';
    if (s === 'in-progress') return 'In Progress';
    if (s === 'resolved') return 'Resolved';
    return 'Archived';
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={viewMode === "trash" ? "Contact Trash Bin" : "Contact Inquiries"}
        description={viewMode === "trash" ? "Restore or permanently delete removed inquiries." : "Monitor contact submissions from public web visitors."}
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input placeholder="Search name, email, message..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-10 pl-10 rounded-xl" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => { setViewMode("active"); setSelectedIds([]); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${viewMode === "active" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>All Inquiries</button>
              <button onClick={() => { setViewMode("trash"); setSelectedIds([]); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${viewMode === "trash" ? "bg-red-50 text-red-600 shadow-sm" : "text-slate-400"}`}><Trash2 className="w-3.5 h-3.5" /> Trash</button>
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold bg-white">
              <option value="createdAt">Sort: Date</option>
              <option value="name">Sort: Name</option>
              <option value="status">Sort: Status</option>
            </select>
            <button onClick={() => setSortOrder((p) => p === "asc" ? "desc" : "asc")} className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold">{sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}</button>
          </div>
        </div>

        {viewMode === "active" && (
          <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 items-center justify-between">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white">
              <option value="all">All Statuses</option>
              {CONTACT_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
            </select>
            <button onClick={() => { setSearchTerm(""); setStatusFilter("all"); setSortBy("createdAt"); setSortOrder("desc"); }} className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
          </div>
        )}

        {selectedIds.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="text-xs font-bold text-emerald-800">{selectedIds.length} selected</span>
            <div className="flex flex-wrap items-center gap-2">
              {viewMode === "active" ? (
                <>
                  <select value={bulkStatusValue} onChange={(e) => setBulkStatusValue(e.target.value as ContactStatus)} className="h-8 px-2.5 rounded-lg border text-xs font-bold bg-white">
                    {CONTACT_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
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
        <div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>
      ) : contacts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6">
            {contacts.map((c: any) => (
              <div key={c._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all relative">
                <input type="checkbox" checked={selectedIds.includes(c._id)} onChange={() => toggleSelect(c._id)} className="absolute top-4 left-4 w-4 h-4 accent-emerald-600" />
                <div className="pl-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{c.name} <span className="text-xs font-semibold text-slate-400">({c.email})</span></h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {c.phone || "No phone"}</span>
                        {c.company && <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {c.company}</span>}
                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {c.serviceInterested}</span>
                      </div>
                      {c.updatedBy && <p className="text-[10px] text-slate-400 mt-1">Last updated by {c.updatedBy}</p>}
                      {viewMode === "trash" && c.deletedAt && <p className="text-[10px] text-red-400 mt-1">Deleted {new Date(c.deletedAt).toLocaleString()} by {c.deletedBy || "Admin"}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      {viewMode === "active" ? (
                        <>
                          <select value={c.status || "new"} onChange={(e) => updateStatusMutation.mutate({ id: c._id, status: e.target.value as ContactStatus })} className="text-[10px] font-extrabold uppercase px-2 py-1 rounded border bg-white">
                            {CONTACT_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                          </select>
                          <Button variant="ghost" size="sm" onClick={() => { setDeleteConfirmId(c._id); setDeleteConfirmTitle(c.name); }} className="text-red-600 hover:bg-red-50 h-8"><Trash2 className="w-4 h-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={() => restoreMutation.mutate(c._id)} className="h-8 text-xs"><RotateCw className="w-3.5 h-3.5 mr-1" /> Restore</Button>
                          <Button variant="ghost" size="sm" onClick={() => setPermDeleteConfirmId(c._id)} className="text-red-600 hover:bg-red-50 h-8"><Trash2 className="w-4 h-4" /></Button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap">{c.message}</p>
                  {c.budget && <div className="text-[11px] font-bold text-amber-600 mt-4 uppercase">Budget: {c.budget}</div>}
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200/60 p-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <input type="checkbox" checked={selectedIds.length === contacts.length && contacts.length > 0} onChange={toggleSelectAll} className="accent-emerald-600" /> Select Page
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}><ArrowLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" disabled={currentPage >= pagination.totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState title={viewMode === "trash" ? "Trash is empty" : "No contact submissions"} description={viewMode === "trash" ? "Deleted inquiries appear here." : "Inquiries from the contact form will show up here."} />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Move to Trash?</h3>
            <p className="text-sm text-slate-600 mb-6">Move inquiry from <strong>{deleteConfirmTitle}</strong> to trash?</p>
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
            <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-6 h-6 text-red-600" /><h3 className="text-lg font-bold text-slate-900">Permanent Delete</h3></div>
            <p className="text-sm text-slate-600 mb-6">This action cannot be undone. The inquiry will be permanently removed.</p>
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

export default Contacts;
