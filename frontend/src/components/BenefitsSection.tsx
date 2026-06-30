import { motion } from 'framer-motion';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BENEFITS, SECTION_BENEFITS } from '@/data';
import { SpotlightCard } from '@/components/animations/SpotlightCard';
import { cn } from '@/lib/utils';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const gridContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease },
  },
};

const BENEFIT_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80', // Motherboard Chip
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80', // Cybersecurity grid
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=150&auto=format&fit=crop&q=80', // Business financial chart
  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&auto=format&fit=crop&q=80', // Quality review / QA testing
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&auto=format&fit=crop&q=80', // Transparent contract agreement
  'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=150&auto=format&fit=crop&q=80', // Developer coding layout
];

export const BenefitsSection = () => {
  const { ref, isInView } = useAnimatedSection();

  return (
    <SiteSection ref={ref} id="benefits" variant="muted" aria-labelledby="benefits-heading" className="lg:pb-36">
      <div className="container-custom relative z-10">
        <SectionHeader
          tag={SECTION_BENEFITS.tag}
          title={SECTION_BENEFITS.title}
          highlight={SECTION_BENEFITS.highlight}
          description={SECTION_BENEFITS.description}
          isInView={isInView}
          headingId="benefits-heading"
        />

        <motion.div
          className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          variants={gridContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {BENEFITS.map((item, index) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              className={cn(
                "h-full",
                index % 3 === 1 ? "lg:translate-y-4" : index % 3 === 2 ? "lg:translate-y-8" : ""
              )}
            >
              <SpotlightCard
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-[0_8px_30px_-12px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] hover:border-emerald-500/50 hover:bg-emerald-500/[0.04] transition-all duration-500 hover:-translate-y-2"
                spotlightColor="rgba(34, 197, 94, 0.03)"
                borderColor="rgba(34, 197, 94, 0.2)"
              >
                <div className="h-1 w-full bg-gradient-to-r from-primary via-emerald-500 to-teal-600 relative z-10" aria-hidden />

                <div className="flex flex-1 flex-col p-6 sm:p-7 relative z-10 text-slate-700">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-slate-100 shadow-sm ring-1 ring-slate-100 transition-all duration-500 group-hover:scale-110 group-hover:ring-emerald-500/20"
                        aria-hidden
                      >
                        <img
                          src={BENEFIT_IMAGES[index]}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="font-display text-[1.0625rem] font-bold leading-snug tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <span className="shrink-0 font-mono text-[0.6875rem] font-medium tabular-nums tracking-wide text-slate-400 group-hover:text-primary/60 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-500 font-semibold transition-colors">
                    {item.description}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SiteSection>
  );
};
export default BenefitsSection;
