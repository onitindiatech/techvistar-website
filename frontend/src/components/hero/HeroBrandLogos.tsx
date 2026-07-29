import { memo, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BrandLogo = {
  name: string;
  width: number;
  height: number;
  svg: ReactNode;
};

/** Monochrome brand marks — white/gray via currentColor for hero blend. */
const BRANDS: BrandLogo[] = [
  {
    name: 'Microsoft',
    width: 108,
    height: 24,
    svg: (
      <>
        <rect x="0" y="0" width="10" height="10" fill="currentColor" />
        <rect x="12" y="0" width="10" height="10" fill="currentColor" opacity="0.85" />
        <rect x="0" y="12" width="10" height="10" fill="currentColor" opacity="0.85" />
        <rect x="12" y="12" width="10" height="10" fill="currentColor" opacity="0.7" />
        <text x="28" y="17" fontSize="12" fontWeight="600" fontFamily="system-ui,sans-serif" fill="currentColor">
          Microsoft
        </text>
      </>
    ),
  },
  {
    name: 'AWS',
    width: 56,
    height: 24,
    svg: (
      <>
        <text x="0" y="15" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif" fill="currentColor" letterSpacing="0.5">
          aws
        </text>
        <path
          d="M2 18c6 4 16 4 24 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      </>
    ),
  },
  {
    name: 'Google Cloud',
    width: 118,
    height: 24,
    svg: (
      <>
        <circle cx="10" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 4v8l5.5 3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <text x="24" y="16" fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif" fill="currentColor">
          Google Cloud
        </text>
      </>
    ),
  },
  {
    name: 'MongoDB',
    width: 96,
    height: 24,
    svg: (
      <>
        <path
          d="M10 2c0 8-3.5 12-3.5 18 0 1.5.8 2.5 1.5 2.5s1.5-1 1.5-2.5C9.5 14 6 10 6 2c1.5 1 4 2 4 0z"
          fill="currentColor"
        />
        <text x="18" y="16" fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif" fill="currentColor">
          MongoDB
        </text>
      </>
    ),
  },
  {
    name: 'Docker',
    width: 88,
    height: 24,
    svg: (
      <>
        <rect x="2" y="10" width="5" height="4" rx="0.5" fill="currentColor" />
        <rect x="8" y="10" width="5" height="4" rx="0.5" fill="currentColor" />
        <rect x="14" y="10" width="5" height="4" rx="0.5" fill="currentColor" />
        <rect x="8" y="5" width="5" height="4" rx="0.5" fill="currentColor" opacity="0.85" />
        <rect x="14" y="5" width="5" height="4" rx="0.5" fill="currentColor" opacity="0.85" />
        <path d="M1 15h22c1 3-2 5-6 5H8c-4 0-7-2-7-5z" fill="currentColor" opacity="0.75" />
        <text x="28" y="16" fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif" fill="currentColor">
          Docker
        </text>
      </>
    ),
  },
  {
    name: 'GitHub',
    width: 86,
    height: 24,
    svg: (
      <>
        <path
          fill="currentColor"
          d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z"
        />
        <text x="28" y="16" fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif" fill="currentColor">
          GitHub
        </text>
      </>
    ),
  },
  {
    name: 'Vercel',
    width: 78,
    height: 24,
    svg: (
      <>
        <path d="M12 4L22 20H2L12 4z" fill="currentColor" />
        <text x="28" y="16" fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif" fill="currentColor">
          Vercel
        </text>
      </>
    ),
  },
  {
    name: 'Cloudflare',
    width: 108,
    height: 24,
    svg: (
      <>
        <path
          d="M8 16c-3 0-5-1.5-5-3.5S5.5 9 8.5 9c.4-2 2.2-3.5 4.5-3.5 2.6 0 4.7 1.9 5 4.4 2 .3 3.5 1.8 3.5 3.6 0 2-1.7 3.5-4 3.5H8z"
          fill="currentColor"
          opacity="0.9"
        />
        <text x="26" y="16" fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif" fill="currentColor">
          Cloudflare
        </text>
      </>
    ),
  },
];

function LogoMark({ brand }: { brand: BrandLogo }) {
  return (
    <div
      className="hero-brand-logo group/logo flex shrink-0 items-center justify-center"
      title={brand.name}
      role="img"
      aria-label={brand.name}
    >
      <svg
        viewBox={`0 0 ${brand.width} ${brand.height}`}
        width={brand.width}
        height={brand.height}
        className="h-5 w-auto text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.12)] transition-[opacity,transform,filter] duration-300 ease-out group-hover/logo:opacity-100 group-hover/logo:-translate-y-[3px] group-hover/logo:scale-105 group-hover/logo:drop-shadow-[0_0_14px_rgba(255,255,255,0.28)] motion-reduce:transition-none motion-reduce:group-hover/logo:translate-y-0 motion-reduce:group-hover/logo:scale-100"
        fill="currentColor"
        aria-hidden
      >
        {brand.svg}
      </svg>
    </div>
  );
}

function LogoRow({ rowKey, ariaHidden }: { rowKey: string; ariaHidden?: boolean }) {
  return (
    <div
      className="hero-brand-marquee-row flex shrink-0 items-center gap-8 sm:gap-10 md:gap-12 lg:gap-14"
      aria-hidden={ariaHidden || undefined}
    >
      {BRANDS.map((brand) => (
        <LogoMark key={`${rowKey}-${brand.name}`} brand={brand} />
      ))}
    </div>
  );
}

type HeroBrandMarqueeProps = {
  className?: string;
  label?: string;
};

export const HeroBrandMarquee = memo(function HeroBrandMarquee({
  className,
  label = 'Trusted by industry leaders',
}: HeroBrandMarqueeProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: '80px 0px', threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn('hero-brand-marquee w-full min-w-0', className)}>
      {label ? (
        <p className="hero-trust-label mb-2.5 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] sm:mb-3 sm:text-xs">
          {label}
        </p>
      ) : null}
      <div
        ref={scrollerRef}
        className="hero-brand-marquee-scroller relative overflow-hidden"
        aria-label="Technology partners"
        data-paused={inView ? 'false' : 'true'}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent sm:w-14 md:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-zinc-950 via-zinc-950/70 to-transparent sm:w-14 md:w-16" />
        <div className="hero-brand-marquee-track flex w-max items-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
          <LogoRow rowKey="a" />
          <LogoRow rowKey="b" ariaHidden />
        </div>
      </div>
    </div>
  );
});
