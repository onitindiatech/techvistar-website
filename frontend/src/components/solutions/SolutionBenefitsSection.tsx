import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Maximize, Shield } from 'lucide-react';
import { SolutionDetail } from '@/data/solutions';

interface SectionProps {
  solution: SolutionDetail;
}

export const SolutionBenefitsSection = ({ solution }: SectionProps) => {
  const benefitsList = [
    {
      title: 'ROI',
      desc: solution.benefits.roi,
      icon: TrendingUp,
    },
    {
      title: 'Efficiency',
      desc: solution.benefits.efficiency,
      icon: Zap,
    },
    {
      title: 'Scalability',
      desc: solution.benefits.scalability,
      icon: Maximize,
    },
    {
      title: 'Security',
      desc: solution.benefits.security,
      icon: Shield,
    },
  ];

  return (
    <section
      id="benefits"
      className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-10"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/[0.04] blur-3xl" />

      <div className="relative z-10 mb-8 space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
            <Sparkles className="h-3 w-3 text-emerald-600" />
          </div>
          <h2 className="font-display text-heading-sm text-slate-900">
            {solution.sectionCopy?.benefitsTitle || 'Benefits & Features'}
          </h2>
        </div>
        {solution.sectionCopy?.benefitsSubtitle?.trim() && (
          <p className="pl-7 text-xs font-medium text-slate-500">
            {solution.sectionCopy.benefitsSubtitle}
          </p>
        )}
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {benefitsList.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-5 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-[0_12px_30px_-12px_rgba(14,165,233,0.1)]"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mb-1.5 font-display text-sm font-bold text-slate-900">{benefit.title}</h3>
              <p className="text-xs font-medium leading-relaxed text-slate-500">{benefit.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default SolutionBenefitsSection;
