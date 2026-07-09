import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { EmptyState } from "@/components/admin/common/EmptyState";
import {
  getAllApplications, updateApplicationStatus, deleteApplication, restoreApplication,
  permanentlyDeleteApplication, bulkDeleteApplications, bulkRestoreApplications, bulkUpdateApplicationStatus,
  type ApplicationStatus,
} from "@/services/job.service";
import { isResolvableResumeUrl, getResumePreviewUrl, getResumeDownloadUrl, canPreviewResumeInline, downloadResumeWithAuth } from "@/lib/resumeUrl";
import { getAccessToken } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import {
  Trash2, ExternalLink, Loader2, ArrowUpRight, FileUp, Search, RotateCcw,
  AlertTriangle, ArrowLeft, ArrowRight, RotateCw, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const APPLICATION_STATUSES: ApplicationStatus[] = ['Pending', 'Shortlisted', 'Interview', 'Rejected', 'Selected'];

const Applications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusValue, setBulkStatusValue] = useState<ApplicationStatus>("Pending");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [permDeleteConfirmId, setPermDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(searchTerm); setCurrentPage(1); }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["admin", "applications", {
      page: currentPage, search: debouncedSearch, status: statusFilter,
      trash: viewMode === "trash", sortBy, sortOrder,
    }],
    queryFn: () => getAllApplications({
      page: currentPage, limit: itemsPerPage, search: debouncedSearch,
      status: statusFilter, trash: viewMode === "trash", sortBy, sortOrder,
    }),
  });

  const applications = apiResponse?.applications || [];
  const pagination = apiResponse?.pagination || { total: 0, page: 1, limit: itemsPerPage, totalPages: 1 };

  const refreshQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "applications", "stats"] });
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) => updateApplicationStatus(id, status),
    onSuccess: () => { refreshQueries(); toast({ title: "Status Updated", description: "Applicant status updated." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => { refreshQueries(); setDeleteConfirmId(null); setSelectedIds([]); toast({ title: "Moved to Trash", description: "Application moved to trash." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const restoreMutation = useMutation({
    mutationFn: restoreApplication,
    onSuccess: () => { refreshQueries(); toast({ title: "Restored", description: "Application restored." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const permDeleteMutation = useMutation({
    mutationFn: permanentlyDeleteApplication,
    onSuccess: () => { refreshQueries(); setPermDeleteConfirmId(null); setSelectedIds([]); toast({ title: "Permanently Deleted", description: "Application permanently removed." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteApplications,
    onSuccess: () => { refreshQueries(); setSelectedIds([]); toast({ title: "Bulk Delete", description: "Selected applications moved to trash." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: bulkRestoreApplications,
    onSuccess: () => { refreshQueries(); setSelectedIds([]); toast({ title: "Bulk Restore", description: "Selected applications restored." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: ApplicationStatus }) => bulkUpdateApplicationStatus(ids, status),
    onSuccess: () => { refreshQueries(); setSelectedIds([]); toast({ title: "Bulk Status Updated", description: "Status applied to selected applications." }); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const isActionPending = updateStatusMutation.isPending || deleteMutation.isPending || restoreMutation.isPending ||
    permDeleteMutation.isPending || bulkDeleteMutation.isPending || bulkRestoreMutation.isPending || bulkStatusMutation.isPending;

  const toggleSelect = (id: string) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === applications.length ? [] : applications.map((a: any) => a._id));

  const handleBulkPermDelete = () => {
    if (selectedIds.length === 0 || isActionPending) return;
    if (window.confirm(`Permanently delete ${selectedIds.length} applications?`)) {
      selectedIds.forEach((id) => permDeleteMutation.mutate(id));
    }
  };

  const getJobTitle = (app: any) => {
    if (app.jobId && typeof app.jobId === 'object') return app.jobId.title || 'Unknown Job';
    return 'Unknown Job';
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={viewMode === "trash" ? "Applications Trash Bin" : "Job Applications"}
        description={viewMode === "trash" ? "Restore or permanently delete removed applications." : "Review submissions and manage hiring pipeline statuses."}
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input placeholder="Search applicants..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-10 pl-10 rounded-xl" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => { setViewMode("active"); setSelectedIds([]); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${viewMode === "active" ? "bg-white shadow-sm" : "text-slate-400"}`}>All</button>
              <button onClick={() => { setViewMode("trash"); setSelectedIds([]); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 ${viewMode === "trash" ? "bg-red-50 text-red-600" : "text-slate-400"}`}><Trash2 className="w-3.5 h-3.5" /> Trash</button>
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-9 px-3 rounded-lg border text-xs font-bold bg-white">
              <option value="createdAt">Sort: Date</option>
              <option value="fullName">Sort: Name</option>
              <option value="status">Sort: Status</option>
            </select>
            <button onClick={() => setSortOrder((p) => p === "asc" ? "desc" : "asc")} className="h-9 px-3 rounded-lg border text-xs font-bold">{sortOrder === "asc" ? "↑" : "↓"}</button>
          </div>
        </div>

        {viewMode === "active" && (
          <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 items-center justify-between">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="h-8 px-2.5 rounded-lg border text-xs font-semibold bg-white">
              <option value="all">All Stages</option>
              {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => { setSearchTerm(""); setStatusFilter("all"); }} className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
          </div>
        )}

        {selectedIds.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="text-xs font-bold text-emerald-800">{selectedIds.length} selected</span>
            <div className="flex flex-wrap items-center gap-2">
              {viewMode === "active" ? (
                <>
                  <select value={bulkStatusValue} onChange={(e) => setBulkStatusValue(e.target.value as ApplicationStatus)} className="h-8 px-2.5 rounded-lg border text-xs font-bold bg-white">
                    {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
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
      ) : applications.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-4 w-10"><input type="checkbox" checked={selectedIds.length === applications.length} onChange={toggleSelectAll} className="accent-emerald-600" /></th>
                  <th className="px-4 py-4 font-bold">Applicant</th>
                  <th className="px-4 py-4 font-bold">Position</th>
                  <th className="px-4 py-4 font-bold">Location</th>
                  <th className="px-4 py-4 font-bold">Resume</th>
                  <th className="px-4 py-4 font-bold">Status</th>
                  <th className="px-4 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app: any) => (
                  <tr key={app._id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.includes(app._id)} onChange={() => toggleSelect(app._id)} className="accent-emerald-600" /></td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900">{app.fullName}</div>
                      <div className="text-xs text-slate-400">{app.email}</div>
                      {app.updatedBy && <div className="text-[10px] text-slate-400">Updated by {app.updatedBy}</div>}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-emerald-700">{getJobTitle(app)}</td>
                    <td className="px-4 py-4 text-xs text-slate-600">{app.currentLocation || "—"}<br /><span className="text-slate-400">{app.phone}</span></td>
                    <td className="px-4 py-4">
                      {isResolvableResumeUrl(app.resumeUrl) ? (
                        <div className="flex flex-col items-start gap-1">
                          {(() => {
                            const asset = {
                              resumeUrl: app.resumeUrl,
                              resumePublicId: app.resumePublicId,
                              resumeMimeType: app.resumeMimeType,
                              originalFileName: app.originalFileName,
                            };
                            const previewUrl = getResumePreviewUrl(asset);
                            const downloadUrl = getResumeDownloadUrl(asset);

                            return (
                              <>
                                {previewUrl && canPreviewResumeInline(asset) ? (
                                  <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                                  >
                                    <FileUp className="w-3 h-3" /> View Resume <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                ) : null}
                                {downloadUrl ? (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        await downloadResumeWithAuth(asset, getAccessToken);
                                      } catch (error: any) {
                                        toast({
                                          title: "Download failed",
                                          description: error?.message || "Could not download resume.",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:underline"
                                  >
                                    <Download className="w-3 h-3" /> Download
                                  </button>
                                ) : null}
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">Resume not available</span>
                      )}
                      {app.portfolio && (
                        <a href={app.portfolio} target="_blank" rel="noreferrer" className="block text-[11px] font-bold text-blue-600 hover:underline mt-1">
                          Portfolio <ArrowUpRight className="w-2.5 h-2.5 inline" />
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {viewMode === "active" ? (
                        <select value={app.status || "Pending"} onChange={(e) => updateStatusMutation.mutate({ id: app._id, status: e.target.value as ApplicationStatus })} className="text-[11px] font-extrabold uppercase px-2 py-1 rounded border bg-white">
                          {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-slate-500">{app.status}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {viewMode === "active" ? (
                        <Button variant="ghost" size="sm" onClick={() => { setDeleteConfirmId(app._id); setDeleteConfirmName(app.fullName); }} className="text-red-600 h-8"><Trash2 className="w-4 h-4" /></Button>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button variant="outline" size="sm" onClick={() => restoreMutation.mutate(app._id)} className="h-8 text-xs"><RotateCw className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => setPermDeleteConfirmId(app._id)} className="text-red-600 h-8"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs text-slate-500">Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}><ArrowLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" disabled={currentPage >= pagination.totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ArrowRight className="w-4 h-4" /></Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState title={viewMode === "trash" ? "Trash is empty" : "No applications found"} description="Job applications will appear here." />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold mb-2">Move to Trash?</h3>
            <p className="text-sm text-slate-600 mb-6">Move application from <strong>{deleteConfirmName}</strong> to trash?</p>
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

export default Applications;
