import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { AnimatedStat } from '@/components/ui/AnimatedStat';
import { getCmsIcon } from '@/lib/cmsIcons';
import { useHomeCms } from '@/contexts/HomeCmsContext';

export const HomeStatsSection = () => {
  const { stats } = useHomeCms();
  const { ref, isInView } = useAnimatedSection();

  const items = useMemo(
    () =>
      [...stats]
        .filter((stat) => stat.value?.trim() || stat.label?.trim())
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [stats],
  );

  if (!items.length) return null;

  return (
    <SiteSection
      ref={ref}
      id="home-stats"
      variant="default"
      aria-label="Company statistics"
      className="!py-8 md:!py-10 border-y border-slate-100/80 bg-white"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((stat) => {
            const Icon = getCmsIcon(stat.icon);
            const displayValue = `${stat.prefix || ''}${stat.value || ''}${stat.suffix || ''}`.trim();
            return (
              <AnimatedStat
                key={`${stat.label}-${stat.sortOrder}-${displayValue}`}
                value={displayValue}
                label={stat.label}
                variant="hero-card"
                icon={<Icon className="h-4 w-4" />}
                themeIconClass="bg-emerald-50 text-emerald-600"
              />
            );
          })}
        </motion.div>
      </div>
    </SiteSection>
  );
};

export default HomeStatsSection;
