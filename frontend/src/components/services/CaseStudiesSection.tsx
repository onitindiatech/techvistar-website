import { Service } from '@/data/services';
import { PROJECTS, Project } from '@/data/projects';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, useReducedMotion } from 'framer-motion';

interface SectionProps {
  service: Service;
}

export const CaseStudiesSection = ({ service }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Query projects dynamically where serviceSlugs matches current service's slug
  const relatedProjects = PROJECTS.filter((project: Project) => 
    project.serviceSlugs && project.serviceSlugs.includes(service.slug)
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section id="case-studies" className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 scroll-mt-24 shadow-sm">
      
      {/* Light mesh backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="case-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#case-mesh)" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-2 mb-6">
        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display">Case Studies & Projects</h2>
      </div>
      
      {relatedProjects.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
        >
          {relatedProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={prefersReducedMotion ? {} : { y: -6 }}
              className="group/card flex flex-col justify-between rounded-2xl bg-white/70 backdrop-blur-md border border-slate-100/80 hover:border-emerald-500/30 hover:shadow-[0_15px_30px_-8px_rgba(16,185,129,0.12)] transition-all duration-300 overflow-hidden h-full"
            >
              <div>
              <div className="relative h-44 overflow-hidden bg-white border-b border-slate-100/50 flex items-center justify-center">
                <img 
                  src={project.thumbnail} 
                  alt={project.title} 
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover/card:scale-103" 
                />
                {/* Status Overlay */}
                <Badge variant="outline" className="absolute top-3 right-3 text-[9px] border-emerald-500/20 text-emerald-700 bg-emerald-50/90 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm">
                  {project.status}
                </Badge>
              </div>
                
                <div className="p-5 space-y-2.5">
                  <Badge variant="secondary" className="text-[9px] font-semibold bg-emerald-50/60 text-emerald-700 border border-emerald-100/30 px-2 py-0.5 rounded-md">
                    {project.category}
                  </Badge>
                  
                  <h3 className="text-sm font-bold text-slate-900 group-hover/card:text-emerald-700 transition-colors font-display line-clamp-1 leading-snug">
                    <Link to={`/work/${project.slug}`}>{project.title}</Link>
                  </h3>
                  
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100/50">
                <Link 
                  to={`/work/${project.slug}`} 
                  className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover/card:text-emerald-700 transition-colors"
                >
                  View Case Study
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/card:translate-x-1 duration-300" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="relative z-10 rounded-2xl bg-slate-50 border border-slate-100 p-8 text-center">
          <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">Custom integration case studies are available upon request.</p>
          <a href="#contact" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
            Request past build logs <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </section>
  );
};
export default CaseStudiesSection;
