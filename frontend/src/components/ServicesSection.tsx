import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { getActiveServices } from '@/services/services.service';
import { decorateService, getServiceCardImage } from '@/data/services';
import { getServicesCmsConfig } from '@/services/servicesCmsConfig.service';
import { mergeServicesCmsConfig } from '@/types/servicesCms';
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
  hidden: { opacity: 0, y: 30 },
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
    staleTime: 60_000,
  });

  const sectionCopy = mergeServicesCmsConfig(cmsConfigApi).homeSection;
  const viewAllHref = homeFeatured.ctaLink?.trim() || '/services';
  const viewAllLabel = homeFeatured.ctaText?.trim() || sectionCopy.viewAllTitle || 'View All Services';

  const { data: apiServices } = useQuery({
    queryKey: ['activeServices'],
    queryFn: getActiveServices,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const activeServices = [...(apiServices || []).map(decorateService)].sort((a, b) => a.order - b.order);

  const services = useMemo(() => {
    const limit = Math.max(1, homeFeatured.limit || 6);
    const manualSlugs = (homeFeatured.manualSelection || []).map((slug) => slug.trim()).filter(Boolean);

    let selected = activeServices;

    if (manualSlugs.length > 0) {
      const bySlug = new Map(selected.map((service) => [service.slug, service]));
      selected = manualSlugs
        .map((slug) => bySlug.get(slug))
        .filter((service): service is NonNullable<typeof service> => Boolean(service));
    } else if (homeFeatured.featuredOnly) {
      selected = selected.filter((service) => service.featured === true || service.featured === 'true');
    }

    return selected.slice(0, limit);
  }, [activeServices, homeFeatured.featuredOnly, homeFeatured.limit, homeFeatured.manualSelection]);

  if (homeFeatured.visible === false) return null;

  return (
    <SiteSection ref={ref} id="services" variant="muted" aria-labelledby="services-heading" className="relative pt-8 pb-4 md:pt-12 md:pb-6">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.02] blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeader
          tag={sectionCopy.tag}
          title={homeFeatured.heading?.trim() || sectionCopy.title}
          highlight={sectionCopy.highlight}
          description={homeFeatured.subtitle?.trim() || sectionCopy.description}
          isInView={isInView}
          headingId="services-heading"
        />

        {/* Compact Grid Layout */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto max-w-7xl grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-4 md:gap-5 mt-8"
        >
          {services.map((service) => {
            return (
              <motion.div key={service.title} variants={itemVariants}>
                <Link to={`/services/${service.slug}`} className="block h-full">
                  <SpotlightCard
                    className="group relative flex flex-col items-center justify-between p-4 md:p-5 rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm hover:shadow-[0_15px_30px_rgba(15,23,42,0.05)] hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1 text-center h-full gap-3"
                    spotlightColor="rgba(34, 197, 94, 0.03)"
                    borderColor="rgba(34, 197, 94, 0.18)"
                  >
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 ring-1 ring-slate-100 transition-all duration-500 group-hover:scale-105 group-hover:ring-emerald-500/20">
                      <img
                        src={getServiceCardImage(service)}
                        alt={service.title}
                        className="h-full w-full object-contain p-2 sm:p-2.5 transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                        sizes="56px"
                      />
                    </div>
                    
                    <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                      {service.title}
                    </h3>
                    
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors mt-1">
                      Explore
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                    </span>
                  </SpotlightCard>
                </Link>
              </motion.div>
            );
          })}
          {/* View All Services Card */}
          <motion.div variants={itemVariants}>
            <Link to={viewAllHref} className="block h-full">
              <SpotlightCard
                className="group relative flex flex-col items-center justify-between p-4 md:p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 shadow-sm hover:shadow-[0_15px_30px_rgba(15,23,42,0.05)] hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1 text-center h-full gap-3"
                spotlightColor="rgba(34, 197, 94, 0.03)"
                borderColor="rgba(34, 197, 94, 0.18)"
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl overflow-hidden border border-emerald-100 shadow-sm bg-emerald-50 ring-1 ring-emerald-100 transition-all duration-500 group-hover:scale-105 group-hover:ring-emerald-500/20">
                  <ArrowRight className="h-6 w-6 text-emerald-600 transition-transform duration-500 group-hover:translate-x-1" />
                </div>
                
                <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                  {viewAllLabel}
                </h3>
                
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors mt-1">
                  {sectionCopy.viewAllLinkText}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                </span>
              </SpotlightCard>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </SiteSection>
  );
};
export default ServicesSection;
