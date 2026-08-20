import { useState, useRef } from "react";
import { Plus, Image as ImageIcon, Trash2, Copy, Check, UploadCloud, XCircle, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedia, uploadMedia, deleteMedia, Media } from "@/services/media.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function MediaLibrary() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewMedia, setPreviewMedia] = useState<Media | null>(null);

  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: getMedia,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Image uploaded successfully");
      setIsUploading(false);
    },
    onError: () => {
      toast.error("Failed to upload image");
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media deleted successfully");
      setPreviewMedia(null);
    },
    onError: () => toast.error("Failed to delete media"),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this image? It will no longer be available.")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredMedia = mediaItems.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Media Library</h1>
          <p className="text-sm text-slate-500">Manage images and uploaded files.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 shadow-sm transition-all hover:shadow-md disabled:opacity-50 shrink-0"
          >
            {isUploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Upload Image
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 rounded-2xl border border-slate-100 bg-white flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <UploadCloud className="mx-auto h-12 w-12 text-slate-200" />
          <h3 className="mt-4 text-sm font-semibold text-slate-900">No media uploaded</h3>
          <p className="mt-1 text-sm text-slate-500">Upload your first image to get started.</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-100"
          >
            <Plus className="h-4 w-4" /> Upload Media
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item._id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all hover:shadow-md"
            >
              <img
                src={item.url}
                alt={item.filename}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                onClick={() => setPreviewMedia(item)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 w-full p-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{item.filename}</p>
                    <p className="text-[10px] text-slate-300">{(item.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="flex shrink-0 gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(item.url, item._id);
                      }}
                      className="rounded bg-white/20 p-1.5 text-white backdrop-blur-sm hover:bg-emerald-500 transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item._id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="rounded bg-white/20 p-1.5 text-white backdrop-blur-sm hover:bg-red-500 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredMedia.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No images match your search.
            </div>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewMedia && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 sm:p-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="w-full md:w-2/3 bg-slate-100 flex items-center justify-center p-4 relative min-h-[300px]">
                <img src={previewMedia.url} alt={previewMedia.filename} className="max-h-full max-w-full object-contain rounded-lg" />
              </div>
              <div className="w-full md:w-1/3 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-bold text-slate-900 break-all">{previewMedia.filename}</h3>
                  <button onClick={() => setPreviewMedia(null)} className="text-slate-400 hover:text-slate-600 shrink-0">
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">File Type</p>
                    <p className="text-sm font-medium text-slate-700">{previewMedia.mimeType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">File Size</p>
                    <p className="text-sm font-medium text-slate-700">{(previewMedia.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Uploaded On</p>
                    <p className="text-sm font-medium text-slate-700">{new Date(previewMedia.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Image URL</p>
                    <div className="flex items-center gap-2">
                      <input readOnly value={previewMedia.url} className="w-full rounded bg-slate-50 border border-slate-200 px-2 py-1.5 text-xs text-slate-600 outline-none" />
                      <button
                        onClick={() => handleCopyUrl(previewMedia.url, previewMedia._id)}
                        className="rounded bg-emerald-50 p-1.5 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      >
                        {copiedId === previewMedia._id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={() => handleDelete(previewMedia._id)}
                    className="w-full rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors flex justify-center items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Image
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
