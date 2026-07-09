import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsVideoField } from '@/components/admin/common/CmsVideoField';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type CmsMediaType = 'image' | 'video';

interface CmsMediaFieldProps {
  mediaType: CmsMediaType;
  onMediaTypeChange: (type: CmsMediaType) => void;
  imageUrl: string;
  onImageChange: (url: string, publicId?: string) => void;
  videoMp4: string;
  videoWebm: string;
  videoUrl: string;
  onVideoMp4Change: (url: string, publicId?: string) => void;
  onVideoWebmChange: (url: string) => void;
  onVideoUrlChange: (url: string, publicId?: string) => void;
  youtubeUrl?: string;
  onYoutubeUrlChange?: (url: string) => void;
}

export const CmsMediaField = ({
  mediaType,
  onMediaTypeChange,
  imageUrl,
  onImageChange,
  videoMp4,
  videoWebm,
  videoUrl,
  onVideoMp4Change,
  onVideoWebmChange,
  onVideoUrlChange,
  youtubeUrl,
  onYoutubeUrlChange,
}: CmsMediaFieldProps) => (
  <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">Media type</p>
      <RadioGroup
        value={mediaType}
        onValueChange={(v) => onMediaTypeChange(v as CmsMediaType)}
        className="flex gap-6"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="image" id="media-image" />
          <Label htmlFor="media-image" className="text-sm font-medium">Image</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="video" id="media-video" />
          <Label htmlFor="media-video" className="text-sm font-medium">Video</Label>
        </div>
      </RadioGroup>
    </div>

    {mediaType === 'image' ? (
      <CmsImageField label="Background image" value={imageUrl} onChange={onImageChange} />
    ) : (
      <div className="space-y-4">
        <p className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-800">
          Uploaded MP4/WebM takes priority on the homepage. YouTube is only used when no uploaded video is set.
        </p>
        <CmsVideoField label="MP4 upload / URL (recommended)" value={videoMp4} onChange={onVideoMp4Change} />
        <CmsVideoField label="WebM upload / URL (optional)" value={videoWebm} onChange={(url) => onVideoWebmChange(url)} />
        <CmsVideoField label="Cloudinary video URL" value={videoUrl} onChange={onVideoUrlChange} hint="Used when MP4/WebM are not set." />
        {onYoutubeUrlChange ? (
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-500">YouTube fallback URL (last resort)</label>
            <input
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={youtubeUrl ?? ''}
              onChange={(e) => onYoutubeUrlChange(e.target.value)}
              placeholder="https://youtu.be/..."
            />
            {youtubeUrl?.trim() ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                Note: YouTube may display temporary playback overlays. For a clean professional hero background,
                upload an MP4/WebM video instead.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    )}
  </div>
);
