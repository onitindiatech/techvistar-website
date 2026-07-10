import { SolutionDetail } from '@/data/solutions';
import { Target, TrendingUp, Zap, Shield, Maximize } from 'lucide-react';

interface SectionProps {
  solution: SolutionDetail;
}

export const SolutionBenefitsSection = ({ solution }: SectionProps) => {
  const benefitsList = [
    {
      title: 'ROI',
      desc: solution.benefits.roi,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      hoverFrom: 'group-hover:from-blue-50/50',
      hoverTo: 'group-hover:to-transparent'
    },
    {
      title: 'Efficiency',
      desc: solution.benefits.efficiency,
      icon: Zap,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      hoverFrom: 'group-hover:from-amber-50/50',
      hoverTo: 'group-hover:to-transparent'
    },
    {
      title: 'Scalability',
      desc: solution.benefits.scalability,
      icon: Maximize,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      hoverFrom: 'group-hover:from-indigo-50/50',
      hoverTo: 'group-hover:to-transparent'
    },
    {
      title: 'Security',
      desc: solution.benefits.security,
      icon: Shield,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      hoverFrom: 'group-hover:from-rose-50/50',
      hoverTo: 'group-hover:to-transparent'
    }
  ];

  return (
    <section id="benefits" className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 scroll-mt-24 shadow-sm relative overflow-hidden w-full">
      {/* Decorative Background */}
      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-br from-emerald-50/80 to-transparent pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20" />

      <div className="flex items-center gap-4 mb-5 relative z-10">
        <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
          <Target className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">{solution.sectionCopy?.benefitsTitle || 'Key Benefits'}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{solution.sectionCopy?.benefitsSubtitle || 'Value delivered by our solution'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        {benefitsList.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div key={idx} className={`bg-white border border-slate-100 shadow-sm rounded-2xl p-4 md:p-5 transition-all duration-300 hover:shadow-md hover:border-slate-200 group relative overflow-hidden flex items-center gap-5 hover:-translate-y-1`}>
              {/* Premium Gradient Overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${benefit.hoverFrom} ${benefit.hoverTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full">
                <div className={`h-12 w-12 rounded-xl ${benefit.bg} ${benefit.color} border ${benefit.border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <h3 className="text-lg font-bold text-slate-900 md:w-1/4 shrink-0">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default SolutionBenefitsSection;
