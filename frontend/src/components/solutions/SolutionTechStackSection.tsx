import { SolutionDetail } from '@/data/solutions';
import { motion, useReducedMotion } from 'framer-motion';
import { TechStackLogo } from '@/components/common/TechStackLogo';
import { getTechBrandStyle } from '@/lib/techStackLogos';

interface SectionProps {
  solution: SolutionDetail;
}

export const SolutionTechStackSection = ({ solution }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();
  const techStack = solution.techStack ?? [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120 },
    },
  };

  if (techStack.length === 0) return null;

  return (
    <section
      id="tech-stack"
      className="h-fit w-full scroll-mt-24 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6"
    >
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-heading-md text-slate-900">
            {solution.sectionCopy?.techStackTitle || 'Core Technology Stack'}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            {solution.sectionCopy?.techStackSubtitle || 'Built with enterprise-grade tools'}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="scrollbar-none flex w-full gap-2.5 overflow-x-auto whitespace-nowrap pb-2.5"
        >
          {techStack.map((tech) => {
            const style = getTechBrandStyle(tech);
            return (
              <motion.span
                key={tech}
                variants={itemVariants}
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: 1.06,
                        y: -2,
                        boxShadow: `0 4px 12px ${style.glowColor}`,
                      }
                }
                style={{
                  backgroundColor: style.bg,
                  borderColor: style.borderColor,
                  color: style.textColor,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="inline-flex shrink-0 cursor-default select-none items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200"
              >
                <TechStackLogo name={tech} size="sm" className="h-3.5 w-3.5" />
                {tech}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionTechStackSection;
