import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Building2, Brain, Sparkles, Cloud, Target, 
  Layers, Code2, Cpu, Repeat, Settings, FolderGit2, Shield, 
  ArrowRight, Sparkle, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getActiveSolutions } from '@/services/solutions.service';
import { decorateSolution, SolutionDetail } from '@/data/solutions';
import workBg from '../assets/work-bg.png';

interface SolutionCategory {
  id: string;
  label: string;
  tagline: string;
  desc: string;
  items: SolutionDetail[];
}

export const Solutions = () => {
  const { data: apiSolutions, isLoading } = useQuery({
    queryKey: ['activeSolutions'],
    queryFn: getActiveSolutions,
  });

  const solutionsData = (apiSolutions || []).map(decorateSolution);

  const [activeCategory, setActiveCategory] = useState('business-solutions');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const categoryRefs = {
    'business-solutions': useRef<HTMLDivElement>(null),
    'ai-solutions': useRef<HTMLDivElement>(null),
    'digital-solutions': useRef<HTMLDivElement>(null),
  };

  // Track active section on scroll
  useEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const [key, ref] of Object.entries(categoryRefs)) {
        if (ref.current) {
          const offsetTop = ref.current.offsetTop;
          const offsetHeight = ref.current.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(key);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

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

  const scrollToSection = (id: keyof typeof categoryRefs) => {
    const element = categoryRefs[id].current;
    if (element) {
      const offset = element.offsetTop - 140;
      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
      setActiveCategory(id);
    }
  };

  // Dynamically partition CMS data (Clean & Decoupled Architecture)
  const categories: SolutionCategory[] = [
    {
      id: 'business-solutions',
      label: 'Business Solutions',
      tagline: 'Optimize Operations',
      desc: 'Replace fragmented tools with centralized enterprise platforms built to automate workflows and preserve database compliance.',
      items: solutionsData.filter(s => s.category === 'Business Solutions')
    },
    {
      id: 'ai-solutions',
      label: 'AI Solutions',
      tagline: 'Cognitive Systems',
      desc: 'Integrate autonomous intelligence agents, document classification solvers, and predictive models into your business backend.',
      items: solutionsData.filter(s => s.category === 'AI Solutions')
    },
    {
      id: 'digital-solutions',
      label: 'Digital Solutions',
      tagline: 'Infrastructure & Security',
      desc: 'Establish secure API endpoints, redundant container networks, and encryption compliance protocols.',
      items: solutionsData.filter(s => s.category === 'Digital Solutions')
    }
  ];

  // Animation Variant Helpers
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 22 }
    }
  };

  return (
    <>
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 animate-fade-in pb-16">
        <Navbar />

        {/* HERO SECTION */}
        <section 
          className="relative overflow-hidden bg-zinc-950 pt-28 pb-16 md:pt-36 md:pb-24 border-b border-zinc-900 text-white"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Shifting green waves / glow effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-0"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen"
              style={{ backgroundImage: `url(${workBg})` }}
            />
            {/* Mesh grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <motion.div 
              animate={{ 
                x: [0, 15, -10, 0],
                y: [0, -10, 15, 0],
                scale: [1, 1.1, 0.95, 1]
              }}
              style={{ x: mousePosition.x * 35, y: mousePosition.y * 35 }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                x: [0, -15, 10, 0],
                y: [0, 10, -15, 0],
                scale: [1, 0.9, 1.1, 1]
              }}
              style={{ x: mousePosition.x * -35, y: mousePosition.y * -35 }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-teal-500/10 blur-[120px]" 
            />
          </motion.div>

          <div className="container-custom max-w-7xl mx-auto px-6 relative z-10 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Capabilities</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-white tracking-tight leading-[1.1]">
                Enterprise Solutions
              </h1>
              
              <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-semibold max-w-2xl">
                Deploying robust business automation, production-grade intelligence models, and highly secure cloud environments built to scale operations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* LOADING SKELETON LAYER */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container-custom max-w-7xl mx-auto px-6 py-16 space-y-16"
            >
              <div className="space-y-10">
                <div className="h-6 w-48 bg-slate-200/60 rounded animate-pulse" />
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white border border-slate-200/50 rounded-2xl p-6 h-52 space-y-4 animate-pulse shadow-sm">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                      <div className="h-5 bg-slate-200/60 rounded w-2/3" />
                      <div className="h-3 bg-slate-200/40 rounded w-full" />
                      <div className="h-3 bg-slate-200/40 rounded w-5/6" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* STICKY CATEGORY NAVIGATION */}
              <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-y border-slate-200/80 py-4 mt-0 shadow-sm select-none">
                <div className="container-custom max-w-7xl mx-auto px-6 flex justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-bold">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => scrollToSection(cat.id as any)}
                      className={cn(
                         "relative pb-1 px-1 transition-colors hover:text-emerald-600",
                        activeCategory === cat.id ? "text-emerald-600" : "text-slate-500"
                      )}
                    >
                      <span>{cat.label}</span>
                      {activeCategory === cat.id && (
                        <motion.div 
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* SOLUTION CATEGORY LISTINGS */}
              <div className="space-y-16 py-16">
                {categories.map((cat) => (
                  <section 
                    key={cat.id}
                    ref={categoryRefs[cat.id as keyof typeof categoryRefs]}
                    className="container-custom max-w-7xl mx-auto px-6 scroll-mt-28"
                  >
                    {/* Category Header */}
                    <div className="mb-10 space-y-2 border-b border-slate-200/60 pb-6 relative">
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block">
                        {cat.tagline}
                      </span>
                      <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                        {cat.label}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-2xl mt-1 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    {/* Cards Grid */}
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                      {cat.items.map((sol) => {
                        const Icon = sol.icon;
                        return (
                          <Link to={`/solutions/${sol.slug}`} key={sol.slug} className="flex">
                            <motion.div
                              variants={itemVariants}
                              whileHover={{ y: -6, scale: 1.01 }}
                              className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:border-emerald-500/30 hover:shadow-[0_12px_24px_rgba(16,185,129,0.06)] hover:bg-emerald-500/[0.005] transition-all duration-300 group cursor-pointer w-full"
                            >
                              <div className="space-y-4">
                                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                  <Icon className="w-5.5 h-5.5" />
                                </div>
                                <h3 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-emerald-700 transition-colors">
                                  {sol.title}
                                </h3>
                                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                  {sol.desc}
                                </p>
                              </div>

                              <div className="pt-6 border-t border-slate-100/80 mt-6 flex justify-between items-center text-xs font-bold text-emerald-600">
                                <span className="group-hover:translate-x-0.5 transition-transform">Learn More</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                              </div>
                            </motion.div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  </section>
                ))}
              </div>

              {/* 2. OPTIONAL FEATURED SOLUTION SECTION BELOW THE LISTINGS */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/40">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-slate-200/80 bg-white p-8 md:p-12 shadow-lg overflow-hidden relative flex flex-col lg:flex-row gap-10 items-center justify-between"
                >
                  <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
                  
                  <div className="space-y-6 lg:max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold uppercase tracking-wider">
                      <Sparkle className="w-3.5 h-3.5 fill-current" />
                      <span>Featured Solution Capability</span>
                    </div>

                    <h2 className="text-3xl sm:text-4.5xl font-extrabold font-display text-slate-900 tracking-tight leading-none">
                      Intelligent Workflows
                    </h2>

                    <p className="text-slate-600 font-semibold text-sm sm:text-base leading-relaxed">
                      Transform enterprise operations by deploying cognitive agents that run autonomous file consolidation, reporting, and webhook orchestrations under absolute security compliance.
                    </p>

                    <div className="grid grid-cols-3 gap-6 border-y border-slate-100 py-6 font-bold text-xs sm:text-sm">
                      <div>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">40%</span>
                        <span className="text-slate-500 uppercase tracking-widest text-[9px] block mt-1">Cost Reduction</span>
                      </div>
                      <div>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">99.9%</span>
                        <span className="text-slate-500 uppercase tracking-widest text-[9px] block mt-1">SLA Uptime</span>
                      </div>
                      <div>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">10x</span>
                        <span className="text-slate-500 uppercase tracking-widest text-[9px] block mt-1">Process Speed</span>
                      </div>
                    </div>

                    <Link to="/solutions/business-automation">
                      <Button className="h-11 px-6 bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md mt-2 flex items-center gap-2">
                        <span>Explore Featured Solution</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="w-full lg:w-[460px] h-72 sm:h-80 rounded-2xl bg-slate-50 border border-slate-200/80 p-6 flex flex-col justify-between shadow-inner relative overflow-hidden shrink-0">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200/80">
                      <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-400" />
                        <span className="w-3 h-3 rounded-full bg-yellow-400" />
                        <span className="w-3 h-3 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Workflow Engine</span>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 font-bold text-xs">01</div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-none">Business Automation</h4>
                          <span className="text-[9px] text-slate-400 font-bold block mt-1">Consolidating monthly financial ledger files...</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 font-bold text-xs">02</div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-none">AI Orchestration</h4>
                          <span className="text-[9px] text-slate-400 font-bold block mt-1">Executing classification mapping algorithms...</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-emerald-600 font-extrabold uppercase pt-4 border-t border-slate-200/85">
                      <div className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Active Run</span>
                      </div>
                      <span>100% Secure</span>
                    </div>
                  </div>
                </motion.div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>

        {/* TRUSTED BY CLIENT LOGOS SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-6 border-t border-slate-200/80 mt-10 relative z-10 text-center space-y-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trusted by innovative companies worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-45">
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Microsoft</span>
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Google</span>
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">AWS</span>
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Airbnb</span>
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Intel</span>
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Netflix</span>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-12">
          <motion.div 
            whileHover={{ y: -2 }}
            className="rounded-3xl bg-gradient-to-br from-slate-100 to-white border border-slate-200/85 p-8 sm:p-12 text-center relative overflow-hidden shadow-md text-slate-900"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="max-w-2xl mx-auto relative z-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Ready to Deploy a Solution?</h3>
              <p className="text-slate-600 font-semibold text-sm sm:text-base leading-relaxed">
                Connect with our engineering leads to outline timelines, compliance metrics, and technical requirements.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-sm rounded-xl transition-all shadow-md">
                    Book Consultation
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="h-12 px-8 border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-slate-700 text-sm">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Solutions;
