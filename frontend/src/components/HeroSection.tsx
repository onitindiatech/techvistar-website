import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { HeroBackgroundMedia } from '@/components/HeroBackgroundMedia';
import { useHomeCms } from '@/contexts/HomeCmsContext';

const spring = { type: 'spring' as const, stiffness: 420, damping: 36, mass: 0.8 };

const springSmooth = { stiffness: 120, damping: 22, mass: 0.6 };

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

/** 3D “lift in” from depth */
const rise3d: Variants = {
  hidden: {
    opacity: 0,
    rotateX: 28,
    y: 48,
    z: -80,
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    z: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 26,
      mass: 0.85,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, z: -30 },
  visible: {
    opacity: 1,
    y: 0,
    z: 0,
    transition: spring,
  },
};

/** Typewriter-style reveal for the accent word; reserves width to avoid layout shift */
function TypingAccent({
  text,
  reduced,
  delayMs,
  charMs = 72,
  className,
}: {
  text: string;
  reduced: boolean;
  delayMs: number;
  charMs?: number;
  className?: string;
}) {
  const [len, setLen] = useState(reduced ? text.length : 0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) {
      setLen(text.length);
      return;
    }
    setLen(0);
    timeoutRef.current = setTimeout(() => {
      let i = 0;
      intervalRef.current = setInterval(() => {
        i += 1;
        setLen(Math.min(i, text.length));
        if (i >= text.length && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, charMs);
    }, delayMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, reduced, delayMs, charMs]);

  const visible = text.slice(0, len);
  const done = len >= text.length;

  return (
    <span className={`relative inline-block align-baseline ${className ?? ''}`}>
      <span aria-hidden className="invisible whitespace-pre">
        {text}
      </span>
      <span className="absolute left-0 top-0 whitespace-pre" aria-hidden>
        {visible}
        {!done && (
          <span
            className="ml-px inline-block h-[0.85em] w-[2px] translate-y-px bg-emerald-400/90 align-middle animate-pulse"
            aria-hidden
          />
        )}
      </span>
    </span>
  );
}

type HeroSectionProps = {
  /** Extra top padding when the homepage announcement marquee is shown under the navbar */
  showAnnouncementBar?: boolean;
};

export const HeroSection = ({ showAnnouncementBar = false }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [9, -9]),
    springSmooth
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-11, 11]),
    springSmooth
  );

  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [18, -18]), springSmooth);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springSmooth);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.28], [0, 36]);
  const scrollTilt = useTransform(scrollYProgress, [0, 0.4], [0, -6]);

  const glowScale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 1.12]), { stiffness: 80, damping: 35 });
  const glowRotateX = useTransform(scrollYProgress, [0, 0.5], [0, 8]);
  const ringParallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-24, 24]), springSmooth);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const reduceMotion = prefersReducedMotion === true;
  const cms = useHomeCms();
  const hero = cms.hero;
  const heroHeadlineLabel = `${hero.headlineLine1} ${hero.headlineAccent} ${hero.headlineLine2}`;

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Introduction"
      className="relative isolate min-h-[100svh] lg:h-[100svh] lg:min-h-0 overflow-hidden bg-zinc-950 selection:bg-primary/30 [perspective:1400px]"
    >
      {/* Background media */}
      <HeroBackgroundMedia hero={hero} />

      {/* Single large circle — slow path across the entire hero (above blob layer, behind stars) */}
      <div
        className="pointer-events-none absolute inset-0 -z-[11] overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute left-0 top-0 h-[min(92vmin,680px)] w-[min(92vmin,680px)] rounded-full bg-gradient-to-br from-emerald-400/25 via-primary/20 to-teal-600/15 blur-[min(100px,14vw)] motion-reduce:animate-none animate-hero-circle-orbit will-change-transform"
        />
      </div>

      {/* Starfield — parallax + slow continuous drift */}
      <motion.div
        style={{ x: prefersReducedMotion ? 0 : parallaxX, y: prefersReducedMotion ? 0 : parallaxY }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.45] [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:32px_32px] motion-reduce:animate-none animate-hero-starfield-drift will-change-transform"
        aria-hidden
      />

      {/* Glow — depth layer + scroll scale + float */}
      <motion.div
        style={{
          scale: glowScale,
          rotateX: prefersReducedMotion ? 0 : glowRotateX,
        }}
        className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[min(120vw,720px)] w-[min(120vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.18] blur-[120px] will-change-transform"
        aria-hidden
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [0, -12, 0],
                opacity: [0.45, 0.62, 0.45],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{ x: prefersReducedMotion ? 0 : ringParallaxX }}
        className="pointer-events-none absolute left-1/2 top-[40%] -z-10 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.05] blur-[1px] will-change-transform"
        aria-hidden
      />

      {/* Gradient overlay to darken left side for text readability */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/45 to-transparent" />

      {/* Background Grid Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70"
        aria-hidden
      />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className={cn(
          'container-custom relative z-10 flex min-h-[100svh] lg:h-[100svh] lg:min-h-0 flex-col justify-between px-4 pb-4 sm:pb-8 md:pb-12 lg:px-8',
          showAnnouncementBar ? 'pt-[5.5rem] sm:pt-[8rem] md:pt-[9rem] lg:pt-[9.5rem]' : 'pt-12 sm:pt-24 md:pt-28 lg:pt-32'
        )}
      >
        <div className="flex-1 flex flex-col justify-center items-start w-full">
          <motion.div
            className="mr-auto ml-0 w-full max-w-3xl text-left will-change-transform"
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              style={{ transformStyle: 'preserve-3d' }}
              className="flex flex-col items-start"
            >
              {hero.badge?.trim() ? (
                <motion.span
                  variants={fadeUp}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300"
                >
                  {hero.badge.trim()}
                </motion.span>
              ) : null}
              <motion.h1
                variants={rise3d}
                style={{ transformStyle: 'preserve-3d' }}
                className="font-display text-[clamp(2rem,6.5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] [transform-style:preserve-3d]"
              >
                <span className="block">{hero.headlineLine1}</span>
                <span className="block mt-1 sm:mt-2">{hero.headlineLine2}</span>
                <span className="block mt-1 sm:mt-2">
                  That Drive{' '}
                  <span className="text-primary font-black drop-shadow-[0_0_25px_rgba(34,197,94,0.3)]">
                    {hero.headlineAccent}
                  </span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                style={{ transform: 'translateZ(8px)' }}
                className="mt-4 sm:mt-6 max-w-xl text-zinc-200 text-base sm:text-lg font-medium leading-relaxed text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              >
                {hero.tagline}
              </motion.p>

              <motion.div
                variants={fadeUp}
                style={{ transform: 'translateZ(20px)' }}
                className="mt-6 sm:mt-8 flex flex-col items-start justify-start gap-3 sm:gap-4 sm:flex-row w-full"
              >
                <motion.div
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { scale: 1.04, z: 30, transition: { type: 'spring', stiffness: 400, damping: 20 } }
                  }
                  whileTap={{ scale: 0.97 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    className="h-12 min-w-[11.5rem] w-full sm:w-auto rounded-lg border-0 bg-primary px-8 text-base font-semibold text-primary-foreground shadow-[0_12px_40px_-12px_rgba(34,197,94,0.45)] transition-shadow hover:bg-primary/92 hover:shadow-[0_16px_48px_-10px_rgba(34,197,94,0.4)]"
                    asChild
                  >
                    <Link to={hero.ctaPrimaryLink} className="inline-flex items-center justify-center">
                      <span>{hero.ctaPrimary}</span>
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={
                    prefersReducedMotion ? undefined : { scale: 1.03, z: 20, y: -2 }
                  }
                  whileTap={{ scale: 0.98 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 min-w-[11.5rem] w-full sm:w-auto rounded-lg border-white/15 bg-zinc-950/60 px-8 text-base font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors hover:border-white/25 hover:bg-white/5"
                    asChild
                  >
                    <Link to={hero.ctaSecondaryLink} className="inline-flex items-center justify-center">
                      <span>{hero.ctaSecondary}</span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust Section & Scroll Indicator */}
        <div className="w-full mt-4 sm:mt-8 md:mt-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-left"
          >
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-zinc-400/90 font-bold mb-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Trusted by industry leaders
            </p>
            <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-3 sm:gap-x-10 opacity-60 grayscale select-none">
              {hero.trustLogos.length > 0 ? (
                hero.trustLogos
                  .slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((logo) => (
                    <img key={logo.url + logo.alt} src={logo.url} alt={logo.alt} className="h-5 w-auto object-contain" loading="lazy" />
                  ))
              ) : (
                <>
              <svg className="h-4 sm:h-5 w-auto text-white/80 hover:text-white hover:opacity-100 transition-all duration-300" viewBox="0 0 100 24" fill="currentColor">
                <path d="M12 4L4 18h16L12 4zm0 3.5l5.5 9.5H6.5L12 7.5z" fillRule="evenodd" />
                <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">ACME</text>
              </svg>
              {/* Logo 2: GLOBEX */}
              <svg className="h-4 sm:h-5 w-auto text-white/80 hover:text-white hover:opacity-100 transition-all duration-300" viewBox="0 0 110 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">GLOBEX</text>
              </svg>
              {/* Logo 3: INITECH */}
              <svg className="h-4 sm:h-5 w-auto text-white/80 hover:text-white hover:opacity-100 transition-all duration-300" viewBox="0 0 110 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">INITECH</text>
              </svg>
              {/* Logo 4: UMBRELLA */}
              <svg className="h-4 sm:h-5 w-auto text-white/80 hover:text-white hover:opacity-100 transition-all duration-300" viewBox="0 0 120 24" fill="currentColor">
                <polygon points="12,3 20,8 20,16 12,21 4,16 4,8" stroke="currentColor" strokeWidth="2" fill="none" />
                <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">UMBRELLA</text>
              </svg>
                </>
              )}
            </div>
          </motion.div>

          {/* Smooth Scroll Indicator */}
          {hero.showScrollIndicator ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="hidden md:flex items-center gap-3 text-zinc-400 text-xs font-semibold tracking-wider cursor-pointer select-none"
            onClick={() => {
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore TechVistar</span>
            <div className="w-6 h-10 rounded-full border-2 border-zinc-500/60 p-1 flex justify-center">
              <motion.div
                animate={{
                  y: [0, 12, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-1 h-2 rounded-full bg-emerald-400"
              />
            </div>
          </motion.div>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
};
