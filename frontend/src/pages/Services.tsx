import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getActiveServices } from '@/services/services.service';
import { getServicesCmsConfig } from '@/services/servicesCmsConfig.service';
import { Service, decorateService, IMAGE_MAP } from '@/data/services';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import { mergeServicesCmsConfig } from '@/types/servicesCms';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { AlertCircle, Layers, RotateCcw, Star } from 'lucide-react';
import servicesBg from '../assets/our-service-bg.png';
import { ServicesLandingHero } from '@/components/services/ServicesLandingHero';
import { ServiceCard } from '@/components/services/ServiceCard';
import { cn } from '@/lib/utils';

function resolveLandingBackground(imageKeyOrUrl: string): string {
  const trimmed = imageKeyOrUrl.trim();
  if (!trimmed) return servicesBg;
  if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return IMAGE_MAP[trimmed] || servicesBg;
}

function isFeatured(service: Service): boolean {
  return service.featured === true || (service.featured as unknown) === 'true';
}

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { data: cmsConfigApi } = useQuery({
    queryKey: ['servicesCmsConfig'],
    queryFn: getServicesCmsConfig,
    staleTime: 60_000,
  });

  const cmsConfig = mergeServicesCmsConfig(cmsConfigApi);
  const landing = cmsConfig.landing;

  const { data: apiServices, isLoading, isError, error } = useQuery({
    queryKey: ['activeServices'],
    queryFn: () => getActiveServices(),
    staleTime: 0,
    refetchOnMount: 'always',
    retry: 2,
  });

  const activeServices = useMemo(
    () => (apiServices || []).map((item: unknown) => decorateService(item)),
    [apiServices]
  );

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(activeServices.map((s) => s.category)))],
    [activeServices]
  );

  const filteredServices = useMemo(() => {
    const base =
      selectedCategory === 'All'
        ? activeServices
        : activeServices.filter((s) => s.category === selectedCategory);
    return [...base].sort((a, b) => a.order - b.order);
  }, [activeServices, selectedCategory]);

  const featuredServices = useMemo(
    () => filteredServices.filter(isFeatured),
    [filteredServices]
  );

  const remainingServices = useMemo(
    () => filteredServices.filter((s) => !isFeatured(s)),
    [filteredServices]
  );

  const scrollToAllServices = () => {
    const el = document.getElementById('all-services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <PageSeo
        seo={landing}
        defaults={{
          title: 'Our Services | TechVistar',
          description: landing.description,
          url: buildCanonical('/services'),
        }}
      />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />

        <ServicesLandingHero
          landing={landing}
          backgroundImage={resolveLandingBackground(landing.backgroundImage)}
          onExplore={scrollToAllServices}
        />

        {/* Category filter */}
        <section className="border-b border-slate-200 bg-white py-8">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-emerald-600">
                <Layers className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Browse by category</span>
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
                <h3 className="mb-1 text-lg font-bold text-red-900">Failed to load services</h3>
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
            {featuredServices.length > 0 && (
              <section id="featured-services" className="border-b border-slate-100 bg-white py-16 md:py-24">
                <div className="container mx-auto max-w-7xl space-y-10 md:space-y-12 px-4 md:px-6">
                  <div className="max-w-2xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Top Picks</span>
                    </div>
                    <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                      Featured Services
                    </h2>
                    <p className="text-sm font-semibold text-slate-500">
                      Our most recommended enterprise solutions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featuredServices.map((service, index) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        featured
                        index={index}
                        learnMoreLabel={landing.learnMoreLabel}
                        offeringsLabel={landing.offeringsLabel}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            <section id="all-services" className="bg-slate-50 py-16 md:py-24">
              <div className="container mx-auto max-w-7xl space-y-10 md:space-y-12 px-4 md:px-6">
                <div className="max-w-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Layers className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Full Catalog</span>
                  </div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    {featuredServices.length > 0 ? 'All Services' : landing.title}
                  </h2>
                  <p className="text-sm font-semibold text-slate-500">
                    {featuredServices.length > 0
                      ? 'Explore the complete range of enterprise-grade solutions.'
                      : landing.description}
                  </p>
                </div>

                {remainingServices.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {remainingServices.map((service, index) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        index={index}
                        learnMoreLabel={landing.learnMoreLabel}
                        offeringsLabel={landing.offeringsLabel}
                      />
                    ))}
                  </div>
                ) : featuredServices.length === 0 ? (
                  <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-800">No services found.</h3>
                    <p className="text-sm text-slate-500">Try changing your category filter.</p>
                  </div>
                ) : (
                  <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">
                      All services in this category are featured above.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        <Footer />
      </main>
    </>
  );
};

export default Services;
