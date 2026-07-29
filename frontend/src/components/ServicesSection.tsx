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

  const activeServices = [...(apiServices || []).map(decorateService)].sort((a, b) => a.order - b.order);

  const services = useMemo(() => {
    const manualSlugs = (homeFeatured.manualSelection || []).map((slug) => slug.trim()).filter(Boolean);
    return selectHomeServices(activeServices, manualSlugs, HOME_SERVICES_COUNT);
  }, [activeServices, homeFeatured.manualSelection]);

  if (homeFeatured.visible === false) return null;

  return (
    <SiteSection ref={ref} id="services" variant="muted" aria-labelledby="services-heading" className="relative pt-8 pb-4 md:pt-14 md:pb-8">
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
          className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
        >
          {services.map((service) => {
            const coverSrc = getServiceCardImage(service);

            return (
              <motion.div key={service.slug || service.title} variants={itemVariants} className="h-full">
                <Link
                  to={`/services/${service.slug}`}
                  className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2"
                >
                  <SpotlightCard
                    borderBeam
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_-4px_rgba(15,23,42,0.07)] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[7px] hover:border-emerald-400/30 hover:shadow-[0_4px_8px_rgba(15,23,42,0.05),0_16px_40px_-8px_rgba(15,23,42,0.12),0_32px_56px_-16px_rgba(16,185,129,0.18)]"
                    spotlightColor="rgba(34, 197, 94, 0.06)"
                    borderColor="rgba(34, 197, 94, 0.40)"
                  >
                    {/* ── Cover Image ─────────────────────────────── */}
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                      <img
                        src={coverSrc}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                        loading="lazy"
                        decoding="async"
                      />

                      {/* Gradient veil — fades to card bottom so icon badge is readable */}
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.18) 35%, transparent 65%)',
                        }}
                        aria-hidden
                      />


                      {/* Category pill — top-right */}
                      <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-[4px]">
                        {service.category}
                      </span>
                    </div>

                    {/* ── Card Body ───────────────────────────────── */}
                    <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                      {/* Service name */}
                      <h3 className="font-display text-[0.9375rem] font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-emerald-700">
                        {service.title}
                      </h3>

                      {/* 2-line description */}
                      <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-slate-500">
                        {service.shortDescription}
                      </p>

                      {/* Explore CTA */}
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.75rem] font-bold text-emerald-600 transition-all duration-300 ease-out group-hover:gap-2.5 group-hover:text-emerald-700">
                        Explore
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                      </span>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Centered section CTA — not a peer card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease, delay: 0.35 }}
          className="mt-10 flex justify-center md:mt-12"
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
