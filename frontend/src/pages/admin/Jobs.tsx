import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { Toolbar } from "@/components/admin/common/Toolbar";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { getAllJobs, createJob, updateJob, deleteJob, updateJobStatus } from "@/services/job.service";
import { useToast } from "@/hooks/use-toast";
import { 
  BriefcaseBusiness, Trash2, Edit, CheckCircle, HelpCircle, Eye, EyeOff, Loader2, X, Plus 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Jobs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<"Engineering" | "Design" | "Marketing" | "Sales" | "Product" | "Operations" | "Other">("Engineering");
  const [location, setLocation] = useState("Remote");
  const [employmentType, setEmploymentType] = useState<"Full-time" | "Part-time" | "Contract" | "Internship">("Full-time");
  const [experience, setExperience] = useState("3+ years");
  const [salary, setSalary] = useState("Competitive");
  const [description, setDescription] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [status, setStatus] = useState<"active" | "closed" | "draft">("draft");

  // Fetch Jobs via React Query
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: getAllJobs
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      toast({ title: "Job Listing Created", description: "New job posting published successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error creating job", description: err.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      toast({ title: "Job Listing Updated", description: "Job listing modified successfully." });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: "Error updating job", description: err.message, variant: "destructive" });
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) => updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      toast({ title: "Status Updated", description: "Job status modified." });
    },
    onError: (err: any) => {
      toast({ title: "Error toggling status", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      toast({ title: "Job Posting Deleted", description: "Listing removed permanently." });
    },
    onError: (err: any) => {
      toast({ title: "Error deleting job", description: err.message, variant: "destructive" });
    }
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
    setStatus("draft");
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
    setStatus(item.status || "draft");
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
      department,
      location,
      employmentType,
      experience,
      salary,
      description,
      status,
      requirements: requirementsText.split(",").map(s => s.trim()).filter(Boolean),
      responsibilities: ["Develop enterprise modules", "Ensure unit testing"],
      benefits: ["Health care", "Flexible working"]
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleStatus = (item: any) => {
    const nextStatus = item.status === "active" ? "draft" : "active";
    statusMutation.mutate({ id: item._id, status: nextStatus });
  };

  // Search & Filter computation
  const filteredJobs = jobs.filter((item: any) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Jobs CMS"
        description="Create and publish active job postings for the TechVistar careers catalog."
        actionLabel="Post Job"
        onAction={handleOpenCreate}
      />

      <Toolbar 
        placeholder="Search job titles..." 
        value={searchTerm} 
        onChange={(e: any) => setSearchTerm(e.target.value)} 
        actionLabel={statusFilter === "all" ? "All Statuses" : statusFilter}
        onActionClick={() => setStatusFilter(prev => prev === "all" ? "active" : prev === "active" ? "draft" : "all")}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((item: any) => (
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                    <BriefcaseBusiness className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    item.status === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mt-1">{item.department} • {item.location} ({item.employmentType})</span>
                <p className="text-slate-500 text-sm mt-3 line-clamp-3">{item.description}</p>
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
          title="No job listings found"
          description="Click Post Job to publish career postings."
          actionLabel="Create Post"
          onAction={handleOpenCreate}
        />
      )}

      {/* Creation/Edit Modal */}
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
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Product">Product</option>
                    <option value="Operations">Operations</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Employment Type</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={employmentType} onChange={(e: any) => setEmploymentType(e.target.value)}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</label>
                  <Input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote, NY" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience Needed</label>
                  <Input required value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 3+ years" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Salary</label>
                  <Input required value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. Competitive" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus-visible:outline-none bg-white" value={status} onChange={(e: any) => setStatus(e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
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
