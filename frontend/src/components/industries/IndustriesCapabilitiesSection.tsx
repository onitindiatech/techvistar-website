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

  const title = intro.title?.trim() || 'Industries We Serve';
  const description =
    intro.description?.trim() ||
    'Enterprise-grade platforms and delivery patterns across regulated and high-growth verticals.';
  const eyebrow = capabilities.eyebrow?.trim() || 'Industry expertise';

  const defaultStats = DEFAULT_INDUSTRIES_LANDING_CMS.capabilities.stats.map((stat, idx) =>
    idx === 0 ? { ...stat, value: `${industryCount || 10}+` } : stat
  );
  const stats = capabilities.stats?.length ? capabilities.stats : defaultStats;
  const cards = capabilities.cards?.length ? capabilities.cards : DEFAULT_INDUSTRIES_LANDING_CMS.capabilities.cards;

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
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
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
