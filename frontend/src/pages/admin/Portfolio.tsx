import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { Toolbar } from "@/components/admin/common/Toolbar";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { getAllProjects, createProject, updateProject, deleteProject } from "@/services/portfolio.service";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, Trash2, Edit, CheckCircle, HelpCircle, Eye, EyeOff, Loader2, X, Plus 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Portfolio = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("https://placehold.co/600x400/png");
  const [category, setCategory] = useState("Web App");
  const [client, setClient] = useState("Internal");
  const [role, setRole] = useState("Lead Developer");
  const [industry, setIndustry] = useState("Technology");
  const [status, setStatus] = useState<"Completed" | "In Progress" | "Coming Soon">("Completed");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [technologiesText, setTechnologiesText] = useState("");

  // Fetch Projects via React Query
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin", "portfolio"],
    queryFn: getAllProjects
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "portfolio"] });
      toast({ title: "Project Created", description: "New portfolio project published successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error creating project", description: err.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "portfolio"] });
      toast({ title: "Project Updated", description: "Portfolio project modified successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error updating project", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "portfolio"] });
      toast({ title: "Project Deleted", description: "Portfolio project removed permanently." });
    },
    onError: (err: any) => {
      toast({ title: "Error deleting project", description: err.message, variant: "destructive" });
    }
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setLongDescription("");
    setThumbnail("https://placehold.co/600x400/png");
    setCategory("Web App");
    setClient("Internal");
    setRole("Lead Developer");
    setIndustry("Technology");
    setStatus("Completed");
    setDisplayOrder("0");
    setTechnologiesText("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setLongDescription(item.longDescription || "");
    setThumbnail(item.thumbnail || "https://placehold.co/600x400/png");
    setCategory(item.category || "Web App");
    setClient(item.client || "Internal");
    setRole(item.role || "Lead Developer");
    setIndustry(item.industry || "Technology");
    setStatus(item.status || "Completed");
    setDisplayOrder(String(item.displayOrder || 0));
    setTechnologiesText((item.technologies || []).join(", "));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDateStr = new Date().toISOString().split('T')[0];
    const payload = {
      title,
      description,
      longDescription: longDescription || description,
      thumbnail,
      category,
      client,
      role,
      industry,
      status,
      date: currentDateStr,
      updatedDate: currentDateStr,
      displayOrder: Number(displayOrder) || 0,
      technologies: technologiesText.split(",").map(s => s.trim()).filter(Boolean)
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Search & Filter computation
  const filteredProjects = projects.filter((item: any) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Portfolio CMS"
        description="Manage case studies and showcase projects for marketing presentation."
        actionLabel="Add Project"
        onAction={handleOpenCreate}
      />

      <Toolbar 
        placeholder="Search projects..." 
        value={searchTerm} 
        onChange={(e: any) => setSearchTerm(e.target.value)} 
        actionLabel={statusFilter === "all" ? "All Statuses" : statusFilter}
        onActionClick={() => setStatusFilter(prev => prev === "all" ? "Completed" : prev === "Completed" ? "In Progress" : prev === "In Progress" ? "Coming Soon" : "all")}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((item: any) => (
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    item.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mt-1">{item.category}</span>
                <p className="text-slate-500 text-sm mt-3 line-clamp-3">{item.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)} className="h-8 rounded-lg text-xs font-bold gap-1 border-slate-200">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(item._id)} className="h-8 rounded-lg text-xs font-bold gap-1 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No portfolio projects found"
          description="Click Add Project to get started publishing CMS entries."
          actionLabel="Create Project"
          onAction={handleOpenCreate}
        />
      )}

      {/* Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? "Modify Portfolio Project" : "Add Portfolio Project"}</h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Title</label>
                  <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cloud Sync Platform" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
                  <Input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Web App" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Client Name</label>
                  <Input required value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. Internal, Acme Corp" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Team Role</label>
                  <Input required value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Lead Architect" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Industry</label>
                  <Input required value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. HealthCare" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Display Order</label>
                  <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={status} onChange={(e: any) => setStatus(e.target.value)}>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Thumbnail Image URL</label>
                <Input required value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Short Description</label>
                <Input required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary of the case study" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Long Description</label>
                <textarea required className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 text-sm focus-visible:outline-none" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} placeholder="Detailed case study explanation..." />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Technologies (Comma-separated)</label>
                <Input value={technologiesText} onChange={(e) => setTechnologiesText(e.target.value)} placeholder="e.g. Next.js, Node.js, GraphQL" />
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeModal} className="rounded-xl font-bold h-11 border-slate-200">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold h-11 px-6 shadow-sm gap-2">
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {editingId ? "Save Changes" : "Create Project"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
