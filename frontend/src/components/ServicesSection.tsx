import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getActiveServices } from '@/services/services.service';
import { decorateService, getServiceCardImage, type Service } from '@/data/services';
import { getServicesCmsConfig } from '@/services/servicesCmsConfig.service';
import { mergeServicesCmsConfig } from '@/types/servicesCms';
import { SpotlightCard } from '@/components/animations/SpotlightCard';
import { useHomeCms } from '@/contexts/HomeCmsContext';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/** Home services grid: 4×2 on desktop */
const HOME_SERVICES_COUNT = 8;

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

function isFeaturedService(service: Service): boolean {
  return Boolean(service.featured);
}

/**
 * Featured first, then remaining active services, up to `limit`.
 * Optional CMS manualSelection is honored first, then the same fill rules apply.
 */
function selectHomeServices(activeServices: Service[], manualSlugs: string[], limit: number): Service[] {
  const bySlug = new Map(activeServices.map((service) => [service.slug, service]));
  const picked: Service[] = [];
  const seen = new Set<string>();

  const push = (service: Service | undefined) => {
    if (!service || seen.has(service.slug) || picked.length >= limit) return;
    seen.add(service.slug);
    picked.push(service);
  };

  for (const slug of manualSlugs) {
    push(bySlug.get(slug));
  }

  const featured = activeServices.filter(isFeaturedService);
  const rest = activeServices.filter((service) => !isFeaturedService(service));

  for (const service of featured) push(service);
  for (const service of rest) push(service);

  return picked;
}

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
      match: (c: string, t: string) => /brand|design|creative|ui|ux|perceiv|identity|content/i.test(c) || /brand|design|creative|ui|ux|identity|documentation/i.test(t),
    },
    {
      code: '02',
      title: 'GROWTH',
      subtitle: 'How the business attracts and converts demand.',
      match: (c: string, t: string) => /growth|market|seo|conversion|lead|acquisition/i.test(c) || /market|growth|seo|conversion|revenue/i.test(t),
    },
    {
      code: '03',
      title: 'SYSTEMS',
      subtitle: 'How the business operates and scales.',
      match: (c: string, t: string) => /system|infra|automat|cloud|ops|operation|advanced|ai|tech/i.test(c) || /automat|cloud|devops|system|ops|ai/i.test(t),
    },
    {
      code: '04',
      title: 'DIGITAL',
      subtitle: 'How the business delivers and evolves.',
      match: (c: string, t: string) => /digital|develop|software|product|platform|app|web/i.test(c) || /develop|software|product|platform|web|app/i.test(t),
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
      {/* Soft ambient depth — emerald wash so the field feels less flat */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-[40%] h-[min(560px,75vw)] w-[min(780px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.07)_0%,rgba(148,163,184,0.04)_40%,transparent_68%)]" />
        <div className="absolute left-[18%] top-[55%] h-[280px] w-[280px] rounded-full bg-emerald-400/[0.04] blur-[90px]" />
        <div className="absolute right-[12%] top-[30%] h-[240px] w-[240px] rounded-full bg-teal-500/[0.035] blur-[80px]" />
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
          className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {pillarGroups.map((pillar) => (
            <motion.div key={pillar.title} variants={itemVariants} className="h-full">
              <SpotlightCard
                borderBeam
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_-4px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-xl"
                spotlightColor="rgba(14, 165, 233, 0.06)"
                borderColor="rgba(14, 165, 233, 0.40)"
              >
                {/* Pillar Header */}
                <div className="space-y-1 mb-3">
                  <span className="text-sm font-extrabold text-emerald-600 font-display block">
                    {pillar.code}.
                  </span>
                  <h3 className="font-display text-xl font-extrabold tracking-tight text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 leading-snug">
                    {pillar.subtitle}
                  </p>
                </div>

                <div className="w-full h-px bg-slate-100 my-2" />

                {/* Dynamically Grouped Active Backend Services */}
                <div className="flex-1 space-y-1">
                  {pillar.services.map((srv) => {
                    const IconComp = srv.icon;
                    return (
                      <Link
                        key={srv.slug}
                        to={`/services/${srv.slug}`}
                        className="group/item flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-500/[0.04] transition-all duration-200"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="p-1.5 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-colors shrink-0">
                            <IconComp className="w-4 h-4" />
                          </span>
                          <span className="text-sm font-semibold text-slate-800 group-hover/item:text-emerald-700 transition-colors truncate">
                            {srv.title}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all shrink-0 ml-1" />
                      </Link>
                    );
                  })}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
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
