import { useRef, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { HeroBackgroundMedia } from '@/components/HeroBackgroundMedia';
import { useHomeCms } from '@/contexts/HomeCmsContext';
import { useQuery } from '@tanstack/react-query';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';
import { useMobileViewport } from '@/hooks/useMobileViewport';
import { useLargeTabletViewport } from '@/hooks/useLargeTabletViewport';
import { resolveHomeHeroContent } from '@/lib/resolveHomeHeroContent';
import { DEFAULT_HOME_CMS } from '@/types/homeCms';
import { AnimatedStat } from '@/components/ui/AnimatedStat';
import { getCmsIcon } from '@/lib/cmsIcons';

const spring = { type: 'spring' as const, stiffness: 420, damping: 36, mass: 0.8 };

const springSmooth = { stiffness: 120, damping: 22, mass: 0.6 };

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
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

/** Animates only the CMS highlight word — shimmer + subtle float */
function HeroHighlightText({
  text,
  animate,
}: {
  text: string;
  animate: boolean;
}) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  if (!animate) {
    return (
      <span className="hero-highlight-text--static inline-block font-black">
        {trimmed}
      </span>
    );
  }

  return (
    <motion.span
      className="hero-highlight-text inline-block font-black"
      animate={{ y: [0, -3, 0], scale: [1, 1.015, 1] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {trimmed}
    </motion.span>
  );
}

type HeroSectionProps = {
  /** @deprecated Announcement visibility is read from Website Settings CMS. */
  showAnnouncementBar?: boolean;
};

export const HeroSection = (_props: HeroSectionProps = {}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [18, -18]), springSmooth);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springSmooth);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.28], [0, 36]);

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
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
    staleTime: 60_000,
  });
  const navbarSettings = mergePagesCmsConfig(pagesConfig).websiteSettings.navbar;
  const showAnnouncementBar =
    navbarSettings.announcementBarEnabled && Boolean(navbarSettings.announcementText?.trim());
  const hero = cms.hero;
  const mobileHero = cms.mobileHero ?? DEFAULT_HOME_CMS.mobileHero;
  const isMobileViewport = useMobileViewport();
  const isLargeTabletViewport = useLargeTabletViewport();
  const ipadProHero = cms.ipadProHero ?? DEFAULT_HOME_CMS.ipadProHero;
  const showIpadProEnrichment = isLargeTabletViewport && ipadProHero.enabled;
  const enrichmentControlsActive = isMobileViewport || showIpadProEnrichment;
  const showFeatureCardsGrid = !enrichmentControlsActive || ipadProHero.showFeatureCards;
  const showMetricsCard = !enrichmentControlsActive || ipadProHero.showMetrics;
  const showHighlightsBlock = showIpadProEnrichment && ipadProHero.showHighlightPills;
  const showClientLogoStrip = showIpadProEnrichment && ipadProHero.showClientStrip;
  const ipadProMetrics = useMemo(
    () =>
      (ipadProHero.metrics?.length ? ipadProHero.metrics : DEFAULT_HOME_CMS.ipadProHero.metrics)
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [ipadProHero.metrics]
  );
  const ipadProHighlights = useMemo(
    () =>
      (ipadProHero.highlights?.length ? ipadProHero.highlights : DEFAULT_HOME_CMS.ipadProHero.highlights).filter(
        Boolean
      ),
    [ipadProHero.highlights]
  );
  const featureCardsForGrid = useMemo(() => {
    const cards = ipadProHero.featureCards?.length
      ? ipadProHero.featureCards
      : DEFAULT_HOME_CMS.ipadProHero.featureCards;
    return cards
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .filter((card) => card.label?.trim() || card.description?.trim());
  }, [ipadProHero.featureCards]);
  const statsForCard = useMemo(() => {
    if (!showMetricsCard) return [];
    return ipadProMetrics;
  }, [showMetricsCard, ipadProMetrics]);
  const sortedTrustLogos = useMemo(
    () => hero.trustLogos.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [hero.trustLogos]
  );
  const display = useMemo(
    () => resolveHomeHeroContent(hero, mobileHero, isMobileViewport),
    [
      hero,
      mobileHero,
      mobileHero.enabled,
      mobileHero.badge,
      mobileHero.heading,
      mobileHero.headingLine2,
      mobileHero.mobileHighlightedHeading,
      mobileHero.description,
      mobileHero.ctaPrimary,
      mobileHero.ctaPrimaryLink,
      mobileHero.ctaSecondary,
      mobileHero.ctaSecondaryLink,
      isMobileViewport,
    ]
  );
  const line1 = display.headlineLine1;
  const line2 = display.headlineLine2;
  const accent = display.headlineAccent;
  const animateHighlight = !reduceMotion && hero.animationEnabled;
  const heroHeadlineLabel = display.useSingleHeading
    ? display.singleHeading
    : [line1, line2, accent].filter(Boolean).join(' ');
  const mobileAlignmentClass =
    display.source === 'responsive'
      ? display.alignment === 'center'
        ? 'items-center text-center'
        : display.alignment === 'right'
          ? 'items-end text-right'
          : 'items-start text-left'
      : 'items-start text-left';
  const mobileCopyStyle =
    display.source === 'responsive' && display.maxWidth
      ? { maxWidth: display.maxWidth.includes('px') ? display.maxWidth : `${display.maxWidth}px` }
      : undefined;

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Introduction"
      style={{ position: 'relative' }}
      className={cn(
        'relative isolate min-h-[100svh] md:min-h-[100dvh] lg:h-[100svh] lg:min-h-0 overflow-hidden bg-zinc-950 selection:bg-primary/30 [perspective:1400px]',
        showIpadProEnrichment && 'hero-ipad-pro-enriched',
        enrichmentControlsActive && ipadProHero.showFeatureCards && 'hero-show-feature-cards',
        enrichmentControlsActive && ipadProHero.showMetrics && 'hero-show-metrics',
        showHighlightsBlock && 'hero-show-highlights',
        showClientLogoStrip && 'hero-show-client-strip'
      )}
    >
      <HeroBackgroundMedia hero={hero} />

      <div
        className="pointer-events-none absolute inset-0 -z-[11] overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute left-0 top-0 h-[min(92vmin,680px)] w-[min(92vmin,680px)] rounded-full bg-gradient-to-br from-emerald-400/25 via-primary/20 to-teal-600/15 blur-[min(100px,14vw)] motion-reduce:animate-none animate-hero-circle-orbit will-change-transform"
        />
      </div>

      <motion.div
        style={{ x: prefersReducedMotion ? 0 : parallaxX, y: prefersReducedMotion ? 0 : parallaxY }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.45] [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:32px_32px] motion-reduce:animate-none animate-hero-starfield-drift will-change-transform"
        aria-hidden
      />

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

      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/25 sm:from-black/72 sm:via-black/48 sm:to-black/15 md:from-black/70 md:via-black/45 md:to-transparent" />

      <div 
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70"
        aria-hidden
      />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className={cn(
          'container-custom relative z-10 hero-shell min-h-[100svh] md:min-h-[100dvh] lg:h-[100svh] lg:min-h-0 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6 md:pb-10',
          showAnnouncementBar
            ? 'max-md:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] md:pt-[8rem] lg:pt-[9rem]'
            : 'max-md:pt-[calc(5rem+env(safe-area-inset-top,0px))] md:pt-[7rem] lg:pt-[8rem]'
        )}
      >
        <div className="hero-main">
          <motion.div
            className="hero-copy text-left will-change-transform"
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              style={{ transformStyle: 'preserve-3d', ...mobileCopyStyle }}
              className={cn('hero-copy-inner flex w-full min-w-0 flex-col', mobileAlignmentClass)}
            >
              {display.badge ? (
                <motion.span
                  variants={fadeUp}
                  className="hero-badge mb-1.5 md:mb-3.5 inline-flex w-fit max-w-full shrink-0 items-center gap-2 self-start overflow-visible whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-emerald-300"
                >
                  {display.badge}
                </motion.span>
              ) : null}
              <motion.h1
                variants={fadeUp}
                style={{ transformStyle: 'preserve-3d' }}
                aria-label={heroHeadlineLabel}
                className={cn(
                  'hero-headline font-display font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]',
                  'w-full min-w-0 flex flex-col items-start gap-0',
                  'max-md:text-[clamp(1.1rem,4.4vw+0.28rem,1.55rem)] max-md:leading-[1.26]',
                  'md:text-[clamp(1.85rem,3.2vw+0.65rem,3.5rem)] md:leading-[1.11]',
                  'lg:text-[clamp(2.1rem,2.8vw+0.75rem,4rem)] lg:leading-[1.08]',
                  'tracking-[-0.026em] md:tracking-[-0.032em] lg:tracking-[-0.035em]'
                )}
              >
                {display.useSingleHeading ? (
                  <span className="block w-full max-w-[20ch] md:max-w-none text-pretty [text-wrap:pretty]">
                    {display.singleHeading}
                  </span>
                ) : (
                  <>
                {line1 ? (
                  <span className="block w-full max-w-[20ch] md:max-w-none md:whitespace-nowrap text-pretty [text-wrap:pretty]">
                    {line1}
                  </span>
                ) : null}
                {line2 ? (
                  <span className="block w-full max-w-[20ch] md:max-w-none md:whitespace-nowrap text-pretty [text-wrap:pretty] mt-0.5 md:mt-1.5">
                    {line2}
                  </span>
                ) : null}
                {accent ? (
                  <span className="block w-full max-w-[20ch] md:max-w-none md:whitespace-nowrap text-pretty [text-wrap:pretty] mt-0.5 md:mt-1.5">
                    <HeroHighlightText text={accent} animate={animateHighlight} />
                  </span>
                ) : null}
                  </>
                )}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                style={{ transform: 'translateZ(8px)' }}
                className="hero-tagline mt-1.5 md:mt-5 max-w-[34ch] md:max-w-xl text-zinc-200 font-medium text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] text-pretty text-[0.875rem] md:text-base"
              >
                {display.tagline}
              </motion.p>

              <motion.div
                variants={fadeUp}
                style={{ transform: 'translateZ(20px)' }}
                className={cn(
                  'hero-cta-row mt-2 md:mt-7',
                  display.source === 'responsive' && display.ctaLayout === 'inline' && 'hero-cta-row--inline'
                )}
              >
                <motion.div
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { scale: 1.04, z: 30, transition: { type: 'spring', stiffness: 400, damping: 20 } }
                  }
                  whileTap={{ scale: 0.97 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Button
                    size="lg"
                    className="h-11 sm:h-12 w-full lg:w-auto min-w-0 lg:min-w-[11.5rem] rounded-lg border-0 bg-primary px-6 sm:px-8 text-[0.9375rem] sm:text-base font-semibold text-primary-foreground shadow-[0_12px_40px_-12px_rgba(34,197,94,0.45)] transition-shadow hover:bg-primary/92 hover:shadow-[0_16px_48px_-10px_rgba(34,197,94,0.4)]"
                    asChild
                  >
                    <Link to={display.ctaPrimaryLink} className="inline-flex items-center justify-center">
                      <span>{display.ctaPrimary}</span>
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={
                    prefersReducedMotion ? undefined : { scale: 1.03, z: 20, y: -2 }
                  }
                  whileTap={{ scale: 0.98 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-11 sm:h-12 w-full lg:w-auto min-w-0 lg:min-w-[11.5rem] rounded-lg border-white/15 bg-zinc-950/60 px-6 sm:px-8 text-[0.9375rem] sm:text-base font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors hover:border-white/25 hover:bg-white/5"
                    asChild
                  >
                    <Link to={display.ctaSecondaryLink} className="inline-flex items-center justify-center">
                      <span>{display.ctaSecondary}</span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {(showFeatureCardsGrid || (showMetricsCard && statsForCard.length > 0)) ? (
            <div className="hero-tall-features" aria-label="Core capabilities">
              {showFeatureCardsGrid && featureCardsForGrid.length > 0 ? (
                <ul className="hero-tall-features-grid">
                  {featureCardsForGrid.map((card) => {
                    const Icon = getCmsIcon(card.icon);
                    return (
                      <li key={`${card.label}-${card.sortOrder}`} className="hero-tall-features-item">
                        <span className="hero-tall-features-icon" aria-hidden>
                          <Icon className="h-4 w-4" strokeWidth={2} />
                        </span>
                        <div className="hero-tall-features-content">
                          <span className="hero-tall-features-label">{card.label}</span>
                          <p className="hero-tall-features-desc">{card.description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              {showMetricsCard && statsForCard.length > 0 ? (
                <div className="hero-tall-stats-card" aria-label="Company highlights">
                  {statsForCard.map(({ value, label }) => (
                    <AnimatedStat
                      key={`${value}-${label}`}
                      value={value}
                      label={label}
                      variant="hero-tall"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {showHighlightsBlock && ipadProHighlights.length > 0 ? (
            <div className="hero-ipad-highlights" aria-label="Why Choose TechVistar">
              <p className="hero-ipad-highlights-title">Why Choose TechVistar</p>
              <ul className="hero-ipad-highlights-pills">
                {ipadProHighlights.map((highlight) => (
                  <li key={highlight} className="hero-ipad-highlight-pill">
                    <span aria-hidden className="hero-ipad-highlight-pill-check">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="hero-trust-footer w-full shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-5 md:gap-6">
          {showClientLogoStrip ? (
            <div className="hero-ipad-client-strip w-full md:col-span-2" aria-label="Client logos">
              <div className="hero-ipad-client-strip-logos opacity-50 grayscale select-none">
                {sortedTrustLogos.length > 0 ? (
                  sortedTrustLogos.map((logo) => (
                    <img
                      key={logo.url + logo.alt}
                      src={logo.url}
                      alt={logo.alt}
                      className="h-4 w-auto object-contain"
                      loading="lazy"
                    />
                  ))
                ) : (
                  <>
                    <svg className="h-4 w-auto text-white/80" viewBox="0 0 100 24" fill="currentColor" aria-hidden>
                      <path d="M12 4L4 18h16L12 4zm0 3.5l5.5 9.5H6.5L12 7.5z" fillRule="evenodd" />
                      <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">ACME</text>
                    </svg>
                    <svg className="h-4 w-auto text-white/80" viewBox="0 0 110 24" fill="currentColor" aria-hidden>
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                      <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">GLOBEX</text>
                    </svg>
                    <svg className="h-4 w-auto text-white/80" viewBox="0 0 110 24" fill="currentColor" aria-hidden>
                      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                      <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">INITECH</text>
                    </svg>
                    <svg className="h-4 w-auto text-white/80" viewBox="0 0 120 24" fill="currentColor" aria-hidden>
                      <polygon points="12,3 20,8 20,16 12,21 4,16 4,8" stroke="currentColor" strokeWidth="2" fill="none" />
                      <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">UMBRELLA</text>
                    </svg>
                  </>
                )}
              </div>
            </div>
          ) : null}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-left w-full min-w-0 md:flex-1"
          >
            <p className="hero-trust-label text-[10px] sm:text-xs uppercase tracking-[0.25em] text-zinc-400/90 font-bold mb-2 sm:mb-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Trusted by industry leaders
            </p>
            <div className="hero-trust-logos opacity-60 grayscale select-none">
              {sortedTrustLogos.length > 0 ? (
                sortedTrustLogos.map((logo) => (
                    <img key={logo.url + logo.alt} src={logo.url} alt={logo.alt} className="h-4 sm:h-5 w-auto object-contain" loading="lazy" />
                  ))
              ) : (
                <>
              <svg className="h-4 sm:h-5 w-auto text-white/80 hover:text-white hover:opacity-100 transition-all duration-300" viewBox="0 0 100 24" fill="currentColor">
                <path d="M12 4L4 18h16L12 4zm0 3.5l5.5 9.5H6.5L12 7.5z" fillRule="evenodd" />
                <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">ACME</text>
              </svg>
              <svg className="h-4 sm:h-5 w-auto text-white/80 hover:text-white hover:opacity-100 transition-all duration-300" viewBox="0 0 110 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">GLOBEX</text>
              </svg>
              <svg className="h-4 sm:h-5 w-auto text-white/80 hover:text-white hover:opacity-100 transition-all duration-300" viewBox="0 0 110 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">INITECH</text>
              </svg>
              <svg className="h-4 sm:h-5 w-auto text-white/80 hover:text-white hover:opacity-100 transition-all duration-300" viewBox="0 0 120 24" fill="currentColor">
                <polygon points="12,3 20,8 20,16 12,21 4,16 4,8" stroke="currentColor" strokeWidth="2" fill="none" />
                <text x="28" y="17" className="text-[11px] font-black font-sans tracking-[0.1em]" fill="currentColor">UMBRELLA</text>
              </svg>
                </>
              )}
            </div>
          </motion.div>

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
