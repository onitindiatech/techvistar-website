import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export interface TimelineStep {
  step?: number | string;
  title?: string;
  description: string;
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
  title?: string;
  subtitle?: string;
  showSparkles?: boolean;
  labelPrefix?: string;
}

export const ProcessTimeline = ({
  steps,
  title = 'Development Process',
  subtitle,
  showSparkles = false,
  labelPrefix = 'Phase',
}: ProcessTimelineProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (!steps || steps.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12 },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 18 },
    },
  };

  return (
    <section
      id="process"
      className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-10"
    >
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-72 w-72 rounded-full bg-emerald-500/[0.02] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-72 w-72 rounded-full bg-sky-500/[0.02] blur-3xl" />

      {/* Heading Section */}
      <div className="relative z-10 mb-8 space-y-1">
        <div className="flex items-center gap-2">
          {showSparkles && (
            <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-emerald-600" />
            </div>
          )}
          <h2 className="font-display text-base md:text-lg font-bold text-slate-900 leading-snug">
            {title}
          </h2>
        </div>
        {subtitle?.trim() && (
          <p className="pl-7 text-xs font-medium text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="relative z-10">
        {/* Centered connector — left offset = half of node size (40px / 2 = 20px) */}
        {steps.length > 1 ? (
          <div
            aria-hidden
            className="absolute left-5 top-5 bottom-5 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-500 via-emerald-400/60 to-emerald-200/40"
          />
        ) : null}

        <motion.ol
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="m-0 flex list-none flex-col gap-0 p-0"
        >
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const twoDigitStep = String(idx + 1).padStart(2, '0');

            return (
              <motion.li
                key={`${idx}-${step.title || idx}`}
                variants={stepVariants}
                className={`group relative flex items-start gap-4 md:gap-5 ${isLast ? '' : 'pb-7 md:pb-8'}`}
              >
                {/* Timeline node — fixed 40x40 so line centers on it */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-emerald-500/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-sm font-bold text-emerald-700 shadow-[0_0_0_4px_rgba(14,165,233,0.08)] transition-all duration-300 group-hover:border-emerald-600 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_0_6px_rgba(14,165,233,0.15)]">
                    {twoDigitStep}
                  </span>
                </div>

                {/* Phase card */}
                <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all duration-300 group-hover:border-emerald-500/25 group-hover:bg-white group-hover:shadow-[0_12px_30px_-12px_rgba(14,165,233,0.12)] md:p-5">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-xs md:text-sm font-bold text-emerald-600/90">
                      {labelPrefix} {twoDigitStep}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden />
                    <span className="text-xs font-semibold text-slate-400">Step {idx + 1}</span>
                  </div>
                  {step.title && (
                    <h3 className="mb-1 font-display text-base md:text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700 leading-snug">
                      {step.title}
                    </h3>
                  )}
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
};
