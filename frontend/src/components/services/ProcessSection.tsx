import { Service } from '@/data/services';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SectionProps {
  service: Service;
}

export const ProcessSection = ({ service }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section id="process" className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 scroll-mt-24 shadow-sm">
      
      {/* Subtle radial gradients in background */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-emerald-500/[0.02] blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-sky-500/[0.02] blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-2 mb-8">
        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display">Development Process</h2>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative z-10 pl-2 md:pl-4">
        {/* Glow connector line */}
        <div className="absolute left-[19px] md:left-[23px] top-3 bottom-3 w-[3px] bg-gradient-to-b from-emerald-500 via-emerald-400/50 to-slate-100 rounded-full" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          {service.process.map((step, idx) => (
            <motion.div
              key={step.step}
              variants={stepVariants}
              className="flex gap-5 md:gap-6 relative group"
            >
              {/* Timeline Glass Node */}
              <div className="relative z-10 flex items-center justify-center shrink-0">
                {/* Glowing halo behind active node */}
                <div className="absolute -inset-1.5 rounded-full bg-emerald-500/15 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                
                {/* Main 3D-like step indicator */}
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center text-xs font-bold text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <span className="relative z-10">{step.step}</span>
                </div>
              </div>

              {/* Step Card */}
              <div className="flex-1 p-4 md:p-5 rounded-2xl border border-slate-100 bg-slate-50/50 group-hover:bg-white group-hover:border-emerald-500/20 group-hover:shadow-[0_12px_30px_-10px_rgba(16,185,129,0.08)] transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600/80">Phase {step.step}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <h3 className="text-xs font-semibold text-slate-400">Step {idx + 1}</h3>
                </div>
                
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors mb-1 font-display">
                  {step.title}
                </h4>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  );
};
export default ProcessSection;
