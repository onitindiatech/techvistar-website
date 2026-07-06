import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { Toolbar } from "@/components/admin/common/Toolbar";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { getAllApplications, updateApplicationStatus, deleteApplication } from "@/services/job.service";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, Trash2, CheckCircle, ExternalLink, Loader2, ArrowUpRight, Search, FileUp, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Applications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch applications via React Query
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["admin", "applications"],
    queryFn: getAllApplications
  });

  // Mutators
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
      toast({ title: "Status Updated", description: "Applicant status updated successfully." });
    },
    onError: (err: any) => {
      toast({ title: "Error updating status", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
      toast({ title: "Application Deleted", description: "Job application deleted permanently." });
    },
    onError: (err: any) => {
      toast({ title: "Error deleting application", description: err.message, variant: "destructive" });
    }
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  // Filter & Search
  const filteredApps = applications.filter((app: any) => {
    const matchesSearch = app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || app.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Job Applications"
        description="Review incoming submissions, resumes, and manage hiring pipeline statuses."
      />

      <Toolbar 
        placeholder="Search applicants (name, email)..." 
        value={searchTerm} 
        onChange={(e: any) => setSearchTerm(e.target.value)}
        actionLabel={statusFilter === "all" ? "All Stages" : statusFilter}
        onActionClick={() => setStatusFilter(prev => prev === "all" ? "Pending" : prev === "Pending" ? "Shortlisted" : prev === "Shortlisted" ? "Interview" : "all")}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4 font-bold">Applicant Details</th>
                  <th className="px-6 py-4 font-bold">Location & Contact</th>
                  <th className="px-6 py-4 font-bold">Experience</th>
                  <th className="px-6 py-4 font-bold">Resume & Portfolio</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app: any) => (
                  <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{app.fullName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-slate-700">{app.currentLocation || "Remote"}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                      {app.yearsOfExperience} Year(s)
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline">
                          <FileUp className="w-3 h-3" /> View Resume <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {app.portfolio && (
                        <div>
                          <a href={app.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline">
                            Portfolio Link <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={app.status || "Pending"} 
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-1 rounded border bg-white focus:outline-none ${
                          app.status === 'Selected' ? 'text-emerald-600 border-emerald-200' :
                          app.status === 'Rejected' ? 'text-red-600 border-red-200' :
                          app.status === 'Shortlisted' ? 'text-purple-600 border-purple-200' :
                          'text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteMutation.mutate(app._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No applications found"
          description="Candidates applying to careers catalog postings will show up here."
        />
      )}
    </div>
  );
};

export default Applications;
