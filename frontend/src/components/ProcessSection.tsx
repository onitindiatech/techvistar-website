import React, { useState, MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { cn } from '@/lib/utils';
import { PROCESS_PILLARS, PROCESS_STEPS, SECTION_PROCESS } from '@/data';
import { Check, Sparkles } from 'lucide-react';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export const ProcessSection = () => {
  const { ref, isInView } = useAnimatedSection();
  const [activeTab, setActiveTab] = useState(0);

  // 3D Tilt Effect Setup
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Moderate rotation for a premium, not exaggerated, 3D effect
  const rotateX = useTransform(smoothY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [0, 1], [-8, 8]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

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
      className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24 perspective-[2000px]"
    >
      {/* Background radial highlight */}
      <div 
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.02] blur-[140px]" 
        aria-hidden 
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">


        {/* Interactive Tabs Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08, ease }}
          className="mx-auto mb-8 max-w-2xl flex flex-col items-center gap-4 relative z-20"
        >
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Operating principles
          </p>
          
          {/* Scrollable Tab bar for mobile compatibility */}
          <div className="w-full overflow-x-auto no-scrollbar pb-1 flex justify-center">
            <div className="inline-flex items-center gap-1.5 p-1.5 bg-white/50 backdrop-blur-md border border-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-500">
              {PROCESS_PILLARS.map((word, index) => (
                <button
                  key={word}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "relative px-5 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer select-none overflow-hidden",
                    activeTab === index ? "text-emerald-700" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {activeTab === index && (
                    <motion.div
                      layoutId="active-process-tab"
                      className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/60 shadow-[0_2px_10px_rgba(16,185,129,0.06)] rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{word}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3D tabbed panel view container */}
        <div className="mx-auto max-w-4xl relative perspective-[2000px]">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl p-6 md:p-10 shadow-[0_30px_60px_-20px_rgba(16,185,129,0.15)] relative will-change-transform"
          >
            {/* Glossy overlay for glassmorphism */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/80 via-white/40 to-transparent pointer-events-none" style={{ transform: "translateZ(1px)" }} />
            
            {/* Animated outline pulse */}
            <div className="absolute inset-0 rounded-3xl border border-emerald-500/10 animate-pulse pointer-events-none" style={{ transform: "translateZ(2px)" }} />

            {/* Animate presence layout switcher */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, z: -40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, z: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, z: -40, filter: 'blur(8px)' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Left Column details (7 cols) */}
                <div className="md:col-span-7 space-y-5 text-left" style={{ transform: "translateZ(30px)" }}>
                  {/* Phase badge */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 shadow-sm text-emerald-700 border border-emerald-200/50 text-[10px] font-bold uppercase tracking-wider select-none"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Phase {getStepValue(currentStep.step)}
                  </motion.div>

                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-display text-2xl sm:text-3xl font-black text-slate-900 leading-tight drop-shadow-sm"
                  >
                    {currentStep.title}
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-500 text-sm leading-relaxed font-medium"
                  >
                    {currentStep.description}
                  </motion.p>

                  {/* Deliverables checklist */}
                  <div className="pt-2 space-y-3">
                    <motion.h4 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400"
                    >
                      Key Deliverables
                    </motion.h4>
                    <ul className="space-y-3">
                      {currentStep.deliverables.map((item, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="flex items-start gap-3 text-slate-700 font-semibold text-xs sm:text-[0.9rem] leading-relaxed group hover:text-emerald-700 transition-colors"
                        >
                          <div className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-200 shrink-0 mt-0.5 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
                            <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                          </div>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column visual illustration (5 cols) */}
                <div className="md:col-span-5 flex justify-center items-center h-full" style={{ transformStyle: "preserve-3d" }}>
                  <div 
                    className="w-full max-w-[280px] aspect-square rounded-3xl border border-white/50 bg-gradient-to-br from-white/40 to-white/10 p-8 flex flex-col items-center justify-center relative shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-sm"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    {/* Floating background elements for depth */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-emerald-100/50 blur-xl" style={{ transform: "translateZ(-30px)" }} />
                    <div className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full bg-teal-100/50 blur-xl" style={{ transform: "translateZ(-20px)" }} />
                    
                    {/* Large progress circle node */}
                    <div 
                      className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-[0_15px_35px_rgba(16,185,129,0.15)] border border-emerald-50/50"
                      style={{ transform: "translateZ(40px)" }}
                    >
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r={66} className="stroke-slate-50 fill-none" strokeWidth="6" />
                        <motion.circle
                          cx="80"
                          cy="80"
                          r={66}
                          className="stroke-emerald-500 fill-none drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                          strokeWidth="6"
                          strokeLinecap="round"
                          initial={{ strokeDashoffset: 2 * Math.PI * 66 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 66 - ((activeTab + 1) / 4) * 2 * Math.PI * 66 }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                          style={{ strokeDasharray: 2 * Math.PI * 66 }}
                        />
                      </svg>
                      
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: 'spring' }}
                        className="relative z-10 flex flex-col items-center justify-center"
                        style={{ transform: "translateZ(20px)" }}
                      >
                        <StepIcon className="w-10 h-10 text-emerald-600 drop-shadow-md" />
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest mt-2 select-none">
                          Phase {getStepValue(currentStep.step)}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="mx-auto mt-12 md:mt-16 max-w-2xl text-center text-xs leading-relaxed text-slate-400 font-medium px-4"
        >
          {SECTION_PROCESS.footnote}
        </motion.p>
      </div>
    </SiteSection>
  );
};

export default ProcessSection;
