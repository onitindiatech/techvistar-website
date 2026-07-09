import { SolutionDetail } from '@/data/solutions';
import { Layers, ArrowRight } from 'lucide-react';
import '../ui/GlassIcons.css';

interface SectionProps {
  solution: SolutionDetail;
}

const gradientMapping = [
  'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
  'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))'
];

export const SolutionFeaturesSection = ({ solution }: SectionProps) => {
  return (
    <section id="features" className="relative overflow-hidden bg-[#F8FAFC] border border-slate-200/80 rounded-3xl p-5 md:p-6 scroll-mt-24 shadow-sm w-full">
      
      {/* Light mesh and blurred radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="card-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#card-mesh)" />
        </svg>
      </div>

      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none z-0" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl pointer-events-none z-0" />

      <div className="flex items-center gap-4 mb-5 relative z-10">
        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
          <Layers className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Features</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Key capabilities of our solution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {solution.features.map((feature, idx) => {
          const FeatureIcon = feature.icon;
          const bgGradient = gradientMapping[idx % gradientMapping.length];
          
          return (
            <div key={idx} className="group flex flex-col justify-between p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-slate-100 hover:border-emerald-500/30 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_-8px_rgba(16,185,129,0.12)] transition-all duration-300 h-full">
              <div>
                {/* Header: Glass Icon Wrapper and Label */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="icon-btn pointer-events-none scale-50 origin-top-left -mb-6 -mr-4">
                    <span className="icon-btn__back" style={{ background: bgGradient }}></span>
                    <span className="icon-btn__front">
                      <span className="icon-btn__icon">
                        <FeatureIcon className="w-6 h-6 text-white" />
                      </span>
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors font-display">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-slate-500 leading-relaxed mb-2">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default SolutionFeaturesSection;
