import { useRef, useState } from 'react';
import { Film, Loader2, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uploadVideoFile, validateVideoFile } from '@/services/upload.service';
import { useToast } from '@/hooks/use-toast';

interface CmsVideoFieldProps {
  label: string;
  value: string;
  onChange: (url: string, publicId?: string) => void;
  publicId?: string;
  hint?: string;
}

export const CmsVideoField = ({ label, value, onChange, hint }: CmsVideoFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    const error = validateVideoFile(file);
    if (error) {
      toast({ title: 'Invalid video', description: error, variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const result = await uploadVideoFile(file);
      onChange(result.videoUrl, result.publicId);
      toast({ title: 'Uploaded', description: 'Video uploaded to Cloudinary.' });
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Could not upload video.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase text-slate-500">{label}</label>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-black">
          <video src={value} className="max-h-48 w-full object-contain" controls muted playsInline preload="metadata" />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:border-emerald-400 hover:bg-emerald-50/30"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          ) : (
            <>
              <Film className="h-6 w-6 text-slate-400" />
              <p className="text-xs text-slate-500">MP4 or WebM — max 50 MB</p>
            </>
          )}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          placeholder="Or paste Cloudinary video URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <Upload className="mr-1 h-4 w-4" />
          Upload
        </Button>
      </div>
      {hint ? <p className="text-[11px] text-slate-400">{hint}</p> : null}
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,.mp4,.webm"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};
