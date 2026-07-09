import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { INDUSTRIES } from '@/data/industries';
import { PROJECTS } from '@/data/projects';
import { PROCESS_STEPS } from '@/data/process';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ChevronRight, 
  AlertTriangle, 
  Lightbulb, 
  Check, 
  Briefcase, 
  Cpu, 
  Image,
  Workflow
} from 'lucide-react';
import { SpotlightCard } from '@/components/animations/SpotlightCard';
import { AuroraBackground, Spotlight3DBackground } from '@/components/animations/PremiumBackground';
// Shared color utility for premium spotlight rendering
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
import { BlurReveal, ScaleIn, StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
import { PremiumImage } from '@/components/common/PremiumImage';
import { Magnetic, ShineEffect, GlowHover } from '@/components/animations/MicroInteractions';
import { useQuery } from '@tanstack/react-query';
import { getIndustryBySlug } from '@/services/industry.service';
import { decorateIndustry, getIndustryHeroImage } from '@/data/industry.adapter';
import { RichTextContent } from '@/components/common/RichTextContent';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';

const DEFAULT_OVERVIEW_QUOTE =
  'Adapting our VISTAR delivery frameworks to the precise requirements of target industries, securing data contracts, and scaling customer interfaces.';

export const IndustryDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  // Fetch dynamic industry details from backend CMS
  const { data: apiIndustry, isPending } = useQuery({
    queryKey: ['industryDetails', slug],
    queryFn: () => getIndustryBySlug(slug || ''),
    enabled: !!slug,
  });

  const staticIndustry = slug ? INDUSTRIES.find((i) => i.slug === slug) : undefined;

  // Prefer API data; use static fallback only when available (avoids false "Not Found" during fetch)
  const industry = apiIndustry
    ? decorateIndustry(apiIndustry)
    : staticIndustry;

  // Reset scroll (must run before any conditional return — Rules of Hooks)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [industry?.slug]);

  const seoBlock = (
    <PageSeo
      seo={industry}
      defaults={{
        title: industry ? `${industry.title} Industry Solutions | TechVistar` : 'Industry Not Found | TechVistar',
        description: industry?.shortDescription || industry?.description || '',
        image: industry ? getIndustryHeroImage(industry) : undefined,
        url: industry ? buildCanonical(`/industries/${industry.slug}`) : buildCanonical('/industries'),
      }}
    />
  );

  // CMS-only slugs have no static fallback — wait for API before showing not-found
  if (isPending && !staticIndustry) {
    return null;
  }

  if (!industry) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfa] px-4 pt-20">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/65 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
            <h1 className="text-2xl md:text-3xl font-black font-display text-teal-955 tracking-tight mb-3">
              Industry Not Found
            </h1>
            <p className="text-slate-655 text-xs sm:text-sm leading-relaxed mb-8 font-medium">
              We couldn't find the industry sector you were looking for. It may have been moved or updated.
            </p>
            <Button asChild className="w-full bg-primary text-white hover:bg-primary/95 rounded-xl font-bold">
              <Link to="/industries">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Industries
              </Link>
            </Button>
          </div>
          <Footer />
        </main>
      </>
    );
  }

  const Icon = industry.icon;
  const colors = resolveSpotlightColors(industry.id);
  const overviewQuote = industry.overviewQuote?.trim() || DEFAULT_OVERVIEW_QUOTE;
  const hasStats = industry.statistics && industry.statistics.length > 0;
  const hasChallenges = industry.challenges && industry.challenges.length > 0;
  const hasSolutions = industry.solutions && industry.solutions.length > 0;
  const hasTechnologies = industry.technologies && industry.technologies.length > 0;

  // Resolve related projects for case studies
  const relatedProjectsData = PROJECTS.filter((p) => industry.caseStudies.includes(p.slug));

  return (
    <>
      {seoBlock}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-[#fafbfa]">
        <Navbar />

        {/* Hero Section Redesigned with dynamic split cover image & Aurora Background */}
        <AuroraBackground className="bg-gradient-to-b from-zinc-950 via-[#041d1a] to-zinc-950 pt-24 pb-20 md:pt-36 md:pb-28 border-b border-emerald-950/40">
          <div className="container-custom max-w-5xl mx-auto px-4 relative z-10">
            <Link 
              to="/industries" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Industries</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-2">
              <div className="lg:col-span-7">
                <BlurReveal duration={0.6}>
                  <div className="flex flex-wrap gap-2 items-center mb-4">
                    <ShineEffect className="rounded-full">
                      <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 font-black uppercase tracking-[0.15em] text-[10px] px-2.5 py-0.5 rounded-full">
                        Industry Verticals
                      </Badge>
                    </ShineEffect>
                    {relatedProjectsData.length > 0 && (
                      <Badge variant="secondary" className="bg-white/10 text-white font-semibold text-[10px] px-2.5 py-0.5 border border-white/5 rounded-full">
                        {relatedProjectsData.length} Case Studies Deployed
                      </Badge>
                    )}
                  </div>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">
                    {industry.title}
                  </h1>
                  <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-300 font-semibold leading-relaxed max-w-2xl">
                    {industry.shortDescription}
                  </p>
                </BlurReveal>
              </div>

              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <BlurReveal duration={0.6} delay={0.15} className="w-full max-w-sm">
                  {/* Dynamically renders cover image inside rounded container */}
                  <div className="relative group/cover rounded-3xl overflow-hidden border border-white/15 shadow-2xl w-full aspect-[4/3] bg-slate-800">
                    {getIndustryHeroImage(industry) ? (
                      <PremiumImage 
                        src={getIndustryHeroImage(industry)} 
                        alt={industry.title}
                        aspectRatioClassName="aspect-[4/3]"
                        className="group-hover/cover:scale-[1.05] transition-transform duration-500"
                        showOverlay={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <Image className="h-10 w-10 text-slate-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/45 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-5 left-5 p-3 rounded-2xl bg-white/90 backdrop-blur text-emerald-600 border border-emerald-100/35 shadow-md">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </BlurReveal>
              </div>
            </div>
          </div>
        </AuroraBackground>

        {/* Breadcrumb Navigation */}
                {/* Spotlight 3D Parallax Dot Background wrapping all main sections */}
        <Spotlight3DBackground className="py-16 md:py-24">
          <div className="container-custom max-w-5xl mx-auto px-4 space-y-16 md:space-y-24">
            
            {/* Section 1: Overview */}
            <div className={`grid grid-cols-1 ${hasStats ? 'lg:grid-cols-12' : ''} gap-10 items-start pb-12 border-b border-slate-100`}>
              <div className={`${hasStats ? 'lg:col-span-8' : ''} space-y-4`}>
                <ScaleIn>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-teal-955 tracking-tight">
                    Overview & Sector Focus
                  </h2>
                  <div className="border-l-4 border-emerald-500 pl-4 py-1.5 mt-4">
                    <RichTextContent
                      content={overviewQuote}
                      className="text-slate-655 text-sm sm:text-base leading-relaxed font-semibold italic"
                    />
                  </div>
                  <RichTextContent
                    content={industry.description}
                    className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium pt-3"
                  />
                  {/* Strategic Capabilities feature grid to fill height space */}
                  <div className="mt-8 pt-6 border-t border-slate-100/80">
                    <h3 className="font-display font-extrabold text-teal-955 text-xs uppercase tracking-wider mb-4">
                      Strategic Capabilities
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GlowHover glowColor={colors.border}>
                        <SpotlightCard 
                          spotlightColor={colors.spotlight} 
                          borderColor={colors.border}
                          className="p-4.5 rounded-xl border border-slate-200/40 bg-white shadow-sm flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="font-display font-black text-teal-955 text-xs sm:text-sm">
                              Enterprise Governance
                            </div>
                            <p className="text-slate-500 text-[11px] font-semibold mt-2.5 leading-relaxed">
                              Configured from day one to comply with vertical-specific regulatory guidelines, access logs, and data encryption.
                            </p>
                          </div>
                        </SpotlightCard>
                      </GlowHover>
                      <GlowHover glowColor={colors.border}>
                        <SpotlightCard 
                          spotlightColor={colors.spotlight} 
                          borderColor={colors.border}
                          className="p-4.5 rounded-xl border border-slate-200/40 bg-white shadow-sm flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="font-display font-black text-teal-955 text-xs sm:text-sm">
                              API-First Integrations
                            </div>
                            <p className="text-slate-500 text-[11px] font-semibold mt-2.5 leading-relaxed">
                              Seamlessly connecting modern microservices databases with pre-existing legacy structures and third-party contracts.
                            </p>
                          </div>
                        </SpotlightCard>
                      </GlowHover>
                    </div>
                  </div>
                </ScaleIn>
              </div>

              {hasStats && (
              <div className="lg:col-span-4 space-y-6">
                  <ScaleIn delay={0.1}>
                    <Card className="border border-slate-200/50 bg-white p-6 rounded-2xl shadow-[0_4px_25px_-4px_rgba(10,46,43,0.03)]">
                      <h3 className="font-display font-extrabold text-teal-955 text-xs uppercase tracking-wider mb-5">
                        Metrics & Impact
                      </h3>
                      <div className="space-y-6">
                        {industry.statistics.map((stat, index) => (
                          <div key={index} className="group border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                            <div className={`text-3xl font-black bg-gradient-to-r ${industry.industriesColor} bg-clip-text text-transparent group-hover:scale-105 transition-transform origin-left duration-300`}>
                              {stat.value}
                            </div>
                            <div className="text-teal-955 text-xs sm:text-sm font-bold mt-1">
                              {stat.label}
                            </div>
                            {stat.description && (
                              <p className="text-slate-500 text-xs font-semibold mt-1 leading-relaxed">
                                {stat.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </ScaleIn>
              </div>
              )}
            </div>

            {/* Section 2: Challenge & Solution */}
            {(hasChallenges || hasSolutions) && (
              <div className="space-y-16 md:space-y-24 pb-12 border-b border-slate-100">
            {hasChallenges && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-teal-955 tracking-tight">
                    Business Challenges We Resolve
                  </h2>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold">
                  Every vertical sector contains unique bottlenecks that slow development cycles and introduce compliance risks:
                </p>
                <StaggerContainer className="grid grid-cols-1 gap-4">
                  {industry.challenges.map((challenge, index) => (
                    <StaggerItem key={index}>
                      <GlowHover glowColor="rgba(239, 68, 68, 0.05)">
                        <SpotlightCard 
                          spotlightColor="rgba(239, 68, 68, 0.02)"
                          borderColor="rgba(239, 68, 68, 0.15)"
                          className="flex flex-col sm:flex-row gap-4 sm:items-start border border-slate-200/40 bg-white p-5 rounded-2xl shadow-sm hover:scale-[1.005] transition-all"
                        >
                          <div className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-100/60 text-[10px] font-black uppercase tracking-wider shrink-0 w-fit">
                            Challenge 0{index + 1}
                          </div>
                          <div>
                            <h3 className="font-display font-extrabold text-teal-955 text-base mb-1">
                              {challenge.title}
                            </h3>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                              {challenge.description}
                            </p>
                          </div>
                        </SpotlightCard>
                      </GlowHover>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {hasSolutions && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-emerald-500 shrink-0" />
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-teal-955 tracking-tight">
                    Our Engineering Solutions
                  </h2>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold mb-6">
                  Deploying secure, modern, and high-performance digital platforms configured for your workflows:
                </p>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {industry.solutions.map((solution, index) => (
                    <StaggerItem key={index}>
                      <GlowHover glowColor="rgba(16, 185, 129, 0.05)">
                        <SpotlightCard 
                          spotlightColor="rgba(16, 185, 129, 0.04)"
                          borderColor="rgba(16, 185, 129, 0.2)"
                          className="border border-emerald-100/60 bg-emerald-50/[0.12] p-6 rounded-2xl h-full shadow-[0_4px_20px_-4px_rgba(16,185,129,0.02)]"
                        >
                          <div className="flex gap-4">
                            <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 mb-1 block">
                                Solution Strategy 0{index + 1}
                              </span>
                              <h3 className="font-display font-extrabold text-teal-955 text-base mb-2">
                                {solution.title}
                              </h3>
                              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                                {solution.description}
                              </p>
                            </div>
                          </div>
                        </SpotlightCard>
                      </GlowHover>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            )}
              </div>
            )}

            {/* Section 3: Technology Stack */}
            {hasTechnologies && (
              <div className="space-y-6 pb-12 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-teal-900 shrink-0" />
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-teal-955 tracking-tight">
                    Technology Stack
                  </h2>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold mb-6">
                  Core technologies we deploy for this industry vertical:
                </p>
                <div className="flex flex-wrap gap-2">
                  {industry.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs text-slate-600 border-slate-200 bg-white font-semibold px-3 py-1 rounded-lg">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Related Case Study */}
            {relatedProjectsData.length > 0 && (
              <div className="space-y-6 pb-12 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-teal-900 shrink-0" />
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-teal-955 tracking-tight">
                    Related Case Study
                  </h2>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold mb-6">
                  Real outcomes, scalable codebases, and integrations successfully shipped:
                </p>
                <StaggerContainer className="grid grid-cols-1 gap-6">
                  {relatedProjectsData.map((proj) => (
                    <StaggerItem key={proj.id}>
                      <Link 
                        to={`/work/${proj.slug}`}
                        className="group block rounded-2xl overflow-hidden"
                      >
                        <GlowHover glowColor={colors.border}>
                          <SpotlightCard
                            spotlightColor={colors.spotlight}
                            borderColor={colors.border}
                            className="flex flex-col md:flex-row gap-6 border border-slate-200/50 bg-white p-5 rounded-2xl shadow-[0_4px_25px_-4px_rgba(10,46,43,0.02)] hover:shadow-[0_16px_36px_rgb(0,0,0,0.05)] hover:scale-[1.003] transition-all duration-300"
                          >
                            {proj.thumbnail && (
                              <div className="w-full md:w-[32%] h-44 rounded-xl overflow-hidden shrink-0 bg-slate-50 relative border border-slate-200/40">
                                <img 
                                  src={proj.thumbnail} 
                                  alt={proj.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="flex-grow flex flex-col justify-between py-1">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                                    {proj.category}
                                  </span>
                                  <span className="text-[10px] text-slate-400">|</span>
                                  <span className="text-[10px] font-bold text-slate-400">
                                    Client: {proj.client}
                                  </span>
                                </div>
                                <h3 className="font-display font-extrabold text-teal-955 group-hover:text-primary transition-colors text-lg sm:text-xl mt-1">
                                  {proj.title}
                                </h3>
                                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed mt-2.5">
                                  {proj.description}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-50">
                                <div className="flex flex-wrap gap-1.5">
                                  {proj.technologies.slice(0, 4).map((tech) => (
                                    <Badge key={tech} variant="outline" className="text-[9px] text-slate-400 border-slate-200 bg-white px-2 py-0.5 rounded">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1.5 transition-transform shrink-0">
                                  View details <ChevronRight className="h-3.5 w-3.5" />
                                </span>
                              </div>
                            </div>
                          </SpotlightCard>
                        </GlowHover>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {/* Section 6: Delivery Process (Full Width) */}
            <div className="space-y-6 pb-12 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-teal-900 shrink-0" />
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-teal-955 tracking-tight">
                  Our Delivery Process
                </h2>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold mb-8">
                We follow our structured, governance-first delivery framework to ensure all integrations, security layers, and data contracts remain auditable.
              </p>
              <StaggerContainer className="relative border-l border-slate-200/80 ml-3 pl-6 space-y-8 mt-6">
                {PROCESS_STEPS.map((step, idx) => {
                  return (
                    <StaggerItem key={idx} className="relative group/timeline">
                      {/* Dot step indicator */}
                      <span className="absolute -left-[35px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-emerald-500 text-emerald-600 font-bold text-xs group-hover/timeline:scale-110 group-hover/timeline:bg-emerald-500 group-hover/timeline:text-white transition-all">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="font-display font-extrabold text-teal-955 text-sm sm:text-base group-hover/timeline:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed max-w-2xl">
                          {step.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {step.deliverables.map((deliv, dIdx) => (
                             <Badge key={dIdx} variant="outline" className="text-[9px] bg-slate-50/50 text-slate-500 border-slate-200/60 font-semibold py-0.5 px-2 rounded-lg transition-transform hover:scale-[1.03]">
                              {deliv}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          </div>
        </Spotlight3DBackground>

        {/* Final CTA */}
        <AuroraBackground className="bg-gradient-to-br from-zinc-950 via-[#031c19] to-zinc-950 border-t border-emerald-950/40 py-20 md:py-24">
          <div className="container-custom max-w-4xl mx-auto text-center px-4 relative z-10">
            <ScaleIn>
              <ShineEffect className="inline-block rounded-full mb-4">
                <Badge variant="outline" className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black uppercase tracking-[0.2em] text-[10px] px-3.5 py-1 rounded-full">
                  Let's partner up
                </Badge>
              </ShineEffect>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mt-3">
                {industry.cta.title}
              </h2>
              {industry.cta.subtitle && (
                <RichTextContent
                  content={industry.cta.subtitle}
                  className="mt-5 text-slate-300 max-w-xl mx-auto text-xs sm:text-sm font-semibold leading-relaxed"
                />
              )}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Magnetic>
                  <Button size="lg" className="w-full sm:w-auto font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-[1.02]" asChild>
                    <Link to={industry.cta.buttonLink}>{industry.cta.buttonText}</Link>
                  </Button>
                </Magnetic>
                <Magnetic>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/10 bg-white/5 hover:bg-white/10 hover:text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02]" asChild>
                    <Link to="/industries">Browse Other Verticals</Link>
                  </Button>
                </Magnetic>
              </div>
            </ScaleIn>
          </div>
        </AuroraBackground>

        <Footer />
      </main>
    </>
  );
};

export default IndustryDetails;
