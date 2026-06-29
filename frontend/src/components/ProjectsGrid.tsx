import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Maximize2, ArrowRight } from 'lucide-react';
import { Project } from '@/data/projects';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectsGridProps {
  projects: readonly Project[] | Project[];
}

// Inline SVGs for premium technology representation
const TechIcon = ({ name }: { name: string }) => {
  const iconName = name.trim().toLowerCase();

  const svgMap: Record<string, React.ReactNode> = {
    react: (
      <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2" transform="translate(12 12)" />
        <ellipse rx="11" ry="4.2" transform="translate(12 12) rotate(30)" />
        <ellipse rx="11" ry="4.2" transform="translate(12 12) rotate(90)" />
        <ellipse rx="11" ry="4.2" transform="translate(12 12) rotate(150)" />
      </svg>
    ),
    typescript: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.125 0h21.75c.621 0 1.125.504 1.125 1.125v21.75c0 .621-.504 1.125-1.125 1.125H1.125C.504 24 0 23.496 0 22.875V1.125C0 .504.504 0 1.125 0zm17.208 17.512c-.528-.276-.924-.624-1.176-1.044-.252-.42-.384-.96-.384-1.608h-2.148c0 .96.264 1.74.804 2.34.528.6 1.284.9 2.256.9 1.116 0 1.956-.372 2.52-1.128.564-.756.84-1.788.84-3.084V8.348h-2.22v6.624c0 .768-.156 1.344-.456 1.74-.3.396-.792.6-1.476.6.012 0 .004.2-.04.2zm-7.692-2.148c-.288.588-.72 1.032-1.308 1.332-.588.3-1.308.456-2.16.456-1.008 0-1.812-.3-2.424-.9-.6-.6-.948-1.464-1.032-2.58h2.244c.072.576.24 1.008.516 1.296.276.288.696.432 1.26.432.552 0 .96-.132 1.212-.396.252-.264.384-.66.384-1.188v-.024c0-.528-.156-.912-.468-1.152-.312-.24-.864-.468-1.644-.684-1.02-.276-1.776-.624-2.28-1.044-.504-.42-.756-1.02-.756-1.8 0-.84.324-1.512.972-2.016.648-.504 1.488-.756 2.52-.756.984 0 1.764.24 2.34.72.576.48.912 1.164 1.008 2.052H8.625c-.06-.444-.204-.768-.432-.972-.228-.204-.576-.312-1.044-.312-.444 0-.792.108-1.032.324-.24.216-.36.528-.36.936 0 .372.132.66.396.864.264.204.744.408 1.44.612 1.056.288 1.836.66 2.34 1.116.504.456.756 1.092.756 1.908.012.876-.288 1.572-.9 2.088z" />
      </svg>
    ),
    node: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0L2.8 5.3v10.6L12 21.2l9.2-5.3V5.3zm.9 3.2l6.2 3.6-6.2 3.6V3.2zm-1.8 0v7.2L4.9 6.8zm-4.3 9.4V8.4l6.1 3.5zm10.4 0l-6.1-3.5V8.4z" />
      </svg>
    ),
    python: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.4 3.7c.8 0 1.4.6 1.4 1.4s-.6 1.4-1.4 1.4-1.4-.6-1.4-1.4.6-1.4 1.4-1.4zm2.8 16.6c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4 1.4.6 1.4 1.4-.6 1.4-1.4 1.4zm2.8-5.6H9.2v-1.4h7v1.4zm-2.8-2.8H6.4v-1.4h5.6v1.4z" />
      </svg>
    ),
    postgresql: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.5H8v-2h3v-2.5h2v2.5h3v2h-3v3.5z" />
      </svg>
    ),
    mongodb: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C7.2 4.8 6.4 11.2 12 24c5.6-12.8 4.8-19.2 0-24zm0 18.4c-2.4-5.6-1.6-9.6 0-13.6 1.6 4 2.4 8 0 13.6z" />
      </svg>
    ),
    docker: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.983 8.871h-2.148V6.723h2.148zm2.525 0h-2.147V6.723h2.147zm2.524 0h-2.147V6.723h2.147zm-5.048-2.524h-2.148V4.199h2.148zm2.524 0h-2.147V4.199h2.147zm-7.572 5.048h-2.148V9.243h2.148zm2.525 0h-2.148V9.243h2.148zm2.524 0h-2.147V9.243h2.147zm8.307 2.115c-.131-.383-.435-.747-.899-.899a7.352 7.352 0 00-.91-.186c.01-.225.015-.453.015-.684v-.328h-1.077v.328c0 .285-.01.567-.03.847-.075.986-.411 1.944-1.01 2.766-.549.754-1.306 1.341-2.203 1.704v.006c-1.311.536-2.775.536-4.086 0l-.06-.024c-1.67-.681-2.91-2.072-3.414-3.824H0c.348 2.502 1.956 4.671 4.298 5.759 1.91.887 4.103 1.034 6.13.411 2.378-.731 4.382-2.457 5.485-4.73a8.948 8.948 0 001.378-1.503c.536-.75.875-1.597 1.002-2.483a3.57 3.57 0 00.024-.51z" />
      </svg>
    ),
    aws: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H7v-2h6v2zm4-4H7v-2h10v2zm0-4H7V6h10v2z" />
      </svg>
    ),
    openai: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 12H7v-2h6v2zm2-4H7V8h8v2z" />
      </svg>
    ),
  };

  const svgContent = svgMap[iconName];

  if (svgContent) {
    return (
      <div 
        className="h-8 w-8 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center transition-all cursor-pointer"
        title={name}
      >
        {svgContent}
      </div>
    );
  }

  // Fallback Chip
  return (
    <span className="px-2.5 py-1 rounded-full bg-zinc-950/60 text-zinc-400 text-[10px] font-semibold border border-zinc-800/80 hover:border-emerald-500/20 hover:text-emerald-400 transition-all select-none">
      {name}
    </span>
  );
};

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
              className="group h-full flex flex-col overflow-hidden border-zinc-800/90 bg-zinc-900/95 text-white shadow-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.08)] hover:border-emerald-500/30 transition-all duration-300"
            >
              {/* 1. Project Image (with Zoom Expand Button overlay) */}
              <Link to={`/work/${project.slug}`} className="block relative h-48 overflow-hidden bg-zinc-950 border-b border-zinc-800/85">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                
                {/* Maximize Icon Button Overlay */}
                <div className="absolute right-3 top-3 h-8 w-8 rounded-full bg-zinc-950/80 border border-zinc-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                  <Maximize2 className="h-4 w-4 text-emerald-400" />
                </div>
              </Link>

              <CardHeader className="space-y-3 pb-2 flex-grow">
                {/* 2. Industry/Category Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className="w-fit text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                  >
                    {project.industry || project.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-fit text-[10px] font-semibold border-zinc-800 text-zinc-400 bg-zinc-950/60"
                  >
                    {project.status}
                  </Badge>
                </div>

                {/* 3. Project Name */}
                <CardTitle className="text-base font-bold font-display text-white leading-snug hover:text-emerald-400 transition-colors">
                  <Link to={`/work/${project.slug}`}>{project.title}</Link>
                </CardTitle>

                {/* 4. Short Description */}
                <CardDescription className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                  {project.description}
                </CardDescription>
              </CardHeader>

              {/* Card Footer containing Tech Icons & Primary CTA */}
              <CardContent className="flex flex-col pt-0 justify-between mt-auto space-y-5">
                {/* 5. Technology Stack (icons/chips) */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/40">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <TechIcon key={tech} name={tech} />
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="px-2 py-1 rounded-md bg-zinc-950/50 text-zinc-500 text-[10px] font-semibold border border-zinc-800/80">
                      +{project.technologies.length - 5}
                    </span>
                  )}
                </div>

                {/* 6. Explore Project Button */}
                <Button asChild className="w-full bg-zinc-950 text-zinc-300 border border-zinc-800/60 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent transition-all duration-300 font-semibold text-xs h-9 rounded-lg select-none">
                  <Link to={`/work/${project.slug}`} className="inline-flex items-center justify-center gap-1.5">
                    Explore Project
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
