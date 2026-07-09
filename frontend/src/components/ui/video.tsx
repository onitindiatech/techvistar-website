import React, { useEffect, useRef } from 'react';

interface VideoProps {
  youtubeUrl: string;
  /** Seconds to start playback (and loop restart). Default 0. */
  startTime?: number;
  overlayClassName?: string;
  iframeClassName?: string;
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
}) => {
  const videoId = getYouTubeId(youtubeUrl);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const configuredStart = clampStartTime(startTime);

  useEffect(() => {
    if (!videoId || !playerContainerRef.current) return;

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
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            if (configuredStart > 0) {
              event.target.seekTo(configuredStart, true);
            }
            event.target.playVideo();
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
    };
  }, [videoId, configuredStart]);

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
      className="absolute inset-0 -z-20 w-full h-full overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <div
        ref={playerContainerRef}
        className={`absolute top-1/2 left-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none border-0 ${iframeClassName ?? ''}`}
      />
      <div className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
    </div>
  );
};
