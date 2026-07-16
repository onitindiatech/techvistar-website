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
    const manualSlugs = (homeFeatured.manualSelection || []).map((slug) => slug.trim()).filter(Boolean);
    return selectHomeServices(activeServices, manualSlugs, HOME_SERVICES_COUNT);
  }, [activeServices, homeFeatured.manualSelection]);

  if (homeFeatured.visible === false) return null;

  return (
    <SiteSection ref={ref} id="services" variant="muted" aria-labelledby="services-heading" className="relative pt-8 pb-4 md:pt-12 md:pb-6">
      {/* Soft ambient depth — emerald wash so the field feels less flat */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-[40%] h-[min(560px,75vw)] w-[min(780px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.07)_0%,rgba(148,163,184,0.04)_40%,transparent_68%)]" />
        <div className="absolute left-[18%] top-[55%] h-[280px] w-[280px] rounded-full bg-emerald-400/[0.04] blur-[90px]" />
        <div className="absolute right-[12%] top-[30%] h-[240px] w-[240px] rounded-full bg-teal-500/[0.035] blur-[80px]" />
      </div>

      <div className="container-custom relative z-10">
        <SectionHeader
          tag={sectionCopy.tag}
          title={homeFeatured.heading?.trim() || sectionCopy.title}
          highlight={sectionCopy.highlight}
          description={homeFeatured.subtitle?.trim() || sectionCopy.description}
          isInView={isInView}
          headingId="services-heading"
        />

        {/* Responsive grid: mobile 1 · tablet 2 · desktop 4 (4×2) */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.slug || service.title} variants={itemVariants} className="h-full">
              <Link
                to={`/services/${service.slug}`}
                className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2"
              >
                <SpotlightCard
                  borderBeam
                  className="group relative flex h-full min-h-[146px] flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_-2px_rgba(15,23,42,0.05),0_12px_24px_-8px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[6px] hover:border-emerald-500/25 hover:shadow-[0_2px_4px_rgba(15,23,42,0.04),0_12px_24px_-6px_rgba(15,23,42,0.08),0_24px_40px_-12px_rgba(16,185,129,0.14)] md:min-h-[152px] md:p-4"
                  spotlightColor="rgba(34, 197, 94, 0.06)"
                  borderColor="rgba(34, 197, 94, 0.35)"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.03] transition-transform duration-300 ease-out group-hover:scale-105 group-hover:ring-emerald-500/20">
                    <img
                      src={getServiceCardImage(service)}
                      alt=""
                      className="h-full w-full object-contain p-2.5 transition-transform duration-300 ease-out group-hover:scale-[1.06]"
                      loading="lazy"
                      decoding="async"
                      sizes="56px"
                    />
                  </div>

                  <h3 className="font-display text-sm font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-primary sm:text-base">
                    {service.title}
                  </h3>

                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 transition-[color,gap] duration-300 ease-out group-hover:gap-2 group-hover:text-emerald-700">
                    Explore
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  </span>
                </SpotlightCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Centered section CTA — not a peer card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease, delay: 0.35 }}
          className="mt-8 flex justify-center md:mt-10"
        >
          <Button asChild variant="hero" size="lg" className="rounded-xl px-8">
            <Link to={viewAllHref} aria-label={viewAllLabel}>
              {viewAllLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </motion.div>
      </div>
    </SiteSection>
  );
};

export default ServicesSection;
