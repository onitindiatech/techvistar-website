import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_SERVICES, SERVICES } from "@/data";
import { SpotlightCard } from '@/components/animations/SpotlightCard';

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

const ctaVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease, delay: 0.2 },
  },
};



export const ServicesSection = () => {
  const { ref, isInView } = useAnimatedSection();

  // Distribute services: Left Column (0, 2, 4) and Right Column (1, 3, 5)
  const leftServices = SERVICES.filter((_, idx) => idx % 2 === 0);
  const rightServices = SERVICES.filter((_, idx) => idx % 2 !== 0);

  return (
    <SiteSection ref={ref} id="services" variant="muted" aria-labelledby="services-heading" className="relative pt-12 pb-6 md:pt-16 md:pb-8">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.02] blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeader
          tag={SECTION_SERVICES.tag}
          title={SECTION_SERVICES.title}
          highlight={SECTION_SERVICES.highlight}
          description={SECTION_SERVICES.description}
          isInView={isInView}
          headingId="services-heading"
        />

        {/* 2-Column Grid Layout */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            {leftServices.map((service) => {
              return (
                <motion.div key={service.title} variants={itemVariants}>
                  <Link to={`/services/${service.slug}`} className="block">
                    <SpotlightCard
                      className="group relative flex flex-col p-6 rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm hover:shadow-[0_15px_30px_rgba(15,23,42,0.05)] hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1"
                      spotlightColor="rgba(34, 197, 94, 0.03)"
                      borderColor="rgba(34, 197, 94, 0.18)"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full overflow-hidden border border-slate-100 shadow-sm bg-white ring-1 ring-slate-100 transition-all duration-500 group-hover:scale-105 group-hover:ring-emerald-500/20">
                          <img
                            src={service.coverImage}
                            alt={service.title}
                            className="h-full w-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        
                        <div className="space-y-1.5 pt-0.5">
                          <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-500 font-medium">
                            {service.description}
                          </p>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:text-emerald-700 mt-2 transition-colors">
                            Explore
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                          </span>
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {rightServices.map((service) => {
              return (
                <motion.div key={service.title} variants={itemVariants}>
                  <Link to={`/services/${service.slug}`} className="block">
                    <SpotlightCard
                      className="group relative flex flex-col p-6 rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm hover:shadow-[0_15px_30px_rgba(15,23,42,0.05)] hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1"
                      spotlightColor="rgba(34, 197, 94, 0.03)"
                      borderColor="rgba(34, 197, 94, 0.18)"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full overflow-hidden border border-slate-100 shadow-sm bg-white ring-1 ring-slate-100 transition-all duration-500 group-hover:scale-105 group-hover:ring-emerald-500/20">
                          <img
                            src={service.coverImage}
                            alt={service.title}
                            className="h-full w-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        
                        <div className="space-y-1.5 pt-0.5">
                          <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-500 font-medium">
                            {service.description}
                          </p>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:text-emerald-700 mt-2 transition-colors">
                            Explore
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                          </span>
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 md:mt-12 max-w-5xl mx-auto w-full"
        >
          <SpotlightCard
            className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.12)] hover:border-emerald-500/50 hover:bg-emerald-500/[0.04] transition-all duration-500 w-full"
            spotlightColor="rgba(34, 197, 94, 0.03)"
            borderColor="rgba(34, 197, 94, 0.2)"
          >
            <div className="flex flex-col items-center justify-between gap-5 px-6 py-6 sm:flex-row sm:px-8 w-full h-full">
              <span className="max-w-xl text-center text-sm leading-relaxed text-slate-600 font-bold sm:text-left">
                {SECTION_SERVICES.cta}
              </span>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-colors hover:bg-primary/92"
              >
                Contact us
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </motion.a>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </SiteSection>
  );
};
export default ServicesSection;
