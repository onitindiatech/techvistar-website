import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
  /** Linear/Vercel-style rotating border beam on hover */
  borderBeam?: boolean;
}

export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(34, 197, 94, 0.08)',
  borderColor = 'rgba(34, 197, 94, 0.25)',
  borderBeam = false,
  ...props
}: SpotlightCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const background = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      ${spotlightColor},
      transparent 80%
    )
  `;

  const borderBg = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      ${borderColor},
      transparent 80%
    )
  `;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300',
        className,
      )}
      {...props}
    >
      {/* Spotlight Radial Background Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
      />

      {/* Spotlight Radial Border Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-[1px] z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: borderBg,
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Soft idle edge — faint emerald line so resting cards feel less flat */}
      {borderBeam && (
        <div
          className="pointer-events-none absolute inset-0 z-[12] rounded-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-0 motion-reduce:hidden"
          aria-hidden
          style={{
            padding: '1px',
            background:
              'linear-gradient(135deg, rgba(16,185,129,0.22), transparent 40%, transparent 60%, rgba(148,163,184,0.18))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* Rotating conic border beam on hover */}
      {borderBeam && (
        <div
          className="pointer-events-none absolute -inset-px z-[15] overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
          aria-hidden
          style={{
            padding: '1.5px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 aspect-square w-[220%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg 68%, rgba(16,185,129,0.08) 76%, rgba(16,185,129,0.65) 88%, rgba(52,211,153,1) 94%, rgba(255,255,255,0.95) 98%, transparent 100%)',
              animation: isHovered ? 'service-border-spin 2.4s linear infinite' : undefined,
            }}
          />
        </div>
      )}

      {/* Second brighter beam, opposite phase — dual “line” energy */}
      {borderBeam && (
        <div
          className="pointer-events-none absolute -inset-px z-[16] overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
          aria-hidden
          style={{
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 aspect-square w-[220%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{
              background:
                'conic-gradient(from 180deg, transparent 0deg 78%, rgba(16,185,129,0.35) 90%, rgba(255,255,255,0.75) 96%, transparent 100%)',
              animation: isHovered ? 'service-border-spin 3.6s linear infinite reverse' : undefined,
            }}
          />
        </div>
      )}

      <div className="relative z-20 h-full w-full">{children}</div>
    </div>
  );
};
