import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { Toolbar } from "@/components/admin/common/Toolbar";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from "@/services/faq.service";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquareText, Trash2, Edit, CheckCircle, HelpCircle, Eye, EyeOff, Loader2, X, Plus 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FAQs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [faqId, setFaqId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState<"General" | "Services" | "Work" | "Careers" | "Contact" | "AI" | "Backend" | "Frontend">("General");
  const [page, setPage] = useState<"home" | "services" | "work" | "careers" | "contact" | "all">("all");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [displayOrder, setDisplayOrder] = useState("0");

  // Fetch FAQs via React Query
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: getAllFAQs
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: createFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      toast({ title: "FAQ Created", description: "New FAQ published successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error creating FAQ", description: err.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateFAQ(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      toast({ title: "FAQ Updated", description: "FAQ modified successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error updating FAQ", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      toast({ title: "FAQ Deleted", description: "FAQ entry removed permanently." });
    },
    onError: (err: any) => {
      toast({ title: "Error deleting FAQ", description: err.message, variant: "destructive" });
    }
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFaqId(`faq-${Date.now()}`);
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setPage("all");
    setStatus("active");
    setDisplayOrder("0");
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      faqId: editingId ? undefined : faqId,
      question,
      answer,
      category,
      page,
      status,
      displayOrder: Number(displayOrder) || 0
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleStatus = (item: any) => {
    const nextStatus = item.status === "active" ? "inactive" : "active";
    updateMutation.mutate({
      id: item._id,
      data: { ...item, status: nextStatus }
    });
  };

  // Search & Filter computation
  const filteredFAQs = faqs.filter((item: any) => {
    const matchesSearch = item.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="FAQ CMS"
        description="Configure frequently asked questions presented across public application routes."
        actionLabel="Add FAQ"
        onAction={handleOpenCreate}
      />

      <Toolbar 
        placeholder="Search questions..." 
        value={searchTerm} 
        onChange={(e: any) => setSearchTerm(e.target.value)} 
        actionLabel={categoryFilter === "all" ? "All Categories" : categoryFilter}
        onActionClick={() => setCategoryFilter(prev => prev === "all" ? "General" : prev === "General" ? "Services" : prev === "Services" ? "Careers" : "all")}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      ) : filteredFAQs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFAQs.map((item: any) => (
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <MessageSquareText className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    item.status === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">{item.question}</h3>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mt-1">{item.category} • page: {item.page}</span>
                <p className="text-slate-500 text-sm mt-3 line-clamp-3">{item.answer}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => toggleStatus(item)}
                  className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg transition-colors"
                  title={item.status === 'active' ? 'Set as Inactive' : 'Publish / Make Active'}
                >
                  {item.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)} className="h-8 rounded-lg text-xs font-bold gap-1 border-slate-200">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(item._id)} className="h-8 rounded-lg text-xs font-bold gap-1 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No FAQ items found"
          description="Click Add FAQ to get started publishing CMS entries."
          actionLabel="Create FAQ"
          onAction={handleOpenCreate}
        />
      )}

      {/* Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? "Modify FAQ" : "Add FAQ"}</h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 pt-6">
              {!editingId && (
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">FAQ Identifier (unique ID)</label>
                  <Input required value={faqId} onChange={(e) => setFaqId(e.target.value)} placeholder="e.g. faq-security" />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Text</label>
                <Input required value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What is your refund policy?" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Answer Text</label>
                <textarea required className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 text-sm focus-visible:outline-none" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer statement..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={category} onChange={(e: any) => setCategory(e.target.value)}>
                    <option value="General">General</option>
                    <option value="Services">Services</option>
                    <option value="Work">Work</option>
                    <option value="Careers">Careers</option>
                    <option value="Contact">Contact</option>
                    <option value="AI">AI</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Page Context</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={page} onChange={(e: any) => setPage(e.target.value)}>
                    <option value="all">All Pages</option>
                    <option value="home">Home</option>
                    <option value="services">Services</option>
                    <option value="work">Work</option>
                    <option value="careers">Careers</option>
                    <option value="contact">Contact</option>
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

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeModal} className="rounded-xl font-bold h-11 border-slate-200">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold h-11 px-6 shadow-sm gap-2">
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {editingId ? "Save Changes" : "Create FAQ"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FAQs;
