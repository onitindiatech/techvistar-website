import { useState } from "react";
import { Plus, Users, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, TeamMember } from "@/services/team.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Team() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: getTeamMembers,
  });

  const createMutation = useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success("Team member added successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to add team member"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TeamMember> }) => updateTeamMember({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success("Team member updated successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to update team member"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success("Team member deleted successfully");
    },
    onError: () => toast.error("Failed to delete team member"),
  });

  const openModal = (item?: TeamMember) => {
    setEditingItem(item || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Team Management</h1>
          <p className="text-sm text-slate-500">Manage team members and their roles.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 shadow-sm transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" /> Add Member
        </button>
      </div>

      {isLoading ? (
        <div className="h-40 rounded-2xl border border-slate-100 bg-white flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <Users className="mx-auto h-12 w-12 text-slate-200" />
          <h3 className="mt-4 text-sm font-semibold text-slate-900">No team members</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by adding a new team member.</p>
          <button
            onClick={() => openModal()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-100"
          >
            <Plus className="h-4 w-4" /> Add Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((m) => (
            <div key={m._id} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
              <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => openModal(m)} className="rounded-md bg-white p-1.5 text-slate-400 shadow-sm hover:text-emerald-600 border border-slate-100">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(m._id)} className="rounded-md bg-white p-1.5 text-slate-400 shadow-sm hover:text-red-600 border border-slate-100">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-slate-50 bg-slate-100 shrink-0">
                  {m.profileImage ? (
                    <img src={m.profileImage} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-400 bg-emerald-50">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">{m.name}</h3>
                <p className="mt-0.5 text-xs font-semibold text-emerald-600 uppercase tracking-wider">{m.role}</p>
                <p className="mt-3 text-xs text-slate-500 line-clamp-3 leading-relaxed">{m.bio}</p>
                
                <div className="mt-4 flex items-center gap-1.5 w-full pt-4 border-t border-slate-50">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wider flex-1 justify-center ${m.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {m.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {m.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50 shrink-0">
                <h3 className="text-lg font-bold text-slate-900">{editingItem ? "Edit Team Member" : "Add Team Member"}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-6">
                <form
                  id="team-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = {
                      name: formData.get("name") as string,
                      role: formData.get("role") as string,
                      email: formData.get("email") as string,
                      bio: formData.get("bio") as string,
                      profileImage: formData.get("profileImage") as string,
                      displayOrder: Number(formData.get("displayOrder") || 0),
                      isActive: formData.get("isActive") === "true",
                      socialLinks: {
                        linkedin: formData.get("linkedin") as string,
                        twitter: formData.get("twitter") as string,
                      }
                    };
                    if (editingItem) updateMutation.mutate({ id: editingItem._id, data });
                    else createMutation.mutate(data);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Name *</label>
                      <input name="name" required defaultValue={editingItem?.name} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Role *</label>
                      <input name="role" required defaultValue={editingItem?.role} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Email *</label>
                      <input name="email" type="email" required defaultValue={editingItem?.email} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Profile Image URL</label>
                      <input name="profileImage" defaultValue={editingItem?.profileImage} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Bio *</label>
                    <textarea name="bio" required rows={3} defaultValue={editingItem?.bio} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">LinkedIn URL</label>
                      <input name="linkedin" defaultValue={editingItem?.socialLinks?.linkedin} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Twitter URL</label>
                      <input name="twitter" defaultValue={editingItem?.socialLinks?.twitter} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Display Order</label>
                      <input name="displayOrder" type="number" defaultValue={editingItem?.displayOrder || 0} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Status</label>
                      <select name="isActive" defaultValue={editingItem ? (editingItem.isActive ? "true" : "false") : "true"} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="px-6 py-4 flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <button type="button" onClick={closeModal} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" form="team-form" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {(createMutation.isPending || updateMutation.isPending) && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  {editingItem ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
