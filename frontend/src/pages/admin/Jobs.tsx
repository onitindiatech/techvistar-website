import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { EmptyState } from "@/components/admin/common/EmptyState";
import {
  getAllJobs, createJob, updateJob, deleteJob,
  restoreJob, permanentlyDeleteJob, bulkDeleteJobs, bulkRestoreJobs, bulkUpdateStatus
} from "@/services/job.service";
import { useToast } from "@/hooks/use-toast";
import {
  BriefcaseBusiness, Trash2, Edit, Loader2, X, Plus, AlertCircle, Trash, ArrowLeft, ArrowRight,
  Search, RotateCcw, AlertTriangle, Calendar, User, Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Sales", "Product", "Operations", "Other"] as const;
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;

const Jobs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");
  const [sortBy, setSortBy] = useState("displayOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusValue, setBulkStatusValue] = useState<"draft" | "active" | "closed">("draft");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState("");
  const [permDeleteConfirmId, setPermDeleteConfirmId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<typeof DEPARTMENTS[number]>("Engineering");
  const [location, setLocation] = useState("Remote");
  const [employmentType, setEmploymentType] = useState<typeof EMPLOYMENT_TYPES[number]>("Full-time");
  const [experience, setExperience] = useState("3+ years");
  const [salary, setSalary] = useState("Competitive");
  const [description, setDescription] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [benefitsText, setBenefitsText] = useState("");
  const [status, setStatus] = useState<"active" | "closed" | "draft">("draft");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "jobs", {
      page: currentPage,
      search: debouncedSearch,
      status: statusFilter,
      department: departmentFilter,
      trash: viewMode === "trash",
      featured: featuredFilter,
      sortBy,
      sortOrder,
    }],
    queryFn: () => getAllJobs({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      status: statusFilter,
      department: departmentFilter,
      trash: viewMode === "trash",
      featured: featuredFilter,
      sortBy,
      sortOrder,
    }),
  });

  const jobsList = apiResponse?.jobs || [];
  const pagination = apiResponse?.pagination || { total: 0, page: 1, limit: itemsPerPage, totalPages: 1 };

  const refreshJobQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
    queryClient.invalidateQueries({ queryKey: ["activeJobs"] });
    queryClient.invalidateQueries({ queryKey: ["job"] });
  };

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Job Listing Created", description: "New job posting saved successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error creating job", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateJob(id, data),
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Job Listing Updated", description: "Job listing modified successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error updating job", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Job soft deleted", description: "The job has been moved to Trash." });
      setDeleteConfirmId(null);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error deleting job", description: err.message, variant: "destructive" });
      setDeleteConfirmId(null);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreJob,
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Job restored", description: "The job listing is now active." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error restoring job", description: err.message, variant: "destructive" });
    },
  });

  const permDeleteMutation = useMutation({
    mutationFn: permanentlyDeleteJob,
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Job permanently deleted", description: "The job listing has been removed from database." });
      setPermDeleteConfirmId(null);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error permanently deleting job", description: err.message, variant: "destructive" });
      setPermDeleteConfirmId(null);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteJobs,
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Jobs soft-deleted", description: "Selected jobs moved to Trash." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: bulkRestoreJobs,
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Jobs restored", description: "Selected jobs restored successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkPermDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        await permanentlyDeleteJob(id);
      }
    },
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Jobs permanently deleted", description: "Selected jobs removed from database." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: 'draft' | 'active' | 'closed' }) => bulkUpdateStatus(ids, status),
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Bulk Status Updated", description: "Selected jobs status updated successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const featuredMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => updateJob(id, { featured }),
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Featured Updated", description: "Job featured flag updated." });
    },
    onError: (err: any) => {
      toast({ title: "Error updating featured", description: err.message, variant: "destructive" });
    },
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setDepartment("Engineering");
    setLocation("Remote");
    setEmploymentType("Full-time");
    setExperience("3+ years");
    setSalary("Competitive");
    setDescription("");
    setRequirementsText("");
    setResponsibilitiesText("");
    setBenefitsText("");
    setStatus("draft");
    setDisplayOrder("0");
    setFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    setDepartment(item.department || "Engineering");
    setLocation(item.location || "Remote");
    setEmploymentType(item.employmentType || "Full-time");
    setExperience(item.experience || "3+ years");
    setSalary(item.salary || "Competitive");
    setDescription(item.description || "");
    setRequirementsText((item.requirements || []).join(", "));
    setResponsibilitiesText((item.responsibilities || []).join(", "));
    setBenefitsText((item.benefits || []).join(", "));
    setStatus(item.status || "draft");
    setDisplayOrder(String(item.displayOrder ?? 0));
    setFeatured(item.featured || false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const buildPayload = () => ({
    title,
    department,
    location,
    employmentType,
    experience,
    salary,
    description,
    status,
    displayOrder: Number(displayOrder) || 0,
    featured,
    requirements: requirementsText.split(",").map((s) => s.trim()).filter(Boolean),
    responsibilities: responsibilitiesText.split(",").map((s) => s.trim()).filter(Boolean),
    benefits: benefitsText.split(",").map((s) => s.trim()).filter(Boolean),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleOpenDelete = (item: any) => {
    setDeleteConfirmId(item._id);
    setDeleteConfirmTitle(item.title);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === jobsList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(jobsList.map((x: any) => x._id));
    }
  };

  const isActionPending =
    createMutation.isPending || updateMutation.isPending ||
    deleteMutation.isPending || restoreMutation.isPending ||
    permDeleteMutation.isPending || bulkDeleteMutation.isPending ||
    bulkRestoreMutation.isPending || bulkStatusMutation.isPending ||
    bulkPermDeleteMutation.isPending || featuredMutation.isPending;

  const statusBadgeClass = (value: string) => {
    if (value === "active") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (value === "closed") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-slate-100 text-slate-500 border-slate-200";
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={viewMode === "trash" ? "CMS Trash Bin (Jobs)" : "Jobs CMS"}
        description={viewMode === "trash" ? "Restore or permanently delete removed job postings." : "Create and publish active job postings for the TechVistar careers catalog."}
        actionLabel={viewMode === "trash" ? undefined : "Post Job"}
        onAction={viewMode === "trash" ? undefined : handleOpenCreate}
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input
              placeholder="Search by title, department, location, slug..."
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
                <option value="department">Sort: Department</option>
                <option value="createdAt">Sort: Created Date</option>
                <option value="updatedAt">Sort: Updated Date</option>
                <option value="status">Sort: Status</option>
              </select>
              <button
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold bg-white"
              >
                {sortOrder === "asc" ? "ASC" : "DESC"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Department:
              <select
                value={departmentFilter}
                onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
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
                  <option value="active">Active Only</option>
                  <option value="draft">Drafts Only</option>
                  <option value="closed">Closed Only</option>
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
              setDepartmentFilter("all");
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
          <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="text-xs font-bold text-pink-800">{selectedIds.length} jobs selected</span>
            <div className="flex flex-wrap items-center gap-2">
              {viewMode === "active" ? (
                <>
                  <div className="flex items-center gap-2">
                    <select
                      value={bulkStatusValue}
                      onChange={(e: any) => setBulkStatusValue(e.target.value)}
                      className="h-8 px-2.5 rounded-lg border border-pink-200 bg-white text-xs font-bold focus:outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                    <Button
                      onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: bulkStatusValue })}
                      disabled={isActionPending}
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs font-bold"
                    >
                      Apply Status
                    </Button>
                  </div>
                  <Button onClick={() => bulkDeleteMutation.mutate(selectedIds)} disabled={isActionPending} variant="destructive" size="sm" className="h-8 text-xs font-bold bg-red-600 hover:bg-red-500">
                    Bulk Soft Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => bulkRestoreMutation.mutate(selectedIds)} disabled={isActionPending} variant="outline" size="sm" className="h-8 text-xs font-bold bg-white text-emerald-700 border-emerald-200">
                    Bulk Restore
                  </Button>
                  <Button
                    onClick={() => {
                      if (window.confirm(`Permanently delete ${selectedIds.length} jobs?`)) {
                        bulkPermDeleteMutation.mutate(selectedIds);
                      }
                    }}
                    disabled={isActionPending}
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs font-bold bg-red-600 hover:bg-red-500"
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
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600 mb-4" />
          <h3 className="text-lg font-bold text-red-900 mb-1">Failed to load jobs</h3>
          <p className="text-red-700 text-sm mb-6">{(error as Error)?.message}</p>
        </div>
      ) : jobsList.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsList.map((item: any) => (
              <div key={item._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all group relative">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id)}
                  onChange={() => toggleSelect(item._id)}
                  className="absolute top-4 right-4 w-4.5 h-4.5 accent-emerald-600 cursor-pointer rounded"
                />

                <div className="pr-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                      <BriefcaseBusiness className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order {item.displayOrder ?? 0}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mt-1">
                    {item.department} • {item.location} ({item.employmentType})
                  </span>
                  <p className="text-slate-500 text-sm mt-3 line-clamp-3">{item.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.featured && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[9px] font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${statusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  {viewMode === "trash" && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] space-y-1 text-red-650 bg-red-50/20 p-2 rounded-lg">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Deleted: {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : "N/A"}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> By: {item.deletedBy || "System"}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {viewMode === "active" ? (
                    <>
                      <button
                        onClick={() => featuredMutation.mutate({ id: item._id, featured: !item.featured })}
                        disabled={isActionPending}
                        className="p-2 hover:bg-slate-50 text-slate-400 hover:text-amber-500 rounded-lg transition-colors"
                        title={item.featured ? "Remove featured" : "Mark as featured"}
                      >
                        <Star className={`w-4 h-4 ${item.featured ? "fill-amber-400 text-amber-500" : ""}`} />
                      </button>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)} className="h-8 rounded-lg text-xs font-bold gap-1 border-slate-200">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleOpenDelete(item)} className="h-8 rounded-lg text-xs font-bold gap-1 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 ml-auto">
                      <Button onClick={() => restoreMutation.mutate(item._id)} disabled={isActionPending} variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold gap-1 border-emerald-100 text-emerald-600 hover:bg-emerald-50">
                        Restore
                      </Button>
                      <Button onClick={() => setPermDeleteConfirmId(item._id)} variant="destructive" size="sm" className="h-8 rounded-lg text-xs font-bold gap-1 bg-red-650 hover:bg-red-500">
                        Purge
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-slate-200/60 px-6 py-4 rounded-2xl mt-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === jobsList.length && jobsList.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4.5 h-4.5 accent-emerald-600 cursor-pointer rounded"
                />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select Page Items</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} className="h-9 px-3 rounded-lg border-slate-200">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <span className="text-xs text-slate-500 font-semibold px-2">Page {pagination.page} of {pagination.totalPages}</span>
                <Button variant="outline" size="sm" disabled={currentPage >= pagination.totalPages} onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))} className="h-9 px-3 rounded-lg border-slate-200">
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title={viewMode === "trash" ? "Trash is empty" : "No job listings found"}
          description={viewMode === "trash" ? "Deleted jobs will appear here." : "Click Post Job or modify your search filters to get started."}
          actionLabel={viewMode === "trash" ? undefined : "Create Post"}
          onAction={viewMode === "trash" ? undefined : handleOpenCreate}
        />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Job?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Are you sure you want to delete <strong className="text-slate-800">"{deleteConfirmTitle}"</strong>? It will be moved to the Trash Bin where you can restore it anytime.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="h-10 rounded-xl">Cancel</Button>
              <Button onClick={() => deleteMutation.mutate(deleteConfirmId)} disabled={deleteMutation.isPending} className="bg-red-600 hover:bg-red-500 text-white h-10 rounded-xl px-5 flex items-center gap-1.5 font-bold">
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
              <h3 className="text-lg font-bold text-slate-900">Purge Job Entry?</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">This will permanently delete the record. This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPermDeleteConfirmId(null)} className="h-10 rounded-xl">Cancel</Button>
              <Button onClick={() => permDeleteMutation.mutate(permDeleteConfirmId)} disabled={permDeleteMutation.isPending} className="bg-red-600 hover:bg-red-500 text-white h-10 rounded-xl px-5 flex items-center gap-1.5 font-bold">
                {permDeleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                Purge Record
              </Button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? "Modify Job Listing" : "Create Job Listing"}</h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pt-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Title</label>
                <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Department</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={department} onChange={(e: any) => setDepartment(e.target.value)}>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Employment Type</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={employmentType} onChange={(e: any) => setEmploymentType(e.target.value)}>
                    {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</label>
                  <Input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote, NY" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience</label>
                  <Input required value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 3+ years" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Salary</label>
                  <Input required value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. Competitive" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={status} onChange={(e: any) => setStatus(e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Display Order</label>
                  <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
                </div>
                <div className="flex items-center gap-3 pt-8 pl-1">
                  <input type="checkbox" id="job-featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-emerald-600 rounded cursor-pointer" />
                  <label htmlFor="job-featured" className="text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Featured Job</label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Description</label>
                <textarea required className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 text-sm focus-visible:outline-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide full description of job role..." />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Requirements (Comma-separated)</label>
                <Input value={requirementsText} onChange={(e) => setRequirementsText(e.target.value)} placeholder="e.g. React skill, API design, Node.js" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Responsibilities (Comma-separated)</label>
                <Input value={responsibilitiesText} onChange={(e) => setResponsibilitiesText(e.target.value)} placeholder="e.g. Build features, Write tests" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Benefits (Comma-separated)</label>
                <Input value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} placeholder="e.g. Health care, Flexible working" />
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeModal} className="rounded-xl font-bold h-11 border-slate-200">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold h-11 px-6 shadow-sm gap-2">
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {editingId ? "Save Changes" : "Post Job"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
