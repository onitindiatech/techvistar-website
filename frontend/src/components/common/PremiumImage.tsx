import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface PremiumImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatioClassName?: string; // e.g. "aspect-[16/10]" or "aspect-video"
  className?: string;
  overlayClassName?: string;
  showOverlay?: boolean;
}

export const PremiumImage = ({
  src,
  alt,
  aspectRatioClassName = 'aspect-[16/10]',
  className = '',
  overlayClassName = '',
  showOverlay = true,
  ...props
}: PremiumImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative w-full overflow-hidden bg-slate-100/60", aspectRatioClassName, className)}>
      {/* Skeleton Pulse Loader */}
      {!loaded && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-emerald-500 animate-spin" />
        </div>
      )}

      {/* Image Element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-all duration-700 ease-out",
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
        )}
        {...props}
      />

      {/* Ambient Gradient Overlay */}
      {showOverlay && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent pointer-events-none opacity-80 group-hover/cover:opacity-60 group-hover:opacity-60 transition-opacity duration-500",
            overlayClassName
          )}
        />
      )}
    </div>
  );
};
export default PremiumImage;
