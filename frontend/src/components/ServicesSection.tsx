import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gem, TrendingUp, Settings, CodeXml, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { getActiveServices } from '@/services/services.service';
import { decorateService, type Service } from '@/data/services';
import { getServicesCmsConfig } from '@/services/servicesCmsConfig.service';
import { mergeServicesCmsConfig } from '@/types/servicesCms';
import { SpotlightCard } from '@/components/animations/SpotlightCard';
import { useHomeCms } from '@/contexts/HomeCmsContext';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const listContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

export const ServicesSection = () => {
  const { ref, isInView } = useAnimatedSection();
  const { featuredServices: homeFeatured } = useHomeCms();

  const { data: cmsConfigApi } = useQuery({
    queryKey: ['servicesCmsConfig'],
    queryFn: getServicesCmsConfig,
  });

  const sectionCopy = mergeServicesCmsConfig(cmsConfigApi).homeSection;
  const viewAllHref = homeFeatured.ctaLink?.trim() || '/services';
  const viewAllLabel = homeFeatured.ctaText?.trim() || sectionCopy.viewAllTitle || 'View All Services';

  const { data: apiServices } = useQuery({
    queryKey: ['activeServices'],
    queryFn: getActiveServices,
  });

  const activeServices = useMemo(() => {
    return (apiServices || [])
      .map(decorateService)
      .filter((s): s is Service => Boolean(s))
      .sort((a, b) => a.order - b.order);
  }, [apiServices]);

  const HOME_PILLARS = [
    {
      code: '01',
      title: 'BRAND',
      subtitle: 'How the business is perceived.',
      icon: Gem,
      match: (c: string, t: string) =>
        /brand|design|creative|ui|ux|perceiv|identity|content/i.test(c) ||
        /brand|design|creative|ui|ux|identity|documentation/i.test(t),
    },
    {
      code: '02',
      title: 'GROWTH',
      subtitle: 'How the business attracts and converts demand.',
      icon: TrendingUp,
      match: (c: string, t: string) =>
        /growth|market|seo|conversion|lead|acquisition/i.test(c) ||
        /market|growth|seo|conversion|revenue/i.test(t),
    },
    {
      code: '03',
      title: 'SYSTEMS',
      subtitle: 'How the business operates and scales.',
      icon: Settings,
      match: (c: string, t: string) =>
        /system|infra|automat|cloud|ops|operation|advanced|ai|tech/i.test(c) ||
        /automat|cloud|devops|system|ops|ai/i.test(t),
    },
    {
      code: '04',
      title: 'DIGITAL',
      subtitle: 'How the business delivers and evolves.',
      icon: CodeXml,
      match: (c: string, t: string) =>
        /digital|develop|software|product|platform|app|web/i.test(c) ||
        /develop|software|product|platform|web|app/i.test(t),
    },
  ];

  const pillarGroups = useMemo(() => {
    const groups = HOME_PILLARS.map((p) => ({
      ...p,
      services: [] as Service[],
    }));

    for (const service of activeServices) {
      const category = service.category || '';
      const title = service.title || '';
      let matchedIndex = HOME_PILLARS.findIndex((p) => p.match(category, title));
      if (matchedIndex === -1) matchedIndex = 3;
      groups[matchedIndex].services.push(service);
    }

    return groups;
  }, [activeServices]);

  if (homeFeatured.visible === false) return null;

  return (
    <SiteSection ref={ref} id="services" variant="muted" aria-labelledby="services-heading" className="relative pt-8 pb-4 md:pt-14 md:pb-8">
      {/* Soft ambient depth — authentic TechVistar blue wash */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-[40%] h-[min(560px,75vw)] w-[min(780px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.06)_0%,rgba(148,163,184,0.03)_40%,transparent_68%)]" />
        <div className="absolute left-[15%] top-[55%] h-[280px] w-[280px] rounded-full bg-sky-400/[0.04] blur-[90px]" />
        <div className="absolute right-[12%] top-[30%] h-[240px] w-[240px] rounded-full bg-[#0b2859]/[0.03] blur-[80px]" />
      </div>

      <div className="container-custom relative z-10">
        <SectionHeader
          tag={sectionCopy.tag}
          title={homeFeatured.heading?.trim() || sectionCopy.title}
          highlight={homeFeatured.heading?.trim() ? '' : sectionCopy.highlight}
          description={homeFeatured.subtitle?.trim() || sectionCopy.description}
          isInView={isInView}
          headingId="services-heading"
        />

        {/* Dynamic 4-pillar grid: mobile 1 · tablet 2 · desktop 4 */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch"
        >
          {pillarGroups.map((pillar) => {
            const PillarIcon = pillar.icon;
            return (
              <motion.div key={pillar.title} variants={itemVariants} className="h-full flex flex-col">
                <SpotlightCard
                  borderBeam
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl md:rounded-[22px] border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(11,40,89,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0b2859]/30 hover:shadow-[0_16px_36px_rgba(11,40,89,0.08)]"
                  spotlightColor="rgba(11, 40, 89, 0.04)"
                  borderColor="rgba(11, 40, 89, 0.25)"
                >
                  <div>
                    {/* Top Row: Pillar Icon Box + Watermark Number */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#0b2859]/[0.08] border border-[#0b2859]/15 flex items-center justify-center text-[#0b2859] shadow-sm group-hover:scale-105 group-hover:bg-[#0b2859] group-hover:text-white group-hover:border-[#0b2859] transition-all duration-300">
                        <PillarIcon className="w-6 h-6" strokeWidth={1.8} />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-slate-200/80 select-none tracking-tight font-display group-hover:text-[#0b2859]/20 transition-colors duration-300">
                        {pillar.code}.
                      </span>
                    </div>

                    {/* Pillar Header */}
                    <div className="space-y-1 mb-4">
                      <span className="text-xs font-extrabold text-[#0b2859] font-display uppercase tracking-wider block">
                        {pillar.code}.
                      </span>
                      <h3 className="font-display text-xl font-extrabold tracking-tight text-slate-900">
                        {pillar.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed min-h-[32px]">
                        {pillar.subtitle}
                      </p>
                    </div>

                    <div className="w-full h-px bg-slate-100/80 mb-3" />

                    {/* Dynamically Grouped Active Backend Services */}
                    <div className="space-y-1">
                      {pillar.services.map((srv) => (
                        <Link
                          key={srv.slug}
                          to={`/services/${srv.slug}`}
                          className="group/item flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-[#0b2859]/[0.04] transition-all duration-200"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="p-1 rounded-full bg-[#0b2859]/[0.08] text-[#0b2859] border border-[#0b2859]/15 group-hover/item:bg-[#0b2859] group-hover/item:text-white group-hover/item:border-[#0b2859] transition-all duration-200 shrink-0">
                              <Globe className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-sm font-semibold text-slate-700 group-hover/item:text-[#0b2859] transition-colors truncate">
                              {srv.title}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#0b2859] opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all shrink-0 ml-1" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Bottom subtle glow accent line on hover */}
                  <div className="absolute bottom-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#0b2859]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Centered section CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease, delay: 0.35 }}
          className="mt-10 flex justify-center md:mt-12"
        >
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
        </motion.div>
      </div>
    </SiteSection>
  );
};

export default ServicesSection;

