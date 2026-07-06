import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { Toolbar } from "@/components/admin/common/Toolbar";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { getAllContacts, updateContactStatus, deleteContact } from "@/services/contact.service";
import { useToast } from "@/hooks/use-toast";
import { 
  Contact, Trash2, Eye, EyeOff, Loader2, Mail, Phone, Building, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Contacts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch contact inquiries
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["admin", "contacts"],
    queryFn: getAllContacts
  });

  // Mutators
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateContactStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] });
      toast({ title: "Inquiry Updated", description: "Inquiry status updated successfully." });
    },
    onError: (err: any) => {
      toast({ title: "Error updating inquiry", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] });
      toast({ title: "Inquiry Deleted", description: "Inquiry removed permanently." });
    },
    onError: (err: any) => {
      toast({ title: "Error deleting inquiry", description: err.message, variant: "destructive" });
    }
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  // Search & Filter
  const filteredContacts = contacts.filter((c: any) => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || c.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Contact Inquiries"
        description="Monitor contact submissions and inquiries received from public web visitors."
      />

      <Toolbar 
        placeholder="Search inquiries (name, message)..." 
        value={searchTerm} 
        onChange={(e: any) => setSearchTerm(e.target.value)}
        actionLabel={statusFilter === "all" ? "All Statuses" : statusFilter}
        onActionClick={() => setStatusFilter(prev => prev === "all" ? "new" : prev === "new" ? "read" : prev === "read" ? "resolved" : "all")}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      ) : filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredContacts.map((c: any) => (
            <div key={c._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {c.name}
                    <span className="text-xs font-semibold text-slate-400">({c.email})</span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone || "No phone"}</span>
                    {c.company && <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-slate-400" /> {c.company}</span>}
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Interested: <span className="text-emerald-600 uppercase">{c.serviceInterested}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select 
                    value={c.status || "new"} 
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded border bg-white focus:outline-none ${
                      c.status === 'resolved' ? 'text-emerald-600 border-emerald-200 bg-emerald-50/10' :
                      c.status === 'read' ? 'text-blue-600 border-blue-200 bg-blue-50/10' :
                      'text-red-600 border-red-200 bg-red-50/10'
                    }`}
                  >
                    <option value="new">Unread / New</option>
                    <option value="read">Read</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteMutation.mutate(c._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{c.message}</p>
                {c.budget && (
                  <div className="text-[11px] font-bold text-amber-600 mt-4 uppercase tracking-wider">
                    Budget estimate: {c.budget}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No contact submissions"
          description="Inquiries submitted via footer/contact form will show up here."
        />
      )}
    </div>
  );
};

export default Contacts;
