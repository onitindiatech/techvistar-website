import { SolutionDetail } from '@/data/solutions';
import { Brain } from 'lucide-react';

interface SectionProps {
  solution: SolutionDetail;
}

export const SolutionOverviewSection = ({ solution }: SectionProps) => {
  const IconComponent = solution.icon || Brain;

  return (
    <section id="overview" className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-8 scroll-mt-24 shadow-sm relative overflow-hidden w-full">
      
      {/* Light mesh grid backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="overview-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#overview-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="icon-btn pointer-events-none scale-75 origin-top-left -mb-4 -mr-4">
            <span className="icon-btn__back" style={{ background: 'linear-gradient(hsl(210, 90%, 40%), hsl(220, 90%, 40%))' }}></span>
            <span className="icon-btn__front">
              <span className="icon-btn__icon">
                <IconComponent className="w-6 h-6 text-white" />
              </span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Overview</h2>
        </div>

        <div className="max-w-4xl pt-2">
          <p className="text-slate-600 text-sm md:text-sm leading-relaxed">
            {solution.ourSolution.overview}
          </p>
        </div>
      </div>
    </section>
  );
};
export default SolutionOverviewSection;
