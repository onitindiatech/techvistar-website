import React from 'react';

interface VideoProps {
  /** The full YouTube URL to extract the video ID from and play as background. */
  youtubeUrl: string;
  /** Optional class name to customize the dark overlay. Default is 'bg-black/50'. */
  overlayClassName?: string;
  /** Optional class name to customize the iframe (e.g. for custom heights). */
  iframeClassName?: string;
}

/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats.
 * Supports standard URLs, short (youtu.be) URLs, embeds, and mobile/shorts URLs.
 */
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1);
    }
    if (parsedUrl.hostname.includes('youtube.com')) {
      if (parsedUrl.pathname.startsWith('/shorts/')) {
        return parsedUrl.pathname.split('/')[2];
      }
      if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname.split('/')[2];
      }
      return parsedUrl.searchParams.get('v');
    }
  } catch {
    // Fallback to regex if URL parsing fails
  }

  // Regex fallback matching standard patterns
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Video Component
 * Renders a full-screen background YouTube video with customized overlay and configurations.
 */
export const Video: React.FC<VideoProps> = ({
  youtubeUrl,
  overlayClassName = 'bg-black/50',
  iframeClassName,
}) => {
  const videoId = getYouTubeId(youtubeUrl);

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

  // Embed parameters for background playback:
  // - autoplay=1: Start playing immediately
  // - mute=1: Mute video (necessary for autoplay to work in modern browsers)
  // - loop=1 & playlist=videoId: Loop the video indefinitely (YouTube requires playlist parameter for loop to work)
  // - playsinline=1: Prevent native full-screen playback on iOS
  // - controls=0: Hide YouTube player controls
  // - modestbranding=1: Minimize YouTube branding in the player
  // - rel=0: Show related videos only from the same channel
  // - enablejsapi=1: Allow JavaScript control API
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&controls=0&modestbranding=1&rel=0&enablejsapi=1`;

  return (
    <div 
      className="absolute inset-0 -z-20 w-full h-full overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* 
        The iframe is sized using viewport units (177.77vh width / 56.25vw height) 
        to ensure it always maintains a 16:9 ratio and covers the container 
        without displaying black letterboxes.
      */}
      <iframe
        src={embedUrl}
        className={`absolute top-1/2 left-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none border-0 ${iframeClassName ?? ''}`}
        allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
        tabIndex={-1}
      />
      {/* Dark tint overlay */}
      <div className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
    </div>
  );
};
