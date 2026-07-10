import { SolutionDetail } from '@/data/solutions';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface SectionProps {
  solution: SolutionDetail;
}

export const SolutionProcessSection = ({ solution }: SectionProps) => {
  return (
    <section id="process" className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 scroll-mt-24 shadow-sm relative overflow-hidden w-full">
      <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-5">
          <div className="icon-btn pointer-events-none scale-75 origin-top-left -mb-4 -mr-4">
            <span className="icon-btn__back" style={{ background: 'linear-gradient(hsl(210, 90%, 40%), hsl(200, 90%, 40%))' }}></span>
            <span className="icon-btn__front">
              <span className="icon-btn__icon">
                <span className="text-white font-bold font-display">P</span>
              </span>
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">{solution.sectionCopy?.processTitle || 'Implementation Process'}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">{solution.sectionCopy?.processSubtitle || 'How we deliver results'}</p>
          </div>
        </div>

        <div className="relative mt-12 py-4">
          {/* Center Vertical Line (hidden on mobile, visible on md+) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 bg-slate-100 -translate-x-1/2 z-0" />
          
          {/* Left Vertical Line (visible on mobile only) */}
          <div className="md:hidden absolute left-[38px] top-4 bottom-4 w-1 bg-slate-100 z-0" />

          <div className="flex flex-col gap-12 relative z-10">
            {solution.howItWorks.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="relative flex flex-col md:flex-row items-center group">
                  
                  {/* Mobile Node (absolute left) */}
                  <div className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-4 border-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center z-20 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                    <span className="text-sm font-bold text-emerald-600 group-hover:text-white transition-colors">{step.step}</span>
                  </div>

                  {/* Desktop Left Content */}
                  <div className={`hidden md:flex w-1/2 justify-end pr-16 ${isEven ? 'opacity-100' : 'opacity-0'}`}>
                    {isEven && (
                      <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-emerald-200 transition-all text-right w-full max-w-md group-hover:-translate-y-1 relative">
                        {/* Connecting line to node */}
                        <div className="absolute top-1/2 -translate-y-1/2 -right-16 w-16 h-1 bg-slate-100 group-hover:bg-emerald-200 transition-colors z-0" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{step.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Desktop Node (Center) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 bg-white border-4 border-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.15)] items-center justify-center z-20 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all group-hover:scale-110 duration-300">
                    <span className="text-lg font-bold text-emerald-600 group-hover:text-white transition-colors">{step.step}</span>
                  </div>

                  {/* Desktop Right Content */}
                  <div className={`hidden md:flex w-1/2 justify-start pl-16 ${!isEven ? 'opacity-100' : 'opacity-0'}`}>
                    {!isEven && (
                      <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-emerald-200 transition-all text-left w-full max-w-md group-hover:-translate-y-1 relative">
                        {/* Connecting line to node */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-16 w-16 h-1 bg-slate-100 group-hover:bg-emerald-200 transition-colors z-0" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{step.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Mobile Content (always visible, pushed right) */}
                  <div className="md:hidden w-full pl-[5.5rem] pr-2 py-2">
                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all w-full relative">
                      <div className="absolute top-1/2 -translate-y-1/2 -left-6 w-6 h-1 bg-slate-100 group-hover:bg-emerald-200 transition-colors z-0" />
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
export default SolutionProcessSection;
