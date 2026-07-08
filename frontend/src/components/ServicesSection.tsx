import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getActiveServices } from '@/services/services.service';
import { decorateService, Service } from '@/data/services';
import { getServicesCmsConfig } from '@/services/servicesCmsConfig.service';
import { mergeServicesCmsConfig } from '@/types/servicesCms';
import { ServiceCard } from '@/components/services/ServiceCard';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function isFeaturedService(service: Service): boolean {
  return service.featured === true || (service.featured as unknown) === 'true';
}

export const ServicesSection = () => {
  const { ref, isInView } = useAnimatedSection();

  const { data: cmsConfigApi } = useQuery({
    queryKey: ['servicesCmsConfig'],
    queryFn: getServicesCmsConfig,
    staleTime: 60_000,
  });

  const sectionCopy = mergeServicesCmsConfig(cmsConfigApi).homeSection;

  const { data: apiServices } = useQuery({
    queryKey: ['activeServices'],
    queryFn: getActiveServices,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const activeServices = useMemo(
    () => [...(apiServices || []).map(decorateService)].sort((a, b) => a.order - b.order),
    [apiServices]
  );

  const featuredServices = useMemo(
    () => activeServices.filter(isFeaturedService).slice(0, 2),
    [activeServices]
  );

  const remainingServices = useMemo(
    () => activeServices.filter((s) => !isFeaturedService(s)),
    [activeServices]
  );

  const showFeaturedSection = featuredServices.length > 0;
  const gridServices = showFeaturedSection ? remainingServices : activeServices;

  return (
    <SiteSection
      ref={ref}
      id="services"
      variant="muted"
      aria-labelledby="services-heading"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-emerald-500/[0.04] blur-[100px]" />

      <div className="container-custom relative z-10">
        <SectionHeader
          tag={sectionCopy.tag}
          title={sectionCopy.title}
          highlight={sectionCopy.highlight}
          description={sectionCopy.description}
          isInView={isInView}
          headingId="services-heading"
          className="mb-14 md:mb-20"
        />

        {showFeaturedSection && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease, delay: 0.1 }}
            className="mx-auto mb-14 max-w-6xl md:mb-16"
          >
            <div className="mb-5 flex items-center gap-2 text-emerald-600">
              <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Featured Services</span>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {featuredServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  variant="homepage-featured"
                  featured
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}

        {gridServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease, delay: 0.18 }}
            className="mx-auto max-w-6xl"
          >
            {showFeaturedSection && (
              <div className="mb-5 flex items-center gap-2 text-slate-500">
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">All Services</span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gridServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  variant="homepage-compact"
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.25 }}
          className="mx-auto mt-14 max-w-6xl md:mt-16"
        >
          <div className="flex flex-col items-start justify-between gap-6 rounded-[24px] border border-slate-200/80 bg-gradient-to-r from-slate-50 via-white to-emerald-50/40 p-6 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.06)] md:flex-row md:items-center md:p-8">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 md:text-xl">
                  Need a custom solution?
                </h3>
                <p className="mt-1 max-w-md text-sm font-medium leading-relaxed text-slate-500">
                  We build scalable software tailored to your business.
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 shrink-0 rounded-full border-emerald-500/40 bg-white px-7 font-bold text-emerald-700 shadow-sm transition-all hover:border-emerald-500 hover:bg-emerald-50/50"
            >
              <Link to="/services" className="group inline-flex items-center gap-2">
                {sectionCopy.viewAllTitle}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </SiteSection>
  );
};

export default ServicesSection;
