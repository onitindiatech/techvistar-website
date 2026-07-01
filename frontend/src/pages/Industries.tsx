import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { INDUSTRIES, Industry } from '@/data/industries';
import { SERVICES } from '@/data/services';
import { PROJECTS } from '@/data/projects';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronRight, HelpCircle, Lightbulb, AlertTriangle, Cpu, Layers } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import servicesBg from '../assets/services-bg.png'; // Reusing premium background asset

export const Industries = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  // Helper resolvers for relational data mapping
  const resolveServiceTitle = (slug: string) => {
    const service = SERVICES.find((s) => s.slug === slug);
    return service ? service.title : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Search filter implementation
  const filteredIndustries = INDUSTRIES.filter((industry) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchTitle = industry.title.toLowerCase().includes(query);
    const matchDesc = industry.description.toLowerCase().includes(query) || 
                      industry.shortDescription.toLowerCase().includes(query);
    const matchTech = industry.technologies.some(tech => tech.toLowerCase().includes(query));
    const matchService = industry.services.some(svc => svc.toLowerCase().includes(query));
    
    return matchTitle || matchDesc || matchTech || matchService;
  });

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-[#fafbfa]">
        <Navbar />

        {/* Premium Industries Hero */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-[#06211e] to-zinc-950 pt-20 pb-16 md:pt-28 md:pb-24 border-b border-emerald-950/40"
        >
          {/* Animated Mesh Waves + Mouse Parallax */}
          <motion.div 
            className="absolute inset-0 opacity-70 pointer-events-none z-0"
            style={{ 
              backgroundImage: `url(${servicesBg})`,
              backgroundSize: 'auto 100%',
              backgroundPosition: 'right',
              backgroundRepeat: 'no-repeat',
            }}
            animate={{
              x: [0, 5, 0],
              y: [0, -2, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url(${servicesBg})`,
                backgroundSize: 'auto 100%',
                backgroundPosition: 'right',
                backgroundRepeat: 'no-repeat',
              }}
              animate={{
                x: mousePosition.x * 6,
                y: mousePosition.y * 6,
              }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
            />
          </motion.div>

          {/* Grid pulse background */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.03) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Gradient Ambient Glow */}
          <motion.div 
            className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none z-0"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.35, 0.45, 0.35],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Core Content Container */}
          <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-4 mt-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-4 bg-emerald-500/15 text-emerald-400 border-emerald-500/25 font-black uppercase tracking-[0.2em] text-[10px] px-3.5 py-1 rounded-full">
                Enterprise Verticals
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-6">
                Driving Digital Innovation <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Across Key Industries
                </span>
              </h1>
              <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-semibold leading-relaxed">
                We combine industry-specific domain expertise with scalable software engineering to deliver secure, regulatory-compliant, and high-performance digital ecosystems.
              </p>
            </motion.div>

            {/* Interactive Search Bar */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-10 max-w-xl mx-auto relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all px-4 py-1.5 backdrop-blur-md">
                <Search className="h-5 w-5 text-slate-450 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search industries, services, or tech stack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 text-white placeholder-slate-450 focus:outline-none focus:ring-0 text-xs sm:text-sm py-2.5 font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-[10px] font-bold text-slate-400 hover:text-white px-2 py-1 bg-white/10 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Dynamic Industries Grid Section */}
        <section className="py-16 md:py-24 container-custom max-w-6xl mx-auto px-4 relative">
          {/* Subtle background glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-emerald-500/[0.02] blur-[120px] pointer-events-none" />

          <AnimatePresence mode="popLayout">
            {filteredIndustries.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredIndustries.map((ind: Industry) => {
                  const Icon = ind.icon;
                  return (
                    <motion.div
                      key={ind.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="h-full flex flex-col border border-slate-200/50 bg-white shadow-[0_4px_25px_-4px_rgba(10,46,43,0.03)] hover:shadow-[0_16px_35px_-8px_rgba(10,46,43,0.08)] hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden">
                        {/* Elegant Teal/Emerald Gradient strip */}
                        <div className={`h-1.5 bg-gradient-to-r ${ind.industriesColor}`} />

                        <CardHeader className="p-6 pb-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-emerald-50/80 text-emerald-600 border border-emerald-100/60 shadow-sm shrink-0">
                              <Icon className="h-5 w-5" />
                            </div>
                            {ind.statistics.length > 0 && (
                              <Badge className="bg-slate-50 hover:bg-slate-50 text-slate-650 font-bold border border-slate-200/60 rounded-lg text-[10px]">
                                {ind.statistics[0].value} {ind.statistics[0].label}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="font-display text-xl font-extrabold text-teal-950 tracking-tight leading-snug">
                            {ind.title}
                          </CardTitle>
                          <CardDescription className="text-slate-500 font-medium text-xs mt-2.5 line-clamp-2 leading-relaxed">
                            {ind.shortDescription}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
                          <div className="space-y-4">
                            {/* Key Challenge Highlight */}
                            {ind.challenges.length > 0 && (
                              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/80">
                                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-rose-600 mb-1.5">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>Core Challenge</span>
                                </div>
                                <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                                  {ind.challenges[0].title}: <span className="font-medium text-slate-500">{ind.challenges[0].description}</span>
                                </p>
                              </div>
                            )}

                            {/* Key Solution Highlight */}
                            {ind.solutions.length > 0 && (
                              <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/40">
                                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-700 mb-1.5">
                                  <Lightbulb className="h-3 w-3" />
                                  <span>Our Approach</span>
                                </div>
                                <p className="text-slate-800 text-xs font-semibold leading-relaxed">
                                  {ind.solutions[0].title}: <span className="font-medium text-slate-500">{ind.solutions[0].description}</span>
                                </p>
                              </div>
                            )}

                            {/* Associated Services */}
                            <div>
                              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">
                                <Layers className="h-3 w-3" />
                                <span>Key Solutions</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {ind.services.slice(0, 3).map((svcSlug) => (
                                  <Badge key={svcSlug} variant="secondary" className="bg-teal-50/60 hover:bg-teal-50 text-[10px] text-teal-800 font-bold border border-teal-100/30 px-2 py-0.5 rounded-lg">
                                    {resolveServiceTitle(svcSlug)}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Technologies utilized */}
                            <div>
                              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">
                                <Cpu className="h-3 w-3" />
                                <span>Technologies</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {ind.technologies.slice(0, 4).map((tech) => (
                                  <Badge key={tech} variant="outline" className="text-[10px] text-slate-500 border-slate-200 bg-white font-semibold px-2 py-0.5 rounded-lg">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Detail Link */}
                          <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400">
                              {ind.caseStudies.length} Case Study Linked
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 font-bold flex items-center gap-1 group/btn p-0 px-2 rounded-lg text-xs"
                              asChild
                            >
                              <Link to={`/industries/${ind.slug}`}>
                                <span>Explore details</span>
                                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <HelpCircle className="h-12 w-12 text-slate-350 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No industries match your search</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                  Try tweaking your keywords or searching for general technologies like React, Python, or API.
                </p>
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="outline" 
                  className="mt-6 border-slate-200 rounded-xl"
                >
                  Reset search filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Global CTA Section */}
        <section className="bg-gradient-to-br from-zinc-950 via-[#031c19] to-zinc-950 border-t border-emerald-950/40 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
          
          <div className="container-custom max-w-4xl mx-auto text-center px-4 relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              Looking for a custom enterprise platform?
            </h2>
            <p className="mt-6 text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-semibold leading-relaxed">
              We collaborate closely with technical and product stakeholders to scope, design, and deploy secure, high-performance systems tailored to your vertical's specific requirements.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto font-bold rounded-xl shadow-lg shadow-emerald-500/10" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/10 bg-white/5 hover:bg-white/10 hover:text-white font-bold rounded-xl" asChild>
                <Link to="/work">View Anonymized Portfolio</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Industries;
