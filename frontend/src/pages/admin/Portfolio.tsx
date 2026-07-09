import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { EmptyState } from "@/components/admin/common/EmptyState";
import {
  getAllProjects, createProject, updateProject, deleteProject,
  restoreProject, permanentlyDeleteProject, bulkDeleteProjects, bulkRestoreProjects, bulkUpdateStatus
} from "@/services/portfolio.service";
import { useToast } from "@/hooks/use-toast";
import { IMAGE_MAP } from "@/data/projects";
import { CmsImageField, resolveCmsMediaSrc } from "@/components/admin/common/CmsImageField";
import { RichTextEditor } from "@/components/admin/common/RichTextEditor";
import { normalizeRichContent } from "@/lib/sanitizeHtml";
import { SeoManager } from "@/components/admin/common/SeoManager";
import { seoFromItem, seoToPayload } from "@/lib/seoAdmin";
import { EMPTY_SEO, SeoMetadata } from "@/types/seo";
import { ImageUpload } from "@/components/admin/common/ImageUpload";
import {
  Package, Trash2, Edit, Loader2, X, Plus, AlertCircle, ArrowLeft, ArrowRight,
  Search, RotateCcw, AlertTriangle, Star, ArrowUpNarrowWide, ArrowDownWideNarrow,
  Settings, BookOpen, ImageIcon, Tag, Sparkles, BarChart3, Globe, ShieldCheck, Check, Trash
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

const PORTFOLIO_CATEGORIES = [
  "Mobility & logistics",
  "Data & sustainability",
  "Applied ML",
  "NLP",
  "Productivity AI",
  "Healthcare ML",
  "NLP / GenAI",
  "FinTech",
  "Web App",
];

type ProjectStatus = "Completed" | "In Progress" | "Coming Soon";
type TabName = "general" | "content" | "media" | "caseStudy" | "tech" | "seo" | "preview";

const Portfolio = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Filters & State
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

  // Selection & Bulk Status
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusValue, setBulkStatusValue] = useState<ProjectStatus>("Completed");

  // Modals & Confirmation Dialogs
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
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("Web App");
  const [client, setClient] = useState("Internal");
  const [role, setRole] = useState("Lead Developer");
  const [industry, setIndustry] = useState("Technology");
  const [status, setStatus] = useState<ProjectStatus>("Completed");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [featured, setFeatured] = useState(false);
  
  const [liveUrl, setLiveUrl] = useState("#");
  const [githubUrl, setGithubUrl] = useState("#");
  const [technologiesText, setTechnologiesText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [serviceSlugsText, setServiceSlugsText] = useState("");
  
  // Case Study Lists
  const [challengesText, setChallengesText] = useState("");
  const [keyFeaturesText, setKeyFeaturesText] = useState("");
  const [galleryText, setGalleryText] = useState("");

  // SEO Fields
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
    queryKey: ["admin", "portfolio", {
      page: currentPage,
      search: debouncedSearch,
      status: statusFilter,
      category: categoryFilter,
      trash: viewMode === "trash",
      featured: featuredFilter,
      sortBy,
      sortOrder,
    }],
    queryFn: () => getAllProjects({
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

  const projects = apiResponse?.projects || [];
  const pagination = apiResponse?.pagination || { total: 0, page: 1, limit: itemsPerPage, totalPages: 1 };

  const refreshPortfolioQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "portfolio"] });
    queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
    queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
  };

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      refreshPortfolioQueries();
      toast({ title: "Project Created", description: "New portfolio project published successfully." });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Error creating project", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProject(id, data),
    onSuccess: () => {
      refreshPortfolioQueries();
      toast({ title: "Project Updated", description: "Portfolio project modified successfully." });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Error updating project", description: err.message, variant: "destructive" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ item, featured }: { item: any; featured: boolean }) => updateProject(item._id, { ...item, featured }),
    onMutate: async ({ item, featured }) => {
      const id = item._id;
      await queryClient.cancelQueries({ queryKey: ["admin", "portfolio"] });
      const previousApiResponse = queryClient.getQueryData(["admin", "portfolio", {
        page: currentPage,
        search: debouncedSearch,
        status: statusFilter,
        category: categoryFilter,
        trash: viewMode === "trash",
        featured: featuredFilter,
        sortBy,
        sortOrder
      }]);

      queryClient.setQueryData(
        ["admin", "portfolio", {
          page: currentPage,
          search: debouncedSearch,
          status: statusFilter,
          category: categoryFilter,
          trash: viewMode === "trash",
          featured: featuredFilter,
          sortBy,
          sortOrder
        }],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            projects: old.projects.map((p: any) =>
              p._id === id ? { ...p, featured } : p
            )
          };
        }
      );

      return { previousApiResponse };
    },
    onError: (err, newTodo, context: any) => {
      if (context?.previousApiResponse) {
        queryClient.setQueryData(
          ["admin", "portfolio", {
            page: currentPage,
            search: debouncedSearch,
            status: statusFilter,
            category: categoryFilter,
            trash: viewMode === "trash",
            featured: featuredFilter,
            sortBy,
            sortOrder
          }],
          context.previousApiResponse
        );
      }
      toast({ title: "Error updating featured status", description: err.message, variant: "destructive" });
    },
    onSuccess: () => {
      refreshPortfolioQueries();
      toast({ title: "Featured Status Updated", description: "Project featured status updated successfully." });
    }
  });

  const bulkFeaturedMutation = useMutation({
    mutationFn: async ({ ids, featured }: { ids: string[]; featured: boolean }) => {
      const promises = ids.map(id => {
        const item = projects.find((p: any) => p._id === id);
        if (!item) return Promise.resolve();
        return updateProject(id, { ...item, featured });
      });
      return Promise.all(promises);
    },
    onSuccess: () => {
      refreshPortfolioQueries();
      toast({ title: "Bulk Featured Updated", description: "Selected projects updated successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      refreshPortfolioQueries();
      toast({ title: "Project soft deleted", description: "The project has been moved to Trash." });
      setDeleteConfirmId(null);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error deleting project", description: err.message, variant: "destructive" });
      setDeleteConfirmId(null);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreProject,
    onSuccess: () => {
      refreshPortfolioQueries();
      toast({ title: "Project restored", description: "The project listing is now active." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error restoring project", description: err.message, variant: "destructive" });
    },
  });

  const permDeleteMutation = useMutation({
    mutationFn: permanentlyDeleteProject,
    onSuccess: () => {
      refreshPortfolioQueries();
      toast({ title: "Project permanently deleted", description: "The project has been removed from the database." });
      setPermDeleteConfirmId(null);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error permanently deleting project", description: err.message, variant: "destructive" });
      setPermDeleteConfirmId(null);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteProjects,
    onSuccess: () => {
      refreshPortfolioQueries();
      toast({ title: "Projects soft-deleted", description: "Selected projects moved to Trash." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: bulkRestoreProjects,
    onSuccess: () => {
      refreshPortfolioQueries();
      toast({ title: "Projects restored", description: "Selected projects restored successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status: s }: { ids: string[]; status: ProjectStatus }) => bulkUpdateStatus(ids, s),
    onSuccess: () => {
      refreshPortfolioQueries();
      toast({ title: "Bulk Status Updated", description: "Selected projects status updated successfully." });
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
      title, slug, description, longDescription, thumbnail, category, client, role, industry, status, displayOrder, featured,
      liveUrl, githubUrl, technologiesText, tagsText, serviceSlugsText, challengesText, keyFeaturesText, galleryText, seo
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
    setDescription("");
    setLongDescription("");
    setThumbnail("");
    setCategory("Web App");
    setClient("Internal");
    setRole("Lead Developer");
    setIndustry("Technology");
    setStatus("Completed");
    setDisplayOrder("0");
    setFeatured(false);
    setLiveUrl("#");
    setGithubUrl("#");
    setTechnologiesText("React, Node.js");
    setTagsText("Enterprise, Web App");
    setServiceSlugsText("custom-web-development");
    setChallengesText("High cloud costs\nInconsistent server scaling");
    setKeyFeaturesText("Auto-scaling node clusters\nLive analytics telemetry");
    setGalleryText("");
    setSeo(EMPTY_SEO);
    
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
    setDescription(item.description || "");
    setLongDescription(item.longDescription || "");
    setThumbnail(item.thumbnail || "");
    setCategory(item.category || "Web App");
    setClient(item.client || "Internal");
    setRole(item.role || "Lead Developer");
    setIndustry(item.industry || "Technology");
    setStatus(item.status || "Completed");
    setDisplayOrder(String(item.displayOrder || 0));
    setFeatured(item.featured || false);
    
    setLiveUrl(item.liveUrl || "#");
    setGithubUrl(item.githubUrl || "#");
    setTechnologiesText((item.technologies || []).join(", "));
    setTagsText((item.tags || []).join(", "));
    setServiceSlugsText((item.serviceSlugs || []).join(", "));
    setChallengesText((item.challenges || []).join("\n"));
    setKeyFeaturesText((item.keyFeatures || []).join("\n"));
    setGalleryText((item.gallery || []).join("\n"));
    setSeo(seoFromItem(item));

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
    if (!title.trim()) errors.title = "Title is required.";
    if (!slug.trim()) errors.slug = "Slug path is required.";
    if (!description.trim()) errors.description = "Short description is required.";
    if (!thumbnail.trim()) errors.thumbnail = "Thumbnail URL is required.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!runFormValidation()) {
      toast({ title: "Validation Error", description: "Please complete required fields on all tabs.", variant: "destructive" });
      return;
    }

    const currentDateStr = new Date().toISOString().split("T")[0];
    const payload = {
      title,
      slug,
      description,
      longDescription: normalizeRichContent(longDescription) || description,
      thumbnail,
      category,
      client,
      role,
      industry,
      status,
      date: currentDateStr,
      updatedDate: currentDateStr,
      displayOrder: Number(displayOrder) || 0,
      featured,
      liveUrl,
      githubUrl,
      technologies: technologiesText.split(",").map(t => t.trim()).filter(Boolean),
      tags: tagsText.split(",").map(t => t.trim()).filter(Boolean),
      serviceSlugs: serviceSlugsText.split(",").map(s => s.trim()).filter(Boolean),
      challenges: challengesText.split("\n").map(c => c.trim()).filter(Boolean),
      keyFeatures: keyFeaturesText.split("\n").map(k => k.trim()).filter(Boolean),
      gallery: galleryText.split("\n").map(g => g.trim()).filter(Boolean),
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
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map((x: any) => x._id));
    }
  };

  const handleOpenDelete = (item: any) => {
    setDeleteConfirmId(item._id);
    setDeleteConfirmTitle(item.title);
  };

  const statusBadgeClass = (s: string) => {
    if (s === "Completed") return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    if (s === "In Progress") return "bg-blue-50 text-blue-600 border border-blue-100";
    return "bg-amber-50 text-amber-600 border border-amber-100";
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={viewMode === "trash" ? "CMS Trash Bin" : "Portfolio Projects CMS"}
        description={viewMode === "trash" ? "Restore or permanently delete removed portfolio projects." : "Manage case studies and platform project highlights."}
        actionLabel={viewMode === "trash" ? undefined : "Add Project"}
        onAction={viewMode === "trash" ? undefined : handleOpenCreate}
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input
              placeholder="Search by Title, Category, Technologies..."
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
                All Projects
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
                <option value="date">Sort: Date</option>
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
              Category:
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="all">All Categories</option>
                {PORTFOLIO_CATEGORIES.map((cat) => (
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
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Coming Soon">Coming Soon</option>
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
              {selectedIds.length} projects selected
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
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                    <Button onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: bulkStatusValue })} variant="secondary" size="sm" className="h-8 text-xs font-bold">
                      Apply Status
                    </Button>
                  </div>
                  <Button 
                    onClick={() => bulkFeaturedMutation.mutate({ ids: selectedIds, featured: true })} 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs font-bold border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                    disabled={bulkFeaturedMutation.isPending}
                  >
                    Mark Featured
                  </Button>
                  <Button 
                    onClick={() => bulkFeaturedMutation.mutate({ ids: selectedIds, featured: false })} 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs font-bold border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                    disabled={bulkFeaturedMutation.isPending}
                  >
                    Remove Featured
                  </Button>
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
                      if (window.confirm(`Permanently delete ${selectedIds.length} projects?`)) {
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
        <div 
          className="grid w-full gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}
        >
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
          <h3 className="text-lg font-bold text-red-900 mb-1">Failed to load projects</h3>
          <p className="text-red-700 text-sm mb-6">{(error as Error)?.message}</p>
        </div>
      ) : projects.length > 0 ? (
        <>
          <div 
            className="grid w-full gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}
          >
            {projects.map((item: any) => (
              <div key={item._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all group relative">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id)}
                  onChange={() => toggleSelect(item._id)}
                  className="absolute top-4 right-4 w-4.5 h-4.5 accent-emerald-600 cursor-pointer rounded"
                />

                <div className="pr-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/50 flex items-center justify-center">
                      {item.thumbnail ? (
                        <img src={IMAGE_MAP[item.thumbnail] || item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${statusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">{item.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mt-1">{item.category}</span>
                  <p className="text-slate-500 text-xs mt-3 line-clamp-3 leading-relaxed">{item.description}</p>
                  
                  {/* Toggle & Badges */}
                  <div className="flex items-center justify-between mt-3 gap-2 flex-wrap pt-2 border-t border-slate-50">
                    <div className="flex flex-wrap gap-1.5">
                      {item.featured && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[9px] font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-50 text-slate-500 border border-slate-100">
                        Order: {item.displayOrder ?? 0}
                      </span>
                    </div>

                    {viewMode === "active" && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Featured</span>
                        <Switch 
                          checked={item.featured || false} 
                          disabled={toggleFeaturedMutation.isPending}
                          onCheckedChange={(checked) => {
                            toggleFeaturedMutation.mutate({ item, featured: checked });
                          }}
                        />
                      </div>
                    )}
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
                  checked={selectedIds.length === projects.length && projects.length > 0}
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
          title={viewMode === "trash" ? "Trash is empty" : "No project entries found"}
          description="Click Add Project or modify your search filters to get started."
          actionLabel={viewMode === "trash" ? undefined : "Create Project"}
          onAction={viewMode === "trash" ? undefined : handleOpenCreate}
        />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Project?</h3>
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
              <h3 className="text-lg font-bold text-slate-900">Purge Project Entry?</h3>
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
      )}

      {isModalOpen && createPortal(
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
                <h2 className="text-lg font-bold text-slate-900">{editingId ? "Modify Portfolio Project" : "Add Portfolio Project"}</h2>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Enterprise Content Management</p>
              </div>
              <button type="button" onClick={handleCloseAttempt} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>

            {/* Sticky Tabs Navigation */}
            <div className="flex bg-white px-8 border-b border-slate-200/60 overflow-x-auto gap-2 py-2.5 shrink-0 scrollbar-none">
              {([
                { name: "general", label: "General", icon: Settings },
                { name: "content", label: "Content", icon: BookOpen },
                { name: "media", label: "Media Assets", icon: ImageIcon },
                { name: "caseStudy", label: "Case Study Details", icon: Sparkles },
                { name: "tech", label: "Tech Stack & Tags", icon: Tag },
                { name: "seo", label: "SEO Config", icon: Globe },
                { name: "preview", label: "Preview", icon: ShieldCheck }
              ] as { name: TabName, label: string, icon: any }[]).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                const hasError = activeTab !== tab.name && (
                  (tab.name === "general" && (validationErrors.title || validationErrors.slug)) ||
                  (tab.name === "content" && validationErrors.description) ||
                  (tab.name === "media" && validationErrors.thumbnail)
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
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Project Title *</label>
                        <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AI-driven Fleet Analytics" className="h-10 rounded-lg border-slate-200" />
                        {validationErrors.title && <p className="text-[10px] font-semibold text-red-500">{validationErrors.title}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Category *</label>
                        <select
                          required
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          {PORTFOLIO_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Slug Path *</label>
                          <button
                            type="button"
                            onClick={() => setIsSlugManual(!isSlugManual)}
                            className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 hover:underline"
                          >
                            {isSlugManual ? "Auto Sync" : "Manual Override"}
                          </button>
                        </div>
                        <Input 
                          required 
                          value={slug} 
                          disabled={!isSlugManual} 
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} 
                          placeholder="auto-generated-slug-path" 
                          className="h-10 rounded-lg border-slate-200 font-mono text-xs bg-slate-50/50" 
                        />
                        {validationErrors.slug && <p className="text-[10px] font-semibold text-red-500">{validationErrors.slug}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Display Order</label>
                        <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="h-10 rounded-lg border-slate-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Client / Org</label>
                        <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. DHL Express" className="h-10 rounded-lg border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Project Role</label>
                        <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Lead ML Engineer" className="h-10 rounded-lg border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Target Industry</label>
                        <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Transport & Logistics" className="h-10 rounded-lg border-slate-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live URL</label>
                        <Input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." className="h-10 rounded-lg border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">GitHub Repository Link</label>
                        <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className="h-10 rounded-lg border-slate-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/50 rounded-xl">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project Lifecycle Status</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">Status tag on public listings.</p>
                        </div>
                        <select
                          className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                          value={status}
                          onChange={(e: any) => setStatus(e.target.value)}
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Coming Soon">Coming Soon</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/50 rounded-xl">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Highlight on homepage</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">Pin project to homepage highlights.</p>
                        </div>
                        <Switch checked={featured} onCheckedChange={setFeatured} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Content */}
                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Short Summary Description *</label>
                      <Input required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief one-sentence pitch summary..." className="h-10 rounded-lg border-slate-200" />
                      {validationErrors.description && <p className="text-[10px] font-semibold text-red-500">{validationErrors.description}</p>}
                    </div>

                    <RichTextEditor
                      label="Full Case Study Narrative"
                      value={longDescription}
                      onChange={setLongDescription}
                      placeholder="Provide details about the client's request, core technical architecture, implementation phases, and metrics achieved..."
                      minHeightClassName="min-h-[220px]"
                      helperText="Supports headings, lists, links, code, and more."
                    />
                  </div>
                )}

                {/* Tab 3: Media */}
                {activeTab === "media" && (
                  <div className="space-y-6">
                    <CmsImageField
                      label="Cover Thumbnail *"
                      value={thumbnail}
                      onChange={(url) => {
                        setThumbnail(url);
                        if (url) {
                          setValidationErrors((prev) => {
                            const next = { ...prev };
                            delete next.thumbnail;
                            return next;
                          });
                        }
                      }}
                      helperText="Primary card image on Work / Portfolio listings and related project cards."
                    />
                    {validationErrors.thumbnail && (
                      <p className="text-[10px] font-semibold text-red-500 -mt-4">{validationErrors.thumbnail}</p>
                    )}

                    <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/50 rounded-xl">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Gallery Images
                      </label>
                      <p className="text-[11px] font-medium text-slate-400">
                        Shown on Project Detail. Upload additional images or keep existing Cloudinary / legacy URLs.
                      </p>

                      {galleryText
                        .split("\n")
                        .map((g) => g.trim())
                        .filter(Boolean)
                        .map((url, idx) => {
                          const preview = resolveCmsMediaSrc(url) || url;
                          return (
                            <div
                              key={`${url}-${idx}`}
                              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200"
                            >
                              <div className="h-16 w-24 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                                <img src={preview} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />
                              </div>
                              <Input
                                value={url}
                                onChange={(e) => {
                                  const lines = galleryText.split("\n");
                                  const realIdx = lines
                                    .map((l, i) => ({ l: l.trim(), i }))
                                    .filter((x) => x.l)
                                    .map((x) => x.i)[idx];
                                  if (realIdx === undefined) return;
                                  const next = [...lines];
                                  next[realIdx] = e.target.value;
                                  setGalleryText(next.join("\n"));
                                }}
                                className="h-9 rounded-lg bg-white border-slate-200 font-mono text-[11px] flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const kept = galleryText
                                    .split("\n")
                                    .map((g) => g.trim())
                                    .filter(Boolean)
                                    .filter((_, i) => i !== idx);
                                  setGalleryText(kept.join("\n"));
                                }}
                                className="h-8 rounded-lg text-xs font-bold gap-1.5 border-red-100 text-red-600 hover:bg-red-50 shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove
                              </Button>
                            </div>
                          );
                        })}

                      <ImageUpload
                        label="Add Gallery Image"
                        value=""
                        helperText="Uploads append a new Cloudinary URL to the gallery list."
                        onChange={(data) => {
                          if (!data?.imageUrl) return;
                          const existing = galleryText.split("\n").map((g) => g.trim()).filter(Boolean);
                          setGalleryText([...existing, data.imageUrl].join("\n"));
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Tab 4: Case Study Details */}
                {activeTab === "caseStudy" && (
                  <div className="space-y-6">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/50 space-y-2">
                      <label className="text-[11px] font-extrabold uppercase text-slate-600 tracking-wider">Client Challenges Encountered (One per line)</label>
                      <textarea
                        className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 text-sm focus:outline-none bg-white"
                        value={challengesText}
                        onChange={(e) => setChallengesText(e.target.value)}
                        placeholder="e.g. Complex legacy APIs&#10;High processing latency"
                      />
                    </div>

                    <div className="p-4 bg-emerald-50/20 rounded-xl border border-emerald-100/50 space-y-2">
                      <label className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider">Delivered Key System Features (One per line)</label>
                      <textarea
                        className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 text-sm focus:outline-none bg-white"
                        value={keyFeaturesText}
                        onChange={(e) => setKeyFeaturesText(e.target.value)}
                        placeholder="e.g. Distributed caching tier&#10;Custom real-time visual telemetry boards"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 5: Tech Stack & Tags */}
                {activeTab === "tech" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Core Technologies (Comma-separated)</label>
                      <Input value={technologiesText} onChange={(e) => setTechnologiesText(e.target.value)} placeholder="e.g. Python, PyTorch, Kubernetes" className="h-10 rounded-lg border-slate-200" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tags / Labels (Comma-separated)</label>
                      <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="e.g. Deep Learning, Enterprise, FinTech" className="h-10 rounded-lg border-slate-200" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Connected Services Slugs (Comma-separated)</label>
                      <Input value={serviceSlugsText} onChange={(e) => setServiceSlugsText(e.target.value)} placeholder="e.g. cloud-engineering, machine-learning" className="h-10 rounded-lg border-slate-200" />
                    </div>
                  </div>
                )}

                {/* Tab 6: SEO */}
                {activeTab === "seo" && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                    <SeoManager
                      value={seo}
                      onChange={setSeo}
                      slug={slug}
                      pathPrefix="/work/"
                      defaultTitle={title ? `${title} | TechVistar Portfolio` : ''}
                      defaultDescription={description}
                      defaultImage={thumbnail}
                    />
                  </div>
                )}

                {/* Tab 7: Preview */}
                {activeTab === "preview" && (
                  <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <div className="text-[10px] font-extrabold uppercase text-emerald-650 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Project Listing Preview
                    </div>

                    <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden group">
                      <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-slate-100">
                        {thumbnail ? (
                          <img src={IMAGE_MAP[thumbnail] || thumbnail} alt={title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400"><Package className="w-8 h-8" /></div>
                        )}
                        <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide">{status}</span>
                      </div>
                      
                      <div className="p-5 space-y-3">
                        <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">{category}</span>
                        <h4 className="font-bold text-slate-900 text-base leading-tight mt-1">{title || "Untitled Project"}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{description || "Short description snippet will show here."}</p>
                        
                        {technologiesText && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {technologiesText.split(",").slice(0, 3).map((t, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-semibold">{t.trim()}</span>
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
                  {editingId ? "Save Changes" : "Create Project"}
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
                  You have made modifications to this project. Leaving will discard all unsaved edits. Are you sure you want to exit?
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

export default Portfolio;
