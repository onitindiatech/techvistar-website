import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface VideoProps {
  youtubeUrl: string;
  /** Seconds to start playback (and loop restart). Default 0. */
  startTime?: number;
  overlayClassName?: string;
  iframeClassName?: string;
  /** Optional poster shown until the player is in view */
  posterUrl?: string;
  /** Fade poster out once YouTube player is ready (hero LCP poster) */
  fadePosterOnReady?: boolean;
  /** Begin loading the player immediately (used with hero poster placeholder) */
  loadImmediately?: boolean;
}

type YtPlayer = {
  mute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

type YtPlayerState = {
  ENDED: number;
};

type YtNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, number | string>;
      events?: {
        onReady?: (event: { target: YtPlayer }) => void;
        onStateChange?: (event: { data: number; target: YtPlayer }) => void;
      };
    }
  ) => YtPlayer;
  PlayerState: YtPlayerState;
};

declare global {
  interface Window {
    YT?: YtNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeIframeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        resolve();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        // Use the standard iframe API endpoint (nocookie domain doesn't serve this)
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }

  return youtubeApiPromise;
}

/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats.
 */
export const getYouTubeId = (url: string): string | null => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1).split('/')[0] || null;
    }
    if (parsedUrl.hostname.includes('youtube.com')) {
      if (parsedUrl.pathname.startsWith('/shorts/')) {
        return parsedUrl.pathname.split('/')[2] || null;
      }
      if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname.split('/')[2] || null;
      }
      return parsedUrl.searchParams.get('v');
    }
  } catch {
    // fallback below
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

function clampStartTime(seconds?: number): number {
  const value = Number.isFinite(seconds) ? Math.round(seconds as number) : 3;
  return Math.max(0, Math.min(600, value));
}

/**
 * Decorative full-screen YouTube background (no controls, loops from configured start).
 */
export const Video: React.FC<VideoProps> = ({
  youtubeUrl,
  startTime = 3,
  overlayClassName = 'bg-black/50',
  iframeClassName,
  posterUrl,
  fadePosterOnReady = false,
  loadImmediately = false,
}) => {
  const videoId = getYouTubeId(youtubeUrl);
  const rootRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const configuredStart = clampStartTime(startTime);
  const [isActive, setIsActive] = useState(loadImmediately);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    if (loadImmediately) return;

    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.05 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [loadImmediately]);

  useEffect(() => {
    const shouldLoad = loadImmediately || isActive;
    if (!shouldLoad || !videoId || !playerContainerRef.current) return;

    let cancelled = false;

    const mountPlayer = async () => {
      await loadYouTubeIframeApi();
      if (cancelled || !playerContainerRef.current || !window.YT?.Player) return;

      playerRef.current?.destroy();
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: videoId,
          start: configuredStart,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          enablejsapi: 1,
          // Declare the host origin so YouTube postMessage targets the correct window.
          // This eliminates the "target origin does not match" console error.
          origin: window.location.origin,
          // Use privacy-enhanced mode to avoid third-party ad/tracking requests.
          host: 'https://www.youtube-nocookie.com',
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            if (configuredStart > 0) {
              event.target.seekTo(configuredStart, true);
            }
            event.target.playVideo();
            setPlayerReady(true);
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.ENDED) {
              event.target.seekTo(configuredStart, true);
              event.target.playVideo();
            }
          },
        },
      });
    };

    void mountPlayer();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setPlayerReady(false);
    };
  }, [videoId, configuredStart, isActive, loadImmediately]);

  if (!videoId) {
    return (
      <div
        className="absolute inset-0 bg-zinc-950 flex items-center justify-center text-zinc-500 text-sm"
        aria-label="Video error"
      >
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 -z-20 w-full h-full overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {posterUrl && (fadePosterOnReady || !isActive) ? (
        <img
          src={posterUrl}
          alt=""
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            fadePosterOnReady && 'transition-opacity duration-500 ease-in-out',
            fadePosterOnReady && playerReady ? 'opacity-0' : 'opacity-100',
          )}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      ) : null}
      <div
        ref={playerContainerRef}
        className={`absolute top-1/2 left-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none border-0 ${iframeClassName ?? ''}`}
      />
      <div className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
    </div>
  );
};
