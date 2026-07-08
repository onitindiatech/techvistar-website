import { Service } from '@/data/services';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { getTechBrandStyle } from '@/lib/techStackLogos';
import { TechStackLogo } from '@/components/common/TechStackLogo';

interface SectionProps {
  service: Service;
}

export const TechnologySection = ({ service }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  if (!service.technologies || service.technologies.length === 0) return null;

  return (
    <section
      id="technology"
      className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-10"
    >
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-emerald-500/[0.04] blur-3xl" />

      <div className="relative z-10 mb-8">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
            <Sparkles className="h-3 w-3 text-emerald-600" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900">Technology Stack</h2>
        </div>
        <p className="text-xs font-medium text-slate-500">
          Core platforms and tools powering this service delivery.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
      >
        {service.technologies.map((tech) => {
          const style = getTechBrandStyle(tech);
          return (
            <motion.div
              key={tech}
              variants={itemVariants}
              whileHover={
                prefersReducedMotion
                  ? {}
                  : {
                      y: -4,
                      boxShadow: `0 12px 28px -8px ${style.glowColor}`,
                    }
              }
              style={{
                backgroundColor: style.bg,
                borderColor: style.borderColor,
              }}
              className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border p-4 text-center transition-all duration-300 hover:border-opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/90 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <TechStackLogo name={tech} />
              </div>
              <span
                className="text-[11px] font-bold leading-tight"
                style={{ color: style.textColor }}
              >
                {tech}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default TechnologySection;
