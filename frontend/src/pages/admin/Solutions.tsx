import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { EmptyState } from "@/components/admin/common/EmptyState";
import {
  getAllSolutions, createSolution, updateSolution, deleteSolution,
  restoreSolution, permanentlyDeleteSolution, bulkDeleteSolutions, bulkRestoreSolutions, bulkUpdateStatus
} from "@/services/solutions.service";
import { useToast } from "@/hooks/use-toast";
import { resolveLucideIcon } from "@/lib/resolveLucideIcon";
import {
  Shapes, Trash2, Edit, Loader2, X, Plus, AlertCircle, ArrowLeft, ArrowRight,
  Search, RotateCcw, AlertTriangle, Star, ArrowUpNarrowWide, ArrowDownWideNarrow,
  Settings, BookOpen, Tag, Sparkles, BarChart3, Globe, ShieldCheck, Check, Trash,
  Image as ImageIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { RichTextEditor } from "@/components/admin/common/RichTextEditor";
import { normalizeRichContent, stripHtmlToText } from "@/lib/sanitizeHtml";
import { CmsImageField } from "@/components/admin/common/CmsImageField";
import { CmsSortableList } from "@/components/admin/common/CmsSortableList";
import { CmsFutureFeatureCallout } from "@/components/admin/common/CmsFutureFeatureCallout";
import { SeoManager } from "@/components/admin/common/SeoManager";
import { seoFromItem, seoToPayload } from "@/lib/seoAdmin";
import { EMPTY_SEO, SeoMetadata } from "@/types/seo";
import {
  SolutionExtendedCmsFields,
  createDefaultExtendedCmsState,
  extendedStateFromItem,
  type SolutionExtendedCmsState,
} from "@/components/admin/solutions/SolutionExtendedCmsFields";

const SOLUTION_CATEGORIES = ["Business Solutions", "AI Solutions", "Digital Solutions"];

type TabName =
  | "general"
  | "hero"
  | "content"
  | "media"
  | "benefits"
  | "features"
  | "process"
  | "tech"
  | "faqs"
  | "industries"
  | "sections"
  | "relations"
  | "seo"
  | "preview";

// Resolves lucide icons dynamically
const renderLucideIcon = (name: string, className = "w-4 h-4") => {
  const IconComponent = resolveLucideIcon(name);
  return <IconComponent className={className} />;
};

const Solutions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search, Pagination & Filter states
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

  // Bulk operations state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusValue, setBulkStatusValue] = useState<"draft" | "active">("active");

  // Modal, Confirm & Dirty states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState("");
  const [permDeleteConfirmId, setPermDeleteConfirmId] = useState<string | null>(null);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>("general");

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [icon, setIcon] = useState("Shapes");
  const [category, setCategory] = useState(SOLUTION_CATEGORIES[0]);
  const [status, setStatus] = useState<"draft" | "active">("active");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [featured, setFeatured] = useState(false);

  // Challenges sub-schema
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengePointsText, setChallengePointsText] = useState("");
  const [challengeImpact, setChallengeImpact] = useState("");

  // Our Solution sub-schema
  const [ourSolutionOverview, setOurSolutionOverview] = useState("");
  const [ourSolutionCapabilitiesText, setOurSolutionCapabilitiesText] = useState("");

  // Benefits sub-schema
  const [benefitRoi, setBenefitRoi] = useState("");
  const [benefitEfficiency, setBenefitEfficiency] = useState("");
  const [benefitScalability, setBenefitScalability] = useState("");
  const [benefitSecurity, setBenefitSecurity] = useState("");

  // Lists sub-schemas
  const [featuresList, setFeaturesList] = useState<{ title: string; description: string; icon: string }[]>([]);
  const [processSteps, setProcessSteps] = useState<{ step: string; title: string; desc: string }[]>([]);
  const [techStackText, setTechStackText] = useState("");
  const [metricsList, setMetricsList] = useState<{ label: string; value: string }[]>([]);
  const [dashboardImage, setDashboardImage] = useState("");
  const [extendedCms, setExtendedCms] = useState<SolutionExtendedCmsState>(createDefaultExtendedCmsState);
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

  const { data: allSolutionsForRelations } = useQuery({
    queryKey: ["admin", "solutions", "all-for-relations"],
    queryFn: () => getAllSolutions({ page: 1, limit: 200, status: "all" }),
    staleTime: 60_000,
  });

  const solutionRelationOptions = (allSolutionsForRelations?.solutions || [])
    .filter((s: { slug?: string; _id?: string }) => s.slug && s._id !== editingId)
    .map((s: { slug: string; title: string }) => ({ slug: s.slug, title: s.title }));

  const patchExtendedCms = (patch: Partial<SolutionExtendedCmsState>) => {
    setExtendedCms((prev) => ({ ...prev, ...patch }));
  };

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
      setIsModalOpen(false);
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
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Error updating solution", description: err.message, variant: "destructive" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ item, featured }: { item: any; featured: boolean }) => updateSolution(item._id, { ...item, featured }),
    onMutate: async ({ item, featured }) => {
      const id = item._id;
      await queryClient.cancelQueries({ queryKey: ["admin", "solutions"] });
      const previousApiResponse = queryClient.getQueryData(["admin", "solutions", {
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
        ["admin", "solutions", {
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
            solutions: old.solutions.map((s: any) =>
              s._id === id ? { ...s, featured } : s
            )
          };
        }
      );

      return { previousApiResponse };
    },
    onError: (err, newTodo, context: any) => {
      if (context?.previousApiResponse) {
        queryClient.setQueryData(
          ["admin", "solutions", {
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
      refreshSolutionsQueries();
      toast({ title: "Featured Status Updated", description: "Solution featured status updated successfully." });
    }
  });

  const bulkFeaturedMutation = useMutation({
    mutationFn: async ({ ids, featured }: { ids: string[]; featured: boolean }) => {
      const promises = ids.map(id => {
        const item = solutions.find((s: any) => s._id === id);
        if (!item) return Promise.resolve();
        return updateSolution(id, { ...item, featured });
      });
      return Promise.all(promises);
    },
    onSuccess: () => {
      refreshSolutionsQueries();
      toast({ title: "Bulk Featured Updated", description: "Selected solutions updated successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    }
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
    mutationFn: ({ ids, status: s }: { ids: string[]; status: "draft" | "active" }) => bulkUpdateStatus(ids, s),
    onSuccess: () => {
      refreshSolutionsQueries();
      toast({ title: "Bulk Status Updated", description: "Selected solutions status updated successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  // Auto-slug generation
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

  // Scroll lock when modal is open
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
      title, slug, subtitle, icon, category, status, displayOrder, featured,
      challengeTitle, challengePointsText, challengeImpact,
      ourSolutionOverview, ourSolutionCapabilitiesText,
      benefitRoi, benefitEfficiency, benefitScalability, benefitSecurity,
      featuresList, processSteps, techStackText, metricsList,
      dashboardImage, extendedCms, seo,
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
    setSubtitle("");
    setIcon("Shapes");
    setCategory(SOLUTION_CATEGORIES[0]);
    setStatus("active");
    setDisplayOrder("0");
    setFeatured(false);
    setChallengeTitle("Challenges Overview");
    setChallengePointsText("Identified business inefficiencies\nLack of automation workflows");
    setChallengeImpact("High operational cost overhead");
    setOurSolutionOverview("Integrated digital capabilities and real-time dashboard tracking");
    setOurSolutionCapabilitiesText("Custom API integration\nAutomated workflow engine");
    setBenefitRoi("Significant efficiency improvement");
    setBenefitEfficiency("Reduces processing delays by 35%");
    setBenefitScalability("Cloud native architecture ready");
    setBenefitSecurity("Standard ISO compliance encryption");
    setFeaturesList([
      { title: "Real-time Monitoring", description: "Observe metric deviations instantly.", icon: "Activity" }
    ]);
    setProcessSteps([
      { step: "01", title: "Discovery", desc: "Audit existing business pipelines." }
    ]);
    setTechStackText("React, Node.js, MongoDB");
    setMetricsList([
      { label: "Cost Savings", value: "30%" }
    ]);
    setDashboardImage("");
    setExtendedCms(createDefaultExtendedCmsState());
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
    setSubtitle(item.subtitle || "");
    setIcon(item.icon || "Shapes");
    setCategory(item.category || SOLUTION_CATEGORIES[0]);
    setStatus(item.status || "active");
    setDisplayOrder(String(item.displayOrder || 0));
    setFeatured(item.featured || false);

    const ch = item.challenges || {};
    setChallengeTitle(ch.title || "");
    setChallengePointsText((ch.points || []).join("\n"));
    setChallengeImpact(ch.impact || "");

    const os = item.ourSolution || {};
    setOurSolutionOverview(os.overview || "");
    setOurSolutionCapabilitiesText((os.capabilities || []).join("\n"));

    const ben = item.benefits || {};
    setBenefitRoi(ben.roi || "");
    setBenefitEfficiency(ben.efficiency || "");
    setBenefitScalability(ben.scalability || "");
    setBenefitSecurity(ben.security || "");

    setFeaturesList(item.features || []);
    setProcessSteps(item.howItWorks || []);
    setTechStackText((item.techStack || []).join(", "));
    setMetricsList(item.metrics || []);
    setDashboardImage(item.dashboardImage || "");
    setExtendedCms(extendedStateFromItem(item));
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
    if (!slug.trim()) errors.slug = "Slug URL is required.";
    if (!subtitle.trim()) errors.subtitle = "Subtitle is required.";
    if (!challengeTitle.trim()) errors.challengeTitle = "Challenge overview title is required.";
    if (!stripHtmlToText(ourSolutionOverview)) errors.ourSolutionOverview = "Our solution overview is required.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!runFormValidation()) {
      toast({ title: "Validation Error", description: "Please complete required fields on all tabs.", variant: "destructive" });
      return;
    }

    const payload = {
      title,
      slug,
      subtitle,
      icon,
      category,
      status,
      displayOrder: Number(displayOrder) || 0,
      featured,
      challenges: {
        title: challengeTitle,
        points: challengePointsText.split("\n").map(p => p.trim()).filter(Boolean),
        impact: challengeImpact
      },
      ourSolution: {
        overview: normalizeRichContent(ourSolutionOverview),
        capabilities: ourSolutionCapabilitiesText.split("\n").map(c => c.trim()).filter(Boolean)
      },
      benefits: {
        roi: benefitRoi,
        efficiency: benefitEfficiency,
        scalability: benefitScalability,
        security: benefitSecurity
      },
      features: featuresList,
      howItWorks: processSteps,
      techStack: techStackText.split(",").map(t => t.trim()).filter(Boolean),
      metrics: metricsList,
      dashboardImage,
      heroDescription: normalizeRichContent(extendedCms.heroDescription),
      heroBadge: extendedCms.heroBadge,
      backLinkText: extendedCms.backLinkText,
      heroFloatingCards: extendedCms.heroFloatingCards,
      heroStats: extendedCms.heroStats,
      sectionCopy: extendedCms.sectionCopy,
      industries: extendedCms.industriesList,
      faqs: extendedCms.faqsList,
      relatedSolutionSlugs: extendedCms.relatedSolutionSlugs,
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
                      if (window.confirm(`Permanently delete ${selectedIds.length} solutions?`)) {
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
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      {renderLucideIcon(item.icon, "w-5 h-5")}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">{item.category}</span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mt-2">{item.subtitle}</p>
                  
                  {/* Meta Chips & Toggle */}
                  <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                    <div className="flex flex-wrap gap-1.5">
                      {item.featured && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[9px] font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border border-slate-200 ${statusBadgeClass(item.status)}`}>
                        {item.status}
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
                <h2 className="text-lg font-bold text-slate-900">{editingId ? "Modify Solution Listing" : "Add Solution Listing"}</h2>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Enterprise Content Management</p>
              </div>
              <button type="button" onClick={handleCloseAttempt} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>

            {/* Sticky Tabs Navigation */}
            <div className="flex bg-white px-8 border-b border-slate-200/60 overflow-x-auto gap-2 py-2.5 shrink-0 scrollbar-none">
              {([
                { name: "general", label: "General", icon: Settings },
                { name: "hero", label: "Hero", icon: Sparkles },
                { name: "content", label: "Content", icon: BookOpen },
                { name: "media", label: "Media", icon: ImageIcon },
                { name: "benefits", label: "Benefits", icon: Tag },
                { name: "features", label: "Features", icon: Tag },
                { name: "process", label: "Process", icon: Sparkles },
                { name: "tech", label: "Tech & Metrics", icon: BarChart3 },
                { name: "faqs", label: "FAQs", icon: BookOpen },
                { name: "industries", label: "Industries", icon: Globe },
                { name: "sections", label: "Sections", icon: Settings },
                { name: "relations", label: "Relations", icon: ArrowRight },
                { name: "seo", label: "SEO", icon: Globe },
                { name: "preview", label: "Preview", icon: ShieldCheck }
              ] as { name: TabName, label: string, icon: any }[]).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                const hasError = activeTab !== tab.name && (
                  (tab.name === "general" && (validationErrors.title || validationErrors.slug)) ||
                  (tab.name === "content" && (validationErrors.subtitle || validationErrors.challengeTitle || validationErrors.ourSolutionOverview))
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

            {/* Modal Body (Scrollable Content Container) */}
            <div className="flex-1 overflow-y-auto bg-slate-50/40 p-8 custom-scrollbar">
              <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-sm">
                
                {/* Tab 1: General */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Solution Title *</label>
                        <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cybersecurity Solutions" className="h-10 rounded-lg border-slate-200" />
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
                          {SOLUTION_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">Slug Path *</label>
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

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/50 rounded-xl">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Publish Status</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Control visibility on the public platform.
                          </p>
                        </div>
                        <select
                          className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                          value={status}
                          onChange={(e: any) => setStatus(e.target.value)}
                        >
                          <option value="draft">Draft (CMS only)</option>
                          <option value="active">Active (Public)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/50 rounded-xl">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Featured Offering</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Promote to homepage highlights.
                          </p>
                        </div>
                        <Switch checked={featured} onCheckedChange={setFeatured} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Lucide Icon Class</label>
                      <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. Shield, Shapes, Activity" className="h-10 rounded-lg border-slate-200 font-mono text-xs" />
                    </div>
                  </div>
                )}

                {/* Tab: Hero */}
                {activeTab === "hero" && (
                  <SolutionExtendedCmsFields
                    activeTab="hero"
                    state={extendedCms}
                    onChange={patchExtendedCms}
                    allSolutionOptions={solutionRelationOptions}
                  />
                )}

                {/* Tab 2: Content */}
                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Subtitle Headline *</label>
                      <Input required value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Leading secure framework implementation for modern business" className="h-10 rounded-lg border-slate-200" />
                      {validationErrors.subtitle && <p className="text-[10px] font-semibold text-red-500">{validationErrors.subtitle}</p>}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/50 space-y-4">
                      <CmsFutureFeatureCallout>
                        Challenges content is saved to the database but is not rendered on public solution detail pages
                        yet. Hero stats in the Solution CMS tab are live; this separate challenges block is deferred.
                      </CmsFutureFeatureCallout>
                      <h4 className="text-xs font-extrabold uppercase text-slate-650 tracking-wider">Challenges Managed</h4>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Challenge Overview Title *</label>
                        <Input required value={challengeTitle} onChange={(e) => setChallengeTitle(e.target.value)} placeholder="e.g. Core Operational Hurdles" className="h-10 rounded-lg bg-white border-slate-200" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Specific Challenges (One per line)</label>
                        <textarea
                          className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none"
                          value={challengePointsText}
                          onChange={(e) => setChallengePointsText(e.target.value)}
                          placeholder="e.g. Outdated infrastructure&#10;Lack of automation workflows"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Business Impact Narrative</label>
                        <Input value={challengeImpact} onChange={(e) => setChallengeImpact(e.target.value)} placeholder="e.g. Leading to 20% annual productivity decline" className="h-10 rounded-lg bg-white border-slate-200" />
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-100 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider">Our Solution Outline</h4>

                      <RichTextEditor
                        label="Solution Overview Narrative"
                        required
                        value={ourSolutionOverview}
                        onChange={setOurSolutionOverview}
                        placeholder="Describe how this offering resolves challenges..."
                        minHeightClassName="min-h-[120px]"
                        error={validationErrors.ourSolutionOverview}
                      />

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Capabilities (One per line)</label>
                        <textarea
                          className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none"
                          value={ourSolutionCapabilitiesText}
                          onChange={(e) => setOurSolutionCapabilitiesText(e.target.value)}
                          placeholder="e.g. Seamless API Gateway&#10;Multi-region replication"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Media */}
                {activeTab === "media" && (
                  <div className="space-y-6">
                    <CmsImageField
                      label="Hero Dashboard Image"
                      value={dashboardImage}
                      onChange={setDashboardImage}
                      helperText="Dashboard mockup shown in the hero section (JPG, PNG, WEBP — max 5 MB)"
                    />
                  </div>
                )}

                {/* Tab 3: Benefits */}
                {activeTab === "benefits" && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-extrabold uppercase text-slate-650 tracking-wider">Core Benefits Assessment</h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ROI / Return on Investment</label>
                        <Input value={benefitRoi} onChange={(e) => setBenefitRoi(e.target.value)} placeholder="e.g. 150% average ROI within first 6 months" className="h-10 rounded-lg border-slate-200" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Operational Efficiency</label>
                        <Input value={benefitEfficiency} onChange={(e) => setBenefitEfficiency(e.target.value)} placeholder="e.g. Eliminates manual entry processing time by 40%" className="h-10 rounded-lg border-slate-200" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Scalability</label>
                        <Input value={benefitScalability} onChange={(e) => setBenefitScalability(e.target.value)} placeholder="e.g. Autoscale capability to support 10x traffic surges" className="h-10 rounded-lg border-slate-200" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Security & Compliance Protection</label>
                        <Input value={benefitSecurity} onChange={(e) => setBenefitSecurity(e.target.value)} placeholder="e.g. End-to-end encryption with standard SOC2 audits" className="h-10 rounded-lg border-slate-200" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Features */}
                {activeTab === "features" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="text-xs font-extrabold uppercase text-slate-650 tracking-wider">Key Features Checklist</h4>
                      <Button
                        type="button"
                        onClick={() => setFeaturesList([...featuresList, { title: "New Feature", description: "Describe feature details", icon: "Tag" }])}
                        variant="outline"
                        size="sm"
                        className="h-8.5 rounded-lg border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Feature Item
                      </Button>
                    </div>

                    <CmsSortableList
                      items={featuresList}
                      onChange={setFeaturesList}
                      onDuplicate={(item) => ({ ...item, title: `${item.title} (copy)` })}
                      renderItem={(feature, idx) => (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Feature Title</label>
                              <Input
                                value={feature.title}
                                onChange={(e) => {
                                  const newList = [...featuresList];
                                  newList[idx].title = e.target.value;
                                  setFeaturesList(newList);
                                }}
                                className="h-9 rounded-lg bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Icon Class</label>
                              <Input
                                value={feature.icon}
                                onChange={(e) => {
                                  const newList = [...featuresList];
                                  newList[idx].icon = e.target.value;
                                  setFeaturesList(newList);
                                }}
                                className="h-9 rounded-lg bg-white border-slate-200 font-mono text-xs"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
                            <Input
                              value={feature.description}
                              onChange={(e) => {
                                const newList = [...featuresList];
                                newList[idx].description = e.target.value;
                                setFeaturesList(newList);
                              }}
                              className="h-9 rounded-lg bg-white border-slate-200"
                            />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* Tab 5: Process */}
                {activeTab === "process" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="text-xs font-extrabold uppercase text-slate-650 tracking-wider">How It Works Steps</h4>
                      <Button
                        type="button"
                        onClick={() => setProcessSteps([...processSteps, { step: `0${processSteps.length + 1}`, title: "New Phase", desc: "Phase description" }])}
                        variant="outline"
                        size="sm"
                        className="h-8.5 rounded-lg border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Step
                      </Button>
                    </div>

                    <CmsSortableList
                      items={processSteps}
                      onChange={setProcessSteps}
                      onDuplicate={(item) => ({ ...item, title: `${item.title} (copy)` })}
                      renderItem={(stepItem, idx) => (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Index/Step</label>
                            <Input
                              value={stepItem.step}
                              onChange={(e) => {
                                const newList = [...processSteps];
                                newList[idx].step = e.target.value;
                                setProcessSteps(newList);
                              }}
                              className="h-9 rounded-lg bg-white border-slate-200 font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title</label>
                            <Input
                              value={stepItem.title}
                              onChange={(e) => {
                                const newList = [...processSteps];
                                newList[idx].title = e.target.value;
                                setProcessSteps(newList);
                              }}
                              className="h-9 rounded-lg bg-white border-slate-200"
                            />
                          </div>
                          <div className="space-y-1 col-span-3">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
                            <Input
                              value={stepItem.desc}
                              onChange={(e) => {
                                const newList = [...processSteps];
                                newList[idx].desc = e.target.value;
                                setProcessSteps(newList);
                              }}
                              className="h-9 rounded-lg bg-white border-slate-200"
                            />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* Tab 6: Tech & Metrics */}
                {activeTab === "tech" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tech Stack (Comma-separated)</label>
                      <Input value={techStackText} onChange={(e) => setTechStackText(e.target.value)} placeholder="e.g. React, Node.js, AWS, Docker" className="h-10 rounded-lg border-slate-200" />
                    </div>

                    <CmsFutureFeatureCallout>
                      Metrics highlights are saved but not shown on public solution detail pages. Use Hero Stats in the
                      Solution CMS tab for live metrics on the solution hero.
                    </CmsFutureFeatureCallout>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 pt-4">
                      <h4 className="text-xs font-extrabold uppercase text-slate-650 tracking-wider">Metrics Highlights</h4>
                      <Button
                        type="button"
                        onClick={() => setMetricsList([...metricsList, { label: "Performance", value: "99%" }])}
                        variant="outline"
                        size="sm"
                        className="h-8.5 rounded-lg border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Metric
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <CmsSortableList
                        items={metricsList}
                        onChange={setMetricsList}
                        onDuplicate={(item) => ({ ...item, label: `${item.label} (copy)` })}
                        renderItem={(m, idx) => (
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              value={m.label}
                              onChange={(e) => {
                                const newList = [...metricsList];
                                newList[idx].label = e.target.value;
                                setMetricsList(newList);
                              }}
                              placeholder="Metric label"
                              className="h-9 bg-white border-slate-200"
                            />
                            <Input
                              value={m.value}
                              onChange={(e) => {
                                const newList = [...metricsList];
                                newList[idx].value = e.target.value;
                                setMetricsList(newList);
                              }}
                              placeholder="Value (e.g. 99% or $1.5M)"
                              className="h-9 bg-white border-slate-200"
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )}

                {["faqs", "industries", "sections", "relations"].includes(activeTab) && (
                  <SolutionExtendedCmsFields
                    activeTab={activeTab}
                    state={extendedCms}
                    onChange={patchExtendedCms}
                    allSolutionOptions={solutionRelationOptions}
                  />
                )}

                {activeTab === "seo" && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                    <SeoManager
                      value={seo}
                      onChange={setSeo}
                      slug={slug}
                      pathPrefix="/solutions/"
                      defaultTitle={title ? `${title} | TechVistar Solutions` : ''}
                      defaultDescription={stripHtmlToText(extendedCms.heroDescription) || subtitle}
                      defaultImage={dashboardImage}
                    />
                  </div>
                )}

                {/* Tab 7: Preview */}
                {activeTab === "preview" && (
                  <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <div className="text-[10px] font-extrabold uppercase text-emerald-650 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Live Preview
                    </div>

                    <div className="w-full max-w-xl bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl p-6 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                          {renderLucideIcon(icon, "w-6 h-6")}
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">{category}</span>
                          <h3 className="text-lg font-bold text-white mt-2">{title || "Untitled Solution"}</h3>
                          <p className="text-slate-400 text-xs leading-relaxed mt-1">{subtitle || "Provide a subtitled marketing tagline description."}</p>
                        </div>
                      </div>

                      {techStackText && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                          {techStackText.split(",").map((t, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-800/80 text-[10px] font-bold rounded text-slate-300 border border-slate-700/50">{t.trim()}</span>
                          ))}
                        </div>
                      )}

                      {metricsList.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                          {metricsList.map((m, i) => (
                            <div key={i} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
                              <div className="text-xl font-extrabold text-emerald-400">{m.value}</div>
                              <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{m.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="px-8 py-4.5 bg-white border-t border-slate-200/60 backdrop-blur flex justify-between items-center shrink-0">
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
                  {editingId ? "Save Changes" : "Create Solution"}
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
                  You have made modifications to this solution. Leaving will discard all unsaved edits. Are you sure you want to exit?
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

export default Solutions;
