import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SolutionDetail } from '@/data/solutions';
import '../ui/GlassIcons.css';

interface SectionProps {
  solution: SolutionDetail;
}

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
};

const gradientCycle = [
  gradientMapping.blue,
  gradientMapping.green,
  gradientMapping.purple,
  gradientMapping.orange,
  gradientMapping.indigo,
  gradientMapping.red,
];

export const SolutionFeaturesSection = ({ solution }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="features" className="relative overflow-hidden bg-[#F8FAFC] border border-slate-200/80 rounded-3xl p-6 md:p-10 scroll-mt-24 shadow-sm">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="solution-card-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#solution-card-mesh)" />
        </svg>
      </div>

      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none z-0" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 flex items-center gap-2 mb-6">
        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display">
          {solution.sectionCopy?.featuresTitle || 'Key Features'}
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 relative z-10"
      >
        {solution.features.map((feature, idx) => {
          const FeatureIcon = feature.icon;
          const bgGradient = gradientCycle[idx % gradientCycle.length];

          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.01 }}
              className="group flex flex-col justify-between p-4 rounded-2xl bg-white/75 backdrop-blur-md border border-slate-100 hover:border-emerald-500/30 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_-8px_rgba(16,185,129,0.12)] transition-all duration-300"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-1 overflow-visible">
                  <div className="icon-btn pointer-events-none scale-50 origin-top-left -mb-8 -mr-4 shrink-0 min-h-[4.5rem] min-w-[4.5rem]">
                    <span className="icon-btn__back" style={{ background: bgGradient }}></span>
                    <span className="icon-btn__front">
                      <span className="icon-btn__icon">
                        <FeatureIcon className="w-6 h-6 text-white" />
                      </span>
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn More
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-0.5 group-hover:text-emerald-700 transition-colors font-display">
                  {feature.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default SolutionFeaturesSection;
