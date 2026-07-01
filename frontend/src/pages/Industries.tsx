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

  const resolveProjectTitle = (slug: string) => {
    const project = PROJECTS.find((p) => p.slug === slug);
    return project ? project.title : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
      <main id="main-content" className="min-h-screen bg-slate-50">
        <Navbar />

        {/* Premium Industries Hero */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden bg-zinc-950 pt-20 pb-16 md:pt-24 md:pb-20 border-b border-zinc-900"
        >
          {/* Animated Mesh Waves + Mouse Parallax */}
          <motion.div 
            className="absolute inset-0 opacity-80 pointer-events-none z-0"
            style={{ 
              backgroundImage: `url(${servicesBg})`,
              backgroundSize: 'auto 100%',
              backgroundPosition: 'right',
              backgroundRepeat: 'no-repeat',
            }}
            animate={{
              x: [0, 6, 0],
              y: [0, -3, 0],
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
                x: mousePosition.x * 8,
                y: mousePosition.y * 8,
              }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
            />
          </motion.div>

          {/* Grid pulse background */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)`,
              backgroundSize: '45px 45px',
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
            className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-550/5 blur-[90px] pointer-events-none z-0"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.5, 0.4],
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
              <Badge variant="outline" className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold uppercase tracking-wider text-xs px-3 py-1">
                Enterprise Verticals
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Driving Digital Innovation <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Across Key Industries
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-350 max-w-2xl mx-auto font-medium">
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
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-xl opacity-50 group-hover:opacity-85 transition-opacity" />
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all px-4 py-1.5 backdrop-blur-md">
                <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search industries, services, or tech stack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 text-white placeholder-slate-400 focus:outline-none focus:ring-0 text-sm sm:text-base py-2"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 bg-white/10 rounded"
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
        <section className="py-12 md:py-20 container-custom max-w-6xl mx-auto px-4">
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
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="h-full flex flex-col border border-slate-200/80 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden">
                        {/* Gradient header strip */}
                        <div className={`h-2.5 bg-gradient-to-r ${ind.industriesColor}`} />

                        <CardHeader className="p-6 pb-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${ind.industriesColor} text-white shadow-md`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            {ind.statistics.length > 0 && (
                              <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-lg">
                                {ind.statistics[0].value} {ind.statistics[0].label}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="font-display text-xl font-bold text-slate-900 group-hover:text-primary">
                            {ind.title}
                          </CardTitle>
                          <CardDescription className="text-slate-500 font-medium text-xs mt-2 line-clamp-2">
                            {ind.shortDescription}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
                          <div className="space-y-4">
                            {/* Key Challenge Highlight */}
                            {ind.challenges.length > 0 && (
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>Core Challenge</span>
                                </div>
                                <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                                  {ind.challenges[0].title}: <span className="font-medium text-slate-500">{ind.challenges[0].description}</span>
                                </p>
                              </div>
                            )}

                            {/* Key Solution Highlight */}
                            {ind.solutions.length > 0 && (
                              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/60">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                                  <Lightbulb className="h-3 w-3" />
                                  <span>Our Approach</span>
                                </div>
                                <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                                  {ind.solutions[0].title}: <span className="font-medium text-slate-500">{ind.solutions[0].description}</span>
                                </p>
                              </div>
                            )}

                            {/* Associated Services */}
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                <Layers className="h-3 w-3" />
                                <span>Key Solutions</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {ind.services.slice(0, 3).map((svcSlug) => (
                                  <Badge key={svcSlug} variant="secondary" className="bg-slate-100 hover:bg-slate-200/80 text-[10px] text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                                    {resolveServiceTitle(svcSlug)}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Technologies utilized */}
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                <Cpu className="h-3 w-3" />
                                <span>Technologies</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {ind.technologies.slice(0, 4).map((tech) => (
                                  <Badge key={tech} variant="outline" className="text-[10px] text-slate-500 font-medium px-2 py-0.5 border-slate-200 bg-white">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Detail Link (Future Ready) */}
                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400">
                              {ind.caseStudies.length} Case Study Linked
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold flex items-center gap-1 group/btn p-0 px-2 rounded-lg"
                              asChild
                            >
                              <Link to={`/industries/${ind.slug}`}>
                                <span>Explore details</span>
                                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
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
                className="text-center py-16"
              >
                <HelpCircle className="h-12 w-12 text-slate-350 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No industries match your search</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                  Try tweaking your keywords or searching for general technologies like React, Python, or API.
                </p>
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="outline" 
                  className="mt-6 border-slate-200"
                >
                  Reset search filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Global CTA Section */}
        <section className="bg-zinc-950 border-t border-zinc-900 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
          
          <div className="container-custom max-w-4xl mx-auto text-center px-4 relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Looking for a custom enterprise platform?
            </h2>
            <p className="mt-6 text-slate-400 max-w-xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
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
