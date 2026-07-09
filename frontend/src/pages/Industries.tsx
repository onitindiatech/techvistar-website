import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Industry } from '@/data/industries';
import { SERVICES } from '@/data/services';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, HelpCircle, Lightbulb, AlertTriangle, Cpu, Layers, Image, Sparkles } from 'lucide-react';
import { SpotlightCard } from '@/components/animations/SpotlightCard';
import { Spotlight3DBackground } from '@/components/animations/PremiumBackground';
import { PageHeader } from '@/components/ui/PageHeader';
import { StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
import { Magnetic, GlowHover } from '@/components/animations/MicroInteractions';
import workBg from '../assets/work-bg.png';
import { useQuery } from '@tanstack/react-query';
import { getActiveIndustries } from '@/services/industry.service';
import { getPublicPagesConfig } from '@/services/pages.service';
import { decorateIndustry, getIndustryCardImage } from '@/data/industry.adapter';
import { mergePagesCmsConfig, DEFAULT_INDUSTRIES_LANDING_CMS } from '@/types/pagesCms';
import { seoFromItem } from '@/lib/seoAdmin';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';

const resolveSpotlightColors = (id: string) => {
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
  const { data: pagesConfigApi } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
    staleTime: 60_000,
  });

  const landing = mergePagesCmsConfig(pagesConfigApi).industriesLanding;
  const heroBg = landing.hero.backgroundImage?.trim() || workBg;

  const { data: apiIndustries, isPending, isSuccess } = useQuery({
    queryKey: ['activeIndustries'],
    queryFn: () => getActiveIndustries(),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Never substitute static data after a successful fetch — CMS records exist only in MongoDB.
  const industriesData = useMemo(() => {
    if (isSuccess && Array.isArray(apiIndustries)) {
      return apiIndustries
        .map((item: any) => decorateIndustry(item))
        .filter((item): item is Industry => item !== null);
    }
    if (isPending) {
      return [];
    }
    return [];
  }, [apiIndustries, isPending, isSuccess]);

  const resolveServiceTitle = (slug: string) => {
    const service = SERVICES.find((s) => s.slug === slug);
    return service ? service.title : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <>
      <PageSeo
        seo={seoFromItem(landing as unknown as Record<string, unknown>)}
        defaults={{
          title: landing.seoTitle || DEFAULT_INDUSTRIES_LANDING_CMS.seoTitle || 'Industries | TechVistar',
          description: landing.seoDescription || DEFAULT_INDUSTRIES_LANDING_CMS.seoDescription || '',
          url: buildCanonical('/industries'),
        }}
      />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-[#fafbfa]">
        <Navbar />

        {/* Premium Redesigned Industries Hero with Aurora Background */}
        <PageHeader 
          title={
            landing.hero.subtitle ? (
              <>
                {landing.hero.title} <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-350 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
                  {landing.hero.subtitle}
                </span>
              </>
            ) : (
              landing.hero.title
            )
          }
          subtitle={landing.hero.eyebrow || 'INDUSTRIES WE SERVE'}
          description={landing.hero.description}
          backgroundImage={heroBg}
        />

        {/* Breadcrumb Navigation */}
                {/* Dynamic Industries Asymmetrical Grid Section with 3D Parallax Dot Background */}
        <Spotlight3DBackground className="pt-6 pb-8 md:pt-8 md:pb-12">
          <div className="container-custom max-w-6xl mx-auto px-4 relative">
            <AnimatePresence mode="popLayout">
              {industriesData.length > 0 ? (
                <StaggerContainer 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
                >
                  {industriesData.map((ind: Industry) => {
                    const Icon = ind.icon;
                    const colors = resolveSpotlightColors(ind.id);
                    // Wide-card layout follows CMS featured flag — NOT array index.
                    // Index-based featured (index === 0 || index === 6) broke when new industries
                    // were prepended: index-0 got a 2-col slot with collapsed/invisible content.
                    const isFeatured = Boolean(ind.featured);

                    return (
                      <StaggerItem
                        key={ind.id}
                        className={`${isFeatured ? 'md:col-span-2' : 'md:col-span-1'} flex flex-col`}
                      >
                        <GlowHover glowColor={colors.border} className="flex flex-col flex-1">
                          <SpotlightCard 
                            spotlightColor={colors.spotlight}
                            borderColor={colors.border}
                            className="flex flex-col flex-1 border border-slate-200/40 bg-white shadow-[0_4px_25px_-4px_rgba(10,46,43,0.025)] hover:shadow-[0_20px_40px_-8px_rgba(10,46,43,0.08)] hover:scale-[1.005] hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
                          >
                            <div className={`flex flex-col ${isFeatured ? 'md:flex-row' : ''} flex-1`}>
                              
                              {/* Card cover image — fixed aspect ratio, never causes height variation */}
                              <div className={`relative overflow-hidden shrink-0 bg-slate-100 ${
                                isFeatured
                                  ? 'w-full md:w-[38%] aspect-[4/3] md:aspect-auto border-b md:border-b-0 md:border-r border-slate-200/40'
                                  : 'w-full aspect-[16/10] border-b border-slate-200/40'
                              }`}>
                                {getIndustryCardImage(ind) ? (
                                  <img 
                                    src={getIndustryCardImage(ind)}
                                    alt={ind.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="absolute inset-0 w-full h-full bg-slate-50 flex items-center justify-center">
                                    <Image className="h-8 w-8 text-slate-300" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-white/90 backdrop-blur text-emerald-600 border border-emerald-100/33 shadow-sm shrink-0 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                                  <Icon className="h-4.5 w-4.5" />
                                </div>
                              </div>

                              {/* Card body — flex-col so CTA always pins to bottom */}
                              <div className="flex flex-col flex-1 p-6">
                                {/* Top content block */}
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-3.5">
                                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-primary">
                                      Enterprise Vertical
                                    </span>
                                    {ind.statistics && ind.statistics.length > 0 && (
                                      <Badge className="bg-slate-50 hover:bg-slate-50 text-slate-650 font-bold border border-slate-200/60 rounded-lg text-[9px]">
                                        {ind.statistics[0].value} {ind.statistics[0].label}
                                      </Badge>
                                    )}
                                  </div>
                                  <h2 className="font-display text-xl sm:text-2xl font-black text-teal-955 tracking-tight leading-snug">
                                    {ind.title}
                                  </h2>
                                  {/* Description clamped to 3 lines — prevents height variance across cards */}
                                  <p className="text-slate-500 font-medium text-xs mt-2.5 leading-relaxed line-clamp-3">
                                    {ind.shortDescription}
                                  </p>

                                  {/* Challenge & Solution snippet — both clamped to 2 lines */}
                                  <div className="space-y-3 mt-4">
                                    {ind.challenges && ind.challenges.length > 0 && (
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

                                    {isFeatured && ind.solutions && ind.solutions.length > 0 && (
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

                                {/* Footer pinned to bottom via mt-auto */}
                                <div className="mt-auto pt-5 space-y-3">
                                  {/* Service tags — flex-wrap, never expands card */}
                                  {ind.services && ind.services.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <Layers className="h-3 w-3 text-slate-400 mr-0.5 shrink-0" />
                                      {ind.services.slice(0, isFeatured ? 4 : 2).map((svcSlug) => (
                                        <Badge key={svcSlug} variant="secondary" className="bg-teal-50/50 hover:bg-teal-55 text-[9.5px] text-teal-800 font-bold border border-teal-100/20 px-2 py-0.5 rounded-lg transition-all hover:scale-[1.03]">
                                          {resolveServiceTitle(svcSlug)}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}

                                  {/* Tech tags — flex-wrap, never expands card */}
                                  {ind.technologies && ind.technologies.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <Cpu className="h-3 w-3 text-slate-400 mr-0.5 shrink-0" />
                                      {ind.technologies.slice(0, isFeatured ? 5 : 3).map((tech) => (
                                        <Badge key={tech} variant="outline" className="text-[9.5px] text-slate-500 border-slate-200 bg-white font-semibold px-2 py-0.5 rounded-lg transition-all hover:scale-[1.03]">
                                          {tech}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}

                                  {/* CTA row always at bottom */}
                                  <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400">
                                      {(ind.caseStudies || []).length} Anonymized Case Study Linked
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
                  <h3 className="text-lg font-bold text-slate-900">
                    {isPending ? 'Loading industries…' : 'No industries available'}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                    {isPending
                      ? 'Fetching the latest industry solutions from our CMS.'
                      : 'Check back soon for new industry solutions from TechVistar.'}
                  </p>
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
                {landing.cta.title}
              </h2>
              
              <p className="text-emerald-50/90 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-medium">
                {landing.cta.description}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="bg-white text-emerald-700 hover:bg-slate-50 font-bold border-none shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_-4px_rgba(0,0,0,0.2)] px-7 py-3 rounded-xl inline-flex items-center gap-2 transition-all h-11 text-xs md:text-sm"
                    asChild
                  >
                    <Link to={landing.cta.buttonLink || '/contact'}>{landing.cta.buttonText}</Link>
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
