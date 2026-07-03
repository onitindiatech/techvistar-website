import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { INDUSTRIES, Industry } from '@/data/industries';
import { SERVICES } from '@/data/services';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronRight, HelpCircle, Lightbulb, AlertTriangle, Cpu, Layers, Image, Sparkles, ArrowRight, Heart, GraduationCap, Landmark, ShoppingCart, Factory, Truck } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SpotlightCard } from '@/components/animations/SpotlightCard';
import { AuroraBackground, Spotlight3DBackground } from '@/components/animations/PremiumBackground';
import { PremiumImage } from '@/components/common/PremiumImage';
import { BlurReveal, ScaleIn, StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
import { Magnetic, ShineEffect, GlowHover } from '@/components/animations/MicroInteractions';
// Shared color utility for premium spotlight rendering
export const resolveSpotlightColors = (id: string) => {
  const colorMap: Record<string, { spotlight: string; border: string }> = {
    healthcare: { spotlight: 'rgba(16, 185, 129, 0.06)', border: 'rgba(16, 185, 129, 0.25)' },
    education: { spotlight: 'rgba(59, 130, 246, 0.06)', border: 'rgba(59, 130, 246, 0.25)' },
    finance: { spotlight: 'rgba(245, 158, 11, 0.06)', border: 'rgba(245, 158, 11, 0.25)' },
    'retail-ecommerce': { spotlight: 'rgba(244, 63, 94, 0.06)', border: 'rgba(244, 63, 94, 0.25)' },
    manufacturing: { spotlight: 'rgba(249, 115, 22, 0.06)', border: 'rgba(249, 115, 22, 0.25)' },
    'real-estate': { spotlight: 'rgba(6, 182, 212, 0.06)', border: 'rgba(6, 182, 212, 0.25)' },
    logistics: { spotlight: 'rgba(139, 92, 246, 0.06)', border: 'rgba(139, 92, 246, 0.25)' },
    agriculture: { spotlight: 'rgba(34, 197, 94, 0.06)', border: 'rgba(34, 197, 94, 0.25)' },
    hospitality: { spotlight: 'rgba(245, 158, 11, 0.06)', border: 'rgba(245, 158, 11, 0.25)' },
    'energy-utilities': { spotlight: 'rgba(245, 158, 11, 0.06)', border: 'rgba(245, 158, 11, 0.25)' },
  };
  return colorMap[id] || { spotlight: 'rgba(16, 185, 129, 0.06)', border: 'rgba(16, 185, 129, 0.25)' };
};

export const Industries = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

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

        {/* Premium Redesigned Industries Hero with Aurora Background */}
        <AuroraBackground className="bg-gradient-to-b from-zinc-950 via-[#021815] to-zinc-950 pt-20 pb-20 md:pt-32 md:pb-28 border-b border-emerald-950/40 relative overflow-hidden">
          {/* Decorative mesh background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          {/* Glowing colorful backdrop blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="container-custom relative z-10 max-w-6xl mx-auto px-4 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Text Content + Search */}
              <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                <BlurReveal duration={0.6}>
                  <ShineEffect className="inline-block rounded-full mb-6">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-black uppercase tracking-[0.22em] text-[9px] px-4 py-1.5 rounded-full shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]">
                      INDUSTRIES WE SERVE
                    </Badge>
                  </ShineEffect>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-6">
                    Redefining Digitization <br />
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-350 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
                      In Global Industries
                    </span>
                  </h1>
                  <p className="mt-4 text-sm sm:text-base md:text-lg text-zinc-300 max-w-xl font-semibold leading-relaxed">
                    We combine industry-specific domain expertise with scalable software engineering to deliver secure, regulatory-compliant, and high-performance digital ecosystems.
                  </p>
                </BlurReveal>

                {/* Interactive Search Bar */}
                <BlurReveal duration={0.6} delay={0.15} className="mt-10 w-full max-w-xl relative group">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-555/20 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:bg-white/[0.05] transition-all duration-300 px-5 py-2 backdrop-blur-xl shadow-inner">
                    <Search className="h-5 w-5 text-emerald-400 mr-3 shrink-0 animate-pulse" />
                    <input
                      type="text"
                      placeholder="Search industries, services, or technologies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-0 text-white placeholder-slate-400 focus:outline-none focus:ring-0 text-xs sm:text-sm py-2.5 font-semibold tracking-wide"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-[10px] font-black text-emerald-400 hover:text-white px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/25"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </BlurReveal>
              </div>

              {/* Right Column: Globe + Floating Panels */}
              <div className="lg:col-span-6 relative h-[480px] lg:h-[550px] w-full flex items-center justify-center overflow-hidden mt-10 lg:mt-0">
                {/* Globe Core */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent flex items-center justify-center border border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.15)] animate-[pulse_3s_infinite]">
                  {/* Spinning outer rings */}
                  <div className="absolute inset-[-15px] rounded-full border border-dashed border-emerald-500/20 animate-[spin_60s_linear_infinite]" />
                  <div className="absolute inset-[-30px] rounded-full border border-dashed border-teal-500/10 animate-[spin_40s_linear_infinite_reverse]" />
                  <div className="absolute inset-[-45px] rounded-full border border-emerald-500/5 animate-[spin_80s_linear_infinite]" />

                  {/* Styled SVG Globe grid */}
                  <svg className="w-56 h-56 sm:w-64 sm:h-64 text-emerald-400/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                    <circle cx="50" cy="50" r="45" />
                    <circle cx="50" cy="50" r="35" />
                    <circle cx="50" cy="50" r="20" />
                    <path d="M50,5 Q50,95" />
                    <path d="M5,50 Q95,50" />
                    <path d="M50,5 Q70,50 50,95" />
                    <path d="M50,5 Q30,50 50,95" />
                    <path d="M50,5 Q85,50 50,95" />
                    <path d="M50,5 Q15,50 50,95" />
                  </svg>

                  {/* Globe center glow */}
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-400/20 blur-xl" />
                </div>

                {/* Floating Panels */}
                {/* Healthcare */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[12%] left-[4%] flex items-center gap-3 bg-zinc-950/85 border border-emerald-500/30 rounded-xl px-3.5 py-2 shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-md z-20 hover:border-emerald-400 hover:shadow-[0_4px_30px_rgba(16,185,129,0.2)] transition-colors duration-300"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Heart className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-white leading-none">Healthcare</div>
                    <div className="text-[8px] font-semibold text-emerald-400/70 mt-0.5 leading-none">Better Outcomes</div>
                  </div>
                </motion.div>

                {/* Finance */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[48%] left-[0%] flex items-center gap-3 bg-zinc-950/85 border border-emerald-500/30 rounded-xl px-3.5 py-2 shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-md z-20 hover:border-emerald-400 hover:shadow-[0_4px_30px_rgba(16,185,129,0.2)] transition-colors duration-300"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Landmark className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-white leading-none">Finance</div>
                    <div className="text-[8px] font-semibold text-emerald-400/70 mt-0.5 leading-none">Secure & Scalable</div>
                  </div>
                </motion.div>

                {/* Logistics */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-[10%] left-[8%] flex items-center gap-3 bg-zinc-950/85 border border-emerald-500/30 rounded-xl px-3.5 py-2 shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-md z-20 hover:border-emerald-400 hover:shadow-[0_4px_30px_rgba(16,185,129,0.2)] transition-colors duration-300"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Truck className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-white leading-none">Logistics</div>
                    <div className="text-[8px] font-semibold text-emerald-400/70 mt-0.5 leading-none">Supply Chain 4.0</div>
                  </div>
                </motion.div>

                {/* Manufacturing */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[8%] right-[4%] flex items-center gap-3 bg-zinc-950/85 border border-emerald-500/30 rounded-xl px-3.5 py-2 shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-md z-20 hover:border-emerald-400 hover:shadow-[0_4px_30px_rgba(16,185,129,0.2)] transition-colors duration-300"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Factory className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-white leading-none">Manufacturing</div>
                    <div className="text-[8px] font-semibold text-emerald-400/70 mt-0.5 leading-none">Smart Automation</div>
                  </div>
                </motion.div>

                {/* Retail */}
                <motion.div 
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[38%] right-[0%] flex items-center gap-3 bg-zinc-950/85 border border-emerald-500/30 rounded-xl px-3.5 py-2 shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-md z-20 hover:border-emerald-400 hover:shadow-[0_4px_30px_rgba(16,185,129,0.2)] transition-colors duration-300"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-white leading-none">Retail & E-Commerce</div>
                    <div className="text-[8px] font-semibold text-emerald-400/70 mt-0.5 leading-none">Customer Centric</div>
                  </div>
                </motion.div>

                {/* Education */}
                <motion.div 
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-[18%] right-[8%] flex items-center gap-3 bg-zinc-950/85 border border-emerald-500/30 rounded-xl px-3.5 py-2 shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-md z-20 hover:border-emerald-400 hover:shadow-[0_4px_30px_rgba(16,185,129,0.2)] transition-colors duration-300"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-white leading-none">Education</div>
                    <div className="text-[8px] font-semibold text-emerald-400/70 mt-0.5 leading-none">Digital Learning</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </AuroraBackground>

        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Dynamic Industries Asymmetrical Grid Section with 3D Parallax Dot Background */}
        <Spotlight3DBackground className="pt-6 pb-8 md:pt-8 md:pb-12">
          <div className="container-custom max-w-6xl mx-auto px-4 relative">
            <AnimatePresence mode="popLayout">
              {filteredIndustries.length > 0 ? (
                <StaggerContainer 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredIndustries.map((ind: Industry, index: number) => {
                    const Icon = ind.icon;
                    const colors = resolveSpotlightColors(ind.id);
                    const isFeatured = index === 0 || index === 6;

                    return (
                      <StaggerItem
                        key={ind.id}
                        className={`${isFeatured ? 'md:col-span-2' : 'md:col-span-1'} h-full`}
                      >
                        <GlowHover glowColor={colors.border} className="h-full">
                          <SpotlightCard 
                            spotlightColor={colors.spotlight}
                            borderColor={colors.border}
                            className="h-full flex flex-col border border-slate-200/40 bg-white shadow-[0_4px_25px_-4px_rgba(10,46,43,0.025)] hover:shadow-[0_20px_40px_-8px_rgba(10,46,43,0.08)] hover:scale-[1.005] hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
                          >
                            <div className={`flex flex-col ${isFeatured ? 'md:flex-row' : ''} h-full`}>
                              
                              {/* Card cover image */}
                              <div className={`relative overflow-hidden shrink-0 ${isFeatured ? 'w-full md:w-[38%] border-b md:border-b-0 md:border-r border-slate-200/40' : 'w-full border-b border-slate-200/40'}`}>
                                {ind.heroImage ? (
                                  <PremiumImage 
                                    src={ind.heroImage} 
                                    alt={ind.title}
                                    aspectRatioClassName={isFeatured ? 'aspect-[4/3] md:aspect-auto md:h-full' : 'aspect-[16/10]'}
                                    className="group-hover:scale-[1.05] transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full aspect-[16/10] bg-slate-50 flex items-center justify-center">
                                    <Image className="h-8 w-8 text-slate-300" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-white/90 backdrop-blur text-emerald-600 border border-emerald-100/33 shadow-sm shrink-0 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                                  <Icon className="h-4.5 w-4.5" />
                                </div>
                              </div>

                              {/* Card text details */}
                              <div className="flex-grow flex flex-col justify-between p-6">
                                <div>
                                  <div className="flex items-center justify-between mb-3.5">
                                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-primary">
                                      Enterprise Vertical
                                    </span>
                                    {ind.statistics.length > 0 && (
                                      <Badge className="bg-slate-50 hover:bg-slate-50 text-slate-650 font-bold border border-slate-200/60 rounded-lg text-[9px]">
                                        {ind.statistics[0].value} {ind.statistics[0].label}
                                      </Badge>
                                    )}
                                  </div>
                                  <h2 className="font-display text-xl sm:text-2xl font-black text-teal-955 tracking-tight leading-snug">
                                    {ind.title}
                                  </h2>
                                  <p className="text-slate-500 font-medium text-xs mt-2.5 leading-relaxed">
                                    {ind.shortDescription}
                                  </p>

                                  {/* Asymmetrical detail listing */}
                                  <div className="space-y-3.5 mt-5">
                                    {ind.challenges.length > 0 && (
                                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/80">
                                        <div className="flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-[0.1em] text-rose-600 mb-1">
                                          <AlertTriangle className="h-3 w-3" />
                                          <span>Core Challenge</span>
                                        </div>
                                        <p className="text-slate-700 text-xs font-semibold leading-relaxed line-clamp-2">
                                          {ind.challenges[0].title}: <span className="font-medium text-slate-500">{ind.challenges[0].description}</span>
                                        </p>
                                      </div>
                                    )}

                                    {isFeatured && ind.solutions.length > 0 && (
                                      <div className="bg-emerald-50/20 p-3 rounded-xl border border-emerald-100/30">
                                        <div className="flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-[0.1em] text-emerald-700 mb-1">
                                          <Lightbulb className="h-3 w-3" />
                                          <span>Our Solution</span>
                                        </div>
                                        <p className="text-slate-800 text-xs font-semibold leading-relaxed line-clamp-2">
                                          {ind.solutions[0].title}: <span className="font-medium text-slate-500">{ind.solutions[0].description}</span>
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Tags and badges */}
                                <div className="mt-6 space-y-4">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <Layers className="h-3 w-3 text-slate-400 mr-0.5" />
                                    {ind.services.slice(0, isFeatured ? 4 : 2).map((svcSlug) => (
                                      <Badge key={svcSlug} variant="secondary" className="bg-teal-50/50 hover:bg-teal-55 text-[9.5px] text-teal-800 font-bold border border-teal-100/20 px-2 py-0.5 rounded-lg transition-all hover:scale-[1.03]">
                                        {resolveServiceTitle(svcSlug)}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <Cpu className="h-3 w-3 text-slate-400 mr-0.5" />
                                    {ind.technologies.slice(0, isFeatured ? 5 : 3).map((tech) => (
                                      <Badge key={tech} variant="outline" className="text-[9.5px] text-slate-500 border-slate-200 bg-white font-semibold px-2 py-0.5 rounded-lg transition-all hover:scale-[1.03]">
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400">
                                      {ind.caseStudies.length} Anonymized Case Study Linked
                                    </span>
                                    <Magnetic range={0.2}>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 font-bold flex items-center gap-1 group/btn p-0 px-2.5 rounded-lg text-xs"
                                        asChild
                                      >
                                        <Link to={`/industries/${ind.slug}`}>
                                          <span>Explore details</span>
                                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1.5" />
                                        </Link>
                                      </Button>
                                    </Magnetic>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </SpotlightCard>
                        </GlowHover>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <HelpCircle className="h-12 w-12 text-slate-355 mx-auto mb-4" />
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
          </div>
        </Spotlight3DBackground>

        {/* Contained Redesigned CTA Card Section */}
        <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-16 md:pt-6 md:pb-24 bg-slate-50/30 border-t border-slate-100/80">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-[#10B981] to-emerald-700 border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-white shadow-[0_20px_50px_rgba(16,185,129,0.15)] text-center max-w-4xl mx-auto"
          >
            {/* Blurred background glows */}
            <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-emerald-300/20 blur-2xl pointer-events-none" />

            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-10" aria-hidden="true">
              <svg width="100%" height="100%">
                <pattern id="cta-mesh-industries" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#cta-mesh-industries)" />
              </svg>
            </div>

            <div className="relative z-10 space-y-6">
              {/* Floating badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold select-none">
                <Sparkles className="h-3 w-3 text-emerald-100 animate-pulse" />
                <span>Let's collaborate</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-black font-display tracking-tight leading-tight max-w-2xl mx-auto text-white">
                Looking for a custom enterprise platform?
              </h2>
              
              <p className="text-emerald-50/90 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-medium">
                We collaborate closely with technical and product stakeholders to scope, design, and deploy secure, high-performance systems tailored to your vertical's specific requirements.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="bg-white text-emerald-700 hover:bg-slate-50 font-bold border-none shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_-4px_rgba(0,0,0,0.2)] px-7 py-3 rounded-xl inline-flex items-center gap-2 transition-all h-11 text-xs md:text-sm"
                    asChild
                  >
                    <Link to="/contact">Get in Touch</Link>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    className="border-white/30 hover:border-white text-white hover:bg-white/10 font-bold px-7 py-3 rounded-xl inline-flex items-center gap-2 h-11 text-xs md:text-sm transition-all"
                    asChild
                  >
                    <Link to="/work">View Anonymized Portfolio</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Industries;
