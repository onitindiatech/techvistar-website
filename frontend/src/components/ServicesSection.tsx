import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gem, TrendingUp, Settings, CodeXml } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SpotlightCard } from '@/components/animations/SpotlightCard';
import { useHomeCms } from '@/contexts/HomeCmsContext';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const listContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

const EXPERTISE_PILLARS = [
  {
    code: '01.',
    title: 'BRAND',
    description:
      'We shape how your business is perceived through strategic brand identity, positioning, visual language, and impactful communication that builds lasting trust.',
    icon: Gem,
    ctaText: 'Explore Brand Services',
    ctaLink: '/services/branding',
  },
  {
    code: '02.',
    title: 'GROWTH',
    description:
      'We help you attract, convert, and scale demand with data-driven growth strategy, digital marketing, and measurable outcomes that fuel long-term success.',
    icon: TrendingUp,
    ctaText: 'Explore Growth Services',
    ctaLink: '/services/growth-strategy',
  },
  {
    code: '03.',
    title: 'SYSTEMS',
    description:
      'We build intelligent systems that help your business operate and scale — through automation, AI, cloud solutions, and efficient business infrastructure.',
    icon: Settings,
    ctaText: 'Explore Systems Services',
    ctaLink: '/services/ai-automation',
  },
  {
    code: '04.',
    title: 'DIGITAL',
    description:
      'We design, develop, and evolve digital products, websites, and custom software that deliver seamless experiences and drive real business impact.',
    icon: CodeXml,
    ctaText: 'Explore Digital Services',
    ctaLink: '/services/web-development',
  },
];

export const ServicesSection = () => {
  const { ref, isInView } = useAnimatedSection();
  const { featuredServices: homeFeatured } = useHomeCms();

  const viewAllHref = homeFeatured.ctaLink?.trim() || '/services';
  const viewAllLabel = homeFeatured.ctaText?.trim() || 'View All Services';

  if (homeFeatured.visible === false) return null;

  return (
    <SiteSection
      ref={ref}
      id="services"
      variant="default"
      aria-labelledby="services-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f6fd]/60 to-[#ffffff] pt-12 pb-12 md:pt-16 md:pb-16 border-y border-slate-100/80"
    >
      {/* Background Subtle Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* TechVistar Signature Ambient Radial Glows & Wave Curves */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08)_0%,rgba(11,40,89,0.04)_45%,transparent_70%)] blur-[60px]" />
        <div className="absolute -left-20 top-1/4 h-[350px] w-[350px] rounded-full bg-[#0b2859]/[0.04] blur-[90px]" />
        <div className="absolute -right-20 bottom-1/4 h-[350px] w-[350px] rounded-full bg-sky-400/[0.05] blur-[90px]" />

        {/* Subtle decorative curved side shapes matching the reference */}
        <svg className="absolute left-0 top-0 h-full w-48 text-[#0b2859]/[0.03] pointer-events-none hidden lg:block" viewBox="0 0 200 800" fill="none">
          <path d="M-50,0 C80,200 40,600 -50,800 L-100,800 L-100,0 Z" fill="currentColor" />
        </svg>
        <svg className="absolute right-0 top-0 h-full w-48 text-[#0b2859]/[0.03] pointer-events-none hidden lg:block" viewBox="0 0 200 800" fill="none">
          <path d="M250,0 C120,200 160,600 250,800 L300,800 L300,0 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="container-custom relative z-10">
        {/* Top Header Row with Badge & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="flex items-center justify-between mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b2859]/10 border border-[#0b2859]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0b2859] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#0b2859]">
              OUR EXPERTISE
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.25em] text-slate-400 uppercase font-display">
            <span>IDEAS</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>TECHNOLOGY</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>IMPACT</span>
          </div>
        </motion.div>

        {/* 4-Pillar Grid */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {EXPERTISE_PILLARS.map((pillar) => {
            const PillarIcon = pillar.icon;
            return (
              <motion.div key={pillar.title} variants={itemVariants} className="h-full flex flex-col">
                <SpotlightCard
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(11,40,89,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0b2859]/30 hover:shadow-[0_16px_36px_rgba(11,40,89,0.1)]"
                  spotlightColor="rgba(11, 40, 89, 0.04)"
                  borderColor="rgba(11, 40, 89, 0.25)"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Top Row: Icon Box + Large Watermark Number */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-[#0b2859]/[0.08] border border-[#0b2859]/15 flex items-center justify-center text-[#0b2859] shadow-sm group-hover:scale-105 group-hover:bg-[#0b2859] group-hover:text-white group-hover:border-[#0b2859] transition-all duration-300">
                          <PillarIcon className="w-6 h-6" strokeWidth={1.9} />
                        </div>
                        <span className="text-3xl sm:text-4xl font-black text-slate-200/90 select-none tracking-tight font-display group-hover:text-[#0b2859]/20 transition-colors duration-300">
                          {pillar.code}
                        </span>
                      </div>

                      {/* Pillar Number & Title */}
                      <div className="space-y-1 mb-3">
                        <span className="text-xs font-black text-[#0b2859] font-display uppercase tracking-wider block">
                          {pillar.code}
                        </span>
                        <h3 className="font-display text-xl font-black tracking-tight text-slate-900">
                          {pillar.title}
                        </h3>
                      </div>

                      {/* Category Description Paragraph */}
                      <p className="text-xs sm:text-[13px] font-medium text-slate-600 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-6">
                      <Link
                        to={pillar.ctaLink}
                        className="w-full h-11 bg-[#041a3d] hover:bg-[#021028] text-white font-extrabold text-xs tracking-tight rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(4,26,61,0.22)] hover:shadow-[0_6px_20px_rgba(4,26,61,0.35)] transition-all duration-200 group/btn cursor-pointer"
                      >
                        <span>{pillar.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </div>
                  </div>

                  {/* Bottom subtle hover highlight */}
                  <div className="absolute bottom-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#0b2859]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Bar with Accents and Centered View All Services CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease, delay: 0.3 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Bottom Left Accent */}
          <div className="hidden md:flex items-center gap-2.5 text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase font-display">
            <span className="w-0.5 h-4 bg-[#0b2859]/40 rounded-full" />
            <span>BUILDING WHAT'S NEXT</span>
          </div>

          {/* Center Main CTA */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center h-11 px-8 bg-[#041a3d] hover:bg-[#021028] text-white rounded-xl transition-all duration-200 text-sm font-extrabold tracking-tight shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] group cursor-pointer"
          >
            <Link to={viewAllHref} aria-label={viewAllLabel} className="inline-flex items-center gap-2 text-white">
              <span>{viewAllLabel}</span>
              <ArrowRight className="w-4 h-4 opacity-90 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden />
            </Link>
          </motion.button>

          {/* Bottom Right Accent */}
          <div className="hidden md:flex items-center gap-2.5 text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase font-display">
            <span>FROM VISION TO REALITY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0b2859]/40" />
            <span className="w-8 h-px bg-slate-300/80" />
          </div>
        </motion.div>
      </div>
    </SiteSection>
  );
};

export default ServicesSection;


