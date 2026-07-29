import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { resolveLucideIcon } from '@/lib/resolveLucideIcon';
import { IndustriesLandingCmsConfig } from '@/types/pagesCms';
import { DEFAULT_INDUSTRIES_LANDING_CMS } from '@/types/pagesCms';
import { AnimatedStat } from '@/components/ui/AnimatedStat';

interface IndustriesCapabilitiesSectionProps {
  landing: IndustriesLandingCmsConfig;
  industryCount: number;
}

export const IndustriesCapabilitiesSection = ({
  landing,
  industryCount,
}: IndustriesCapabilitiesSectionProps) => {
  const capabilities = landing.capabilities || DEFAULT_INDUSTRIES_LANDING_CMS.capabilities;
  const intro = landing.intro || DEFAULT_INDUSTRIES_LANDING_CMS.intro;

  const title = intro.title?.trim() || DEFAULT_INDUSTRIES_LANDING_CMS.intro.title;
  const description = intro.description?.trim() || DEFAULT_INDUSTRIES_LANDING_CMS.intro.description;
  const eyebrow = capabilities.eyebrow?.trim() || DEFAULT_INDUSTRIES_LANDING_CMS.capabilities.eyebrow;

  // Prefer CMS stats; only enrich the first default slot with live catalog count when CMS still uses defaults.
  const cmsStats = capabilities.stats?.length
    ? capabilities.stats
    : DEFAULT_INDUSTRIES_LANDING_CMS.capabilities.stats;
  const stats = cmsStats.map((stat, idx) => {
    const isDefaultFirst =
      idx === 0 &&
      (!capabilities.stats?.length ||
        (stat.label === DEFAULT_INDUSTRIES_LANDING_CMS.capabilities.stats[0]?.label &&
          (stat.value === DEFAULT_INDUSTRIES_LANDING_CMS.capabilities.stats[0]?.value ||
            /^\d+\+$/.test(stat.value))));
    if (isDefaultFirst && industryCount > 0) {
      return { ...stat, value: `${industryCount}+` };
    }
    return stat;
  });
  const cards = capabilities.cards?.length
    ? capabilities.cards
    : DEFAULT_INDUSTRIES_LANDING_CMS.capabilities.cards;

  return (
    <section id="industries-we-serve" className="border-t border-slate-100 bg-white py-16 md:py-20">
      <div className="container mx-auto max-w-7xl space-y-8 md:space-y-10 px-4 md:px-6">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            {intro.icon ? (
              <img src={intro.icon} alt="" className="h-4 w-4 rounded object-cover" />
            ) : (
              <Building2 className="h-4 w-4" />
            )}
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
          {cards.map((item, index) => {
            const Icon = resolveLucideIcon(item.icon || 'ShieldCheck');
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

export default IndustriesCapabilitiesSection;
