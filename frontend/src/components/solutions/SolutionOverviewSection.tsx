import { SolutionDetail } from '@/data/solutions';
import { Brain, Lightbulb, AlertTriangle } from 'lucide-react';

interface SectionProps {
  solution: SolutionDetail;
}

export const SolutionOverviewSection = ({ solution }: SectionProps) => {
  const IconComponent = solution.icon || Brain;

  return (
    <section id="overview" className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 scroll-mt-24 shadow-sm relative overflow-hidden w-full">
      
      {/* Light mesh grid backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="overview-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#overview-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Main Content Column */}
        <div className="md:col-span-12 space-y-5">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="icon-btn pointer-events-none scale-75 origin-top-left -mb-4 -mr-4">
              <span className="icon-btn__back" style={{ background: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))' }}></span>
              <span className="icon-btn__front">
                <span className="icon-btn__icon">
                  <IconComponent className="w-6 h-6 text-white" />
                </span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">Solution Theory</h2>
          </div>

          <div className="w-12 h-1 bg-emerald-500 rounded-full" />

          <p className="text-slate-600 text-base leading-relaxed">
            {solution.ourSolution.overview}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Challenges box */}
            <div className="bg-red-50/50 border border-red-100/50 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:bg-red-50/80">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-base font-bold text-red-800">Operational Obstacles</div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-red-700/90 leading-relaxed mb-2">
                  {solution.challenges.title}
                </p>
                <ul className="space-y-1">
                  {solution.challenges.points.map((pt, i) => (
                    <li key={i} className="text-sm text-red-600 flex gap-2 items-start">
                      <span className="shrink-0 mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-4 border-t border-red-200/50">
                <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest block">System Impact</span>
                <p className="text-sm font-bold text-red-700 mt-1.5 leading-relaxed">{solution.challenges.impact}</p>
              </div>
            </div>

            {/* Capabilities Box */}
            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:bg-emerald-50/80">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Lightbulb className="h-5 w-5 text-emerald-600 animate-pulse" />
                </div>
                <div className="text-base font-bold text-emerald-800">Our Tailored Approach</div>
              </div>
              <div className="space-y-3 pt-1">
                {solution.ourSolution.capabilities.map((cap, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                      <span className="text-emerald-600 text-[11px] font-bold">{i + 1}</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-700">{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SolutionOverviewSection;
