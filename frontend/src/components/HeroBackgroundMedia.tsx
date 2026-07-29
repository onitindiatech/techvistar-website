import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Video } from '@/components/ui/video';
import type { HomeHeroConfig } from '@/types/homeCms';
import { cn } from '@/lib/utils';

interface HeroBackgroundMediaProps {
  hero: HomeHeroConfig;
}

const POSTER_FADE_MS = 500;

const HERO_MEDIA_CLASS =
  'pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover select-none object-[62%_28%] sm:object-[55%_32%] md:object-[center_35%] lg:object-center';

function useOffscreenMediaPause<T extends HTMLMediaElement>(enabled: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!el) return;
        if (entry?.isIntersecting) {
          void el.play().catch(() => undefined);
        } else {
          el.pause();
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
}

function HeroPosterLayer({
  src,
  blur,
  visible,
  fadeDuration = POSTER_FADE_MS,
}: {
  src: string;
  blur: boolean;
  visible: boolean;
  fadeDuration?: number;
}) {
  return (
    <img
      src={src}
      alt=""
      className={cn(
        HERO_MEDIA_CLASS,
        blur && 'scale-105 blur-sm',
        'transition-opacity ease-in-out',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      style={{ transitionDuration: `${fadeDuration}ms` }}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      sizes="100vw"
      aria-hidden
    />
  );
}

function markVideoReady(setReady: (value: boolean) => void) {
  setReady(true);
}

function HeroNativeVideo({
  hero,
  overlayOpacity,
}: {
  hero: HomeHeroConfig;
  overlayOpacity: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useOffscreenMediaPause<HTMLVideoElement>(true);
  const posterUrl = hero.heroPosterImage?.trim() || '';
  const usePosterLayer = Boolean(posterUrl);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const hidePoster = videoReady && !videoFailed;
  const fadeDuration = prefersReducedMotion ? 0 : POSTER_FADE_MS;

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload={usePosterLayer ? 'auto' : 'metadata'}
        poster={!usePosterLayer ? hero.backgroundImage || undefined : undefined}
        className={cn(HERO_MEDIA_CLASS, hero.backgroundBlur && 'scale-105 blur-sm')}
        onCanPlayThrough={() => markVideoReady(setVideoReady)}
        onLoadedData={() => {
          if (usePosterLayer) markVideoReady(setVideoReady);
        }}
        onError={() => {
          if (usePosterLayer) setVideoFailed(true);
        }}
        aria-hidden
      >
        {hero.backgroundVideoMp4 ? <source src={hero.backgroundVideoMp4} type="video/mp4" /> : null}
        {hero.backgroundVideoWebm ? <source src={hero.backgroundVideoWebm} type="video/webm" /> : null}
        {hero.backgroundVideoUrl ? <source src={hero.backgroundVideoUrl} /> : null}
      </video>
      {usePosterLayer ? (
        <HeroPosterLayer
          src={posterUrl}
          blur={hero.backgroundBlur}
          visible={!hidePoster}
          fadeDuration={fadeDuration}
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
      />
    </>
  );
}

export function HeroBackgroundMedia({ hero }: HeroBackgroundMediaProps) {
  const overlayOpacity = Math.min(90, Math.max(0, hero.overlayOpacity)) / 100;
  const heroPoster = hero.heroPosterImage?.trim() || '';

  if (hero.mediaType === 'video') {
    const hasNative =
      Boolean(hero.backgroundVideoMp4?.trim()) ||
      Boolean(hero.backgroundVideoWebm?.trim()) ||
      Boolean(hero.backgroundVideoUrl?.trim());

    if (hasNative) {
      return <HeroNativeVideo hero={hero} overlayOpacity={overlayOpacity} />;
    }

    if (hero.youtubeUrl?.trim()) {
      return (
        <Video
          youtubeUrl={hero.youtubeUrl}
          startTime={hero.youtubeStartTime}
          overlayClassName={`bg-black/${hero.overlayOpacity}`}
          iframeClassName="w-[177.78svh]"
          posterUrl={heroPoster || hero.backgroundImage || undefined}
          fadePosterOnReady={Boolean(heroPoster)}
          loadImmediately={Boolean(heroPoster)}
        />
      );
    }

    if (heroPoster) {
      return (
        <>
          <img
            src={heroPoster}
            alt=""
            className={cn(HERO_MEDIA_CLASS, hero.backgroundBlur && 'scale-105 blur-sm')}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
          />
        </>
      );
    }

    return null;
  }

  if (hero.backgroundImage) {
    return (
      <>
        <img
          src={hero.backgroundImage}
          alt=""
          className={cn(
            HERO_MEDIA_CLASS,
            hero.backgroundBlur && 'scale-105 blur-sm',
          )}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      </>
    );
  }

  if (hero.youtubeUrl?.trim()) {
    return (
      <Video
        youtubeUrl={hero.youtubeUrl}
        startTime={hero.youtubeStartTime}
        overlayClassName={`bg-black/${hero.overlayOpacity}`}
        iframeClassName="w-[177.78svh]"
        posterUrl={heroPoster || hero.backgroundImage || undefined}
        fadePosterOnReady={Boolean(heroPoster)}
        loadImmediately={Boolean(heroPoster)}
      />
    );
  }

  return null;
}
