import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Project } from '@/data/projects';

interface SectionProps {
  project: Project;
}

export const ProjectProcessSection = ({ project }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (!project.process?.length) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section
      id="process"
      className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 scroll-mt-24 shadow-sm"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="project-process-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#project-process-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 flex items-center gap-2 mb-8">
        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display">Development Process</h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 space-y-0"
      >
        {project.process.map((step, idx) => (
          <motion.div key={idx} variants={itemVariants} className="relative flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-md shrink-0">
                {step.step || idx + 1}
              </div>
              {idx < project.process.length - 1 && (
                <div className="w-px flex-1 bg-emerald-200/60 my-1" />
              )}
            </div>

            <div className="pb-8 flex-1">
              <h3 className="text-sm font-bold text-slate-900 font-display">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectProcessSection;
