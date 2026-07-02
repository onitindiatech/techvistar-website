import { motion, useReducedMotion } from 'framer-motion';
import AutoScroll from 'embla-carousel-auto-scroll';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PROJECTS, SECTION_PROJECTS } from "@/data";
import { Link } from 'react-router-dom';
import { HoverCard } from '@/components/animations/HoverCard';

export const ProjectsSection = () => {
  const { ref, isInView } = useAnimatedSection();
  const reduceMotion = useReducedMotion();

  const autoScrollPlugins = useMemo(
    () =>
      reduceMotion
        ? []
        : [
            AutoScroll({
              speed: 0.5,
              startDelay: 400,
              playOnInit: true,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
              stopOnFocusIn: false,
            }),
          ],
    [reduceMotion]
  );

  return (
    <SiteSection ref={ref} id="projects" variant="default" className="relative overflow-hidden" aria-labelledby="projects-heading">
      {/* Subtle Background Ambient Blur Blobs */}
      <div className="absolute top-1/4 left-10 -z-10 w-72 h-72 rounded-full bg-primary/5 opacity-[0.03] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 -z-10 w-96 h-96 rounded-full bg-emerald-500/5 opacity-[0.03] blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeader
          tag={SECTION_PROJECTS.tag}
          title={SECTION_PROJECTS.title}
          highlight={SECTION_PROJECTS.highlight}
          description={SECTION_PROJECTS.description}
          isInView={isInView}
          headingId="projects-heading"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <Carousel
            opts={{ align: 'start', loop: true }}
            plugins={autoScrollPlugins}
            className="w-full"
          >
            <CarouselContent className="-ml-4" role="list">
              {PROJECTS.map((project, index) => {
                const isFeatured = index === 0;
                
                return (
                  <CarouselItem
                    key={project.id}
                    className="pl-4 basis-full md:basis-[48%] lg:basis-[31%]"
                    role="listitem"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.45, delay: index * 0.05 }}
                      className="h-full transform-gpu"
                    >
                      <HoverCard
                        depth={6}
                        scale={1.01}
                        className={`h-full flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 transform-gpu ${
                          isFeatured 
                            ? 'border-primary/30 bg-white/95 backdrop-blur-md shadow-[0_12px_30px_rgba(15,23,42,0.04)]'
                            : 'border-slate-200 bg-white/90 backdrop-blur-sm shadow-[0_6px_20px_rgba(15,23,42,0.02)]'
                        }`}
                      >
                        {/* Image Container */}
                        <Link to={`/work/${project.slug}`} className={`relative block overflow-hidden bg-slate-100 border-b border-slate-200/60 w-full ${
                          isFeatured ? 'h-52' : 'h-48'
                        }`}>
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10 pointer-events-none" />
                          
                          {/* Micro-CTA Case Study Overlay on hover */}
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center pointer-events-none">
                            <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-slate-900 text-[0.6875rem] font-bold shadow-md backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5">
                              View Case Study
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>

                          {/* Floating Category Badge */}
                          <Badge
                            variant="secondary"
                            className={`absolute top-3 left-3 z-20 text-[0.625rem] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm transition-all duration-200 hover:scale-105 ${
                              isFeatured 
                                ? 'bg-primary/95 text-white border-primary/25' 
                                : 'bg-white/90 text-slate-800 border-slate-200/40'
                            }`}
                          >
                            {project.category}
                          </Badge>

                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="h-full w-full object-contain p-4 bg-white transition-transform duration-750 ease-out transform-gpu group-hover:scale-102"
                            loading="lazy"
                          />
                        </Link>

                        {/* Text & Meta details container */}
                        <div className="flex flex-col flex-grow p-6">
                          <div className="space-y-2 pb-2">
                            {isFeatured && (
                              <span className="text-[0.625rem] font-bold uppercase tracking-widest text-primary mb-0.5 block">
                                ★ Featured Case
                              </span>
                            )}
                            <h3 className={`font-bold font-display text-slate-950 leading-snug hover:text-primary transition-colors ${
                              isFeatured ? 'text-xl' : 'text-lg'
                            }`}>
                              <Link to={`/work/${project.slug}`}>{project.title}</Link>
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-[6] md:line-clamp-5">
                              {project.description}
                            </p>
                          </div>

                          <div className="flex flex-col flex-grow pt-0 mt-4">
                            {/* Technology pills with micro-hover animations */}
                            <div className="flex flex-wrap gap-1.5 mb-6">
                              {project.technologies.slice(0, isFeatured ? 4 : 3).map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-700 text-[0.6875rem] font-medium border border-slate-200/60 transition-all duration-200 hover:scale-105 hover:bg-slate-100"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > (isFeatured ? 4 : 3) && (
                                <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[0.6875rem] font-medium border border-slate-200/60">
                                  +{project.technologies.length - (isFeatured ? 4 : 3)}
                                </span>
                              )}
                            </div>

                            {/* Action buttons with custom hover icon animations */}
                            <div className="flex gap-3 mt-auto">
                              <a
                                href={project.liveUrl !== '#' ? project.liveUrl : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group/btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[0.6875rem] font-bold tracking-wide uppercase transition-all duration-200 ${
                                  project.liveUrl === '#'
                                    ? 'border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                                    : 'border-slate-200 text-slate-700 hover:border-primary/30 hover:bg-primary/5 hover:text-primary'
                                }`}
                                onClick={(e) => project.liveUrl === '#' && e.preventDefault()}
                                aria-label={`View live demo of ${project.title}`}
                              >
                                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                Demo
                              </a>
                              <a
                                href={project.githubUrl !== '#' ? project.githubUrl : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group/btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[0.6875rem] font-bold tracking-wide uppercase transition-all duration-200 ${
                                  project.githubUrl === '#'
                                    ? 'border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                                    : 'border-slate-200 text-slate-700 hover:border-primary/30 hover:bg-primary/5 hover:text-primary'
                                }`}
                                onClick={(e) => project.githubUrl === '#' && e.preventDefault()}
                                aria-label={`View source code of ${project.title}`}
                              >
                                <Github className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                                Code
                              </a>
                            </div>
                          </div>
                        </div>
                      </HoverCard>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {/* Redesigned Floating Carousel Controls */}
            <div className="hidden md:block">
              <CarouselPrevious className="-left-4 border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-700 hover:bg-primary/5 hover:text-primary hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary shadow-sm" />
              <CarouselNext className="-right-4 border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-700 hover:bg-primary/5 hover:text-primary hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary shadow-sm" />
            </div>
          </Carousel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-12 text-center"
        >
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
          >
            Request a technical scoping call
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </SiteSection>
  );
};
