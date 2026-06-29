import { useEffect, useState } from 'react';
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
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ABOUT_COPY, ABOUT_PAGE } from '@/data';
import aboutBg from '../assets/about-bg.png';

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

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Text Animation Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } }
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: { width: 64, transition: { duration: 0.6, ease, delay: 0.4 } }
  };

  return (
    <main className="min-h-screen bg-muted">
      <Navbar />

      {/* Page Hero with Custom Background & Animations */}
      <section 
        className="relative overflow-hidden bg-zinc-950 pt-28 pb-20 md:pt-36 md:pb-28 border-b border-zinc-900"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-right md:bg-center opacity-30 pointer-events-none"
          style={{ backgroundImage: `url(${aboutBg})` }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/75 to-transparent z-0 pointer-events-none" />

        {/* Tiny Floating Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-emerald-400/80 rounded-full blur-[0.5px]"
              style={{
                left: `${(i * 14) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
              animate={{
                y: [0, -35, 0],
                x: [0, 8, 0],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 10 + (i % 3) * 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.7,
              }}
            />
          ))}
        </div>

        <div className="container-custom relative z-10 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Side: Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 text-left"
            >
              <motion.nav 
                variants={itemVariants}
                aria-label="Breadcrumb" 
                className="mb-6 text-xs font-semibold tracking-wider text-emerald-400 uppercase"
              >
                <Link to="/" className="hover:underline underline-offset-4">
                  Home
                </Link>
                <span className="mx-2 text-zinc-600">/</span>
                <span className="text-zinc-400">About</span>
              </motion.nav>

              <motion.span 
                variants={itemVariants}
                className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20"
              >
                {ABOUT_PAGE.hero.eyebrow}
              </motion.span>

              <motion.h1 
                variants={itemVariants}
                className="mt-6 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]"
              >
                About <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">TechVistar</span>
              </motion.h1>

              <motion.div 
                variants={lineVariants}
                className="mt-5 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" 
              />

              <motion.p 
                variants={itemVariants}
                className="mt-8 text-sm sm:text-[0.9375rem] md:text-base leading-relaxed text-zinc-300 max-w-xl"
              >
                {ABOUT_PAGE.hero.lead}
              </motion.p>
            </motion.div>

            {/* Right Side: Interactive Animated Globe */}
            <div className="lg:col-span-5 relative flex items-center justify-center h-[350px] sm:h-[400px]">
              {/* Soft radial glow under the globe */}
              <div className="absolute w-44 h-44 rounded-full bg-emerald-500/10 blur-[60px] pointer-events-none" />

              {/* Parallax Group (Globe + Orbits) */}
              <motion.div
                style={{
                  x: mousePosition.x * 12,
                  y: mousePosition.y * 12,
                }}
                className="relative w-72 h-72 rounded-full border border-emerald-500/20 bg-emerald-500/[0.01] flex items-center justify-center pointer-events-none opacity-40"
                animate={{
                  boxShadow: [
                    '0 0 35px rgba(16,185,129,0.04)',
                    '0 0 55px rgba(16,185,129,0.08)',
                    '0 0 35px rgba(16,185,129,0.04)'
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Orbital lines & particles */}
                <motion.div 
                  className="absolute inset-2 rounded-full border border-teal-500/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full shadow-[0_0_8px_#14b8a6]" />
                </motion.div>

                <motion.div 
                  className="absolute inset-8 rounded-full border border-emerald-500/10"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]" />
                </motion.div>

                {/* Rotating Globe Core */}
                <motion.div
                  className="absolute flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
                >
                  <Globe className="w-24 h-24 text-emerald-400/40" strokeWidth={1} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

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
                {ABOUT_PAGE.focusAreasHeading}
              </h2>
              <p className="mt-2 text-sm leading-snug text-slate-600">
                {ABOUT_PAGE.focusAreasDescription}
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
              {ABOUT_PAGE.missionVisionHeading}
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
              {ABOUT_PAGE.principlesHeading}
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
                  {ABOUT_PAGE.location.heading}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-800">{ABOUT_COPY.locationLine}</p>
                <p className="mt-1 text-xs text-slate-600">{ABOUT_PAGE.location.detail}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-slate-500">{ABOUT_PAGE.commitmentHeading}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{ABOUT_COPY.closing}</p>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-xl bg-primary px-4 py-4 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs font-medium leading-snug sm:max-w-[70%] sm:text-sm">
                {ABOUT_PAGE.ctaText}
              </p>
              <Button variant="secondary" size="default" className="shrink-0 border-0 bg-white text-primary hover:bg-slate-100 text-sm" asChild>
                <Link to="/#contact" className="inline-flex items-center gap-2">
                  {ABOUT_PAGE.ctaButtonText}
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
