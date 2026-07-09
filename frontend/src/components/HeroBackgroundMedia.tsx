import { Video } from '@/components/ui/video';
import type { HomeHeroConfig } from '@/types/homeCms';
import { cn } from '@/lib/utils';

interface HeroBackgroundMediaProps {
  hero: HomeHeroConfig;
}

export function HeroBackgroundMedia({ hero }: HeroBackgroundMediaProps) {
  const overlayOpacity = Math.min(90, Math.max(0, hero.overlayOpacity)) / 100;

  if (hero.mediaType === 'video') {
    const hasNative =
      Boolean(hero.backgroundVideoMp4?.trim()) ||
      Boolean(hero.backgroundVideoWebm?.trim()) ||
      Boolean(hero.backgroundVideoUrl?.trim());

    if (hasNative) {
      return (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={hero.backgroundImage || undefined}
            className={cn(
              'pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover select-none',
              hero.backgroundBlur && 'scale-105 blur-sm'
            )}
            aria-hidden
          >
            {hero.backgroundVideoMp4 ? <source src={hero.backgroundVideoMp4} type="video/mp4" /> : null}
            {hero.backgroundVideoWebm ? <source src={hero.backgroundVideoWebm} type="video/webm" /> : null}
            {hero.backgroundVideoUrl ? <source src={hero.backgroundVideoUrl} /> : null}
          </video>
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
          />
        </>
      );
    }

    if (hero.youtubeUrl) {
      return (
        <Video
          youtubeUrl={hero.youtubeUrl}
          startTime={hero.youtubeStartTime}
          overlayClassName={`bg-black/${hero.overlayOpacity}`}
          iframeClassName="w-[177.78svh]"
        />
      );
    }
  }

  if (hero.backgroundImage) {
    return (
      <>
        <img
          src={hero.backgroundImage}
          alt=""
          className={cn(
            'pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover',
            hero.backgroundBlur && 'scale-105 blur-sm'
          )}
          loading="eager"
          fetchPriority="high"
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      </>
    );
  }

  if (hero.youtubeUrl) {
    return (
      <Video
        youtubeUrl={hero.youtubeUrl}
        startTime={hero.youtubeStartTime}
        overlayClassName={`bg-black/${hero.overlayOpacity}`}
        iframeClassName="w-[177.78svh]"
      />
    );
  }

  return null;
}
