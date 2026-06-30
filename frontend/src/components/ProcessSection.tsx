import { motion } from 'framer-motion';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';
import { PROCESS_PILLARS, PROCESS_STEPS, SECTION_PROCESS } from '@/data';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const listContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export const ProcessSection = () => {
  const { ref, isInView } = useAnimatedSection();

  const getStepValue = (step: number) => {
    return String(step).padStart(2, '0');
  };

  const getStepPercentage = (step: number) => {
    if (step === 1) return 25;
    if (step === 2) return 50;
    if (step === 3) return 75;
    return 100;
  };

  return (
    <SiteSection ref={ref} id="process" variant="default" aria-labelledby="process-heading" className="relative overflow-hidden py-24 md:py-32">
      {/* Background radial highlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.02] blur-[130px]" aria-hidden />

      <div className="container-custom relative z-10">
        <SectionHeader
          tag={SECTION_PROCESS.tag}
          title={SECTION_PROCESS.title}
          highlight={SECTION_PROCESS.highlight}
          description={SECTION_PROCESS.description}
          isInView={isInView}
          headingId="process-heading"
        />

        {/* Operating Pillars Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.08, ease }}
          className="mx-auto mb-16 max-w-3xl"
        >
          <p className="mb-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Operating principles
          </p>
          <ul
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-slate-200/80 bg-slate-50/40 px-4 py-4 sm:flex-nowrap sm:gap-x-0 sm:divide-x sm:divide-slate-200/80 sm:px-0 rounded-xl"
            aria-label="Operating principles"
          >
            {PROCESS_PILLARS.map((word) => (
              <li key={word} className="text-center sm:px-10">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                  {word}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Responsive Roadmap Container */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto max-w-5xl rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/[0.08] via-white to-teal-50/[0.08] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(34,197,94,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(34,197,94,0.12)] transition-shadow duration-500 relative"
        >
          {/* Animated subtle outline pulse */}
          <div className="absolute inset-0 rounded-3xl border border-emerald-500/10 animate-pulse pointer-events-none" />

          {/* Desktop Horizontal Roadmap Layout */}
          <div className="relative hidden lg:block">
            {/* Horizontal progress connector line starting at center of step 1 and ending at step 4 */}
            <div className="absolute top-[48px] left-[12%] right-[12%] h-[3px] bg-emerald-500/20 -z-10">
              <div
                className={cn(
                  "h-full bg-emerald-500 transition-all duration-[1200ms] ease-out delay-100",
                  isInView ? "w-full" : "w-0"
                )}
              />
            </div>

            <div className="grid grid-cols-4 gap-6 relative z-10">
              {PROCESS_STEPS.map((item, index) => {
                const percentage = getStepPercentage(item.step);
                const radius = 40;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (percentage / 100) * circumference;

                return (
                  <motion.div
                    key={item.step}
                    variants={itemVariants}
                    className="flex flex-col items-center text-center group"
                  >
                    {/* Animated Circular Step Node */}
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg mb-6">
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r={radius} className="stroke-slate-100 fill-none" strokeWidth="3" />
                        <motion.circle
                          cx="48"
                          cy="48"
                          r={radius}
                          className="stroke-emerald-500 fill-none"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          initial={{ strokeDashoffset: circumference }}
                          animate={isInView ? { strokeDashoffset } : {}}
                          transition={{ duration: 1.5, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                          style={{ strokeDasharray: circumference }}
                        />
                      </svg>
                      <span className="relative z-10 font-display text-base font-extrabold text-emerald-600 group-hover:scale-105 transition-transform duration-300">
                        {getStepValue(item.step)}
                      </span>
                    </div>

                    {/* Step Meta */}
                    <div className="space-y-2">
                      <h3 className="font-display text-sm font-extrabold text-slate-900 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] leading-relaxed text-slate-500 font-semibold px-2">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile/Tablet Vertical Roadmap Fallback */}
          <div className="lg:hidden relative">
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200/80 -z-10" />

            <div className="space-y-10">
              {PROCESS_STEPS.map((item, index) => (
                <motion.div
                  key={item.step}
                  variants={itemVariants}
                  className="flex items-start gap-5 relative z-10 group"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white font-display text-sm font-black text-emerald-600 shadow-sm">
                    {getStepValue(item.step)}
                  </div>
                  <div className="space-y-1 pt-1.5 text-left">
                    <h3 className="font-display text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-500 font-semibold">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="mx-auto mt-16 max-w-2xl text-center text-sm leading-relaxed text-slate-500 font-medium"
        >
          {SECTION_PROCESS.footnote}
        </motion.p>
      </div>
    </SiteSection>
  );
};

export default ProcessSection;
