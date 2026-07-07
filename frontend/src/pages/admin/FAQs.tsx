import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { EmptyState } from "@/components/admin/common/EmptyState";
import {
  getAllFAQs, createFAQ, updateFAQ, deleteFAQ,
  restoreFAQ, permanentlyDeleteFAQ, bulkDeleteFAQs, bulkRestoreFAQs, bulkUpdateStatus
} from "@/services/faq.service";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquareText, Trash2, Edit, Loader2, X, Plus, AlertCircle, Trash, ArrowLeft, ArrowRight,
  Search, RotateCcw, AlertTriangle, Info, Calendar, User, Check
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FAQ_CATEGORIES = ["General", "Services", "Work", "Careers", "Contact", "AI", "Backend", "Frontend"] as const;
const FAQ_PAGES = ["all", "home", "services", "work", "careers", "contact"] as const;

const FAQs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pageFilter, setPageFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");
  const [sortBy, setSortBy] = useState("displayOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusValue, setBulkStatusValue] = useState<"active" | "inactive">("inactive");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState("");
  const [permDeleteConfirmId, setPermDeleteConfirmId] = useState<string | null>(null);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);

  const [faqId, setFaqId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState<typeof FAQ_CATEGORIES[number]>("General");
  const [page, setPage] = useState<typeof FAQ_PAGES[number]>("all");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [featured, setFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [auditInfo, setAuditInfo] = useState<{
    createdBy?: string;
    updatedBy?: string;
    deletedBy?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  }>({});

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
    queryKey: ["admin", "faqs", {
      page: currentPage,
      search: debouncedSearch,
      status: statusFilter,
      category: categoryFilter,
      pageContext: pageFilter,
      trash: viewMode === "trash",
      featured: featuredFilter,
      sortBy,
      sortOrder,
    }],
    queryFn: () => getAllFAQs({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      status: statusFilter,
      category: categoryFilter,
      pageContext: pageFilter,
      trash: viewMode === "trash",
      featured: featuredFilter,
      sortBy,
      sortOrder,
    }),
  });

  const faqsList = apiResponse?.faqs || [];
  const pagination = apiResponse?.pagination || { total: 0, page: 1, limit: itemsPerPage, totalPages: 1 };

  const { data: allFaqsRes } = useQuery({
    queryKey: ["admin", "faqs", "all"],
    queryFn: () => getAllFAQs({ page: 1, limit: 1000 }),
    enabled: isModalOpen,
  });
  const allFaqs = allFaqsRes?.faqs || [];

  const refreshFaqQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
    queryClient.invalidateQueries({ queryKey: ["activeFAQs"] });
  };

  const createMutation = useMutation({
    mutationFn: createFAQ,
    onSuccess: () => {
      refreshFaqQueries();
      toast({ title: "FAQ Created", description: "New FAQ published successfully." });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Error creating FAQ", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateFAQ(id, data),
    onSuccess: () => {
      refreshFaqQueries();
      toast({ title: "FAQ Updated", description: "FAQ modified successfully." });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Error updating FAQ", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFAQ,
    onSuccess: () => {
      refreshFaqQueries();
      toast({ title: "FAQ soft deleted", description: "The FAQ has been moved to Trash." });
      setDeleteConfirmId(null);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error deleting FAQ", description: err.message, variant: "destructive" });
      setDeleteConfirmId(null);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreFAQ,
    onSuccess: () => {
      refreshFaqQueries();
      toast({ title: "FAQ restored", description: "The FAQ is now active again." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error restoring FAQ", description: err.message, variant: "destructive" });
    },
  });

  const permDeleteMutation = useMutation({
    mutationFn: permanentlyDeleteFAQ,
    onSuccess: () => {
      refreshFaqQueries();
      toast({ title: "FAQ permanently deleted", description: "The FAQ has been removed from the database." });
      setPermDeleteConfirmId(null);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Error permanently deleting FAQ", description: err.message, variant: "destructive" });
      setPermDeleteConfirmId(null);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteFAQs,
    onSuccess: () => {
      refreshFaqQueries();
      toast({ title: "FAQs soft-deleted", description: "Selected FAQs moved to Trash." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: bulkRestoreFAQs,
    onSuccess: () => {
      refreshFaqQueries();
      toast({ title: "FAQs restored", description: "Selected FAQs restored successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status: nextStatus }: { ids: string[]; status: "active" | "inactive" }) => bulkUpdateStatus(ids, nextStatus),
    onSuccess: () => {
      refreshFaqQueries();
      toast({ title: "Bulk Status Updated", description: "Selected FAQs status updated successfully." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkPermDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        await permanentlyDeleteFAQ(id);
      }
    },
    onSuccess: () => {
      refreshFaqQueries();
      toast({ title: "FAQs permanently deleted", description: "Selected FAQs removed from database." });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast({ title: "Bulk Action Error", description: err.message, variant: "destructive" });
    },
  });

  const getCurrentStateString = () => JSON.stringify({
    faqId, question, answer, category, page, status, displayOrder, featured, seoTitle, seoDescription, tags,
  });

  const isFormDirty = () => isModalOpen && getCurrentStateString() !== originalDataStr;

  const resetFormState = () => {
    setFaqId(`faq-${Date.now()}`);
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setPage("all");
    setStatus("active");
    setDisplayOrder("0");
    setFeatured(false);
    setSeoTitle("");
    setSeoDescription("");
    setTags([]);
    setTagInput("");
    setValidationErrors({});
    setAuditInfo({});
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    resetFormState();
    setTimeout(() => {
      setOriginalDataStr(getCurrentStateString());
    }, 50);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item._id);
    setFaqId(item.faqId || "");
    setQuestion(item.question || "");
    setAnswer(item.answer || "");
    setCategory(item.category || "General");
    setPage(item.page || "all");
    setStatus(item.status || "active");
    setDisplayOrder(String(item.displayOrder || 0));
    setFeatured(item.featured || false);
    setSeoTitle(item.seoTitle || "");
    setSeoDescription(item.seoDescription || "");
    setTags(item.tags || []);
    setTagInput("");
    setValidationErrors({});
    setAuditInfo({
      createdBy: item.createdBy,
      updatedBy: item.updatedBy,
      deletedBy: item.deletedBy,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      deletedAt: item.deletedAt,
    });
    setTimeout(() => {
      setOriginalDataStr(JSON.stringify({
        faqId: item.faqId || "",
        question: item.question || "",
        answer: item.answer || "",
        category: item.category || "General",
        page: item.page || "all",
        status: item.status || "active",
        displayOrder: String(item.displayOrder || 0),
        featured: item.featured || false,
        seoTitle: item.seoTitle || "",
        seoDescription: item.seoDescription || "",
        tags: item.tags || [],
      }));
    }, 50);
    setIsModalOpen(true);
  };

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

  const handleCloseAttempt = () => {
    if (isFormDirty()) {
      setShowUnsavedConfirm(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const runFormValidation = (): boolean => {
    const errors: Record<string, string> = {};
    if (!editingId && !faqId.trim()) errors.faqId = "FAQ ID is required.";
    if (!question.trim()) errors.question = "Question is required.";
    if (!answer.trim()) errors.answer = "Answer is required.";
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
      toast({ title: "Validation Failed", description: "Please review the required fields.", variant: "destructive" });
      return;
    }

    if (!editingId) {
      const isUnique = !allFaqs.some((item: any) => item.faqId === faqId.trim().toLowerCase());
      if (!isUnique) {
        setValidationErrors((prev) => ({ ...prev, faqId: "FAQ ID must be unique." }));
        toast({ title: "Duplicate FAQ ID", description: "Please provide a unique FAQ identifier.", variant: "destructive" });
        return;
      }
    }

    const payload: Record<string, unknown> = {
      question,
      answer,
      category,
      page,
      status,
      displayOrder: Number(displayOrder) || 0,
      featured,
      seoTitle,
      seoDescription,
      tags,
    };

    if (!editingId) {
      payload.faqId = faqId.trim().toLowerCase();
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate({ id: editingId, data: payload });
    }
  };

  const handleOpenDelete = (item: any) => {
    setDeleteConfirmId(item._id);
    setDeleteConfirmTitle(item.question);
  };

  const addTag = () => {
    const clean = tagInput.trim();
    if (!clean || tags.includes(clean)) return;
    setTags([...tags, clean]);
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === faqsList.length ? [] : faqsList.map((x: any) => x._id));
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
    if (window.confirm(`Permanently delete ${selectedIds.length} FAQs?`)) {
      bulkPermDeleteMutation.mutate(selectedIds);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={viewMode === "trash" ? "CMS Trash Bin (FAQs)" : "FAQ CMS"}
        description={viewMode === "trash" ? "Restore or permanently delete removed FAQs." : "Configure frequently asked questions presented across public application routes."}
        actionLabel={viewMode === "trash" ? undefined : "Add FAQ"}
        onAction={viewMode === "trash" ? undefined : handleOpenCreate}
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input
              placeholder="Search questions, answers, categories..."
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
                All FAQs
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
                <option value="question">Sort: Question</option>
                <option value="createdAt">Sort: Created Date</option>
                <option value="updatedAt">Sort: Updated Date</option>
                <option value="status">Sort: Status</option>
                <option value="category">Sort: Category</option>
              </select>
              <button
                onClick={() => setSortOrder((prev) => prev === "asc" ? "desc" : "asc")}
                className="h-9 w-9 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {sortOrder === "asc"
                  ? <LucideIcons.ArrowUpNarrowWide className="w-4 h-4 text-slate-500" />
                  : <LucideIcons.ArrowDownWideNarrow className="w-4 h-4 text-slate-500" />}
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
                {FAQ_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Page:
              <select
                value={pageFilter}
                onChange={(e) => { setPageFilter(e.target.value); setCurrentPage(1); }}
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="all">All Pages</option>
                {FAQ_PAGES.filter((p) => p !== "all").map((p) => <option key={p} value={p}>{p}</option>)}
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
                  <option value="inactive">Inactive Only</option>
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
              setPageFilter("all");
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
            <span className="text-xs font-bold text-emerald-800">{selectedIds.length} FAQs selected</span>
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
                      <option value="inactive">Inactive</option>
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
                  <Button onClick={handleBulkPermDelete} disabled={isActionPending} variant="destructive" size="sm" className="h-8 text-xs font-bold bg-red-600 hover:bg-red-500">
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
          <h3 className="text-lg font-bold text-red-900 mb-1">Failed to load FAQs</h3>
          <p className="text-red-700 text-sm mb-6">{error?.message}</p>
        </div>
      ) : faqsList.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqsList.map((item: any) => (
              <div key={item._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all group relative">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id)}
                  onChange={() => toggleSelect(item._id)}
                  className="absolute top-4 right-4 w-4.5 h-4.5 accent-emerald-600 cursor-pointer rounded"
                />

                <div className="pr-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <MessageSquareText className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">{item.question}</h3>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mt-1">{item.category} • page: {item.page}</span>
                  <p className="text-slate-500 text-sm mt-3 line-clamp-3">{item.answer}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.featured && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[9px] font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
                      item.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}>
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
                      <Button onClick={() => restoreMutation.mutate(item._id)} disabled={isActionPending} variant="outline" size="sm" className="h-8.5 rounded-lg text-xs font-bold gap-1 border-emerald-100 text-emerald-600 hover:bg-emerald-50">
                        Restore
                      </Button>
                      <Button onClick={() => setPermDeleteConfirmId(item._id)} variant="destructive" size="sm" className="h-8.5 rounded-lg text-xs font-bold gap-1 bg-red-650 hover:bg-red-500">
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
                  checked={selectedIds.length === faqsList.length && faqsList.length > 0}
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
          title={viewMode === "trash" ? "Trash is empty" : "No FAQ items found"}
          description="Click Add FAQ or modify your search filters to get started."
          actionLabel={viewMode === "trash" ? undefined : "Create FAQ"}
          onAction={viewMode === "trash" ? undefined : handleOpenCreate}
        />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete FAQ?</h3>
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
              <h3 className="text-lg font-bold text-slate-900">Purge FAQ Entry?</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              This will permanently delete the record. This action cannot be undone.
            </p>
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

      {showUnsavedConfirm && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Unsaved changes</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              You have made modifications to this FAQ. Leaving will discard all unsaved edits.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowUnsavedConfirm(false)} className="h-10 rounded-xl">Keep Editing</Button>
              <Button onClick={() => { setShowUnsavedConfirm(false); setIsModalOpen(false); }} className="bg-red-650 hover:bg-red-500 text-white h-10 rounded-xl px-5">
                Discard & Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[24px] border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200/60 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingId ? "Modify FAQ" : "Add FAQ"}</h2>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">FAQ Content Management</p>
              </div>
              <button type="button" onClick={handleCloseAttempt} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
                {!editingId && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">FAQ Identifier (unique ID) *</label>
                    <Input required value={faqId} onChange={(e) => setFaqId(e.target.value)} placeholder="e.g. faq-security" className={validationErrors.faqId ? "border-red-500" : ""} />
                    {validationErrors.faqId && <p className="text-[10px] text-red-500 font-bold">{validationErrors.faqId}</p>}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Text *</label>
                  <Input required value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What is your refund policy?" className={validationErrors.question ? "border-red-500" : ""} />
                  {validationErrors.question && <p className="text-[10px] text-red-500 font-bold">{validationErrors.question}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Answer Text *</label>
                  <textarea required className={`w-full min-h-[120px] p-3 rounded-lg border text-sm focus-visible:outline-none ${validationErrors.answer ? "border-red-500" : "border-slate-200"}`} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer statement..." />
                  {validationErrors.answer && <p className="text-[10px] text-red-500 font-bold">{validationErrors.answer}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
                    <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={category} onChange={(e: any) => setCategory(e.target.value)}>
                      {FAQ_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Page Context</label>
                    <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={page} onChange={(e: any) => setPage(e.target.value)}>
                      {FAQ_PAGES.map((p) => <option key={p} value={p}>{p === "all" ? "All Pages" : p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Display Order</label>
                    <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
                    <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={status} onChange={(e: any) => setStatus(e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="faq-featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-emerald-600 rounded cursor-pointer" />
                  <label htmlFor="faq-featured" className="text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Featured FAQ</label>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Tags</label>
                  <div className="flex gap-2">
                    <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Add tag & press Enter" className="h-9 text-sm" />
                    <Button type="button" onClick={addTag} variant="secondary" className="h-9 text-xs">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                        {tag}
                        <button type="button" onClick={() => removeTag(idx)} className="text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">SEO Title</label>
                  <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Optional SEO meta title" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">SEO Description</label>
                  <textarea className="w-full min-h-[80px] p-3 rounded-lg border border-slate-200 text-sm focus-visible:outline-none" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Optional SEO meta description" />
                </div>

                {editingId && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-600" /> Activity History
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/40">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Creation Trail</span>
                        <div className="font-semibold text-slate-750">Created By: {auditInfo.createdBy || "System"}</div>
                        <div className="text-[10px] text-slate-450 mt-0.5">At: {auditInfo.createdAt ? new Date(auditInfo.createdAt).toLocaleString() : "N/A"}</div>
                      </div>
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/40">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Update Trail</span>
                        <div className="font-semibold text-slate-750">Last Updated By: {auditInfo.updatedBy || "System"}</div>
                        <div className="text-[10px] text-slate-450 mt-0.5">At: {auditInfo.updatedAt ? new Date(auditInfo.updatedAt).toLocaleString() : "N/A"}</div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="px-8 py-4.5 bg-white border-t border-slate-200/60 flex justify-between items-center shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-wider">
                {isFormDirty() ? (
                  <span className="text-amber-600 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Unsaved changes</span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Saved to workspace</span>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleCloseAttempt} className="rounded-xl font-bold h-10 border-slate-200 bg-white">Cancel</Button>
                <Button type="button" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold h-10 px-5 shadow-md flex items-center gap-1.5">
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  {editingId ? "Save Changes" : "Create FAQ"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FAQs;
