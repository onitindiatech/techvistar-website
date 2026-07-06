import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { Toolbar } from "@/components/admin/common/Toolbar";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { getAllSubscribers, deleteSubscriber } from "@/services/newsletter.service";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, Trash2, CheckCircle, HelpCircle, Loader2, Calendar, Link
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Fetch subscribers via React Query
  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: getAllSubscribers
  });

  // Mutator
  const deleteMutation = useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "subscribers"] });
      toast({ title: "Subscriber Deleted", description: "Subscribed address removed successfully." });
    },
    onError: (err: any) => {
      toast({ title: "Error deleting subscriber", description: err.message, variant: "destructive" });
    }
  });

  // Search & Filter computation
  const filteredSubscribers = subscribers.filter((item: any) => {
    const matchesSearch = item.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = sourceFilter === "all" || item.source === sourceFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Newsletter Subscribers"
        description="Review subscribed audiences, campaign sources, and unsubscribe metrics."
      />

      <Toolbar 
        placeholder="Search email addresses..." 
        value={searchTerm} 
        onChange={(e: any) => setSearchTerm(e.target.value)}
        actionLabel={sourceFilter === "all" ? "All Sources" : sourceFilter}
        onActionClick={() => setSourceFilter(prev => prev === "all" ? "footer" : prev === "footer" ? "blog_popup" : prev === "blog_popup" ? "hero" : "all")}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      ) : filteredSubscribers.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm max-w-4xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4 font-bold">Email Address</th>
                  <th className="px-6 py-4 font-bold">Subscribed Source</th>
                  <th className="px-6 py-4 font-bold">Join Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscribers.map((item: any) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900">{item.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        {item.source || "Direct"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500 flex items-center gap-1.5 pt-6">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteMutation.mutate(item._id)}
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
          title="No subscribers found"
          description="Audiences subscribing via public newsletters will show up here."
        />
      )}
    </div>
  );
};

export default Newsletter;
