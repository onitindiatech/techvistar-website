import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjectFilters, SortOption } from '@/hooks/useProjectFilters';
import { ProjectsGrid } from '@/components/ProjectsGrid';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import workBg from '../work-bg.png';

const Work = () => {
  const {
    filteredProjects,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
  } = useProjectFilters();

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

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-slate-50">
        <Navbar />

        {/* Work Hero */}
        <section 
          className="relative overflow-hidden bg-zinc-950 pt-28 pb-20 md:pt-36 md:pb-28 border-b border-zinc-900"
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
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-screen"
              style={{ backgroundImage: `url(${workBg})` }}
            />
            {/* Soft shifting auroras */}
            <motion.div 
              animate={{ 
                x: [0, 15, -10, 0],
                y: [0, -10, 15, 0],
                scale: [1, 1.1, 0.9, 1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -left-16 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                x: [0, -15, 10, 0],
                y: [0, 15, -10, 0],
                scale: [1, 0.9, 1.1, 1]
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" 
            />
          </motion.div>

          {/* Tiny Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400/80 rounded-full"
                style={{
                  left: `${(i * 13) % 100}%`,
                  top: `${(i * 17) % 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 12, 0],
                  opacity: [0.2, 0.7, 0.2],
                }}
                transition={{
                  duration: 9 + (i % 4) * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>

          {/* Soft Light Sweep */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.015] to-transparent -skew-x-12"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2,
            }}
          />

          {/* Noise texture overlay */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Subtle Grid Pattern Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40" />

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-5 font-display leading-[1.1]">
              Our Work
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed mb-6">
              Explore our portfolio of production-ready systems spanning logistics routing, natural language processing, financial workspaces, and applied machine learning.
            </p>
            <div className="text-xs uppercase tracking-widest text-emerald-400/90 font-mono font-semibold">
              Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </div>
          </div>
        </section>

        {/* Filters & Control Panel */}
        <section className="relative -mt-10 md:-mt-12 z-20 pb-8 bg-transparent">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] flex flex-col gap-6">
              
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-slate-200 focus-visible:ring-primary"
                />
              </div>

              {/* Filters & Sorting Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className={
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {/* Status & Sorting */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Status Toggle Buttons */}
                  <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white p-0.5">
                    {(['All', 'Completed', 'In Progress'] as const).map((status) => (
                      <Button
                        key={status}
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedStatus(status)}
                        className={`px-3 py-1.5 h-auto text-xs font-medium rounded-md transition-colors ${
                          selectedStatus === status
                            ? 'bg-slate-100 text-slate-900 font-semibold'
                            : 'text-slate-500 hover:text-slate-950'
                        }`}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="w-48">
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value as SortOption)}
                    >
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="a-z">Alphabetical (A-Z)</SelectItem>
                        <SelectItem value="z-a">Alphabetical (Z-A)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            {filteredProjects.length > 0 ? (
              <ProjectsGrid projects={filteredProjects} />
            ) : (
              /* Empty State */
              <div className="text-center py-16 bg-white border border-slate-200 rounded-xl max-w-md mx-auto px-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">No projects found.</h3>
                <p className="text-slate-500 text-sm">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Work;
