import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { lazy, Suspense, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getActiveProjects } from '@/services/portfolio.service';
import { decorateProject, IMAGE_MAP, PROJECTS } from '@/data/projects';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { getPublicPagesConfig } from '@/services/pages.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

import { Button } from '@/components/ui/button';
import { CmsHref } from '@/components/common/CmsHref';
import { Input } from '@/components/ui/input';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  Building2,
  Globe,
  MessageSquare,
  Package,
  Rocket,
  Search,
  Smile,
  Sparkles,
  Star,
} from 'lucide-react';
import workBg from '../assets/work-bg-new.png';
import { LazyMount } from '@/components/common/LazyMount';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import { DEFAULT_PAGES_CMS_CONFIG, mergePagesCmsConfig } from '@/types/pagesCms';
import { seoFromItem } from '@/lib/seoAdmin';

const LazyTextType = lazy(() => import('@/components/ui/TextType'));

const STAT_ICON_MAP = {
  Briefcase,
  Building2,
  Smile,
  Award,
  Rocket,
  Globe,
  Package,
  Star,
  BarChart3,
} as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderHighlightedTitle(title: string, highlightedWords: string): React.ReactNode {
  const words = Array.from(
    new Set(
      highlightedWords
        .split(',')
        .map((word) => word.trim())
        .filter(Boolean)
    )
  );

  if (!words.length) return title;

  const matcher = new RegExp(`(${words.map((word) => escapeRegExp(word)).join('|')})`, 'gi');
  const segments = title.split(matcher).filter(Boolean);

  return segments.map((segment, index) =>
    words.some((word) => word.toLowerCase() === segment.toLowerCase()) ? (
      <span key={`${segment}-${index}`} className="hero-highlight-text--static inline-block font-black">
        {segment}
      </span>
    ) : (
      <span key={`${segment}-${index}`}>{segment}</span>
    )
  );
}

function resolveLandingBackground(imageKeyOrUrl: string): string {
  const trimmed = imageKeyOrUrl.trim();
  if (!trimmed) return workBg;
  if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return IMAGE_MAP[trimmed] || workBg;
}

export const Work = () => {
  const { data: pagesConfigApi } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const landing = mergePagesCmsConfig(pagesConfigApi).portfolioLanding;
  const filters = landing.filters || DEFAULT_PAGES_CMS_CONFIG.portfolioLanding.filters;

  const { data: apiProjects, isLoading } = useQuery({
    queryKey: ['activeProjects'],
    queryFn: getActiveProjects,
    retry: 2,
  });

  const projectsData = (Array.isArray(apiProjects) && apiProjects.length > 0)
    ? apiProjects.map(decorateProject).filter((p): p is ReturnType<typeof decorateProject> => Boolean(p))
    : [...PROJECTS];

  const filterHook = useProjectFilters(projectsData);

  const {
    filteredProjects,
    selectedIndustry,
    setSelectedIndustry,
    industries,
    selectedService,
    setSelectedService,
    services,
    selectedTechnology,
    setSelectedTechnology,
    technologies,
    selectedStatus,
    setSelectedStatus,
    statuses,
    searchQuery,
    setSearchQuery,
  } = filterHook;

  const featuredProjects = useMemo(() => {
    const featured = filteredProjects.filter((project) => project.featured === true);
    if (featured.length >= 4) return featured.slice(0, 4);
    const nonFeatured = filteredProjects.filter((project) => project.featured !== true);
    return [...featured, ...nonFeatured].slice(0, 4);
  }, [filteredProjects]);

  const featuredIds = useMemo(() => new Set(featuredProjects.map((p) => p.id)), [featuredProjects]);
  const normalProjects = useMemo(() => {
    const unfeatured = filteredProjects.filter((p) => !featuredIds.has(p.id));
    if (unfeatured.length > 0 && unfeatured.length % 3 !== 0) {
      const needed = 3 - (unfeatured.length % 3);
      const candidates = projectsData.filter((p) => !unfeatured.some((u) => u.id === p.id));
      return [...unfeatured, ...candidates.slice(0, needed)];
    }
    return unfeatured;
  }, [filteredProjects, featuredIds, projectsData]);

  const statisticsCards = landing.statistics.cards.length
    ? landing.statistics.cards
    : DEFAULT_PAGES_CMS_CONFIG.portfolioLanding.statistics.cards;
  const workflowSteps = landing.workflow.steps.length
    ? landing.workflow.steps
    : DEFAULT_PAGES_CMS_CONFIG.portfolioLanding.workflow.steps;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
          <div className="text-slate-500 font-display">Loading portfolio...</div>
        </main>
        <Footer />
      </>
    );
  }

    return (
      <>
        <PageSeo
          seo={seoFromItem(landing as unknown as Record<string, unknown>)}
          defaults={{
            title: landing.seoTitle || DEFAULT_PAGES_CMS_CONFIG.portfolioLanding.seoTitle || 'Our Work | TechVistar Portfolio',
            description:
              landing.seoDescription ||
              DEFAULT_PAGES_CMS_CONFIG.portfolioLanding.seoDescription ||
              '',
            url: buildCanonical('/work'),
          }}
        />
        <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 animate-fade-in pb-16 relative overflow-x-hidden">
          <Navbar />

          <PageHeader
            title={renderHighlightedTitle(landing.hero.title, landing.hero.highlightedWords)}
            subtitle={landing.hero.badge || landing.hero.eyebrow}
            description={landing.hero.description}
            backgroundImage={resolveLandingBackground(landing.hero.backgroundImage || '')}
          >
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#041a3d] hover:bg-[#021028] text-white rounded-xl transition-all duration-200 text-sm font-extrabold tracking-tight shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] group cursor-pointer"
                >
                  <CmsHref href={landing.hero.primaryButtonLink || '#projects-grid'} className="inline-flex items-center gap-2 text-white">
                    <span>{landing.hero.primaryButtonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </CmsHref>
                </motion.button>
                <Button asChild variant="outline" className="h-11 rounded-xl border-white/20 bg-white/5 px-6 text-sm font-bold text-white hover:bg-white/10">
                  <CmsHref href={landing.hero.secondaryButtonLink || '/contact'}>
                    {landing.hero.secondaryButtonText}
                  </CmsHref>
                </Button>
              </div>

              {landing.hero.image ? (
                <div className="max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                  <img
                    src={resolveLandingBackground(landing.hero.image)}
                    alt={landing.hero.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          </PageHeader>

          {(filters.enableSearch || filters.enableFilters) && (
            <section id="projects-grid" className="sticky top-20 z-40 border-y border-slate-200/80 bg-white/80 py-4 backdrop-blur-md">
              <div className="container-custom mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:px-12 md:flex-row md:px-14 lg:px-16">
                {filters.enableSearch ? (
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      placeholder={filters.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-4 text-xs font-semibold text-slate-900 focus-visible:ring-emerald-500/20"
                    />
                  </div>
                ) : (
                  <div />
                )}

                {filters.enableFilters ? (
                  <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="All">{filters.allIndustriesLabel}</option>
                      {industries.filter((industry) => industry !== 'All').map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="All">{filters.allServicesLabel}</option>
                      {services.filter((service) => service !== 'All').map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedTechnology}
                      onChange={(e) => setSelectedTechnology(e.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="All">{filters.allTechnologiesLabel}</option>
                      {technologies.filter((technology) => technology !== 'All').map((technology) => (
                        <option key={technology} value={technology}>
                          {technology}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="All">{filters.allStatusesLabel}</option>
                      {statuses.filter((status) => status !== 'All').map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>
            </section>
          )}

          <section className="container-custom mx-auto max-w-7xl px-6 pt-12 pb-16 sm:px-12 md:px-14 md:pt-20 md:pb-20 lg:px-16">
            <div className="mb-12 space-y-2 text-center">
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                {landing.featuredProjects.badge}
              </span>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                {landing.featuredProjects.heading}
              </h2>
              <p className="text-base md:text-lg font-medium text-slate-600">{landing.featuredProjects.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {featuredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -6 }}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/60 bg-white text-slate-900 shadow-md transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_15px_30px_-8px_rgba(14,165,233,0.15)]"
                >
                  <div className="space-y-4">
                    <div className="relative flex h-44 items-center justify-center overflow-hidden border-b border-slate-100 bg-slate-50">
                      <img
                        src={project.thumbnail}
                        alt=""
                        className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="absolute left-3 top-3 z-10 rounded bg-[#041a3d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                        {project.category}
                      </span>
                    </div>

                    <div className="space-y-2.5 p-5">
                      <div className="font-display text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#041a3d] line-clamp-1">
                        {project.title}
                      </div>
                      <p className="line-clamp-3 text-sm md:text-base font-normal leading-relaxed text-slate-600">
                        {project.shortDescription || project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100/60 px-5 pb-5 pt-3">
                    <Link
                      to={`/work/${project.slug}`}
                      className="flex items-center gap-1 text-xs font-bold text-[#041a3d] transition-colors hover:text-sky-600"
                    >
                      {landing.featuredProjects.primaryButtonLabel || 'View Case Study'}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="container-custom mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
            <div className="mx-auto mb-10 max-w-2xl space-y-2 text-center">
              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-[#041a3d]">
                {landing.recentWork.badge}
              </span>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                {landing.recentWork.heading}
              </h2>
              <p className="text-base md:text-lg font-medium text-slate-600">{landing.recentWork.description}</p>
            </div>

            {normalProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {normalProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ y: -6 }}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/60 bg-white text-slate-900 shadow-md transition-all duration-300 hover:border-[#041a3d]/40 hover:shadow-[0_15px_30px_-8px_rgba(14,165,233,0.15)]"
                  >
                    <div className="space-y-4">
                      <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-slate-100 bg-white">
                        <img
                          src={project.thumbnail}
                          alt=""
                          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <span className="absolute left-3 top-3 z-10 rounded bg-[#041a3d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                          {project.industry}
                        </span>
                      </div>

                      <div className="space-y-3 p-5">
                        <div className="font-display text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#041a3d]">
                          {project.title}
                        </div>
                        <p className="line-clamp-3 text-sm md:text-base font-normal leading-relaxed text-slate-600">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="rounded bg-slate-50 px-2 py-0.5 text-[9px] font-semibold text-slate-500 border border-slate-100"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="ml-1 self-center text-[9px] font-semibold text-slate-400">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 border-t border-slate-100 px-5 py-5">
                      <Link to={`/work/${project.slug}`} className="flex-1">
                        <Button className="h-9 w-full rounded-lg bg-[#0F172A] text-xs font-bold text-white shadow-md transition-all hover:bg-slate-800">
                          {landing.recentWork.primaryButtonLabel || 'View Project'}
                        </Button>
                      </Link>
                      <Link to={`/work/${project.slug}`}>
                        <Button
                          variant="outline"
                          className="h-9 rounded-lg border-slate-200 px-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          {landing.recentWork.secondaryButtonLabel || 'Case Study'}
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-md rounded-2xl border border-slate-200/60 bg-white px-6 py-16 text-center shadow-sm">
                <h3 className="mb-1 text-base font-bold text-slate-700">
                  {landing.recentWork.emptyStateTitle || 'No case studies match.'}
                </h3>
                <p className="text-xs font-semibold text-slate-400">
                  {landing.recentWork.emptyStateDescription ||
                    'Try modifying your text search query or filter tags.'}
                </p>
              </div>
            )}
          </section>

          <section className="border-t border-slate-200/80 bg-slate-50 px-6 py-12 sm:px-12 md:py-16 md:px-14 lg:px-16">
            <div className="mx-auto mb-12 max-w-2xl space-y-2 text-center">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                {landing.statistics.heading}
              </h2>
              <p className="text-sm font-semibold text-slate-500">{landing.statistics.description}</p>
            </div>

            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-12">
              <div className="space-y-6 md:col-span-8">
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(14,165,233,0.08)]">
                  <div className="flex w-fit gap-1 rounded-full border border-slate-200/80 bg-amber-50/30 px-3 py-1 text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <div className="text-sm font-semibold leading-relaxed italic text-slate-700 sm:text-base">
                    &quot;
                    <LazyMount minHeight="3rem" rootMargin="200px 0px">
                      <Suspense fallback={<span>{landing.testimonial.quote}</span>}>
                        <LazyTextType
                          text={[landing.testimonial.quote]}
                          typingSpeed={40}
                          pauseDuration={3000}
                          showCursor={true}
                          cursorCharacter="|"
                          as="span"
                        />
                      </Suspense>
                    </LazyMount>
                    &quot;
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{landing.testimonial.author}</div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {[landing.testimonial.role, landing.testimonial.company].filter(Boolean).join(' · ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:col-span-4">
                {statisticsCards.map((card) => {
                  const StatIcon = STAT_ICON_MAP[(card.icon || 'Briefcase') as keyof typeof STAT_ICON_MAP] || Briefcase;
                  return (
                    <div key={`${card.label}-${card.value}`} className="flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-5 shadow-md">
                      <StatIcon className="h-5 w-5 text-emerald-600" />
                      <div className="mt-4 text-2xl font-extrabold leading-none text-emerald-600 sm:text-3xl">
                        {card.value}
                      </div>
                      <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider leading-snug text-slate-500">
                        {card.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="container-custom mx-auto max-w-7xl px-6 py-12 sm:px-12 md:px-14 md:py-16 lg:px-16 border-t border-slate-200/80">
            <div className="mx-auto mb-12 max-w-2xl space-y-2 text-center">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                {landing.workflow.heading}
              </h2>
              <p className="text-base md:text-lg font-medium leading-relaxed text-slate-600">{landing.workflow.description}</p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.06,
                  },
                },
              }}
              className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
            >
              {(() => {
                const stepColors = [
                  { bg: 'bg-emerald-50/80', border: 'border-emerald-100/70', hoverBorder: 'hover:border-emerald-400/40', badge: 'bg-emerald-500/10 text-emerald-700' },
                  { bg: 'bg-blue-50/80', border: 'border-blue-100/70', hoverBorder: 'hover:border-blue-400/40', badge: 'bg-blue-500/10 text-blue-700' },
                  { bg: 'bg-indigo-50/80', border: 'border-indigo-100/70', hoverBorder: 'hover:border-indigo-400/40', badge: 'bg-indigo-500/10 text-indigo-700' },
                  { bg: 'bg-amber-50/80', border: 'border-amber-100/70', hoverBorder: 'hover:border-amber-400/40', badge: 'bg-amber-500/10 text-amber-700' },
                  { bg: 'bg-rose-50/80', border: 'border-rose-100/70', hoverBorder: 'hover:border-rose-400/40', badge: 'bg-rose-500/10 text-rose-700' },
                  { bg: 'bg-teal-50/80', border: 'border-teal-100/70', hoverBorder: 'hover:border-teal-400/40', badge: 'bg-teal-500/10 text-teal-700' },
                  { bg: 'bg-violet-50/80', border: 'border-violet-100/70', hoverBorder: 'hover:border-violet-400/40', badge: 'bg-violet-500/10 text-violet-700' },
                ];

                return workflowSteps.map((step, index) => {
                  const color = stepColors[index % stepColors.length];

                  return (
                    <motion.div
                      key={step.title || index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { type: 'spring', stiffness: 100, damping: 15 },
                        },
                      }}
                      whileHover={{
                        y: -5,
                        scale: 1.02,
                        boxShadow: '0 12px 25px -10px rgba(0,0,0,0.08)',
                      }}
                      className={`select-none cursor-default rounded-xl border p-5 relative space-y-3 shadow-sm transition-all duration-300 ${color.bg} ${color.border} ${color.hoverBorder}`}
                    >
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${color.badge}`}>
                        Step 0{index + 1}
                      </span>
                      <div className="pt-1 text-sm md:text-base font-extrabold tracking-wide text-slate-800 leading-snug">
                        {step.title}
                      </div>
                      <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-600">{step.description}</p>
                    </motion.div>
                  );
                });
              })()}
            </motion.div>
          </section>

          <section className="container-custom mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
            <motion.div
              whileHover={{ y: -2 }}
              className="relative overflow-hidden rounded-3xl border border-[#041a3d]/30 bg-[#041a3d] p-8 text-center text-white shadow-[0_20px_50px_rgba(5,27,61,0.25)] sm:p-12"
              style={
                landing.cta.backgroundImage
                  ? {
                      backgroundImage: `linear-gradient(rgba(4, 26, 61, 0.9), rgba(4, 26, 61, 0.94)), url(${resolveLandingBackground(landing.cta.backgroundImage)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />

              <div className="pointer-events-none absolute inset-0 z-0 opacity-10" aria-hidden="true">
                <svg width="100%" height="100%">
                  <pattern id="cta-mesh-work" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#cta-mesh-work)" />
                </svg>
              </div>

              {landing.cta.image ? (
                <img
                  src={resolveLandingBackground(landing.cta.image)}
                  alt={landing.cta.title}
                  className="pointer-events-none absolute right-0 top-1/2 hidden w-[280px] -translate-y-1/2 object-cover opacity-20 xl:block"
                />
              ) : null}

              <div className="relative z-10 mx-auto max-w-2xl space-y-6">
                {landing.cta.badge ? (
                  <div className="inline-flex select-none items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 animate-pulse text-blue-200" />
                    <span>{landing.cta.badge}</span>
                  </div>
                ) : null}

                <h3 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                  {landing.cta.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-blue-100/90 sm:text-base">
                  {landing.cta.description}
                </p>
                <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-8 text-xs font-extrabold text-[#041a3d] shadow-md transition-all hover:bg-slate-100 sm:text-sm cursor-pointer group"
                  >
                    <CmsHref href={landing.cta.buttonLink || '/contact'} className="inline-flex items-center gap-2 text-[#041a3d]">
                      <span>{landing.cta.buttonText}</span>
                    </CmsHref>
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 text-xs font-extrabold text-white transition-all hover:border-white hover:bg-white/10 sm:text-sm cursor-pointer group"
                  >
                    <CmsHref href={landing.cta.secondaryButtonLink || '#projects-grid'} className="inline-flex items-center gap-2 text-white">
                      <MessageSquare className="h-4 w-4 text-white" />
                      <span>{landing.cta.secondaryButtonText}</span>
                    </CmsHref>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </section>

          <Footer />
        </main>
      </>
    );
  };
export default Work;
