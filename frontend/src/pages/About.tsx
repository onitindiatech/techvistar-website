import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Eye,
  MapPin,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getPublicPagesConfig } from '@/services/pages.service';
import { seoFromItem } from '@/lib/seoAdmin';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import { ABOUT_COPY, ABOUT_PAGE } from '@/data';
import {
  AboutContentCard,
  mergePagesCmsConfig,
  DEFAULT_ABOUT_CMS,
} from '@/types/pagesCms';
import { resolveLucideIcon } from '@/lib/resolveLucideIcon';
import aboutBg from '../assets/about-header.png';
import logoImg from '@/assets/logo.webp';
import { PageHeader } from '@/components/ui/PageHeader';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.42, ease },
};

const THEME_STYLES: Record<
  string,
  { bg: string; border: string; iconBg: string; titleHover: string }
> = {
  blue: {
    bg: 'bg-blue-50/40 hover:bg-blue-50/70',
    border: 'border-blue-100/80 hover:border-blue-200',
    iconBg: 'bg-blue-100/60 text-blue-600',
    titleHover: 'group-hover/ind:text-blue-600',
  },
  emerald: {
    bg: 'bg-emerald-50/40 hover:bg-emerald-50/70',
    border: 'border-emerald-100/80 hover:border-emerald-200',
    iconBg: 'bg-emerald-100/60 text-emerald-600',
    titleHover: 'group-hover/ind:text-emerald-600',
  },
  violet: {
    bg: 'bg-violet-50/40 hover:bg-violet-50/70',
    border: 'border-violet-100/80 hover:border-violet-200',
    iconBg: 'bg-violet-100/60 text-violet-600',
    titleHover: 'group-hover/ind:text-violet-600',
  },
  amber: {
    bg: 'bg-amber-50/40 hover:bg-amber-50/70',
    border: 'border-amber-100/80 hover:border-amber-200',
    iconBg: 'bg-amber-100/60 text-amber-600',
    titleHover: 'group-hover/ind:text-amber-600',
  },
  cyan: {
    bg: 'bg-cyan-50/40 hover:bg-cyan-50/70',
    border: 'border-cyan-100/80 hover:border-cyan-200',
    iconBg: 'bg-cyan-100/60 text-cyan-600',
    titleHover: 'group-hover/ind:text-cyan-600',
  },
  rose: {
    bg: 'bg-rose-50/40 hover:bg-rose-50/70',
    border: 'border-rose-100/80 hover:border-rose-200',
    iconBg: 'bg-rose-100/60 text-rose-600',
    titleHover: 'group-hover/ind:text-rose-600',
  },
  teal: {
    bg: 'bg-teal-50/40 hover:bg-teal-50/70',
    border: 'border-teal-100/80 hover:border-teal-200',
    iconBg: 'bg-teal-100/60 text-teal-600',
    titleHover: 'group-hover/ind:text-teal-600',
  },
};

const sectionPad = 'px-5 py-6 sm:px-6 sm:py-7 md:px-8';

function sortActiveCards(cards: AboutContentCard[] | undefined): AboutContentCard[] {
  return [...(cards || [])]
    .filter((card) => card.active !== false && (card.title?.trim() || card.description?.trim()))
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

const About = () => {
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const about = mergePagesCmsConfig(pagesConfig).about;
  const aboutSeo = seoFromItem(about as unknown as Record<string, unknown>);
  const heroBg = about.hero.backgroundImage?.trim() || aboutBg;
  const storyParagraphs = about.story.body.split('\n\n').filter(Boolean);

  const focusSection = about.focusAreas || DEFAULT_ABOUT_CMS.focusAreas;
  const industriesSection = about.industriesServe || DEFAULT_ABOUT_CMS.industriesServe;

  const focusCards = useMemo(
    () => sortActiveCards(focusSection.cards),
    [focusSection.cards]
  );
  const industryCards = useMemo(
    () => sortActiveCards(industriesSection.cards),
    [industriesSection.cards]
  );

  const pillars = [
    {
      icon: Target,
      label: about.mission.title,
      text: about.mission.text,
      bg: 'bg-emerald-50/30 hover:bg-emerald-50/60',
      border: 'border-emerald-100/80 hover:border-emerald-200',
      iconBg: 'bg-emerald-100/60 text-emerald-700',
    },
    {
      icon: Eye,
      label: about.vision.title,
      text: about.vision.text,
      bg: 'bg-blue-50/30 hover:bg-blue-50/60',
      border: 'border-blue-100/80 hover:border-blue-200',
      iconBg: 'bg-blue-100/60 text-blue-700',
    },
  ] as const;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageSeo
        seo={aboutSeo}
        defaults={{
          title: about.seoTitle || DEFAULT_ABOUT_CMS.seoTitle || 'About TechVistar | Technology-first growth partner',
          description: about.seoDescription || DEFAULT_ABOUT_CMS.seoDescription || ABOUT_COPY.summary,
          url: buildCanonical('/about'),
        }}
      />
      <main className="min-h-screen bg-muted">
        <Navbar />

        <PageHeader
          title={
            about.hero.title.includes('TechVistar') ? (
              <>
                About{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  TechVistar
                </span>
              </>
            ) : (
              about.hero.title
            )
          }
          subtitle={about.hero.eyebrow || ABOUT_PAGE.hero.eyebrow}
          description={about.hero.description}
          backgroundImage={heroBg}
          bgPosition="right bottom"
        />

        <div className="px-4 py-6 sm:px-6 md:py-8 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)]">
            <motion.section
              {...fadeUp}
              className={`${sectionPad} border-b border-slate-100 bg-gradient-to-br from-primary/[0.02] via-emerald-50/[0.05] to-transparent`}
              aria-labelledby="overview-heading"
            >
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <h2
                    id="overview-heading"
                    className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
                  >
                    {about.story.title}
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
                    {storyParagraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="relative flex h-auto w-[160px] items-center justify-center rounded-xl border-2 border-emerald-500/10 bg-white/50 p-4 shadow-lg backdrop-blur-sm">
                    <img src={logoImg} alt="TechVistar Logo" className="h-auto w-full object-contain" />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Focus areas — CMS driven */}
            <section className={`${sectionPad} border-b border-slate-100 bg-slate-50/40`} aria-labelledby="focus-heading">
              <motion.div {...fadeUp}>
                <h2
                  id="focus-heading"
                  className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
                >
                  {focusSection.heading || DEFAULT_ABOUT_CMS.focusAreas.heading}
                </h2>
                <p className="mt-2 text-sm leading-snug text-slate-600">
                  {focusSection.description || DEFAULT_ABOUT_CMS.focusAreas.description}
                </p>
              </motion.div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
                {focusCards.map((area, i) => {
                  const styles = THEME_STYLES[area.color] || THEME_STYLES.emerald;
                  const Icon = resolveLucideIcon(area.icon || 'Globe');
                  return (
                    <motion.div
                      key={`${area.title}-${i}`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      className={`rounded-xl border-2 p-4 shadow-sm transition-all duration-300 hover:shadow-md ${styles.bg} ${styles.border}`}
                    >
                      {area.image?.trim() ? (
                        <div className="mb-3 overflow-hidden rounded-lg border border-slate-100 bg-white">
                          <img
                            src={area.image}
                            alt={area.title}
                            className="h-28 w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-black/5 ${styles.iconBg}`}
                        >
                          <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
                        </div>
                      )}
                      <h3 className="mt-3 font-display text-[0.9375rem] font-semibold leading-snug text-slate-900">
                        {area.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {area.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Industries We Serve — CMS driven */}
            <section className={`${sectionPad} border-b border-slate-100`} aria-labelledby="industries-heading">
              <h2
                id="industries-heading"
                className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
              >
                {industriesSection.heading || DEFAULT_ABOUT_CMS.industriesServe.heading}
              </h2>
              <p className="mt-2 text-sm leading-snug text-slate-600">
                {industriesSection.description || DEFAULT_ABOUT_CMS.industriesServe.description}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {industryCards.map((ind, i) => {
                  const styles = THEME_STYLES[ind.color] || THEME_STYLES.emerald;
                  const Icon = resolveLucideIcon(ind.icon || 'Building2');
                  return (
                    <motion.div
                      key={`${ind.title}-${i}`}
                      whileHover={{
                        y: -4,
                        scale: 1.03,
                        boxShadow: '0 10px 25px -5px rgba(16,185,129,0.15)',
                        borderColor: 'rgba(16,185,129,0.3)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`group/ind cursor-pointer rounded-xl border p-4 shadow-sm ${styles.bg} ${styles.border}`}
                    >
                      {ind.image?.trim() ? (
                        <img
                          src={ind.image}
                          alt={ind.title}
                          className="mb-2 h-16 w-full rounded-lg object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${styles.iconBg}`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        </div>
                      )}
                      <div
                        className={`text-sm font-bold text-slate-900 transition-colors ${styles.titleHover}`}
                      >
                        {ind.title}
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{ind.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Mission & vision */}
            <section className={`${sectionPad} border-b border-slate-100`} aria-labelledby="mission-heading">
              <h2
                id="mission-heading"
                className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
              >
                {ABOUT_PAGE.missionVisionHeading}
              </h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-4">
                {pillars.map((pillar) => (
                  <motion.div
                    key={pillar.label}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className={`overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-md ${pillar.bg} ${pillar.border}`}
                  >
                    <div
                      className="h-0.5 w-full bg-gradient-to-r from-primary via-emerald-500 to-teal-600"
                      aria-hidden
                    />
                    <div className="p-4 sm:p-5">
                      <div className="flex gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-black/5 ${pillar.iconBg}`}
                        >
                          <pillar.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                        </div>
                        <h3 className="min-w-0 flex-1 pt-0.5 font-display text-[0.9375rem] font-bold leading-snug text-slate-900">
                          {pillar.label}
                        </h3>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">{pillar.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Operating principles */}
            <motion.section
              {...fadeUp}
              className={`${sectionPad} border-b border-slate-100 bg-slate-50/40`}
              aria-labelledby="principles-heading"
            >
              <h2
                id="principles-heading"
                className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
              >
                {ABOUT_PAGE.principlesHeading}
              </h2>
              <p className="mt-2 text-sm leading-snug text-slate-600">{ABOUT_PAGE.principlesIntro}</p>
              <div className="mt-5 grid gap-3 border-t border-slate-200/80 pt-4 sm:grid-cols-2">
                {ABOUT_PAGE.principles.map((line, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.015, y: -1 }}
                    className="flex gap-3 rounded-xl border-2 border-emerald-500/10 bg-emerald-500/[0.01] p-4 transition-all duration-200 hover:border-emerald-500/20 hover:bg-emerald-500/[0.04]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Check className="h-3 w-3 stroke-[2.5]" aria-hidden />
                    </span>
                    <span className="text-sm font-medium leading-snug text-slate-700">{line}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Location + commitment + CTA */}
            <section
              className={`${sectionPad} bg-gradient-to-br from-primary/[0.03] via-emerald-50/10 to-transparent`}
              aria-labelledby="location-heading"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <motion.div
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.995 }}
                  className="flex gap-4 rounded-2xl border-2 border-emerald-500/20 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.2)]">
                    <MapPin className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-800/10">
                      {ABOUT_PAGE.location.heading}
                    </span>
                    <h3 className="mt-2 text-base font-extrabold tracking-tight text-slate-900">
                      {ABOUT_COPY.locationLine}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{ABOUT_PAGE.location.detail}</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.995 }}
                  className="flex gap-4 rounded-2xl border-2 border-teal-500/20 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-[0_4px_12px_-2px_rgba(20,184,166,0.2)]">
                    <ShieldCheck className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/80 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-teal-800 ring-1 ring-teal-800/10">
                      {ABOUT_PAGE.commitmentHeading}
                    </span>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-800">
                      {ABOUT_COPY.closing}
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-5 text-white shadow-md transition-shadow duration-300 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs font-bold leading-snug tracking-wide sm:max-w-[70%] sm:text-sm">
                  {about.cta.text}
                </p>
                <Button
                  variant="secondary"
                  size="default"
                  className="shrink-0 border-0 bg-white px-5 py-2.5 text-xs font-bold text-emerald-700 shadow-sm transition-all hover:bg-slate-50 hover:text-emerald-800"
                  asChild
                >
                  <Link
                    to={about.cta.buttonLink || '/#contact'}
                    className="inline-flex items-center gap-2 uppercase tracking-wider"
                  >
                    {about.cta.buttonText}
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" aria-hidden />
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default About;
