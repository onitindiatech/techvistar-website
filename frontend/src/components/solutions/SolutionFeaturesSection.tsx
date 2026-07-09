import { SolutionDetail } from '@/data/solutions';
import { Layers } from 'lucide-react';

interface SectionProps {
  solution: SolutionDetail;
}

export const SolutionFeaturesSection = ({ solution }: SectionProps) => {
  return (
    <section id="features" className="bg-slate-50/50 border border-slate-200/50 rounded-3xl p-5 md:p-6 scroll-mt-24 w-full">
      
      <div className="flex items-center gap-4 mb-5">
        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
          <Layers className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Features</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Key capabilities of our solution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {solution.features.map((feature, idx) => {
          const FeatureIcon = feature.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 group h-full flex flex-col">
              <div className="flex flex-col h-full">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:from-emerald-50 group-hover:to-teal-50 group-hover:border-emerald-200 transition-colors mb-5">
                  <FeatureIcon className="h-5 w-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
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
export default SolutionFeaturesSection;
