import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { ProjectsGrid } from '@/components/ProjectsGrid';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProjectFilterToolbar } from '@/components/work/ProjectFilterToolbar';
import workBg from '../assets/work-bg.png';

const Work = () => {
  const filterHook = useProjectFilters();
  const { filteredProjects, selectedIndustry, selectedService, selectedTechnology, selectedStatus, searchQuery } = filterHook;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Create a compound key to trigger animations whenever filter states change
  const filterKey = `${selectedIndustry}-${selectedService}-${selectedTechnology}-${selectedStatus}-${searchQuery}`;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 animate-fade-in">
        <Navbar />

        {/* Work Hero */}
        <section 
          className="relative overflow-hidden bg-zinc-950 pt-28 pb-20 md:pt-36 md:pb-28 border-b border-zinc-900 text-white"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              x: mousePosition.x * 25,
              y: mousePosition.y * 25,
            }}
            animate={{
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
              style={{ backgroundImage: `url(${workBg})` }}
            />
            
            {/* Shifting green waves / glow effect */}
            <motion.div 
              animate={{ 
                x: [0, 20, -15, 0],
                y: [0, -15, 20, 0],
                scale: [1, 1.15, 0.9, 1]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute left-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[130px]" 
            />
            <motion.div 
              animate={{ 
                x: [0, -25, 20, 0],
                y: [0, 20, -25, 0],
                scale: [1, 0.85, 1.15, 1]
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-teal-500/10 blur-[130px]" 
            />
          </motion.div>

          {/* Tiny Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400/80 rounded-full"
                style={{
                  left: `${(i * 13) % 100}%`,
                  top: `${(i * 17) % 100}%`,
                }}
                animate={{
                  y: [0, -35, 0],
                  x: [0, 15, 0],
                  opacity: [0.1, 0.8, 0.1],
                }}
                transition={{
                  duration: 8 + (i % 5) * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 max-w-6xl relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 select-none">
              OUR PORTFOLIO
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight font-display leading-[1.1]">
              Our Work
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Explore our portfolio of production-ready systems spanning logistics routing, natural language processing, financial workspaces, and applied machine learning.
            </p>
          </div>
        </section>

        {/* Filters & Control Panel */}
        <section className="relative -mt-10 md:-mt-12 z-20 pb-8 bg-transparent">
          <div className="container mx-auto px-4 max-w-6xl">
            <ProjectFilterToolbar filterHook={filterHook} />
          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={filterKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {filteredProjects.length > 0 ? (
                  <ProjectsGrid projects={filteredProjects} />
                ) : (
                  /* Empty State */
                  <div className="text-center py-16 bg-white border border-slate-200 rounded-xl max-w-md mx-auto px-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No projects found.</h3>
                    <p className="text-slate-500 text-sm">
                      Try changing your search or active filter badges.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Work;
