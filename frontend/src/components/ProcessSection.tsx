import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';
import { PROCESS_PILLARS, PROCESS_STEPS, SECTION_PROCESS } from '@/data';
import { Check, Sparkles } from 'lucide-react';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export const ProcessSection = () => {
  const { ref, isInView } = useAnimatedSection();
  const [activeTab, setActiveTab] = useState(0);

  const currentStep = PROCESS_STEPS[activeTab];
  const StepIcon = currentStep.icon;

  const getStepValue = (step: string) => {
    return step.padStart(2, '0');
  };

  return (
    <SiteSection 
      ref={ref} 
      id="process" 
      variant="default" 
      aria-labelledby="process-heading" 
      className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24"
    >
      {/* Background radial highlight */}
      <div 
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.02] blur-[140px]" 
        aria-hidden 
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <SectionHeader
          tag={SECTION_PROCESS.tag}
          title={SECTION_PROCESS.title}
          highlight={SECTION_PROCESS.highlight}
          description={SECTION_PROCESS.description}
          isInView={isInView}
          headingId="process-heading"
        />

        {/* Interactive Tabs Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08, ease }}
          className="mx-auto mb-8 max-w-2xl flex flex-col items-center gap-4"
        >
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Operating principles
          </p>
          
          {/* Scrollable Tab bar for mobile compatibility */}
          <div className="w-full overflow-x-auto no-scrollbar pb-1 flex justify-center">
            <div className="inline-flex items-center gap-1.5 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
              {PROCESS_PILLARS.map((word, index) => (
                <button
                  key={word}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "relative px-5 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer select-none",
                    activeTab === index ? "text-emerald-700" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {activeTab === index && (
                    <motion.div
                      layoutId="active-process-tab"
                      className="absolute inset-0 bg-white border border-slate-200/60 shadow-sm rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  {word}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* tabbed panel view container */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-emerald-50/[0.03] via-white to-teal-50/[0.03] p-6 md:p-10 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.06)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.09)] transition-shadow duration-500 relative"
        >
          {/* Animated outline pulse */}
          <div className="absolute inset-0 rounded-3xl border border-emerald-500/5 animate-pulse pointer-events-none" />

          {/* Animate presence layout switcher */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column details (7 cols) */}
              <div className="md:col-span-7 space-y-5 text-left">
                {/* Phase badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/40 text-[10px] font-bold uppercase tracking-wider select-none">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Phase {getStepValue(currentStep.step)}
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {currentStep.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {currentStep.description}
                </p>

                {/* Deliverables checklist */}
                <div className="pt-2 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                    Key Deliverables
                  </h4>
                  <ul className="space-y-3">
                    {currentStep.deliverables.map((item, idx) => (
                      <li 
                        key={idx} 
                        className="flex items-start gap-3 text-slate-700 font-semibold text-xs sm:text-[0.9rem] leading-relaxed"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100/50 shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column visual illustration (5 cols) */}
              <div className="md:col-span-5 flex justify-center items-center h-full">
                <div className="w-full max-w-[280px] aspect-square rounded-2xl border border-slate-100 bg-slate-50/40 p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                  {/* Subtle inner radial gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent pointer-events-none" />
                  
                  {/* Large progress circle node */}
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r={58} className="stroke-slate-100 fill-none" strokeWidth="4" />
                      <motion.circle
                        cx="72"
                        cy="72"
                        r={58}
                        className="stroke-emerald-500 fill-none"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 58 - ((activeTab + 1) / 4) * 2 * Math.PI * 58 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        style={{ strokeDasharray: 2 * Math.PI * 58 }}
                      />
                    </svg>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <StepIcon className="w-8 h-8 text-emerald-600" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 select-none">
                        Phase {getStepValue(currentStep.step)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="mx-auto mt-8 md:mt-10 max-w-2xl text-center text-xs leading-relaxed text-slate-400 font-medium px-4"
        >
          {SECTION_PROCESS.footnote}
        </motion.p>
      </div>
    </SiteSection>
  );
};

export default ProcessSection;
