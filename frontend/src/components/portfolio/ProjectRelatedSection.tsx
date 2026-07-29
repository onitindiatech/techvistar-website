import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Project } from '@/data/projects';
import { Badge } from '@/components/ui/badge';

interface SectionProps {
  relatedProjects: Project[];
}

export const ProjectRelatedSection = ({ relatedProjects }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (relatedProjects.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="related" className="border-t border-slate-200/80 pt-12 scroll-mt-24">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Related Projects</h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {relatedProjects.map((rp) => (
          <motion.div
            key={rp.id}
            variants={itemVariants}
            whileHover={prefersReducedMotion ? {} : { y: -6 }}
            className="group/card h-full"
          >
            <Link
              to={`/work/${rp.slug}`}
              className="flex flex-col justify-between rounded-2xl bg-white/70 backdrop-blur-md border border-slate-100 hover:border-emerald-500/30 hover:shadow-[0_15px_30px_-8px_rgba(16,185,129,0.12)] transition-all duration-300 h-full overflow-hidden"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-transparent border-b border-slate-100/50">
                  <img
                    src={rp.thumbnail}
                    alt={rp.title}
                    className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover/card:scale-105 mix-blend-multiply contrast-115 brightness-102"
                    loading="lazy"
                  />

                  <Badge
                    variant="secondary"
                    className="absolute top-3 left-3 text-[9px] font-semibold bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded-md shadow-sm"
                  >
                    {rp.category}
                  </Badge>
                </div>

                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 group-hover/card:text-emerald-700 transition-colors font-display line-clamp-1 mb-2">
                    {rp.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {rp.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100/50">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover/card:text-emerald-700 transition-colors">
                  View details
                  <span className="group-hover/card:translate-x-1 transition-transform duration-300">&rarr;</span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectRelatedSection;
