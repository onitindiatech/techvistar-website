import React, { useMemo, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { SiteSection } from '@/components/SiteSection';
import { CmsHref } from '@/components/common/CmsHref';
import DomeGallery from '@/components/ui/DomeGallery';
import { Check, ArrowRight } from 'lucide-react';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { useHomeCms } from '@/contexts/HomeCmsContext';
import { resolveCmsMediaSrc } from '@/components/admin/common/CmsImageField';

export const TECHVISTAR_ECOSYSTEM_TILES = [
  {
    type: 'icon',
    icon: 'ai',
    title: 'Applied AI & Neural Systems',
    description: 'Enterprise AI agents, fine-tuned LLMs, predictive intelligence, and automated inference workflows.',
  },
  {
    type: 'icon',
    icon: 'code',
    title: 'Full-Stack Software Engineering',
    description: 'Scalable web applications, high-performance APIs, and modern TypeScript architectures.',
  },
  {
    type: 'icon',
    icon: 'cloud',
    title: 'Cloud Architecture & DevOps',
    description: 'Multi-region Kubernetes, automated CI/CD pipelines, and resilient serverless ecosystems.',
  },
  {
    type: 'icon',
    icon: 'database',
    title: 'Data Infrastructure & Warehouses',
    description: 'Real-time event streaming, ACID-compliant databases, and optimized caching layers.',
  },
  {
    type: 'icon',
    icon: 'analytics',
    title: 'Business Intelligence & Analytics',
    description: 'Actionable executive dashboards, conversion telemetry, and real-time user insights.',
  },
  {
    type: 'icon',
    icon: 'security',
    title: 'Enterprise Cybersecurity & Trust',
    description: 'Zero-trust architecture, SOC2 compliance standards, and end-to-end data encryption.',
  },
  {
    type: 'icon',
    icon: 'automation',
    title: 'Process Automation & Workflows',
    description: 'Autonomous background jobs, event-driven integrations, and operational task orchestration.',
  },
  {
    type: 'icon',
    icon: 'network',
    title: 'API Mesh & Distributed Networks',
    description: 'Low-latency GraphQL & REST mesh, microservice communication, and edge computing.',
  },
  {
    type: 'icon',
    icon: 'growth',
    title: 'Digital Growth & Revenue Systems',
    description: 'High-converting user journeys, SEO-optimized platforms, and scalable funnel architectures.',
  },
  {
    type: 'icon',
    icon: 'server',
    title: 'High-Availability Server Clusters',
    description: '99.99% SLA uptime, auto-scaling compute clusters, and load-balanced traffic gateways.',
  },
  {
    type: 'icon',
    icon: 'mobile',
    title: 'Cross-Platform Mobile Apps',
    description: 'High-performance React Native & Flutter applications with native device capabilities.',
  },
  {
    type: 'icon',
    icon: 'architecture',
    title: 'Modern System Architecture',
    description: 'Modular micro-frontends, composable services, and future-proof design systems.',
  },
  {
    type: 'icon',
    icon: 'workflow',
    title: 'Workflow Automation & CI/CD',
    description: 'Automated test suites, deterministic builds, and enterprise release management.',
  },
];

export const DomeGallerySection = () => {
  const { portfolio } = useHomeCms();
  const { ref, isInView } = useAnimatedSection();

  const domeImages = useMemo(() => TECHVISTAR_ECOSYSTEM_TILES, []);

  const features = useMemo(
    () => (portfolio.features?.length ? portfolio.features : []).filter(Boolean),
    [portfolio.features],
  );

  const sectionStyle = useMemo((): CSSProperties | undefined => {
    const backgroundImage = resolveCmsMediaSrc(portfolio.backgroundImage || '');
    if (!backgroundImage) return undefined;
    return {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }, [portfolio.backgroundImage]);

  if (!portfolio.visible) return null;

  return (
    <SiteSection 
      ref={ref} 
      id="dome-gallery-section" 
      className="relative overflow-hidden bg-white border-y border-slate-100/80 !py-6 md:!py-8"
      style={sectionStyle}
    >
      {/* Light Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(226, 232, 240, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(circle at 65% 50%, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 65% 50%, black 25%, transparent 75%)',
        }}
      />

      {/* Blue blurred glow and soft radial gradients around earth globe */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[#0b2859]/[0.08] rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#0ea5e9]/[0.06] rounded-full blur-[90px] pointer-events-none" />

      {/* Floating particles - subtle blue animated dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[45%] w-1.5 h-1.5 rounded-full bg-[#0b2859]/30 animate-pulse" />
        <div className="absolute bottom-[25%] left-[12%] w-1 h-1 rounded-full bg-blue-500/30" />
        <div className="absolute top-[40%] right-[5%] w-2 h-2 rounded-full bg-[#0b2859]/20 animate-ping [animation-duration:4s]" />
        <div className="absolute bottom-[15%] right-[42%] w-1.5 h-1.5 rounded-full bg-[#0b2859]/25" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT SIDE (40%) */}
          <motion.div 
            className="lg:col-span-5 space-y-6 md:space-y-7"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b2859]/10 border border-[#0b2859]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0b2859] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#0b2859]">
                {portfolio.badge}
              </span>
            </div>

            <h2 className="font-display text-heading-lg md:text-heading-xl lg:text-display-lg font-extrabold text-slate-900 tracking-tight">
              {portfolio.heading}{' '}
              {portfolio.highlight ? (
                <span className="hero-highlight-text--light inline-block font-black">
                  {portfolio.highlight}
                </span>
              ) : null}
            </h2>

            <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-xl">
              {portfolio.description}
            </p>

            {features.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-slate-700 font-normal text-sm md:text-base">
                    <div className="w-5 h-5 rounded-full bg-[#0b2859]/10 flex items-center justify-center border border-[#0b2859]/20 shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#0b2859]" strokeWidth={2.5} />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center justify-center h-11 px-6 bg-[#041a3d] hover:bg-[#021028] text-white rounded-xl transition-all duration-200 text-sm font-extrabold tracking-tight shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] group cursor-pointer"
              >
                <CmsHref href={portfolio.primaryButtonLink || '/work'} className="inline-flex items-center gap-2 text-white">
                  <span>{portfolio.primaryButtonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform duration-200" />
                </CmsHref>
              </motion.button>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center justify-center h-11 px-6 border-2 border-slate-200 hover:border-[#041a3d]/30 hover:bg-[#041a3d]/5 text-slate-800 font-extrabold rounded-xl transition-all duration-200 text-sm tracking-tight cursor-pointer"
              >
                <CmsHref href={portfolio.secondaryButtonLink || '/work'} className="text-slate-800">
                  <span>{portfolio.secondaryButtonText}</span>
                </CmsHref>
              </motion.button>
            </div>
          </motion.div>

          {/* RIGHT SIDE (60%) */}
          <motion.div 
            className="lg:col-span-7 w-full flex justify-center lg:justify-end items-center relative h-[380px] sm:h-[460px] md:h-[500px]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Soft, circular glowing blue shadow aura around the 3D Earth Globe (No white box) */}
            <div className="absolute top-1/2 left-1/2 lg:left-[55%] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] rounded-full bg-[#0b2859]/[0.28] blur-[80px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '5s' }} />
            <div className="absolute top-1/2 left-1/2 lg:left-[55%] -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full bg-[#0b2859]/[0.32] blur-[45px] pointer-events-none -z-10" />

            {/* Wrapper slightly shifted right on desktop, auto-rotating interactive DomeGallery without white box frame */}
            <div className="w-full h-full max-w-[550px] lg:translate-x-8 relative">
              {portfolio.globeEnabled ? (
                <DomeGallery
                  images={domeImages}
                  overlayBlurColor="transparent"
                  grayscale={false}
                  fit={0.42}
                  minRadius={380}
                  maxRadius={500}
                  imageBorderRadius="16px"
                  dragSensitivity={Math.max(8, Math.round(18 / (portfolio.animationSpeed || 1)))}
                  segments={35}
                />
              ) : null}
            </div>
          </motion.div>

        </div>
      </div>
    </SiteSection>
  );
};
