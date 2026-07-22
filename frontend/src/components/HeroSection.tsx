import { useRef, useMemo, useCallback, type MouseEvent } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroBackgroundMedia } from '@/components/HeroBackgroundMedia';
import { HeroBrandMarquee } from '@/components/hero/HeroBrandLogos';
import { HeroScrollIndicator } from '@/components/hero/HeroScrollIndicator';
import { HeroStatsStrip } from '@/components/hero/HeroStatsStrip';
import { useHomeCms } from '@/contexts/HomeCmsContext';
import { useQuery } from '@tanstack/react-query';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';
import { useMobileViewport } from '@/hooks/useMobileViewport';
import { useLargeTabletViewport } from '@/hooks/useLargeTabletViewport';
import { resolveHomeHeroContent } from '@/lib/resolveHomeHeroContent';
import {
  isHomePath,
  scrollToContactSection,
} from '@/lib/heroScroll';
import { DEFAULT_HOME_CMS } from '@/types/homeCms';
import { AnimatedStat } from '@/components/ui/AnimatedStat';
import { getCmsIcon } from '@/lib/cmsIcons';

const spring = { type: 'spring' as const, stiffness: 420, damping: 36, mass: 0.8 };

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
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
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
  const navigate = useNavigate();
  const location = useLocation();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.28], [0, 36]);

  const reduceMotion = prefersReducedMotion === true;
  const cms = useHomeCms();
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
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

  const goToContact = useCallback(async () => {
    if (isHomePath(location.pathname)) {
      await scrollToContactSection();
      return;
    }
    navigate('/#contact');
  }, [location.pathname, navigate]);

  const goToServicesPage = useCallback(() => {
    if (location.pathname === '/services') {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }
    navigate('/services');
  }, [location.pathname, navigate, prefersReducedMotion]);

  const handlePrimaryCta = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      void goToContact();
    },
    [goToContact],
  );

  const handleSecondaryCta = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      goToServicesPage();
    },
    [goToServicesPage],
  );

  const handleScrollNext = useCallback(() => {
    const services = document.getElementById('services');
    if (services) {
      const top = services.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }
    void goToServicesPage();
  }, [goToServicesPage, prefersReducedMotion]);

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="Introduction"
      style={{ position: 'relative' }}
      className={cn(
        'relative isolate min-h-[100svh] md:min-h-[100dvh] lg:h-[100svh] lg:min-h-0 overflow-hidden bg-zinc-950 selection:bg-primary/30',
        showIpadProEnrichment && 'hero-ipad-pro-enriched',
        enrichmentControlsActive && ipadProHero.showFeatureCards && 'hero-show-feature-cards',
        enrichmentControlsActive && ipadProHero.showMetrics && 'hero-show-metrics',
        showHighlightsBlock && 'hero-show-highlights',
        showClientLogoStrip && 'hero-show-client-strip'
      )}
    >
      <HeroBackgroundMedia hero={hero} />

      {/* Dark vignette only — large green glow circles removed */}
      <div className="pointer-events-none absolute inset-0 -z-[12]" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/25 sm:from-black/72 sm:via-black/48 sm:to-black/15 md:from-black/70 md:via-black/45 md:to-transparent" />

      <div 
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70"
        aria-hidden
      />

      <motion.div
        style={reduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
        className={cn(
          'container-custom relative z-10 hero-shell min-h-[100svh] md:min-h-[100dvh] lg:h-[100svh] lg:min-h-0 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6 md:pb-10',
          showAnnouncementBar
            ? 'max-md:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] md:pt-[8rem] lg:pt-[9rem]'
            : 'max-md:pt-[calc(5rem+env(safe-area-inset-top,0px))] md:pt-[7rem] lg:pt-[8rem]'
        )}
      >
        <div className="hero-main">
          <motion.div
            className="hero-copy text-left"
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
                      : { y: -3, transition: { type: 'spring', stiffness: 420, damping: 22 } }
                  }
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Button
                    size="lg"
                    className={cn(
                      'hero-cta-primary group h-11 sm:h-12 w-full lg:w-auto min-w-0 lg:min-w-[11.5rem] rounded-lg border-0',
                      'bg-primary px-6 sm:px-8 text-[0.9375rem] sm:text-base font-semibold text-primary-foreground',
                      'shadow-[0_12px_40px_-12px_rgba(34,197,94,0.45)]',
                      'transition-[background-color,box-shadow,transform] duration-300',
                      'hover:bg-emerald-400 hover:shadow-[0_18px_44px_-10px_rgba(34,197,94,0.55)]',
                      'focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                    )}
                    asChild
                  >
                    <Link
                      to="/#contact"
                      className="inline-flex items-center justify-center gap-2"
                      onClick={handlePrimaryCta}
                    >
                      <span>{display.ctaPrimary}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={
                    prefersReducedMotion ? undefined : { y: -2, transition: { type: 'spring', stiffness: 400, damping: 24 } }
                  }
                  whileTap={{ scale: 0.96 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                      'hero-cta-secondary group h-11 sm:h-12 w-full lg:w-auto min-w-0 lg:min-w-[11.5rem] rounded-lg',
                      'border-white/20 bg-white/[0.06] px-6 sm:px-8 text-[0.9375rem] sm:text-base font-semibold text-white',
                      'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-sm',
                      'transition-[border-color,background-color,box-shadow] duration-300',
                      'hover:border-emerald-400/45 hover:bg-white/[0.1] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
                      'focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                    )}
                    asChild
                  >
                    <Link
                      to="/services"
                      className="inline-flex items-center justify-center gap-2"
                      onClick={handleSecondaryCta}
                    >
                      <span>{display.ctaSecondary}</span>
                      <ArrowRight className="h-4 w-4 opacity-80 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-4 hidden w-full md:mt-6 md:block lg:mt-7">
                <HeroStatsStrip />
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
                  <HeroBrandMarquee label="" className="hero-ipad-inline-marquee" />
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
            {sortedTrustLogos.length > 0 ? (
              <>
                <p className="hero-trust-label text-[10px] sm:text-xs uppercase tracking-[0.25em] text-zinc-400/90 font-bold mb-2 sm:mb-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                  Trusted by industry leaders
                </p>
                <div className="hero-trust-logos opacity-60 grayscale select-none">
                  {sortedTrustLogos.map((logo) => (
                    <img
                      key={logo.url + logo.alt}
                      src={logo.url}
                      alt={logo.alt}
                      className="h-4 sm:h-5 w-auto object-contain opacity-[0.6] transition-[opacity,transform] duration-300 hover:opacity-100 hover:-translate-y-[3px] hover:scale-105"
                      loading="lazy"
                    />
                  ))}
                </div>
              </>
            ) : (
              <HeroBrandMarquee />
            )}
          </motion.div>

          {hero.showScrollIndicator ? (
            <HeroScrollIndicator onScrollNext={handleScrollNext} />
          ) : null}
        </div>
      </motion.div>
    </section>
  );
};
