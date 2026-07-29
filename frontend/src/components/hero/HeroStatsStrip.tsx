import { memo, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const STATS = [
  { value: 120, suffix: '+', label: 'Projects Delivered' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 24, suffix: '/7', label: 'Support', literal: true },
  { value: 10, suffix: '+', label: 'Industries' },
] as const;

function useCountOnce(target: number, enabled: boolean, reduceMotion: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    if (reduceMotion) {
      setValue(target);
      return;
    }

    let frame = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, reduceMotion, target]);

  return value;
}

function StatItem({
  value,
  suffix,
  label,
  literal,
  active,
  reduceMotion,
}: {
  value: number;
  suffix: string;
  label: string;
  literal?: boolean;
  active: boolean;
  reduceMotion: boolean;
}) {
  const count = useCountOnce(value, active && !literal, reduceMotion);
  const display = literal ? `${value}${suffix}` : `${active || reduceMotion ? count : 0}${suffix}`;

  return (
    <div className="hero-stats-item text-left">
      <p className="text-lg font-bold tracking-tight text-white sm:text-xl md:text-2xl tabular-nums">
        {display}
      </p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 sm:text-[11px]">
        {label}
      </p>
    </div>
  );
}

type HeroStatsStripProps = {
  className?: string;
};

export const HeroStatsStrip = memo(function HeroStatsStrip({ className }: HeroStatsStripProps) {
  const reduceMotion = useReducedMotion() === true;
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn('hero-stats-strip', className)}
      aria-label="Company highlights"
    >
      <div className="hero-stats-divider mb-3 h-px w-full max-w-xl bg-gradient-to-r from-white/25 via-white/10 to-transparent" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 sm:gap-x-8">
        {STATS.map((stat) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            literal={'literal' in stat && stat.literal}
            active={active}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
      <div className="hero-stats-divider mt-3 h-px w-full max-w-xl bg-gradient-to-r from-white/25 via-white/10 to-transparent" />
    </motion.div>
  );
});
