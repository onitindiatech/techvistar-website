import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Layers, RotateCcw, Star } from 'lucide-react';
import { getActiveSolutions } from '@/services/solutions.service';
import { getPublicPagesConfig } from '@/services/pages.service';
import { decorateSolution, decorateStaticSolution, SOLUTIONS_DATA, SolutionDetail } from '@/data/solutions';
import { IMAGE_MAP } from '@/data/services';
import { mergePagesCmsConfig, DEFAULT_SOLUTIONS_LANDING_CMS } from '@/types/pagesCms';
import { seoFromItem } from '@/lib/seoAdmin';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { SolutionsLandingHero } from '@/components/solutions/SolutionsLandingHero';
import { SolutionCard } from '@/components/solutions/SolutionCard';
import { SolutionsCapabilitiesSection } from '@/components/solutions/SolutionsCapabilitiesSection';
import { SolutionsLandingCta } from '@/components/solutions/SolutionsLandingCta';
import { cn } from '@/lib/utils';
import solutionBg from '../assets/solution-header.png';

type SolutionListItem = SolutionDetail & { featured?: boolean };

function resolveLandingBackground(imageKeyOrUrl: string): string {
  const trimmed = imageKeyOrUrl.trim();
  if (!trimmed) return solutionBg;
  if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return IMAGE_MAP[trimmed] || solutionBg;
}

function isFeatured(solution: SolutionListItem): boolean {
  return solution.featured === true || (solution.featured as unknown) === 'true';
}

export const Solutions = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { data: pagesConfigApi } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const landing = mergePagesCmsConfig(pagesConfigApi).solutionsLanding;

  const { data: apiSolutions, isLoading, isError, error } = useQuery({
    queryKey: ['activeSolutions'],
    queryFn: () => getActiveSolutions(),
    retry: 2,
  });

  const activeSolutions = useMemo((): SolutionListItem[] => {
    if (apiSolutions !== undefined) {
      return apiSolutions.map((item: Record<string, unknown>) => ({
        ...decorateSolution(item),
        featured: item.featured === true || item.featured === 'true',
      }));
    }
    if (isError) {
      return Object.values(SOLUTIONS_DATA).map((item) => ({
        ...decorateStaticSolution(item),
        featured: false,
      }));
    }
    return [];
  }, [apiSolutions, isError]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(activeSolutions.map((s) => s.category)))],
    [activeSolutions]
  );

  const filteredSolutions = useMemo(() => {
    const base =
      selectedCategory === 'All'
        ? activeSolutions
        : activeSolutions.filter((s) => s.category === selectedCategory);
    return [...base];
  }, [activeSolutions, selectedCategory]);

  const featuredSolutions = useMemo(
    () => filteredSolutions.filter(isFeatured),
    [filteredSolutions]
  );

  const remainingSolutions = useMemo(
    () => filteredSolutions.filter((s) => !isFeatured(s)),
    [filteredSolutions]
  );

  const scrollToAllSolutions = () => {
    const el = document.getElementById('all-solutions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const catalog = landing.catalog || DEFAULT_SOLUTIONS_LANDING_CMS.catalog;
  const featured = landing.featured || DEFAULT_SOLUTIONS_LANDING_CMS.featured;
  const categoryNav = landing.categoryNav || DEFAULT_SOLUTIONS_LANDING_CMS.categoryNav;

  return (
    <>
      <PageSeo
        seo={seoFromItem(landing as unknown as Record<string, unknown>)}
        defaults={{
          title: landing.seoTitle || DEFAULT_SOLUTIONS_LANDING_CMS.seoTitle || 'Solutions | TechVistar',
          description: landing.seoDescription || DEFAULT_SOLUTIONS_LANDING_CMS.seoDescription || '',
          url: buildCanonical('/solutions'),
        }}
      />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />

        <SolutionsLandingHero
          landing={landing}
          backgroundImage={resolveLandingBackground(landing.hero.backgroundImage || '')}
          onExplore={scrollToAllSolutions}
        />

        <section className="border-b border-slate-200 bg-white py-8">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-emerald-600">
                <Layers className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {categoryNav.eyebrow}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'rounded-xl text-xs font-bold transition-all',
                      selectedCategory === cat
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-500/15 hover:bg-emerald-500'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-500/30 hover:bg-emerald-50/50'
                    )}
                  >
                    {cat}
                  </Button>
                ))}

                {selectedCategory !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {isLoading ? (
          <section className="py-16 md:py-24">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="h-[420px] animate-pulse rounded-3xl border border-slate-100 bg-white"
                  />
                ))}
              </div>
            </div>
          </section>
        ) : isError ? (
          <section className="py-16 md:py-24">
            <div className="container mx-auto max-w-lg px-4 md:px-6">
              <div className="flex flex-col items-center rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
                <div className="mb-4 rounded-xl bg-red-100 p-3 text-red-600">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-1 text-lg font-bold text-red-900">Failed to load solutions</h3>
                <p className="mb-6 text-sm leading-relaxed text-red-700">
                  {error instanceof Error ? error.message : 'An unexpected server error occurred.'}
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Reload Page
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <>
            {featuredSolutions.length > 0 && (
              <section id="featured-solutions" className="border-b border-slate-100 bg-white py-16 md:py-24">
                <div className="container mx-auto max-w-7xl space-y-10 px-4 md:space-y-12 md:px-6">
                  <div className="max-w-2xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {featured.eyebrow}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="text-sm font-semibold text-slate-500">
                      {featured.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featuredSolutions.map((solution, index) => (
                      <SolutionCard
                        key={solution.slug}
                        solution={solution}
                        featured
                        index={index}
                        learnMoreLabel={featured.learnMoreLabel}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            <section id="all-solutions" className="bg-slate-50 py-16 md:py-24">
              <div className="container mx-auto max-w-7xl space-y-10 px-4 md:space-y-12 md:px-6">
                <div className="max-w-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Layers className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {catalog.eyebrow}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    {featuredSolutions.length > 0 ? catalog.title : landing.hero.title}
                  </h2>
                  <p className="text-sm font-semibold text-slate-500">
                    {featuredSolutions.length > 0 ? catalog.description : landing.hero.description}
                  </p>
                </div>

                {remainingSolutions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {remainingSolutions.map((solution, index) => (
                      <SolutionCard
                        key={solution.slug}
                        solution={solution}
                        index={index}
                        learnMoreLabel={catalog.learnMoreLabel}
                      />
                    ))}
                  </div>
                ) : featuredSolutions.length === 0 ? (
                  <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-800">No solutions found.</h3>
                    <p className="text-sm text-slate-500">Try changing your category filter.</p>
                  </div>
                ) : (
                  <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">
                      All solutions in this category are featured above.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <SolutionsCapabilitiesSection
              landing={landing}
              solutionCount={activeSolutions.length}
            />
          </>
        )}

        <SolutionsLandingCta cta={landing.cta || DEFAULT_SOLUTIONS_LANDING_CMS.cta} />

        <Footer />
      </main>
    </>
  );
};

export default Solutions;
