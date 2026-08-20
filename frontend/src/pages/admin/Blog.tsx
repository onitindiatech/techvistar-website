import { useState } from "react";
import { Plus, FileText, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, BlogPost } from "@/services/blog.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Blog() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog"],
    queryFn: getBlogPosts,
  });

  const createMutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success("Blog post created successfully");
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create blog post"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPost> }) => updateBlogPost({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success("Blog post updated successfully");
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to update blog post"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success("Blog post deleted successfully");
    },
    onError: () => toast.error("Failed to delete blog post"),
  });

  const openModal = (item?: BlogPost) => {
    setEditingItem(item || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Blog & Articles</h1>
          <p className="text-sm text-slate-500">Manage your blog posts and articles.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 shadow-sm transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" /> Create Post
        </button>
      </div>

      {isLoading ? (
        <div className="h-40 rounded-2xl border border-slate-100 bg-white flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-slate-200" />
          <h3 className="mt-4 text-sm font-semibold text-slate-900">No blog posts</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by creating a new article.</p>
          <button
            onClick={() => openModal()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-100"
          >
            <Plus className="h-4 w-4" /> Create Post
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{post.title}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">/{post.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{post.author}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${post.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {post.status === 'Published' ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-2 w-2 rounded-full bg-amber-500" />}
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(post)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(post._id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
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
              className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50 shrink-0">
                <h3 className="text-lg font-bold text-slate-900">{editingItem ? "Edit Blog Post" : "Create Blog Post"}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-6">
                <form
                  id="blog-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = {
                      title: formData.get("title") as string,
                      slug: formData.get("slug") as string,
                      author: formData.get("author") as string,
                      category: formData.get("category") as string,
                      featuredImage: formData.get("featuredImage") as string,
                      content: formData.get("content") as string,
                      status: formData.get("status") as 'Published' | 'Draft',
                      publicationDate: formData.get("publicationDate") as string || new Date().toISOString(),
                    };
                    if (editingItem) updateMutation.mutate({ id: editingItem._id, data });
                    else createMutation.mutate(data);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Title *</label>
                      <input name="title" required defaultValue={editingItem?.title} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">URL Slug *</label>
                      <input name="slug" required defaultValue={editingItem?.slug} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Author *</label>
                      <input name="author" required defaultValue={editingItem?.author} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Category *</label>
                      <input name="category" required defaultValue={editingItem?.category} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Featured Image URL</label>
                    <input name="featuredImage" defaultValue={editingItem?.featuredImage} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Content (HTML/Markdown) *</label>
                    <textarea name="content" required rows={10} defaultValue={editingItem?.content} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Status</label>
                      <select name="status" defaultValue={editingItem?.status || "Draft"} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Publication Date</label>
                      <input name="publicationDate" type="date" defaultValue={editingItem?.publicationDate ? new Date(editingItem.publicationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>
                </form>
              </div>
              <div className="px-6 py-4 flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <button type="button" onClick={closeModal} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" form="blog-form" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {(createMutation.isPending || updateMutation.isPending) && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  {editingItem ? "Save Changes" : "Create Post"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
