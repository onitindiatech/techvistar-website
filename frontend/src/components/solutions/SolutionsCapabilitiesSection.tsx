import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { resolveLucideIcon } from '@/lib/resolveLucideIcon';
import {
  SolutionsLandingCmsConfig,
  DEFAULT_SOLUTIONS_LANDING_CMS,
  CmsStatItem,
} from '@/types/pagesCms';
import { AnimatedStat } from '@/components/ui/AnimatedStat';

interface SolutionsCapabilitiesSectionProps {
  landing: SolutionsLandingCmsConfig;
  solutionCount?: number;
}

export const SolutionsCapabilitiesSection = ({
  landing,
  solutionCount = 0,
}: SolutionsCapabilitiesSectionProps) => {
  const intro = landing.intro || DEFAULT_SOLUTIONS_LANDING_CMS.intro;
  const capabilities = landing.capabilities || DEFAULT_SOLUTIONS_LANDING_CMS.capabilities;
  const title = intro.title?.trim() || DEFAULT_SOLUTIONS_LANDING_CMS.intro.title;
  const description = intro.description?.trim() || DEFAULT_SOLUTIONS_LANDING_CMS.intro.description;
  const eyebrow = capabilities.eyebrow?.trim() || DEFAULT_SOLUTIONS_LANDING_CMS.capabilities.eyebrow;

  const stats: CmsStatItem[] = (capabilities.stats?.length
    ? capabilities.stats
    : DEFAULT_SOLUTIONS_LANDING_CMS.capabilities.stats
  ).map((stat, idx) =>
    idx === 0 && solutionCount > 0 ? { ...stat, value: `${solutionCount}+` } : stat
  );

  const featureCards = capabilities.cards?.length
    ? capabilities.cards
    : DEFAULT_SOLUTIONS_LANDING_CMS.capabilities.cards;

  return (
    <section id="solution-capabilities" className="border-t border-slate-100 bg-white py-16 md:py-20">
      <div className="container mx-auto max-w-7xl space-y-8 md:space-y-10 px-4 md:px-6">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <Layers className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{eyebrow}</span>
          </div>
          <h2 className="font-display text-heading-md text-slate-900 md:text-heading-xl">
            {title}
          </h2>
          <p className="text-sm font-semibold leading-relaxed text-slate-500">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={`${stat.label}-${index}`}
              value={stat.value}
              label={stat.label}
              variant="capability-card"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((item, index) => {
            const Icon = resolveLucideIcon(item.icon);
            return (
              <motion.article
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-emerald-500/25 hover:shadow-lg"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="mb-4 h-11 w-11 rounded-xl object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsCapabilitiesSection;
