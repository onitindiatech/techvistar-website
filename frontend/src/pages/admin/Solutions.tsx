import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { EmptyState } from "@/components/admin/common/EmptyState";
import {
  getAllSolutions, createSolution, updateSolution, deleteSolution,
  restoreSolution, permanentlyDeleteSolution, bulkDeleteSolutions, bulkRestoreSolutions, bulkUpdateStatus
} from "@/services/solutions.service";
import { useToast } from "@/hooks/use-toast";
import {
  Shapes, Trash2, Edit, Loader2, X, Plus, AlertCircle, ArrowLeft, ArrowRight,
  Search, RotateCcw, AlertTriangle, Star, ArrowUpNarrowWide, ArrowDownWideNarrow
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SOLUTION_CATEGORIES = ["Business Solutions", "AI Solutions", "Digital Solutions"];

type SolutionStatus = "draft" | "active";

const DEFAULT_CHALLENGES = {
  title: "Default Challenges Overview",
  points: ["Challenge identified"],
  impact: "Requires strategic CMS response",
};

const DEFAULT_OUR_SOLUTION = {
  overview: "Our standardized solutions and operational models",
  capabilities: ["Custom implementation"],
};

const DEFAULT_BENEFITS = {
  roi: "Immediate system optimization and ROI",
  efficiency: "Increased throughput",
  scalability: "Full cloud readiness",
  security: "Compliance and active monitoring",
};

const Solutions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");
  const [sortBy, setSortBy] = useState("displayOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusValue, setBulkStatusValue] = useState<SolutionStatus>("active");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState("");
  const [permDeleteConfirmId, setPermDeleteConfirmId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [icon, setIcon] = useState("Shapes");
  const [category, setCategory] = useState(SOLUTION_CATEGORIES[0]);
  const [status, setStatus] = useState<SolutionStatus>("active");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [featured, setFeatured] = useState(false);
  const [techStackText, setTechStackText] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "solutions", {
      page: currentPage,
      search: debouncedSearch,
      status: statusFilter,
      category: categoryFilter,
      trash: viewMode === "trash",
      featured: featuredFilter,
      sortBy,
      sortOrder,
    }],
    queryFn: () => getAllSolutions({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      status: statusFilter,
      category: categoryFilter,
      trash: viewMode === "trash",
      featured: featuredFilter,
      sortBy,
      sortOrder,
    }),
  });

  const solutions = apiResponse?.solutions || [];
  const pagination = apiResponse?.pagination || { total: 0, page: 1, limit: itemsPerPage, totalPages: 1 };

  const refreshSolutionsQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "solutions"] });
    queryClient.invalidateQueries({ queryKey: ["activeSolutions"] });
    queryClient.invalidateQueries({ queryKey: ["solutionDetails"] });
  };

  const createMutation = useMutation({
    mutationFn: createSolution,
    onSuccess: () => {
      refreshSolutionsQueries();
      toast({ title: "Solution Created", description: "New solution offering published successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error creating solution", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateSolution(id, data),
    onSuccess: () => {
      refreshSolutionsQueries();
      toast({ title: "Solution Updated", description: "Solution offering modified successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error updating solution", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSolution,
    onSuccess: () => {
      refreshSolutionsQueries();
      toast({ title: "Solution soft deleted", description: "The solution has been moved to Trash." });
      setDeleteConfirmId(null);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error deleting solution", description: err.message, variant: "destructive" });
      setDeleteConfirmId(null);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreSolution,
    onSuccess: () => {
      refreshSolutionsQueries();
      toast({ title: "Solution restored", description: "The solution listing is now active." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error restoring solution", description: err.message, variant: "destructive" });
    },
  });

  const permDeleteMutation = useMutation({
    mutationFn: permanentlyDeleteSolution,
    onSuccess: () => {
      refreshSolutionsQueries();
      toast({ title: "Solution permanently deleted", description: "The solution has been removed from the database." });
      setPermDeleteConfirmId(null);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error permanently deleting solution", description: err.message, variant: "destructive" });
      setPermDeleteConfirmId(null);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteSolutions,
    onSuccess: () => {
      refreshSolutionsQueries();
      toast({ title: "Solutions soft-deleted", description: "Selected solutions moved to Trash." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: bulkRestoreSolutions,
    onSuccess: () => {
      refreshSolutionsQueries();
      toast({ title: "Solutions restored", description: "Selected solutions restored successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status: s }: { ids: string[]; status: SolutionStatus }) => bulkUpdateStatus(ids, s),
    onSuccess: () => {
      refreshSolutionsQueries();
      toast({ title: "Bulk Status Updated", description: "Selected solutions status updated successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setIcon("Shapes");
    setCategory(SOLUTION_CATEGORIES[0]);
    setStatus("active");
    setDisplayOrder("0");
    setFeatured(false);
    setTechStackText("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    setSubtitle(item.subtitle || "");
    setIcon(item.icon || "Shapes");
    setCategory(item.category || SOLUTION_CATEGORIES[0]);
    setStatus(item.status || "active");
    setDisplayOrder(String(item.displayOrder || 0));
    setFeatured(item.featured || false);
    setTechStackText((item.techStack || []).join(", "));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      subtitle,
      icon,
      category,
      status,
      displayOrder: Number(displayOrder) || 0,
      featured,
      techStack: techStackText.split(",").map((s) => s.trim()).filter(Boolean),
      challenges: DEFAULT_CHALLENGES,
      ourSolution: DEFAULT_OUR_SOLUTION,
      benefits: DEFAULT_BENEFITS,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === solutions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(solutions.map((x: any) => x._id));
    }
  };

  const handleOpenDelete = (item: any) => {
    setDeleteConfirmId(item._id);
    setDeleteConfirmTitle(item.title);
  };

  const statusBadgeClass = (s: string) => {
    if (s === "active") return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    return "bg-slate-100 text-slate-500 border border-slate-200";
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={viewMode === "trash" ? "CMS Trash Bin" : "Solutions CMS"}
        description={viewMode === "trash" ? "Restore or permanently delete removed solution offerings." : "Manage industry-aligned technology solutions for public marketing."}
        actionLabel={viewMode === "trash" ? undefined : "Add Solution"}
        onAction={viewMode === "trash" ? undefined : handleOpenCreate}
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input
              placeholder="Search by Title, Category, Tech Stack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => { setViewMode("active"); setSelectedIds([]); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${viewMode === "active" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}
              >
                All Listings
              </button>
              <button
                onClick={() => { setViewMode("trash"); setSelectedIds([]); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 ${viewMode === "trash" ? "bg-red-50 text-red-650 shadow-sm font-black" : "text-slate-400"}`}
              >
                <Trash2 className="w-3.5 h-3.5" /> Trash Bin
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold bg-white focus:outline-none"
              >
                <option value="displayOrder">Sort: Order</option>
                <option value="title">Sort: Title</option>
                <option value="createdAt">Sort: Created Date</option>
                <option value="updatedAt">Sort: Updated Date</option>
                <option value="status">Sort: Status</option>
              </select>
              <button
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="h-9 w-9 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                title="Toggle sort direction"
              >
                {sortOrder === "asc" ? <ArrowUpNarrowWide className="w-4 h-4 text-slate-500" /> : <ArrowDownWideNarrow className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Category:
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="all">All Categories</option>
                {SOLUTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {viewMode === "active" && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Status:
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Featured:
              <select
                value={featuredFilter}
                onChange={(e) => { setFeaturedFilter(e.target.value); setCurrentPage(1); }}
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="all">All Featured</option>
                <option value="true">Featured Only</option>
                <option value="false">Non-Featured</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setCategoryFilter("all");
              setFeaturedFilter("all");
              setSortBy("displayOrder");
              setSortOrder("asc");
            }}
            className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 hover:text-slate-650 uppercase tracking-widest"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="text-xs font-bold text-emerald-800">
              {selectedIds.length} solutions selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {viewMode === "active" ? (
                <>
                  <div className="flex items-center gap-2">
                    <select
                      value={bulkStatusValue}
                      onChange={(e: any) => setBulkStatusValue(e.target.value)}
                      className="h-8 px-2.5 rounded-lg border border-emerald-250 bg-white text-xs font-bold focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                    </select>
                    <Button onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: bulkStatusValue })} variant="secondary" size="sm" className="h-8 text-xs font-bold">
                      Apply Status
                    </Button>
                  </div>
                  <Button onClick={() => bulkDeleteMutation.mutate(selectedIds)} variant="destructive" size="sm" className="h-8 text-xs font-bold bg-red-650 hover:bg-red-500">
                    Bulk Soft Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => bulkRestoreMutation.mutate(selectedIds)} variant="outline" size="sm" className="h-8 text-xs font-bold bg-white text-emerald-700 border-emerald-200">
                    Bulk Restore
                  </Button>
                  <Button
                    onClick={() => {
                      if (window.confirm(`Permanently delete ${selectedIds.length} solutions?`)) {
                        selectedIds.forEach((id) => permDeleteMutation.mutate(id));
                      }
                    }}
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs font-bold bg-red-650 hover:bg-red-500"
                  >
                    Bulk Permanent Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/60 p-6 animate-pulse h-[200px]">
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600 mb-4" />
          <h3 className="text-lg font-bold text-red-900 mb-1">Failed to load solutions</h3>
          <p className="text-red-700 text-sm mb-6">{(error as Error)?.message}</p>
        </div>
      ) : solutions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((item: any) => (
              <div key={item._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all group relative">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id)}
                  onChange={() => toggleSelect(item._id)}
                  className="absolute top-4 right-4 w-4.5 h-4.5 accent-emerald-600 cursor-pointer rounded"
                />

                <div className="pr-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Shapes className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${statusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mt-1">{item.category}</span>
                  <p className="text-slate-500 text-sm mt-3 line-clamp-3">{item.subtitle}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-100">
                      Order: {item.displayOrder ?? 0}
                    </span>
                  </div>
                  {viewMode === "trash" && (
                    <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-wider">
                      Deleted {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : ""}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  {viewMode === "active" ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)} className="h-8 rounded-lg text-xs font-bold gap-1 border-slate-200">
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDelete(item)} className="h-8 rounded-lg text-xs font-bold gap-1 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => restoreMutation.mutate(item._id)} className="h-8 rounded-lg text-xs font-bold gap-1 border-emerald-200 text-emerald-700">
                        <RotateCcw className="w-3.5 h-3.5" /> Restore
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setPermDeleteConfirmId(item._id)} className="h-8 rounded-lg text-xs font-bold gap-1 border-red-100 text-red-600 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" /> Purge
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length === solutions.length && solutions.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer rounded"
                />
                <span className="text-xs text-slate-500 font-semibold">Select all on page</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="h-9 rounded-xl text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
                <span className="text-xs font-bold text-slate-500 px-2">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="h-9 rounded-xl text-xs font-bold"
                >
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title={viewMode === "trash" ? "Trash is empty" : "No solution entries found"}
          description="Click Add Solution or modify your search filters to get started."
          actionLabel={viewMode === "trash" ? undefined : "Create Solution"}
          onAction={viewMode === "trash" ? undefined : handleOpenCreate}
        />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete solution offering?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Are you sure you want to delete <strong className="text-slate-800">"{deleteConfirmTitle}"</strong>? It will be moved to the Trash Bin where you can restore it anytime.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="h-10 rounded-xl">Cancel</Button>
              <Button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                disabled={deleteMutation.isPending}
                className="bg-red-650 hover:bg-red-500 text-white h-10 rounded-xl px-5 flex items-center gap-1.5 font-bold"
              >
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Move to Trash
              </Button>
            </div>
          </div>
        </div>
      )}

      {permDeleteConfirmId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-2.5 text-red-600 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Purge Solution Entry?</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              This will permanently delete the record. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPermDeleteConfirmId(null)} className="h-10 rounded-xl">Cancel</Button>
              <Button
                onClick={() => permDeleteMutation.mutate(permDeleteConfirmId)}
                disabled={permDeleteMutation.isPending}
                className="bg-red-650 hover:bg-red-500 text-white h-10 rounded-xl px-5 flex items-center gap-1.5 font-bold"
              >
                {permDeleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? "Modify Solution" : "Add Solution"}</h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Solution Title</label>
                  <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cybersecurity Solutions" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
                  <select
                    required
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {SOLUTION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subtitle</label>
                <Input required value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Short secondary headline description" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Icon Name</label>
                  <Input required value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. Shield, Shapes" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Display Order</label>
                  <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={status} onChange={(e: any) => setStatus(e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured</label>
                  <button
                    type="button"
                    onClick={() => setFeatured(!featured)}
                    className={`w-full h-10 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${featured ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-white border-slate-200 text-slate-500"}`}
                  >
                    <Star className={`w-4 h-4 ${featured ? "fill-amber-400 text-amber-500" : ""}`} />
                    {featured ? "Featured" : "Not Featured"}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Tech Stack (Comma-separated)</label>
                <Input value={techStackText} onChange={(e) => setTechStackText(e.target.value)} placeholder="e.g. AWS, Kubernetes, Node.js" />
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeModal} className="rounded-xl font-bold h-11 border-slate-200">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold h-11 px-6 shadow-sm gap-2">
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {editingId ? "Save Changes" : "Create Solution"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Solutions;
