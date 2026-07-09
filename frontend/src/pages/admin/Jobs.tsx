import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  Search, RotateCcw, AlertTriangle, Calendar, User, Settings, BookOpen, ImageIcon, Tag, Sparkles, ShieldCheck, Check,
  ArrowUpNarrowWide, ArrowDownWideNarrow
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CmsImageField } from "@/components/admin/common/CmsImageField";
import { RichTextEditor } from "@/components/admin/common/RichTextEditor";
import { normalizeRichContent, stripHtmlToText } from "@/lib/sanitizeHtml";
import { SeoManager } from "@/components/admin/common/SeoManager";
import { seoFromItem, seoToPayload } from "@/lib/seoAdmin";
import { EMPTY_SEO, SeoMetadata } from "@/types/seo";

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Sales", "Product", "Operations", "Other"] as const;
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;

type JobStatus = "draft" | "active" | "closed";
type TabName = "general" | "content" | "media" | "seo" | "preview";

const Jobs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");
  const [sortBy, setSortBy] = useState("displayOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selection & Bulk Status
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusValue, setBulkStatusValue] = useState<JobStatus>("draft");

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState("");
  const [permDeleteConfirmId, setPermDeleteConfirmId] = useState<string | null>(null);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>("general");

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [department, setDepartment] = useState<typeof DEPARTMENTS[number]>("Engineering");
  const [location, setLocation] = useState("Remote");
  const [employmentType, setEmploymentType] = useState<typeof EMPLOYMENT_TYPES[number]>("Full-time");
  const [experience, setExperience] = useState("3+ years");
  const [salary, setSalary] = useState("Competitive");
  const [status, setStatus] = useState<JobStatus>("draft");
  const [displayOrder, setDisplayOrder] = useState("0");

  // Content Tab (Short & Full Description, Responsibilities, Requirements, Skills/Tags, Benefits)
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [benefitsText, setBenefitsText] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skillsList, setSkillsList] = useState<string[]>([]);

  // Media Tab
  const [bannerImage, setBannerImage] = useState("");
  const [officeImage, setOfficeImage] = useState("");
  const [teamImage, setTeamImage] = useState("");

  // SEO Tab
  const [seo, setSeo] = useState<SeoMetadata>(EMPTY_SEO);

  // Validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [originalDataStr, setOriginalDataStr] = useState("");

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
      setIsModalOpen(false);
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
      setIsModalOpen(false);
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
      toast({ title: "Job permanently deleted", description: "The job has been removed from the database." });
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

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status: s }: { ids: string[]; status: JobStatus }) => bulkUpdateStatus(ids, s),
    onSuccess: () => {
      refreshJobQueries();
      toast({ title: "Bulk Status Updated", description: "Selected jobs status updated successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  // Slug Autogen
  useEffect(() => {
    if (!isSlugManual && title && !editingId) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generated);
    }
  }, [title, isSlugManual, editingId]);

  // Scroll lock
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showUnsavedConfirm) {
          setShowUnsavedConfirm(false);
        } else if (deleteConfirmId) {
          setDeleteConfirmId(null);
        } else if (permDeleteConfirmId) {
          setPermDeleteConfirmId(null);
        } else if (isModalOpen) {
          handleCloseAttempt();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, showUnsavedConfirm, deleteConfirmId, permDeleteConfirmId]);

  const getCurrentStateString = () => {
    return JSON.stringify({
      title, slug, department, location, employmentType, experience, salary, status, displayOrder,
      shortDescription, fullDescription, responsibilitiesText, requirementsText, benefitsText,
      bannerImage, officeImage, teamImage, seo, skillsList
    });
  };

  const isFormDirty = () => {
    if (!isModalOpen) return false;
    return getCurrentStateString() !== originalDataStr;
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setIsSlugManual(false);
    setDepartment("Engineering");
    setLocation("Remote");
    setEmploymentType("Full-time");
    setExperience("3+ years");
    setSalary("Competitive");
    setShortDescription("");
    setFullDescription("");
    setResponsibilitiesText("");
    setRequirementsText("");
    setBenefitsText("");
    setSkillsList(["React", "TypeScript", "Node.js"]);
    setBannerImage("");
    setOfficeImage("");
    setTeamImage("");
    setSeo(EMPTY_SEO);
    setStatus("draft");
    setDisplayOrder("0");
    
    setValidationErrors({});
    setActiveTab("general");

    setTimeout(() => {
      setOriginalDataStr(getCurrentStateString());
    }, 50);

    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    setSlug(item.slug || "");
    setIsSlugManual(true);
    setDepartment(item.department || "Engineering");
    setLocation(item.location || "Remote");
    setEmploymentType(item.employmentType || "Full-time");
    setExperience(item.experience || "3+ years");
    setSalary(item.salary || "Competitive");
    
    // Parse description, fallback to older image parameters
    const desc = item.description || "";
    if (desc.includes("<!-- split -->")) {
      const parts = desc.split("<!-- split -->");
      setShortDescription(parts[0] || "");
      setFullDescription(parts[1] || "");
      setBannerImage(parts[2] || item.bannerImage || "");
      setOfficeImage(parts[3] || "");
      setTeamImage(parts[4] || "");
    } else {
      setShortDescription(desc);
      setFullDescription("");
      setBannerImage(item.bannerImage || "");
      setOfficeImage("");
      setTeamImage("");
    }

    setResponsibilitiesText((item.responsibilities || []).join("\n"));
    setRequirementsText((item.requirements || []).join("\n"));
    setBenefitsText((item.benefits || []).join("\n"));
    setSkillsList(item.requirements || []);
    
    setSeo(seoFromItem(item));
    setStatus(item.status || "draft");
    setDisplayOrder(String(item.displayOrder ?? 0));
    
    setValidationErrors({});
    setActiveTab("general");

    setTimeout(() => {
      setOriginalDataStr(getCurrentStateString());
    }, 50);

    setIsModalOpen(true);
  };

  const handleCloseAttempt = () => {
    if (isFormDirty()) {
      setShowUnsavedConfirm(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const runFormValidation = (): boolean => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = "Job Title is required.";
    if (!slug.trim()) errors.slug = "Slug path is required.";
    if (!shortDescription.trim()) errors.shortDescription = "Short description is required.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skillsList.includes(skillInput.trim())) {
        setSkillsList([...skillsList, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!runFormValidation()) {
      toast({ title: "Validation Error", description: "Please complete required fields on all tabs.", variant: "destructive" });
      return;
    }

    // Pack Short, Full, Banner, Office, Team Image URLs into description
    const combinedDescription = [
      shortDescription.trim(),
      normalizeRichContent(fullDescription),
      bannerImage.trim(),
      officeImage.trim(),
      teamImage.trim()
    ].join("<!-- split -->");

    const payload: any = {
      title,
      slug,
      department,
      location,
      employmentType,
      experience,
      salary,
      description: combinedDescription,
      requirements: skillsList,
      responsibilities: responsibilitiesText.split("\n").map(r => r.trim()).filter(Boolean),
      benefits: benefitsText.split("\n").map(b => b.trim()).filter(Boolean),
      displayOrder: Number(displayOrder) || 0,
      status,
      featured: false,
      bannerImage: bannerImage.trim(), // Keep sync
      ...seoToPayload(seo),
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
    if (selectedIds.length === jobsList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(jobsList.map((x: any) => x._id));
    }
  };

  const handleOpenDelete = (item: any) => {
    setDeleteConfirmId(item._id);
    setDeleteConfirmTitle(item.title);
  };

  const statusBadgeClass = (s: string) => {
    if (s === "active") return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    if (s === "closed") return "bg-red-50 text-red-600 border border-red-100";
    return "bg-slate-100 text-slate-500 border border-slate-200";
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={viewMode === "trash" ? "CMS Trash Bin" : "Careers CMS"}
        description={viewMode === "trash" ? "Restore or permanently delete removed job listings." : "Manage active corporate roles and recruitment campaigns."}
        actionLabel={viewMode === "trash" ? undefined : "Add Job"}
        onAction={viewMode === "trash" ? undefined : handleOpenCreate}
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input
              placeholder="Search by Job Title, Department, Location..."
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
                All Jobs
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
              Department:
              <select
                value={departmentFilter}
                onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
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
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setDepartmentFilter("all");
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
              {selectedIds.length} job listings selected
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
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                    <Button onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: bulkStatusValue })} variant="secondary" size="sm" className="h-8 text-xs font-bold">
                      Apply Status
                    </Button>
                  </div>
                  <Button onClick={() => bulkDeleteMutation.mutate(selectedIds)} variant="destructive" size="sm" className="h-8 text-xs font-bold bg-red-600 hover:bg-red-500">
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
                      if (window.confirm(`Permanently delete ${selectedIds.length} jobs?`)) {
                        selectedIds.forEach((id) => permDeleteMutation.mutate(id));
                      }
                    }}
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
          <h3 className="text-lg font-bold text-red-900 mb-1">Failed to load careers</h3>
          <p className="text-red-700 text-sm mb-6">{(error as Error)?.message}</p>
        </div>
      ) : jobsList.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsList.map((item: any) => {
              // Parse Short Description for preview
              const rawDesc = item.description || "";
              const cleanDesc = rawDesc.includes("<!-- split -->") ? rawDesc.split("<!-- split -->")[0] : rawDesc;
              return (
                <div key={item._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all group relative">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                    className="absolute top-4 right-4 w-4.5 h-4.5 accent-emerald-600 cursor-pointer rounded"
                  />

                  <div className="pr-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <BriefcaseBusiness className="w-5 h-5" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${statusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mt-1">{item.department} • {item.location}</span>
                    <p className="text-slate-500 text-xs mt-3 line-clamp-3 leading-relaxed">{cleanDesc}</p>
                    
                    <div className="flex items-center justify-between mt-3 gap-2 flex-wrap pt-2 border-t border-slate-50">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-50 text-slate-500 border border-slate-100">
                        {item.employmentType}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Order: {item.displayOrder ?? 0}</span>
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
                        <Button variant="outline" size="sm" onClick={() => handleOpenDelete(item)} className="h-8 rounded-lg text-xs font-bold gap-1 border-red-100 text-red-650 hover:bg-red-50 hover:border-red-200">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => restoreMutation.mutate(item._id)} className="h-8 rounded-lg text-xs font-bold gap-1 border-emerald-200 text-emerald-700">
                          <RotateCcw className="w-3.5 h-3.5" /> Restore
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setPermDeleteConfirmId(item._id)} className="h-8 rounded-lg text-xs font-bold gap-1 border-red-100 text-red-650 hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" /> Purge
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length === jobsList.length && jobsList.length > 0}
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
          title={viewMode === "trash" ? "Trash is empty" : "No job entries found"}
          description="Click Add Job or modify your search filters to get started."
          actionLabel={viewMode === "trash" ? undefined : "Create Job"}
          onAction={viewMode === "trash" ? undefined : handleOpenCreate}
        />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Job posting?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Are you sure you want to delete <strong className="text-slate-800">"{deleteConfirmTitle}"</strong>? It will be moved to the Trash Bin where you can restore it anytime.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="h-10 rounded-xl">Cancel</Button>
              <Button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-500 text-white h-10 rounded-xl px-5 flex items-center gap-1.5 font-bold"
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
              <h3 className="text-lg font-bold text-slate-900">Purge Job Posting?</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              This will permanently delete the record. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPermDeleteConfirmId(null)} className="h-10 rounded-xl">Cancel</Button>
              <Button
                onClick={() => permDeleteMutation.mutate(permDeleteConfirmId)}
                disabled={permDeleteMutation.isPending}
                className="bg-red-600 hover:bg-red-500 text-white h-10 rounded-xl px-5 flex items-center gap-1.5 font-bold"
              >
                {permDeleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}      {isModalOpen && createPortal(
        <>
          <div 
            onClick={handleCloseAttempt}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 md:p-6 cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[24px] border border-slate-200 shadow-2xl w-full max-w-[1400px] w-[min(95vw,1400px)] h-[90vh] max-h-[90vh] flex flex-col overflow-hidden text-slate-900 cursor-default"
            >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200/60 bg-white shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingId ? "Modify Job Posting" : "Add Job Posting"}</h2>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Enterprise Content Management</p>
              </div>
              <button type="button" onClick={handleCloseAttempt} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>

            {/* Sticky Tabs Navigation */}
            <div className="flex bg-white px-8 border-b border-slate-200/60 overflow-x-auto gap-2 py-2.5 shrink-0 scrollbar-none">
              {([
                { name: "general", label: "General", icon: Settings },
                { name: "content", label: "Content", icon: BookOpen },
                { name: "media", label: "Media", icon: ImageIcon },
                { name: "seo", label: "SEO Settings", icon: Tag },
                { name: "preview", label: "Preview", icon: ShieldCheck }
              ] as { name: TabName, label: string, icon: any }[]).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                const hasError = activeTab !== tab.name && (
                  (tab.name === "general" && (validationErrors.title || validationErrors.slug)) ||
                  (tab.name === "content" && validationErrors.shortDescription)
                );

                return (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => setActiveTab(tab.name)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shrink-0 border relative ${
                      isActive 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {hasError && (
                      <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto bg-slate-50/40 p-8 custom-scrollbar">
              <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-sm">
                
                {/* Tab 1: General */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Job Title *</label>
                        <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Lead Full Stack Engineer" className="h-10 rounded-lg border-slate-200" />
                        {validationErrors.title && <p className="text-[10px] font-semibold text-red-500">{validationErrors.title}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Department *</label>
                        <select
                          required
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white"
                          value={department}
                          onChange={(e: any) => setDepartment(e.target.value)}
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Employment Type</label>
                        <select
                          required
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white"
                          value={employmentType}
                          onChange={(e: any) => setEmploymentType(e.target.value)}
                        >
                          {EMPLOYMENT_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Location</label>
                        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote, IN" className="h-10 rounded-lg border-slate-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Experience Requirement</label>
                        <Input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 3+ years" className="h-10 rounded-lg border-slate-200" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Display Order</label>
                        <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="h-10 rounded-lg border-slate-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Salary Range</label>
                        <Input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. Competitive" className="h-10 rounded-lg border-slate-200" />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/50 rounded-xl self-end h-10">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Publish Status</span>
                        <select
                          className="h-8 px-2 rounded-lg border border-slate-250 bg-white text-xs font-bold focus:outline-none"
                          value={status}
                          onChange={(e: any) => setStatus(e.target.value)}
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Content */}
                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Short Description (Cards Preview) *</label>
                      <textarea
                        required
                        className="w-full min-h-[80px] p-3 rounded-lg border border-slate-200 text-sm focus:outline-none bg-white font-sans leading-relaxed"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        placeholder="Brief 2-3 sentence overview shown on public career cards..."
                      />
                      {validationErrors.shortDescription && <p className="text-[10px] font-semibold text-red-500">{validationErrors.shortDescription}</p>}
                    </div>

                    <RichTextEditor
                      label="Full Description (Role Details)"
                      value={fullDescription}
                      onChange={setFullDescription}
                      placeholder="Provide details about the role, team environment, and day-to-day operations..."
                      minHeightClassName="min-h-[160px]"
                      helperText="Supports headings, lists, links, and more."
                    />

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Responsibilities (One per line)</label>
                      <textarea
                        className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 text-sm focus:outline-none bg-white leading-relaxed"
                        value={responsibilitiesText}
                        onChange={(e) => setResponsibilitiesText(e.target.value)}
                        placeholder="List candidate key objectives..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Requirements & Qualifications (One per line)</label>
                      <textarea
                        className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 text-sm focus:outline-none bg-white leading-relaxed"
                        value={requirementsText}
                        onChange={(e) => setRequirementsText(e.target.value)}
                        placeholder="List qualifications, degrees, or certifications required..."
                      />
                    </div>

                    <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200/50">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Skills Tags (Press Enter after typing)</label>
                      <div className="flex flex-wrap gap-2 mb-2 p-2 bg-white rounded-lg border border-slate-200 min-h-[44px]">
                        {skillsList.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                            {skill}
                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-emerald-500 hover:text-emerald-800"><X className="w-3.5 h-3.5" /></button>
                          </Badge>
                        ))}
                        {skillsList.length === 0 && <span className="text-xs text-slate-400 self-center pl-1">No tags added yet</span>}
                      </div>
                      <Input 
                        value={skillInput} 
                        onChange={(e) => setSkillInput(e.target.value)} 
                        onKeyDown={handleAddSkill} 
                        placeholder="Add tag (e.g. React) and press Enter" 
                        className="h-9 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Role Perks & Benefits (One per line)</label>
                      <textarea
                        className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 text-sm focus:outline-none bg-white leading-relaxed"
                        value={benefitsText}
                        onChange={(e) => setBenefitsText(e.target.value)}
                        placeholder="e.g. Remote work stipend&#10;Flexible PTO"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 3: Media */}
                {activeTab === "media" && (
                  <div className="space-y-6">
                    <CmsImageField
                      label="Hero / Banner Image"
                      value={bannerImage}
                      onChange={setBannerImage}
                      helperText="Shown on Careers listing cards and Job Detail hero. Falls back to a default Unsplash image if empty."
                    />
                    <CmsImageField
                      label="Office Image (Optional)"
                      value={officeImage}
                      onChange={setOfficeImage}
                      helperText="Shown on Job Detail culture / office section."
                    />
                    <CmsImageField
                      label="Team Collaboration Image (Optional)"
                      value={teamImage}
                      onChange={setTeamImage}
                      helperText="Shown on Job Detail team section."
                    />
                  </div>
                )}

                {/* Tab 4: SEO */}
                {activeTab === "seo" && (
                  <div className="space-y-6">
                    <SeoManager
                      value={seo}
                      onChange={setSeo}
                      slug={slug}
                      pathPrefix="/careers/"
                      defaultTitle={title ? `${title} | TechVistar Careers` : ''}
                      defaultDescription={stripHtmlToText(description).slice(0, 160)}
                      defaultImage={bannerImage}
                    />
                    <div className="space-y-2 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Slug path *</label>
                        <button
                          type="button"
                          onClick={() => setIsSlugManual(!isSlugManual)}
                          className="text-[9px] font-bold uppercase tracking-widest text-emerald-650 hover:underline"
                        >
                          {isSlugManual ? "Auto Sync" : "Manual Override"}
                        </button>
                      </div>
                      <Input 
                        required 
                        value={slug} 
                        disabled={!isSlugManual} 
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} 
                        placeholder="generated-slug-path" 
                        className="h-10 rounded-lg border-slate-200 font-mono text-xs bg-slate-50/50" 
                      />
                      {validationErrors.slug && <p className="text-[10px] font-semibold text-red-500">{validationErrors.slug}</p>}
                    </div>
                  </div>
                )}

                {/* Tab 5: Preview */}
                {activeTab === "preview" && (
                  <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <div className="text-[10px] font-extrabold uppercase text-emerald-650 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Job Card Preview
                    </div>

                    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden group">
                      {bannerImage ? (
                        <div className="h-44 overflow-hidden relative">
                          <img src={bannerImage} alt={title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">No Banner Image</div>
                      )}
                      <div className="p-6 space-y-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">{department}</span>
                            <h3 className="text-lg font-bold text-slate-900 mt-2">{title || "Untitled Job"}</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">{location} • {employmentType}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${statusBadgeClass(status)}`}>
                            {status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{shortDescription || "Short description will appear here."}</p>
                        
                        {skillsList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {skillsList.map((skill, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200/60 rounded text-[9px] font-semibold text-slate-600">{skill}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="px-8 py-4.5 bg-white border-t border-slate-200/60 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isFormDirty() ? (
                  <span className="text-amber-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> You have unsaved changes
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Saved to workspace
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleCloseAttempt} className="rounded-xl font-bold h-10 border-slate-200 bg-white">Cancel</Button>
                <Button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={createMutation.isPending || updateMutation.isPending} 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold h-10 px-5 shadow-md flex items-center gap-1.5"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  {editingId ? "Save Changes" : "Create Job"}
                </Button>
              </div>
            </div>

          </motion.div>
          </div>

          {showUnsavedConfirm && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Unsaved changes</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  You have made modifications to this job. Leaving will discard all unsaved edits. Are you sure you want to exit?
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowUnsavedConfirm(false)} className="h-10 rounded-xl">Keep Editing</Button>
                  <Button onClick={() => { setShowUnsavedConfirm(false); setIsModalOpen(false); }} className="bg-red-600 hover:bg-red-500 text-white h-10 rounded-xl px-5">
                    Discard & Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </div>
  );
};

export default Jobs;
