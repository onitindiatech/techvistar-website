import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '@/data/projects';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectsGridProps {
  projects: readonly Project[] | Project[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring', 
      stiffness: 120, 
      damping: 18 
    } 
  },
  exit: { 
    opacity: 0, 
    y: 16, 
    transition: { 
      duration: 0.2 
    } 
  }
};

export const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            layout
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Card
              className="group h-full flex flex-col overflow-hidden border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-primary/25 transition-all duration-300"
            >
              <Link to={`/work/${project.slug}`} className="block relative h-48 overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </Link>
              <CardHeader className="space-y-3 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="w-fit text-xs font-medium bg-primary/10 text-primary border border-primary/15"
                  >
                    {project.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-fit text-xs font-medium border-slate-200 text-slate-600 bg-slate-50"
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold font-display text-slate-900 leading-snug hover:text-primary transition-colors">
                  <Link to={`/work/${project.slug}`}>{project.title}</Link>
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm leading-relaxed line-clamp-6">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow pt-0 justify-between">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200/80">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mt-auto">
                  <a
                    href={project.liveUrl !== '#' ? project.liveUrl : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-colors ${
                      project.liveUrl === '#'
                        ? 'border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                        : 'border-slate-200 text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
                    }`}
                    onClick={(e) => project.liveUrl === '#' && e.preventDefault()}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </a>
                  <a
                    href={project.githubUrl !== '#' ? project.githubUrl : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-colors ${
                      project.githubUrl === '#'
                        ? 'border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                        : 'border-slate-200 text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
                    }`}
                    onClick={(e) => project.githubUrl === '#' && e.preventDefault()}
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
