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

      <div className="flex flex-col gap-4 relative z-10">
        {solution.features.map((feature, idx) => {
          const FeatureIcon = feature.icon;
          const bgGradient = gradientMapping[idx % gradientMapping.length];
          
          return (
            <div key={idx} className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-slate-100 hover:border-emerald-500/30 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_-8px_rgba(16,185,129,0.12)] transition-all duration-300">
              
              {/* Icon Container with fixed width/height for the scaled element */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 relative">
                <div className="icon-btn pointer-events-none scale-[0.4] sm:scale-50 origin-top-left absolute top-0 left-0">
                  <span className="icon-btn__back" style={{ background: bgGradient }}></span>
                  <span className="icon-btn__front">
                    <span className="icon-btn__icon">
                      <FeatureIcon className="w-6 h-6 text-white" />
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors font-display">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              <div className="hidden sm:block shrink-0 pl-4">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  Explore
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default SolutionFeaturesSection;
