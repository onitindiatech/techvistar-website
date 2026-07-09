import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { 
  getAllIndustries, createIndustry, updateIndustry, deleteIndustry,
  restoreIndustry, permanentlyDeleteIndustry, bulkDeleteIndustries, bulkRestoreIndustries, bulkUpdateStatus
} from "@/services/industry.service";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";
import { 
  Trash2, Edit, Loader2, X, Plus, AlertCircle, Trash, ArrowLeft, ArrowRight,
  ChevronDown, ChevronUp, Image as ImageIcon, Sparkles, BookOpen, BarChart3, Globe, Settings, Tag, ShieldCheck, Check,
  ArrowUpRight, Search, RotateCcw, AlertTriangle, Info, Calendar, User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { IMAGE_MAP } from "@/data/services";
import { CmsImageField } from "@/components/admin/common/CmsImageField";
import { RichTextEditor } from "@/components/admin/common/RichTextEditor";
import { normalizeRichContent, stripHtmlToText } from "@/lib/sanitizeHtml";
import { SeoManager } from "@/components/admin/common/SeoManager";
import { seoFromItem, seoToPayload } from "@/lib/seoAdmin";
import { EMPTY_SEO, SeoMetadata } from "@/types/seo";

type TabName = "general" | "content" | "media" | "features" | "stats" | "process" | "seo" | "preview";

const SUPPORTED_ICONS = [
  "Rocket", "Shield", "Star", "Clock", "Brain", "Database", "Globe", "Smartphone", 
  "Palette", "Cpu", "Cloud", "Workflow", "Zap", "Code", "Server", "Layers", "Boxes", "Briefcase"
];

const COLOR_PALETTES = [
  { name: "Green", value: "green", bg: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-200" },
  { name: "Blue", value: "blue", bg: "bg-blue-500", text: "text-blue-700", border: "border-blue-200" },
  { name: "Purple", value: "purple", bg: "bg-purple-500", text: "text-purple-700", border: "border-purple-200" },
  { name: "Gold", value: "gold", bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-200" },
  { name: "Red", value: "red", bg: "bg-red-500", text: "text-red-700", border: "border-red-200" },
  { name: "Orange", value: "orange", bg: "bg-orange-500", text: "text-orange-700", border: "border-orange-200" },
  { name: "Gray", value: "gray", bg: "bg-slate-500", text: "text-slate-700", border: "border-slate-200" }
];

const renderLucideIcon = (name: string, className = "w-4 h-4") => {
  const IconComponent = (LucideIcons as any)[name];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <LucideIcons.HelpCircle className={className} />;
};

const Industries = () => {
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
  const [bulkStatusValue, setBulkStatusValue] = useState<"draft" | "active">("draft");
  
  // Modal, Confirm & Dirty states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState("");
  const [permDeleteConfirmId, setPermDeleteConfirmId] = useState<string | null>(null);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>("general");
  
  // Form fields state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [icon, setIcon] = useState("Rocket");
  const [category, setCategory] = useState("Industrial");
  const [overview, setOverview] = useState("");
  const [overviewQuote, setOverviewQuote] = useState("");
  const [status, setStatus] = useState<"draft" | "active">("draft");
  const [displayOrder, setDisplayOrder] = useState("0");
  
  // Rich CMS fields
  const [coverImage, setCoverImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [seo, setSeo] = useState<SeoMetadata>(EMPTY_SEO);
  const [cta, setCta] = useState("");
  const [featured, setFeatured] = useState(false);
  const [dashboardImage, setDashboardImage] = useState("");

  // Audit history states
  const [auditInfo, setAuditInfo] = useState<{
    createdBy?: string;
    updatedBy?: string;
    deletedBy?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  }>({});

  // Tag arrays states
  const [features, setFeatures] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [offerings, setOfferings] = useState<string[]>([]);

  // Array inputs states
  const [featureInput, setFeatureInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [offeringInput, setOfferingInput] = useState("");

  // Complex sub-docs states
  const [processSteps, setProcessSteps] = useState<{ step: number; title: string; description: string }[]>([]);
  const [statsList, setStatsList] = useState<{ value: string; label: string; iconType: string; colorTheme: string }[]>([]);

  // Icon Picker searchable dropdown state
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);

  // Validation messages state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Accordion active indexes
  const [activeStepAccordion, setActiveStepAccordion] = useState<number | null>(null);

  // Original state (for dirty checks)
  const [originalDataStr, setOriginalDataStr] = useState("");

  // Debounced search logic (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Industries via React Query using backend pagination & advanced filters
  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "industries", { 
      page: currentPage, 
      search: debouncedSearch, 
      status: statusFilter, 
      category: categoryFilter,
      trash: viewMode === "trash",
      featured: featuredFilter,
      sortBy,
      sortOrder
    }],
    queryFn: async () => {
      const response = await getAllIndustries({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        status: statusFilter,
        category: categoryFilter,
        trash: viewMode === "trash",
        featured: featuredFilter,
        sortBy,
        sortOrder
      });
      return response;
    }
  });

  const industriesList = apiResponse?.industries || [];
  const pagination = apiResponse?.pagination || { total: 0, page: 1, limit: itemsPerPage, totalPages: 1 };

  const refreshIndustryQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "industries"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "industries", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["activeIndustries"] });
    queryClient.invalidateQueries({ queryKey: ["industryDetails"] });
  };

  // Fetch all industries to check slug uniqueness locally (only when form modal is open)
  const { data: allIndustriesRes } = useQuery({
    queryKey: ["admin", "industries", "all"],
    queryFn: () => getAllIndustries({ page: 1, limit: 1000 }),
    enabled: isModalOpen,
  });
  const allIndustries = allIndustriesRes?.industries || [];

  // Mutators
  const createMutation = useMutation({
    mutationFn: createIndustry,
    onSuccess: () => {
      refreshIndustryQueries();
      toast({ title: "Industry Created", description: "New industry listing published successfully." });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Error creating industry", description: err.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateIndustry(id, data),
    onSuccess: () => {
      refreshIndustryQueries();
      toast({ title: "Industry Updated", description: "Industry listing modified successfully." });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Error updating industry", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIndustry,
    onSuccess: () => {
      refreshIndustryQueries();
      toast({ title: "Industry soft deleted", description: "The industry has been moved to Trash." });
      setDeleteConfirmId(null);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error deleting industry", description: err.message, variant: "destructive" });
      setDeleteConfirmId(null);
    }
  });

  const restoreMutation = useMutation({
    mutationFn: restoreIndustry,
    onSuccess: () => {
      refreshIndustryQueries();
      toast({ title: "Industry restored", description: "The industry listing is now active." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error restoring industry", description: err.message, variant: "destructive" });
    }
  });

  const permDeleteMutation = useMutation({
    mutationFn: permanentlyDeleteIndustry,
    onSuccess: () => {
      refreshIndustryQueries();
      toast({ title: "Industry permanently deleted", description: "The industry listing has been removed from database." });
      setPermDeleteConfirmId(null);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error permanently deleting industry", description: err.message, variant: "destructive" });
      setPermDeleteConfirmId(null);
      setSelectedIds([]);
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteIndustries,
    onSuccess: () => {
      refreshIndustryQueries();
      toast({ title: "Industries soft-deleted", description: "Selected industries moved to Trash." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    }
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: bulkRestoreIndustries,
    onSuccess: () => {
      refreshIndustryQueries();
      toast({ title: "Industries restored", description: "Selected industries restored successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    }
  });

  const bulkPermDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        await permanentlyDeleteIndustry(id);
      }
    },
    onSuccess: () => {
      refreshIndustryQueries();
      toast({ title: "Industries permanently deleted", description: "Selected industries removed from database." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    }
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: 'draft' | 'active' }) => bulkUpdateStatus(ids, status),
    onSuccess: () => {
      refreshIndustryQueries();
      toast({ title: "Bulk Status Updated", description: "Selected industries status updated successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    }
  });

  // Slug Auto-generation logic
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

  // Form dirty checker logic
  const getCurrentStateString = () => {
    return JSON.stringify({
      title, slug, shortDescription, fullDescription, icon, category, overview, overviewQuote, status, displayOrder,
      coverImage, thumbnail, seo, cta, featured, dashboardImage,
      features, technologies, benefits, industries, offerings, processSteps, statsList
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
    setShortDescription("");
    setFullDescription("");
    setIcon("Rocket");
    setCategory("Industrial");
    setOverview("");
    setOverviewQuote("");
    setStatus("draft");
    setDisplayOrder("0");
    setCoverImage("");
    setThumbnail("");
    setSeo(EMPTY_SEO);
    setCta("");
    setFeatured(false);
    setDashboardImage("");
    setFeatures([]);
    setTechnologies([]);
    setBenefits([]);
    setIndustries([]);
    setOfferings([]);
    setProcessSteps([]);
    setStatsList([]);
    setValidationErrors({});
    setAuditInfo({});
    setActiveTab("general");
    
    // Set baseline state
    setTimeout(() => {
      setOriginalDataStr(JSON.stringify({
        title: "", slug: "", shortDescription: "", fullDescription: "", icon: "Rocket", category: "Industrial",
        overview: "", overviewQuote: "", status: "draft", displayOrder: "0", coverImage: "", thumbnail: "", seo: EMPTY_SEO,
        cta: "", featured: false, dashboardImage: "", features: [], technologies: [], benefits: [], industries: [], offerings: [],
        processSteps: [], statsList: []
      }));
    }, 50);

    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    setSlug(item.slug || "");
    setIsSlugManual(true);
    setShortDescription(item.shortDescription || "");
    setFullDescription(item.fullDescription || "");
    setIcon(item.icon || "Rocket");
    setCategory(item.category || "Industrial");
    setOverview(item.overview || "");
    setOverviewQuote(item.overviewQuote || "");
    setStatus(item.status || "draft");
    setDisplayOrder(String(item.displayOrder || 0));
    setCoverImage(item.coverImage || "");
    setThumbnail(item.thumbnail || "");
    setSeo(seoFromItem(item));
    setCta(item.ctaLabel || item.cta || "");
    setFeatured(item.featured || false);
    setDashboardImage(item.dashboardImage || "");
    setFeatures(item.features || []);
    setTechnologies(item.technologies || []);
    setBenefits(item.benefits || []);
    setIndustries(item.industries || []);
    setOfferings(item.offerings || []);
    setProcessSteps(item.process || []);
    setStatsList(item.stats || []);
    setValidationErrors({});
    
    // Set audit info
    setAuditInfo({
      createdBy: item.createdBy,
      updatedBy: item.updatedBy,
      deletedBy: item.deletedBy,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      deletedAt: item.deletedAt
    });

    setActiveTab("general");

    setTimeout(() => {
      setOriginalDataStr(JSON.stringify({
        title: item.title || "", slug: item.slug || "", shortDescription: item.shortDescription || "",
        fullDescription: item.fullDescription || "", icon: item.icon || "Rocket", category: item.category || "Industrial",
        overview: item.overview || "", overviewQuote: item.overviewQuote || "", status: item.status || "draft", displayOrder: String(item.displayOrder || 0),
        coverImage: item.coverImage || "", thumbnail: item.thumbnail || "", seo: seoFromItem(item), cta: item.ctaLabel || item.cta || "", featured: item.featured || false,
        dashboardImage: item.dashboardImage || "", features: item.features || [], technologies: item.technologies || [],
        benefits: item.benefits || [], industries: item.industries || [], offerings: item.offerings || [],
        processSteps: item.process || [], statsList: item.stats || []
      }));
    }, 50);

    setIsModalOpen(true);
  };

  // Scroll locking effect
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

  const handleCloseAttempt = () => {
    if (isFormDirty()) {
      setShowUnsavedConfirm(true);
    } else {
      setIsModalOpen(false);
    }
  };

  // Inline validation checks
  const runFormValidation = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) errors.title = "Industry Title is required.";
    if (!slug.trim()) errors.slug = "Slug URL is required.";
    if (!category.trim()) errors.category = "Category is required.";
    if (!shortDescription.trim()) errors.shortDescription = "Short description is required.";
    if (!stripHtmlToText(overview)) errors.overview = "Overview narrative is required.";
    if (!stripHtmlToText(fullDescription)) errors.fullDescription = "Full description is required.";

    // Check duplicate stats
    const statLabels = statsList.map(s => s.label.trim().toLowerCase());
    if (new Set(statLabels).size !== statLabels.length) {
      errors.stats = "Duplicate statistics labels found.";
    }

    // Check duplicate process steps
    const stepTitles = processSteps.map(p => p.title.trim().toLowerCase());
    if (new Set(stepTitles).size !== stepTitles.length) {
      errors.process = "Duplicate methodology stages found.";
    }

    // Check empty stats or steps
    if (statsList.some(s => !s.value.trim() || !s.label.trim())) {
      errors.stats = "Stat value and label cannot be blank.";
    }
    if (processSteps.some(p => !p.title.trim() || !p.description.trim())) {
      errors.process = "Methodology title and description cannot be blank.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isActionPending =
    createMutation.isPending || updateMutation.isPending ||
    deleteMutation.isPending || restoreMutation.isPending ||
    permDeleteMutation.isPending || bulkDeleteMutation.isPending ||
    bulkRestoreMutation.isPending || bulkStatusMutation.isPending ||
    bulkPermDeleteMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createMutation.isPending || updateMutation.isPending) return;
    if (!runFormValidation()) {
      toast({ title: "Validation Failed", description: "Please review the invalid fields in the tabs.", variant: "destructive" });
      return;
    }

    // Check slug uniqueness
    const isUnique = !allIndustries.some(
      (item: any) => item.slug === slug && item._id !== editingId
    );
    if (!isUnique) {
      setValidationErrors(prev => ({ ...prev, slug: "Slug URL must be unique." }));
      toast({ title: "Duplicate Slug", description: "Please provide a unique slug URL.", variant: "destructive" });
      return;
    }

    const payload = {
      title,
      slug,
      shortDescription,
      fullDescription: normalizeRichContent(fullDescription),
      icon,
      category,
      overview: normalizeRichContent(overview),
      overviewQuote: normalizeRichContent(overviewQuote),
      status,
      displayOrder: Number(displayOrder) || 0,
      features,
      technologies,
      benefits,
      industries,
      offerings,
      coverImage,
      thumbnail,
      ...seoToPayload(seo),
      ctaLabel: cta,
      featured,
      dashboardImage,
      process: processSteps,
      stats: statsList
    };

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

  // Helper row add/remove handlers
  const addStatRow = () => {
    setStatsList([...statsList, { value: "", label: "", iconType: "rocket", colorTheme: "green" }]);
  };
  const removeStatRow = (index: number) => {
    setStatsList(statsList.filter((_, idx) => idx !== index));
  };
  const updateStatRow = (index: number, key: string, val: string) => {
    const updated = [...statsList] as any;
    updated[index][key] = val;
    setStatsList(updated);
  };

  const addProcessRow = () => {
    const nextStep = processSteps.length + 1;
    setProcessSteps([...processSteps, { step: nextStep, title: "", description: "" }]);
    setActiveStepAccordion(processSteps.length);
  };
  const removeProcessRow = (index: number) => {
    const remaining = processSteps.filter((_, idx) => idx !== index);
    const updated = remaining.map((step, idx) => ({ ...step, step: idx + 1 }));
    setProcessSteps(updated);
    setActiveStepAccordion(null);
  };
  const updateProcessRow = (index: number, key: "title" | "description", val: string) => {
    const updated = [...processSteps];
    updated[index][key] = val;
    setProcessSteps(updated);
  };

  // Tag Chip management functions
  const addTag = (type: "features" | "tech" | "benefits" | "ind" | "off", value: string) => {
    const clean = value.trim();
    if (!clean) return;
    if (type === "features") {
      if (features.includes(clean)) {
        toast({ title: "Duplicate Feature", description: "This feature name is already added.", variant: "destructive" });
        return;
      }
      setFeatures([...features, clean]);
      setFeatureInput("");
    } else if (type === "tech") {
      if (technologies.includes(clean)) {
        toast({ title: "Duplicate Technology", description: "This technology is already added.", variant: "destructive" });
        return;
      }
      setTechnologies([...technologies, clean]);
      setTechInput("");
    } else if (type === "benefits") {
      if (benefits.includes(clean)) return;
      setBenefits([...benefits, clean]);
      setBenefitInput("");
    } else if (type === "ind") {
      if (industries.includes(clean)) return;
      setIndustries([...industries, clean]);
      setIndustryInput("");
    } else if (type === "off") {
      if (offerings.includes(clean)) return;
      setOfferings([...offerings, clean]);
      setOfferingInput("");
    }
  };

  const removeTag = (type: "features" | "tech" | "benefits" | "ind" | "off", index: number) => {
    if (type === "features") setFeatures(features.filter((_, idx) => idx !== index));
    if (type === "tech") setTechnologies(technologies.filter((_, idx) => idx !== index));
    if (type === "benefits") setBenefits(benefits.filter((_, idx) => idx !== index));
    if (type === "ind") setIndustries(industries.filter((_, idx) => idx !== index));
    if (type === "off") setOfferings(offerings.filter((_, idx) => idx !== index));
  };

  const resolveImageSrc = (imgName: string) => {
    if (!imgName) return null;
    if (IMAGE_MAP[imgName]) return IMAGE_MAP[imgName];
    if (imgName.startsWith("http") || imgName.startsWith("/")) return imgName;
    return null;
  };

  // Multi-select actions
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === industriesList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(industriesList.map((x: any) => x._id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0 || isActionPending) return;
    bulkDeleteMutation.mutate(selectedIds);
  };

  const handleBulkRestore = () => {
    if (selectedIds.length === 0 || isActionPending) return;
    bulkRestoreMutation.mutate(selectedIds);
  };

  const handleBulkStatusChange = () => {
    if (selectedIds.length === 0 || isActionPending) return;
    bulkStatusMutation.mutate({ ids: selectedIds, status: bulkStatusValue });
  };

  const handleBulkPermDelete = () => {
    if (selectedIds.length === 0 || isActionPending) return;
    if (window.confirm(`Permanently delete ${selectedIds.length} industries?`)) {
      bulkPermDeleteMutation.mutate(selectedIds);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-none::-webkit-scrollbar {
          display: none !important;
        }
        .scrollbar-none {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />

      <PageHeader
        title={viewMode === "trash" ? "CMS Trash Bin (Industries)" : "Industries CMS"}
        description={viewMode === "trash" ? "Restore or permanently delete removed industries." : "Manage the corporate industry sectors displayed on the website."}
        actionLabel={viewMode === "trash" ? undefined : "Add Industry"}
        onAction={viewMode === "trash" ? undefined : handleOpenCreate}
      />

      {/* Advanced Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input 
              placeholder="Search by Title, Category, Slug, Technology..." 
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
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                className="h-9 w-9 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {sortOrder === "asc" ? <LucideIcons.ArrowUpNarrowWide className="w-4 h-4 text-slate-500" /> : <LucideIcons.ArrowDownWideNarrow className="w-4 h-4 text-slate-500" />}
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
                <option value="Life Sciences">Life Sciences</option>
                <option value="EdTech">EdTech</option>
                <option value="FinTech">FinTech</option>
                <option value="Commerce">Commerce</option>
                <option value="Industrial">Industrial</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="PropTech">PropTech</option>
                <option value="HospitalityTech">HospitalityTech</option>
                <option value="AgriTech">AgriTech</option>
                <option value="CleanTech">CleanTech</option>
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

        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="text-xs font-bold text-emerald-800">
              {selectedIds.length} industries selected
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
                    </select>
                    <Button onClick={handleBulkStatusChange} disabled={isActionPending} variant="secondary" size="sm" className="h-8 text-xs font-bold">
                      Apply Status
                    </Button>
                  </div>
                  <Button onClick={handleBulkDelete} disabled={isActionPending} variant="destructive" size="sm" className="h-8 text-xs font-bold bg-red-600 hover:bg-red-500">
                    Bulk Soft Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleBulkRestore} disabled={isActionPending} variant="outline" size="sm" className="h-8 text-xs font-bold bg-white text-emerald-700 border-emerald-200">
                    Bulk Restore
                  </Button>
                  <Button 
                    onClick={handleBulkPermDelete}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between animate-pulse h-[200px]">
              <div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600 mb-4" />
          <h3 className="text-lg font-bold text-red-900 mb-1">Failed to load industries</h3>
          <p className="text-red-700 text-sm mb-6">{error?.message}</p>
        </div>
      ) : industriesList.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industriesList.map((item: any) => (
              <div key={item._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all group relative">
                
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(item._id)} 
                  onChange={() => toggleSelect(item._id)}
                  className="absolute top-4 right-4 w-4.5 h-4.5 accent-emerald-600 cursor-pointer rounded" 
                />

                <div className="pr-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      {renderLucideIcon(item.icon, "w-5 h-5")}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">{item.category}</span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mt-2">{item.shortDescription}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.featured && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[9px] font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
                      item.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {viewMode === "trash" && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] space-y-1 text-red-650 bg-red-50/20 p-2 rounded-lg">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Deleted: {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> By: {item.deletedBy || 'System'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  {viewMode === "active" ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)} className="h-8.5 rounded-lg text-xs font-bold gap-1 border-slate-200">
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDelete(item)} className="h-8.5 rounded-lg text-xs font-bold gap-1 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={() => restoreMutation.mutate(item._id)} 
                        disabled={isActionPending}
                        variant="outline" 
                        size="sm" 
                        className="h-8.5 rounded-lg text-xs font-bold gap-1 border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                      >
                        Restore
                      </Button>
                      <Button 
                        onClick={() => setPermDeleteConfirmId(item._id)} 
                        variant="destructive" 
                        size="sm" 
                        className="h-8.5 rounded-lg text-xs font-bold gap-1 bg-red-600 hover:bg-red-500"
                      >
                        Purge
                      </Button>
                    </>
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
                  checked={selectedIds.length === industriesList.length} 
                  onChange={toggleSelectAll}
                  className="w-4.5 h-4.5 accent-emerald-600 cursor-pointer rounded" 
                />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Select Page Items
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage <= 1} 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="h-9 px-3 rounded-lg border-slate-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage >= pagination.totalPages} 
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  className="h-9 px-3 rounded-lg border-slate-200"
                >
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title={viewMode === "trash" ? "Trash is empty" : "No industry offerings found"}
          description="Click Add Industry or modify your search filters to get started."
          actionLabel={viewMode === "trash" ? undefined : "Create Industry"}
          onAction={viewMode === "trash" ? undefined : handleOpenCreate}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Industry?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Are you sure you want to delete <strong className="text-slate-800">"{deleteConfirmTitle}"</strong>? It will be moved to the Trash Bin where you can restore it anytime.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="h-10 rounded-xl">
                Cancel
              </Button>
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

      {/* Permanent Delete Confirmation */}
      {permDeleteConfirmId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-2.5 text-red-600 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Purge Industry Entry?</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              This will permanently delete the record. This action **cannot be undone**.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPermDeleteConfirmId(null)} className="h-10 rounded-xl">
                Cancel
              </Button>
              <Button 
                onClick={() => permDeleteMutation.mutate(permDeleteConfirmId)} 
                disabled={permDeleteMutation.isPending}
                className="bg-red-600 hover:bg-red-500 text-white h-10 rounded-xl px-5 flex items-center gap-1.5 font-bold"
              >
                {permDeleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                Purge Record
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Portal Mounted Admin Modal */}
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
                <h2 className="text-lg font-bold text-slate-900">{editingId ? "Modify Industry Listing" : "Add Industry Listing"}</h2>
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
                { name: "features", label: "Features", icon: Tag },
                { name: "stats", label: "Stats", icon: BarChart3 },
                { name: "process", label: "Process", icon: Sparkles },
                { name: "seo", label: "SEO Settings", icon: Globe },
                { name: "preview", label: "Preview", icon: ShieldCheck }
              ] as { name: TabName, label: string, icon: any }[]).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                const hasError = activeTab !== tab.name && (
                  (tab.name === "general" && (validationErrors.title || validationErrors.slug || validationErrors.category)) ||
                  (tab.name === "content" && (validationErrors.shortDescription || validationErrors.overview || validationErrors.fullDescription)) ||
                  (tab.name === "stats" && validationErrors.stats) ||
                  (tab.name === "process" && validationErrors.process)
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

            {/* Modal Scrollable Contents area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">

                {/* Tab 1: General */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-6 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Industry Title *</label>
                          <Input 
                            required 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="e.g. Healthcare" 
                            className={`h-10 rounded-lg border-slate-200 ${validationErrors.title ? "border-red-500 focus-visible:ring-red-450" : ""}`} 
                          />
                          {validationErrors.title && (
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{validationErrors.title}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Slug URL *</label>
                            <button 
                              type="button" 
                              onClick={() => setIsSlugManual(!isSlugManual)}
                              className="text-[10px] font-extrabold text-emerald-600 hover:text-emerald-500 uppercase tracking-widest flex items-center gap-1"
                            >
                              {isSlugManual ? <LucideIcons.Lock className="w-3 h-3" /> : <LucideIcons.Unlock className="w-3 h-3" />}
                              {isSlugManual ? "Auto Slug" : "Manual Edit"}
                            </button>
                          </div>
                          <Input 
                            required 
                            disabled={!isSlugManual}
                            value={slug} 
                            onChange={(e) => setSlug(e.target.value)} 
                            placeholder="auto-generated-slug" 
                            className={`h-10 rounded-lg font-mono text-xs ${validationErrors.slug ? "border-red-500 focus-visible:ring-red-450" : "border-slate-200"}`} 
                          />
                          {validationErrors.slug && (
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{validationErrors.slug}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Category *</label>
                          <Input 
                            required 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            placeholder="e.g. Life Sciences" 
                            className={`h-10 rounded-lg border-slate-200 ${validationErrors.category ? "border-red-500 focus-visible:ring-red-450" : ""}`} 
                          />
                          {validationErrors.category && (
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{validationErrors.category}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Display Order</label>
                          <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="h-10 rounded-lg border-slate-200" />
                        </div>

                        <div className="space-y-2 relative">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Icon Picker</label>
                          <div 
                            onClick={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
                            className="h-10 px-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between cursor-pointer text-xs"
                          >
                            <span className="flex items-center gap-2 font-semibold">
                              {renderLucideIcon(icon, "w-4 h-4 text-emerald-600")}
                              {icon}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </div>

                          {isIconDropdownOpen && (
                            <div className="absolute top-18 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-2xl p-2.5 z-55 space-y-2">
                              <Input 
                                placeholder="Search icons..." 
                                value={iconSearchTerm}
                                onChange={(e) => setIconSearchTerm(e.target.value)}
                                className="h-8.5 text-xs"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="max-h-[160px] overflow-y-auto grid grid-cols-2 gap-1 custom-scrollbar">
                                {SUPPORTED_ICONS.filter(x => x.toLowerCase().includes(iconSearchTerm.toLowerCase())).map(item => (
                                  <div 
                                    key={item}
                                    onClick={() => {
                                      setIcon(item);
                                      setIsIconDropdownOpen(false);
                                      setIconSearchTerm("");
                                    }}
                                    className={`p-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 cursor-pointer text-xs ${icon === item ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-650"}`}
                                  >
                                    {renderLucideIcon(item, "w-4 h-4")}
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</label>
                          <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold focus-visible:outline-none bg-white cursor-pointer" value={status} onChange={(e: any) => setStatus(e.target.value)}>
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">CTA Label</label>
                          <Input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g. Consult with Healthcare Experts" className="h-10 rounded-lg border-slate-200" />
                        </div>

                        <div className="flex items-center gap-3 pt-8 pl-1">
                          <input 
                            type="checkbox" 
                            id="portal-modal-featured-light"
                            checked={featured} 
                            onChange={(e) => setFeatured(e.target.checked)}
                            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                          />
                          <label htmlFor="portal-modal-featured-light" className="text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Featured Industry</label>
                        </div>
                      </div>
                    </div>

                    {editingId && (
                      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-4 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                          <Info className="w-4 h-4 text-emerald-600" /> Activity History
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/40">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Creation Trail</span>
                            <div className="font-semibold text-slate-750">Created By: {auditInfo.createdBy || 'System'}</div>
                            <div className="text-[10px] text-slate-450 mt-0.5">At: {auditInfo.createdAt ? new Date(auditInfo.createdAt).toLocaleString() : 'N/A'}</div>
                          </div>
                          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/40">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Update Trail</span>
                            <div className="font-semibold text-slate-750">Last Updated By: {auditInfo.updatedBy || 'System'}</div>
                            <div className="text-[10px] text-slate-450 mt-0.5">At: {auditInfo.updatedAt ? new Date(auditInfo.updatedAt).toLocaleString() : 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Content */}
                {activeTab === "content" && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Short Description *</label>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{shortDescription.length} chars</span>
                      </div>
                      <Input 
                        required 
                        value={shortDescription} 
                        onChange={(e) => setShortDescription(e.target.value)} 
                        placeholder="A short conversion summary..." 
                        className={`h-10 rounded-lg border-slate-200 ${validationErrors.shortDescription ? "border-red-500 focus-visible:ring-red-450" : ""}`} 
                      />
                      {validationErrors.shortDescription && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{validationErrors.shortDescription}</p>
                      )}
                    </div>

                    <RichTextEditor
                      label="Overview / Introduction"
                      required
                      value={overview}
                      onChange={setOverview}
                      placeholder="Overview narrative block..."
                      minHeightClassName="min-h-[120px]"
                      error={validationErrors.overview}
                    />

                    <RichTextEditor
                      label="Overview Quote"
                      value={overviewQuote}
                      onChange={setOverviewQuote}
                      placeholder="Quote shown under Overview on the public industry page..."
                      minHeightClassName="min-h-[100px]"
                      helperText="Optional — rendered as the industry overview quote."
                    />

                    <RichTextEditor
                      label="Full Description"
                      required
                      value={fullDescription}
                      onChange={setFullDescription}
                      placeholder="Detailed industry description..."
                      helperText="Supports headings, lists, links, code, and more."
                      minHeightClassName="min-h-[200px]"
                      error={validationErrors.fullDescription}
                    />
                  </div>
                )}

                {/* Tab 3: Media */}
                {activeTab === "media" && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-6 shadow-sm">
                    <CmsImageField
                      label="Cover Image"
                      value={coverImage}
                      onChange={(url) => {
                        setCoverImage(url);
                        // Seeded Unsplash thumbnails must not hide a newly uploaded Cloudinary cover on listing cards.
                        if (
                          url.includes('cloudinary.com') &&
                          (thumbnail.includes('images.unsplash.com') || thumbnail.includes('placehold.co'))
                        ) {
                          setThumbnail('');
                        }
                      }}
                      helperText="Hero image on Industry Detail. Also used on listing cards when Thumbnail is empty or still a seed placeholder."
                    />
                    <CmsImageField
                      label="Thumbnail Image"
                      value={thumbnail}
                      onChange={setThumbnail}
                      helperText="Preferred card image on Industries listing. Leave empty to use Cover Image."
                    />
                    <CmsImageField
                      label="Dashboard Mock Image"
                      value={dashboardImage}
                      onChange={setDashboardImage}
                      helperText="Optional dashboard / mockup image for industry detail sections."
                    />
                  </div>
                )}

                {/* Tab 4: Features */}
                {activeTab === "features" && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-6 shadow-sm">
                    {([
                      { label: "Key Features", tags: features, input: featureInput, setInput: setFeatureInput, type: "features" },
                      { label: "Technologies Used", tags: technologies, input: techInput, setInput: setTechInput, type: "tech" },
                      { label: "Client Benefits", tags: benefits, input: benefitInput, setInput: setBenefitInput, type: "benefits" },
                      { label: "Core Offerings", tags: offerings, input: offeringInput, setInput: setOfferingInput, type: "off" }
                    ] as const).map((section, idx) => (
                      <div key={idx} className="space-y-2.5 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{section.label}</label>
                        
                        <div className="flex gap-2">
                          <Input 
                            value={section.input} 
                            onChange={(e) => section.setInput(e.target.value)} 
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTag(section.type, section.input);
                              }
                            }}
                            placeholder="Add item & press Enter" 
                            className="h-9 rounded-lg border-slate-200 text-xs" 
                          />
                          <Button 
                            type="button" 
                            onClick={() => addTag(section.type, section.input)}
                            variant="secondary" 
                            className="h-9 rounded-lg text-xs"
                          >
                            Add
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {section.tags.map((tag, tIdx) => (
                            <span 
                              key={tIdx} 
                              className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200"
                            >
                              {tag}
                              <button 
                                type="button" 
                                onClick={() => removeTag(section.type, tIdx)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {section.tags.length === 0 && (
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">No items added yet</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 5: Stats Card Editor */}
                {activeTab === "stats" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Statistics Cards</span>
                      <Button type="button" variant="outline" onClick={addStatRow} className="h-8 rounded-lg font-bold text-xs gap-1 border-slate-200 bg-white">
                        <Plus className="w-3.5 h-3.5" /> Add Stat
                      </Button>
                    </div>

                    {validationErrors.stats && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-650 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4" /> {validationErrors.stats}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {statsList.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between shadow-sm relative group hover:border-slate-355 transition-colors">
                          <button 
                            type="button" 
                            onClick={() => removeStatRow(idx)}
                            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Trash className="w-4 h-4" />
                          </button>

                          <div className="space-y-4">
                            <div className="text-[9px] font-mono text-emerald-600 font-extrabold uppercase tracking-widest">
                              Stat Card #{idx + 1}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Value *</label>
                                <Input required placeholder="99.9%" className="h-8.5 rounded text-xs border-slate-200" value={item.value} onChange={(e) => updateStatRow(idx, "value", e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Label *</label>
                                <Input required placeholder="Uptime" className="h-8.5 rounded text-xs border-slate-200" value={item.label} onChange={(e) => updateStatRow(idx, "label", e.target.value)} />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Icon Code</label>
                                <Input placeholder="rocket" className="h-8.5 rounded text-xs border-slate-200" value={item.iconType} onChange={(e) => updateStatRow(idx, "iconType", e.target.value)} />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Color Chip</label>
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {COLOR_PALETTES.map(chip => (
                                    <div 
                                      key={chip.value}
                                      onClick={() => updateStatRow(idx, "colorTheme", chip.value)}
                                      className={`w-4 h-4 rounded-full cursor-pointer transition-all border ${chip.bg} ${item.colorTheme === chip.value ? "ring-2 ring-emerald-500 ring-offset-1 scale-110" : "opacity-60"}`}
                                      title={chip.name}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 6: Process Accordion Editor */}
                {activeTab === "process" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Methodology / Stages</span>
                      <Button type="button" variant="outline" onClick={addProcessRow} className="h-8 rounded-lg font-bold text-xs gap-1 border-slate-200 bg-white">
                        <Plus className="w-3.5 h-3.5" /> Add Stage
                      </Button>
                    </div>

                    {validationErrors.process && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-650 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4" /> {validationErrors.process}
                      </div>
                    )}

                    <div className="space-y-2.5">
                      {processSteps.map((step, idx) => {
                        const isOpen = activeStepAccordion === idx;
                        return (
                          <div key={idx} className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
                            <div 
                              onClick={() => setActiveStepAccordion(isOpen ? null : idx)}
                              className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-100">
                                  {step.step}
                                </span>
                                <span className="text-xs font-bold text-slate-700">
                                  {step.title.trim() || `Methodology Stage #${step.step}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  type="button" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeProcessRow(idx);
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                              </div>
                            </div>

                            {isOpen && (
                              <div className="px-5 pb-5 pt-1.5 border-t border-slate-100 bg-slate-50/50 space-y-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Stage Title *</label>
                                  <Input required placeholder="Requirements Gathering" className="h-8.5 bg-white border-slate-200 rounded text-xs" value={step.title} onChange={(e) => updateProcessRow(idx, "title", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Description *</label>
                                  <textarea required className="w-full h-20 p-2.5 rounded border border-slate-200 bg-white text-xs focus:outline-none" placeholder="Provide detailed delivery specifications..." value={step.description} onChange={(e) => updateProcessRow(idx, "description", e.target.value)} />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 7: SEO */}
                {activeTab === "seo" && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                    <SeoManager
                      value={seo}
                      onChange={setSeo}
                      slug={slug}
                      pathPrefix="/industries/"
                      defaultTitle={title ? `${title} | TechVistar Industries` : ''}
                      defaultDescription={shortDescription}
                      defaultImage={coverImage || thumbnail}
                    />
                  </div>
                )}

                {/* Tab 8: Preview */}
                {activeTab === "preview" && (
                  <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <div className="text-[10px] font-extrabold uppercase text-emerald-650 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Instant Preview (No Save Required)
                    </div>

                    <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between group">
                      
                      <div className="h-[200px] w-full bg-slate-50 overflow-hidden flex items-center justify-center p-2 border-b border-slate-100">
                        {resolveImageSrc(coverImage) ? (
                          <img src={resolveImageSrc(coverImage) || ""} alt={title} className="h-full w-full object-contain rounded" />
                        ) : (
                          <div className="flex flex-col items-center text-slate-400 gap-1.5">
                            <ImageIcon className="w-6 h-6" />
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">No Cover Image</span>
                          </div>
                        )}
                      </div>

                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[9px] font-bold uppercase text-emerald-600 tracking-wider">
                              {category || "Unassigned"}
                            </span>
                            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">
                              ORDER {displayOrder}
                            </span>
                          </div>
                          
                          <h3 className="text-sm font-bold text-slate-900 leading-snug flex items-center gap-1.5">
                            {renderLucideIcon(icon, "w-4 h-4 text-emerald-650 shrink-0")}
                            {title || "Untitled Industry"}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                            {shortDescription || "Short summary text displayed on public cards..."}
                          </p>
                        </div>

                        {technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {technologies.slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-650 text-[10px] font-semibold rounded border border-slate-200/50">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-auto">
                          <span className="text-[10px] font-black text-emerald-600 hover:underline cursor-pointer flex items-center gap-1">
                            {cta || "Learn More"} <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </form>
            </div>

            {/* Modal Sticky Footer */}
            <div className="px-8 py-4.5 bg-white border-t border-slate-200/60 backdrop-blur flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-455">
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
                  {editingId ? "Save Changes" : "Create Industry"}
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
                  You have made modifications to this industry. Leaving will discard all unsaved edits. Are you sure you want to exit?
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

export default Industries;
