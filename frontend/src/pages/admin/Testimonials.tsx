import { useState } from "react";
import { Plus, MessageSquareQuote, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, Testimonial } from "@/services/testimonial.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });

  const createMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial added successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to add testimonial"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Testimonial> }) => updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial updated successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to update testimonial"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted successfully");
    },
    onError: () => toast.error("Failed to delete testimonial"),
  });

  const openModal = (item?: Testimonial) => {
    setEditingItem(item || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Testimonials</h1>
          <p className="text-sm text-slate-500">Manage client testimonials and reviews.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 shadow-sm transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {isLoading ? (
        <div className="h-40 rounded-2xl border border-slate-100 bg-white flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <MessageSquareQuote className="mx-auto h-12 w-12 text-slate-200" />
          <h3 className="mt-4 text-sm font-semibold text-slate-900">No testimonials</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by adding a new testimonial.</p>
          <button
            onClick={() => openModal()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-100"
          >
            <Plus className="h-4 w-4" /> Add Testimonial
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 overflow-hidden">
                        {t.profileImage ? (
                          <img src={t.profileImage} alt={t.clientName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400 font-bold bg-emerald-50">
                            {t.clientName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{t.clientName}</p>
                        <p className="text-xs text-slate-500">{t.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{t.company}</td>
                  <td className="px-6 py-4">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${t.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {t.status === 'Published' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(t)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(t._id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">{editingItem ? "Edit Testimonial" : "Add Testimonial"}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    clientName: formData.get("clientName") as string,
                    designation: formData.get("designation") as string,
                    company: formData.get("company") as string,
                    testimonial: formData.get("testimonial") as string,
                    rating: Number(formData.get("rating")),
                    status: formData.get("status") as 'Published' | 'Draft',
                    profileImage: formData.get("profileImage") as string,
                  };
                  if (editingItem) updateMutation.mutate({ id: editingItem._id, data });
                  else createMutation.mutate(data);
                }}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Client Name *</label>
                    <input name="clientName" required defaultValue={editingItem?.clientName} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Company *</label>
                    <input name="company" required defaultValue={editingItem?.company} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Designation *</label>
                    <input name="designation" required defaultValue={editingItem?.designation} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Rating (1-5) *</label>
                    <input name="rating" type="number" min="1" max="5" required defaultValue={editingItem?.rating || 5} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Testimonial Content *</label>
                  <textarea name="testimonial" required rows={4} defaultValue={editingItem?.testimonial} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Profile Image URL</label>
                    <input name="profileImage" defaultValue={editingItem?.profileImage} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Status</label>
                    <select name="status" defaultValue={editingItem?.status || "Published"} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={closeModal} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {(createMutation.isPending || updateMutation.isPending) && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    {editingItem ? "Save Changes" : "Add Testimonial"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
