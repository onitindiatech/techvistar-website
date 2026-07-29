import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { CloudUpload, ImageIcon, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { uploadImageFile, UPLOAD_CONSTRAINTS, validateImageFile } from "@/services/upload.service";
import type { UploadedImageData } from "@/types/upload";

export type { UploadedImageData };

export interface ImageUploadProps {
  /** Current image URL (e.g. from CMS record on edit). */
  value?: string;
  /** Called after a successful upload or when the image is removed. */
  onChange: (data: UploadedImageData | null) => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  label = "Image",
  helperText = "JPG, JPEG, PNG, WEBP, or SVG — max 5 MB",
  disabled = false,
  className,
}: ImageUploadProps) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [uploadMeta, setUploadMeta] = useState<UploadedImageData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const acceptAttr = UPLOAD_CONSTRAINTS.acceptedExtensions.join(",");

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = useCallback(async (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      toast({
        title: "Invalid image",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadImageFile(file, setProgress);
      setPreviewUrl(result.imageUrl);
      setUploadMeta(result);
      onChange(result);
      toast({
        title: "Image uploaded",
        description: "Your image was uploaded to Cloudinary successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
      resetInput();
    }
  }, [onChange, toast]);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleUpload(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled && !isUploading) setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) void handleUpload(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setUploadMeta(null);
    onChange(null);
    resetInput();
  };

  const handleReplace = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  const hasPreview = Boolean(previewUrl);

  return (
    <div className={cn("space-y-3", className)}>
      {label ? (
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleFileInput}
      />

      {hasPreview ? (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 h-[180px] flex items-center justify-center">
            {isUploading ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="text-xs font-bold text-slate-600">Uploading… {progress}%</span>
              </div>
            ) : null}
            <img
              src={previewUrl!}
              alt={label}
              className="max-h-full max-w-full object-contain p-2"
            />
          </div>

          {uploadMeta ? (
            <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500">
              <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200 uppercase">
                {uploadMeta.format}
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
                {uploadMeta.width} × {uploadMeta.height}
              </span>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReplace}
              disabled={disabled || isUploading}
              className="h-8 rounded-lg text-xs font-bold gap-1.5 border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Replace
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="h-8 rounded-lg text-xs font-bold gap-1.5 border-red-100 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (!disabled && !isUploading) inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all cursor-pointer outline-none",
            "bg-slate-50/40 border-slate-200 hover:border-emerald-500/50 hover:bg-slate-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]",
            isDragging && "border-emerald-500 bg-emerald-50/30 scale-[1.005]",
            (disabled || isUploading) && "opacity-60 cursor-not-allowed pointer-events-none"
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03)_0%,transparent_60%)] pointer-events-none rounded-2xl" />

          {isUploading ? (
            <div className="relative z-10 flex flex-col items-center gap-3">
              <Loader2 className="w-9 h-9 animate-spin text-emerald-600" />
              <p className="text-xs font-bold text-slate-700">Uploading image…</p>
              <div className="w-44 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500">{progress}%</span>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-[0_4px_16px_rgba(16,185,129,0.06)] border border-slate-100">
                <CloudUpload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900 tracking-tight">
                  Drag & drop an image here
                </p>
                <p className="mt-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  or click to browse file
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-[10px] font-bold gap-1.5 border-slate-200 bg-white shadow-sm pointer-events-none uppercase tracking-wider"
              >
                <Upload className="w-3 h-3" />
                Choose Image
              </Button>
            </div>
          )}
        </div>
      )}

      {helperText ? (
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default ImageUpload;
