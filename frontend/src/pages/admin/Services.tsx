import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { Toolbar } from "@/components/admin/common/Toolbar";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { getAllServices, createService, updateService, deleteService } from "@/services/services.service";
import { useToast } from "@/hooks/use-toast";
import { 
  Wrench, Trash2, Edit, CheckCircle, HelpCircle, Eye, EyeOff, Loader2, X, Plus 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Services = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [icon, setIcon] = useState("Wrench");
  const [category, setCategory] = useState("Technology");
  const [overview, setOverview] = useState("");
  const [status, setStatus] = useState<"draft" | "active">("draft");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [featuresText, setFeaturesText] = useState("");
  const [technologiesText, setTechnologiesText] = useState("");

  // Fetch Services via React Query
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: getAllServices
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      toast({ title: "Service Created", description: "New service listing published successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error creating service", description: err.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      toast({ title: "Service Updated", description: "Service listing modified successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error updating service", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      toast({ title: "Service Deleted", description: "Service entry removed permanently." });
    },
    onError: (err: any) => {
      toast({ title: "Error deleting service", description: err.message, variant: "destructive" });
    }
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setShortDescription("");
    setFullDescription("");
    setIcon("Wrench");
    setCategory("Technology");
    setOverview("");
    setStatus("draft");
    setDisplayOrder("0");
    setFeaturesText("");
    setTechnologiesText("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    setShortDescription(item.shortDescription || "");
    setFullDescription(item.fullDescription || "");
    setIcon(item.icon || "Wrench");
    setCategory(item.category || "Technology");
    setOverview(item.overview || "");
    setStatus(item.status || "draft");
    setDisplayOrder(String(item.displayOrder || 0));
    setFeaturesText((item.features || []).join(", "));
    setTechnologiesText((item.technologies || []).join(", "));
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
      shortDescription,
      fullDescription,
      icon,
      category,
      overview,
      status,
      displayOrder: Number(displayOrder) || 0,
      features: featuresText.split(",").map(s => s.trim()).filter(Boolean),
      technologies: technologiesText.split(",").map(s => s.trim()).filter(Boolean)
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleStatus = (item: any) => {
    const nextStatus = item.status === "active" ? "draft" : "active";
    updateMutation.mutate({
      id: item._id,
      data: { ...item, status: nextStatus }
    });
  };

  // Search & Filter computation
  const filteredServices = services.filter((item: any) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Services CMS"
        description="Manage the professional service offerings displayed on the website."
        actionLabel="Add Service"
        onAction={handleOpenCreate}
      />

      <Toolbar 
        placeholder="Search services..." 
        value={searchTerm} 
        onChange={(e: any) => setSearchTerm(e.target.value)} 
        actionLabel={statusFilter === "all" ? "All Statuses" : statusFilter === "active" ? "Active Only" : "Drafts Only"}
        onActionClick={() => setStatusFilter(prev => prev === "all" ? "active" : prev === "active" ? "draft" : "all")}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((item: any) => (
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    item.status === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mt-1">{item.category}</span>
                <p className="text-slate-500 text-sm mt-3 line-clamp-3">{item.shortDescription}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => toggleStatus(item)}
                  className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg transition-colors"
                  title={item.status === 'active' ? 'Set as Draft' : 'Publish / Make Active'}
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
          title="No service offerings found"
          description="Click Add Service to get started publishing CMS offerings."
          actionLabel="Create Service"
          onAction={handleOpenCreate}
        />
      )}

      {/* Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? "Modify Service Listing" : "Add Service Listing"}</h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Title</label>
                  <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cloud Solutions" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
                  <Input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Technology" />
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
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Short Description</label>
                <Input required value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="A brief one-sentence outline" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Overview / Introduction</label>
                <textarea required className="w-full min-h-[80px] p-3 rounded-lg border border-slate-200 text-sm focus-visible:outline-none" value={overview} onChange={(e) => setOverview(e.target.value)} placeholder="Introduce this service context..." />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Description</label>
                <textarea required className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 text-sm focus-visible:outline-none" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} placeholder="Provide full details of this service offering..." />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Features (Comma-separated)</label>
                <Input value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="e.g. Scalability, Security, Monitoring" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Technologies (Comma-separated)</label>
                <Input value={technologiesText} onChange={(e) => setTechnologiesText(e.target.value)} placeholder="e.g. React, AWS, Docker" />
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeModal} className="rounded-xl font-bold h-11 border-slate-200">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold h-11 px-6 shadow-sm gap-2">
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {editingId ? "Save Changes" : "Create Service"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Services;
