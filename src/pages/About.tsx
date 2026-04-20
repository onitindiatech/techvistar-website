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
  Layers,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ABOUT_COPY, ABOUT_PAGE } from '@/lib/constants';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.42, ease },
};

const pillars = [
  { icon: Target, label: ABOUT_COPY.mission.title, text: ABOUT_COPY.mission.text },
  { icon: Eye, label: ABOUT_COPY.vision.title, text: ABOUT_COPY.vision.text },
] as const;

const focusIcons = [Smartphone, Globe, TrendingUp, GraduationCap] as const;

const sectionPad = 'px-5 py-6 sm:px-6 sm:py-7 md:px-8';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-muted">
      <Navbar />

      {/* Page title — compact */}
      <header className="relative border-b border-border bg-muted pt-[4.75rem] pb-5 md:pt-[5.25rem] md:pb-6">
        <div className="absolute inset-0 grid-pattern opacity-[0.2] pointer-events-none" />
        <div className="container-custom relative z-10 max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-3 text-xs text-slate-500 sm:text-sm">
            <Link to="/" className="font-medium text-primary hover:underline underline-offset-4">
              Home
            </Link>
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-700">About</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">{ABOUT_PAGE.hero.eyebrow}</p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-[2.125rem] md:leading-tight">
              {ABOUT_PAGE.hero.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem] md:text-base">
              {ABOUT_PAGE.hero.lead}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Single structured document — tight vertical rhythm */}
      <div className="container-custom py-6 md:py-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)]">
          {/* Overview */}
          <motion.section {...fadeUp} className={`${sectionPad} border-b border-slate-100`} aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {ABOUT_PAGE.overview.title}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
              {ABOUT_PAGE.overview.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </motion.section>

          {/* Focus areas */}
          <section className={`${sectionPad} border-b border-slate-100 bg-slate-50/40`} aria-labelledby="focus-heading">
            <motion.div {...fadeUp}>
              <h2 id="focus-heading" className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                What we focus on
              </h2>
              <p className="mt-2 text-sm leading-snug text-slate-600">
                Six practice areas—scoped standalone or as part of a broader program.
              </p>
            </motion.div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {ABOUT_PAGE.focusAreas.map((area, i) => {
                const Icon = focusIcons[i % focusIcons.length];
                return (
                  <div
                    key={area.title}
                    className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/12 to-primary/5 text-primary ring-1 ring-primary/12">
                      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
                    </div>
                    <h3 className="mt-3 font-display text-[0.9375rem] font-semibold leading-snug text-slate-900">{area.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">{area.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Mission & vision */}
          <section className={`${sectionPad} border-b border-slate-100`} aria-labelledby="mission-heading">
            <h2 id="mission-heading" className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Mission & vision
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.label}
                  className="overflow-hidden rounded-xl border border-slate-200/90 bg-white"
                >
                  <div className="h-0.5 w-full bg-gradient-to-r from-primary via-emerald-500 to-teal-600" aria-hidden />
                  <div className="p-4 sm:p-5">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/12 to-primary/5 text-primary ring-1 ring-primary/12">
                        <pillar.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </div>
                      <h3 className="min-w-0 flex-1 pt-0.5 font-display text-[0.9375rem] font-bold leading-snug text-slate-900">
                        {pillar.label}
                      </h3>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">{pillar.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Operating principles */}
          <motion.section {...fadeUp} className={`${sectionPad} border-b border-slate-100 bg-slate-50/40`} aria-labelledby="principles-heading">
            <h2 id="principles-heading" className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              How we run engagements
            </h2>
            <p className="mt-2 text-sm leading-snug text-slate-600">{ABOUT_PAGE.principlesIntro}</p>
            <ul className="mt-4 space-y-2.5 border-t border-slate-200/80 pt-4" role="list">
              {ABOUT_PAGE.principles.map((line, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-snug text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary ring-1 ring-primary/12">
                    <Check className="h-3 w-3 stroke-[2.5]" aria-hidden />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Location + commitment + CTA — one block */}
          <section className={sectionPad} aria-labelledby="location-heading">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/12 to-primary/5 text-primary ring-1 ring-primary/12">
                <Building2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="location-heading" className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Headquarters
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-800">{ABOUT_COPY.locationLine}</p>
                <p className="mt-1 text-xs text-slate-600">Remote delivery for clients across India and overseas.</p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Our commitment</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{ABOUT_COPY.closing}</p>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-xl bg-primary px-4 py-4 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs font-medium leading-snug sm:max-w-[70%] sm:text-sm">
                Discuss scope or a statement of work—we respond to new business inquiries within one business day.
              </p>
              <Button variant="secondary" size="default" className="shrink-0 border-0 bg-white text-primary hover:bg-slate-100 text-sm" asChild>
                <Link to="/#contact" className="inline-flex items-center gap-2">
                  Contact us
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default About;
