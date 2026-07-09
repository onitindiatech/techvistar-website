import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  Globe,
  GraduationCap,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
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
import { mergePagesCmsConfig, DEFAULT_ABOUT_CMS } from '@/types/pagesCms';
import aboutBg from '../assets/about-bg.png';
import logoImg from '@/assets/logo.webp';
import { PageHeader } from '@/components/ui/PageHeader';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.42, ease },
};

const boxStyles = [
  {
    icon: Smartphone,
    bg: 'bg-blue-50/40 hover:bg-blue-50/70',
    border: 'border-blue-100/80 hover:border-blue-200',
    iconBg: 'bg-blue-100/60 text-blue-600',
  },
  {
    icon: TrendingUp,
    bg: 'bg-emerald-50/40 hover:bg-emerald-50/70',
    border: 'border-emerald-100/80 hover:border-emerald-200',
    iconBg: 'bg-emerald-100/60 text-emerald-600',
  },
  {
    icon: Globe,
    bg: 'bg-violet-50/40 hover:bg-violet-50/70',
    border: 'border-violet-100/80 hover:border-violet-200',
    iconBg: 'bg-violet-100/60 text-violet-600',
  },
  {
    icon: Zap,
    bg: 'bg-amber-50/40 hover:bg-amber-50/70',
    border: 'border-amber-100/80 hover:border-amber-200',
    iconBg: 'bg-amber-100/60 text-amber-600',
  },
  {
    icon: Sparkles,
    bg: 'bg-cyan-50/40 hover:bg-cyan-50/70',
    border: 'border-cyan-100/80 hover:border-cyan-200',
    iconBg: 'bg-cyan-100/60 text-cyan-600',
  },
  {
    icon: GraduationCap,
    bg: 'bg-rose-50/40 hover:bg-rose-50/70',
    border: 'border-rose-100/80 hover:border-rose-200',
    iconBg: 'bg-rose-100/60 text-rose-600',
  },
] as const;

const sectionPad = 'px-5 py-6 sm:px-6 sm:py-7 md:px-8';

const About = () => {
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
    staleTime: 60_000,
  });

  const about = mergePagesCmsConfig(pagesConfig).about;
  const aboutSeo = seoFromItem(about as unknown as Record<string, unknown>);
  const heroBg = about.hero.backgroundImage?.trim() || aboutBg;
  const storyParagraphs = about.story.body.split('\n\n').filter(Boolean);

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

      {/* Page Hero with Custom Background & Animations */}
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
      />

            {/* Single structured document — tight vertical rhythm */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)]">
          <motion.section {...fadeUp} className={`${sectionPad} border-b border-slate-100 bg-gradient-to-br from-primary/[0.02] via-emerald-50/[0.05] to-transparent`} aria-labelledby="overview-heading">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h2 id="overview-heading" className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {about.story.title}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
                  {storyParagraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <div className="relative flex items-center justify-center w-[160px] h-auto p-4 rounded-xl border-2 border-emerald-500/10 bg-white/50 shadow-lg backdrop-blur-sm">
                  <img 
                    src={logoImg} 
                    alt="TechVistar Logo" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Focus areas */}
          <section className={`${sectionPad} border-b border-slate-100 bg-slate-50/40`} aria-labelledby="focus-heading">
            <motion.div {...fadeUp}>
              <h2 id="focus-heading" className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {ABOUT_PAGE.focusAreasHeading}
              </h2>
              <p className="mt-2 text-sm leading-snug text-slate-600">
                {ABOUT_PAGE.focusAreasDescription}
              </p>
            </motion.div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {ABOUT_PAGE.focusAreas.map((area, i) => {
                const styles = boxStyles[i % boxStyles.length];
                const Icon = styles.icon;
                return (
                  <motion.div
                    key={area.title}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className={`rounded-xl border-2 p-4 shadow-sm transition-all duration-300 hover:shadow-md ${styles.bg} ${styles.border}`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${styles.iconBg} ring-1 ring-black/5`}>
                      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
                    </div>
                    <h3 className="mt-3 font-display text-[0.9375rem] font-semibold leading-snug text-slate-900">{area.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">{area.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Industries We Serve */}
          <section className={`${sectionPad} border-b border-slate-100`} aria-labelledby="industries-heading">
            <h2 id="industries-heading" className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Industries We Serve
            </h2>
            <p className="mt-2 text-sm leading-snug text-slate-600">Deploying tailored digital capabilities optimized for industry regulations.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {[
                { name: 'Healthcare', desc: 'HIPAA-compliant telemedicine platforms and operational databases.' },
                { name: 'Finance', desc: 'High-security transaction systems and digital banking analytics.' },
                { name: 'Education', desc: 'Custom LMS architectures and student tracking dashboards.' },
                { name: 'Logistics', desc: 'Route optimization solvers, capacity scheduling, and GPS trackers.' },
                { name: 'Real Estate', desc: 'Multi-tenant property portals and CRM pipelines.' },
                { name: 'Manufacturing', desc: 'IoT sensor telemetry platforms and predictive maintenance schedulers.' },
                { name: 'Retail', desc: 'Scalable headless eCommerce backends and custom checkouts.' },
                { name: 'Government', desc: 'Secure civic portal databases and administrative dashboards.' }
              ].map((ind) => (
                <motion.div
                  key={ind.name}
                  whileHover={{ y: -4, scale: 1.03, boxShadow: '0 10px 25px -5px rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-emerald-50/30 border border-emerald-100/40 rounded-xl p-4 shadow-sm cursor-pointer group/ind"
                >
                  <div className="font-bold text-slate-900 text-sm group-hover/ind:text-emerald-600 transition-colors">{ind.name}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{ind.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Mission & vision */}
          <section className={`${sectionPad} border-b border-slate-100`} aria-labelledby="mission-heading">
            <h2 id="mission-heading" className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
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
                  <div className="h-0.5 w-full bg-gradient-to-r from-primary via-emerald-500 to-teal-600" aria-hidden />
                  <div className="p-4 sm:p-5">
                    <div className="flex gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-black/5 ${pillar.iconBg}`}>
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
          <motion.section {...fadeUp} className={`${sectionPad} border-b border-slate-100 bg-slate-50/40`} aria-labelledby="principles-heading">
            <h2 id="principles-heading" className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {ABOUT_PAGE.principlesHeading}
            </h2>
            <p className="mt-2 text-sm leading-snug text-slate-600">{ABOUT_PAGE.principlesIntro}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 border-t border-slate-200/80 pt-4">
              {ABOUT_PAGE.principles.map((line, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.015, y: -1 }}
                  className="flex gap-3 p-4 rounded-xl border-2 border-emerald-500/10 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.04] hover:border-emerald-500/20 transition-all duration-200"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Check className="h-3 w-3 stroke-[2.5]" aria-hidden />
                  </span>
                  <span className="text-sm font-medium text-slate-700 leading-snug">{line}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Location + commitment + CTA — one block */}
          {/* Location + commitment + CTA — grid block */}
          <section className={`${sectionPad} bg-gradient-to-br from-primary/[0.03] via-emerald-50/10 to-transparent`} aria-labelledby="location-heading">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Headquarters Card */}
              <motion.div
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.995 }}
                className="flex gap-4 p-5 rounded-2xl border-2 border-emerald-500/20 bg-white/80 shadow-sm backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.2)]">
                  <Building2 className="h-6 w-6 animate-pulse" strokeWidth={1.75} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-800/10">
                    {ABOUT_PAGE.location.heading}
                  </span>
                  <h3 className="mt-2 text-base font-extrabold tracking-tight text-slate-900">{ABOUT_COPY.locationLine}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{ABOUT_PAGE.location.detail}</p>
                </div>
              </motion.div>

              {/* Commitment Card */}
              <motion.div
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.995 }}
                className="flex gap-4 p-5 rounded-2xl border-2 border-teal-500/20 bg-white/80 shadow-sm backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-[0_4px_12px_-2px_rgba(20,184,166,0.2)]">
                  <Sparkles className="h-6 w-6 animate-pulse" strokeWidth={1.75} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/80 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-teal-800 ring-1 ring-teal-800/10">
                    {ABOUT_PAGE.commitmentHeading}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-slate-800 leading-relaxed">{about.teamSection.description}</p>
                </div>
              </motion.div>
            </div>

            {/* CTA Banner */}
            <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-xs font-bold leading-snug sm:max-w-[70%] sm:text-sm tracking-wide">
                {about.cta.text}
              </p>
              <Button variant="secondary" size="default" className="shrink-0 border-0 bg-white text-emerald-700 hover:bg-slate-50 hover:text-emerald-800 font-bold text-xs px-5 py-2.5 shadow-sm transition-all" asChild>
                <Link to={about.cta.buttonLink || '/#contact'} className="inline-flex items-center gap-2 uppercase tracking-wider">
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
