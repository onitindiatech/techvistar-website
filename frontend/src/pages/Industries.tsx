import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Layers, MessageSquare, Sparkles } from 'lucide-react';
import { Industry } from '@/data/industries';
import { IMAGE_MAP } from '@/data/services';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getActiveIndustries } from '@/services/industry.service';
import { getPublicPagesConfig } from '@/services/pages.service';
import { decorateIndustry } from '@/data/industry.adapter';
import { mergePagesCmsConfig, DEFAULT_INDUSTRIES_LANDING_CMS } from '@/types/pagesCms';
import { seoFromItem } from '@/lib/seoAdmin';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import industryBg from '../assets/industry-header.png';
import { IndustriesLandingHero } from '@/components/industries/IndustriesLandingHero';
import { IndustriesCapabilitiesSection } from '@/components/industries/IndustriesCapabilitiesSection';
import { IndustryCard } from '@/components/industries/IndustryCard';

function resolveLandingBackground(imageKeyOrUrl: string): string {
  const trimmed = imageKeyOrUrl.trim();
  if (!trimmed) return industryBg;
  if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return IMAGE_MAP[trimmed] || industryBg;
}

export const Industries = () => {
  const { data: pagesConfigApi } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const landing = mergePagesCmsConfig(pagesConfigApi).industriesLanding;
  const catalog = landing.catalog || DEFAULT_INDUSTRIES_LANDING_CMS.catalog;
  const bottomCta = landing.cta || DEFAULT_INDUSTRIES_LANDING_CMS.cta;

  const { data: apiIndustries, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['activeIndustries'],
    queryFn: () => getActiveIndustries(),
    retry: 2,
  });

  const industriesData = useMemo(() => {
    if (isSuccess && Array.isArray(apiIndustries)) {
      return apiIndustries
        .map((item: unknown) => decorateIndustry(item))
        .filter((item): item is Industry => item !== null);
    }
    return [];
  }, [apiIndustries, isSuccess]);

  const scrollToIndustries = () => {
    const el = document.getElementById('all-industries');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
      <main id="main-content" className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />

        <IndustriesLandingHero
          landing={landing}
          backgroundImage={resolveLandingBackground(landing.hero.backgroundImage || '')}
          onExplore={scrollToIndustries}
        />

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
                <h3 className="mb-1 text-lg font-bold text-red-900">Failed to load industries</h3>
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
            <section id="all-industries" className="bg-slate-50 py-16 md:py-24">
              <div className="container mx-auto max-w-7xl space-y-10 md:space-y-12 px-4 md:px-6">
                <div className="max-w-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Layers className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {catalog.eyebrow || DEFAULT_INDUSTRIES_LANDING_CMS.catalog.eyebrow}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    {catalog.title || DEFAULT_INDUSTRIES_LANDING_CMS.catalog.title}
                  </h2>
                  {catalog.subtitle?.trim() && (
                    <p className="text-sm font-bold text-emerald-600">{catalog.subtitle}</p>
                  )}
                  <p className="text-sm font-semibold text-slate-500">
                    {catalog.description || DEFAULT_INDUSTRIES_LANDING_CMS.catalog.description}
                  </p>
                </div>

                {industriesData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {industriesData.map((industry, index) => (
                      <IndustryCard
                        key={industry.id}
                        industry={industry}
                        index={index}
                        learnMoreLabel={
                          DEFAULT_INDUSTRIES_LANDING_CMS.catalog.learnMoreLabel
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-800">No industries available.</h3>
                    <p className="text-sm text-slate-500">
                      Check back soon for new industry solutions from TechVistar.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <IndustriesCapabilitiesSection landing={landing} industryCount={industriesData.length} />
          </>
        )}

        <section className="border-t border-slate-100 bg-slate-50 px-4 pb-16 pt-8 sm:px-6 md:pb-24">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-none overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-600 via-[#10B981] to-emerald-700 p-8 text-center text-white shadow-[0_20px_50px_rgba(16,185,129,0.15)] md:p-12"
            style={
              bottomCta.backgroundImage
                ? {
                    backgroundImage: `linear-gradient(rgba(5, 150, 105, 0.88), rgba(5, 150, 105, 0.92)), url(${bottomCta.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          >
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-300/20 blur-2xl" />

            <div className="pointer-events-none absolute inset-0 z-0 opacity-10" aria-hidden="true">
              <svg width="100%" height="100%">
                <pattern id="industries-landing-cta-mesh" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#industries-landing-cta-mesh)" />
              </svg>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex select-none items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="h-3 w-3 animate-pulse text-emerald-100" />
                <span>{bottomCta.badge || DEFAULT_INDUSTRIES_LANDING_CMS.cta.badge}</span>
              </div>

              <h2 className="mx-auto max-w-2xl font-display text-2xl font-black leading-tight tracking-tight text-white md:text-4xl">
                {bottomCta.title || DEFAULT_INDUSTRIES_LANDING_CMS.cta.title}
              </h2>

              <p className="mx-auto max-w-xl text-xs font-medium leading-relaxed text-emerald-50/90 md:text-sm">
                {bottomCta.description || DEFAULT_INDUSTRIES_LANDING_CMS.cta.description}
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    asChild
                    className="inline-flex h-11 items-center gap-2 rounded-xl border-none bg-white px-7 py-3 text-xs font-bold text-emerald-700 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] hover:bg-slate-50 hover:shadow-[0_12px_25px_-4px_rgba(0,0,0,0.2)] md:text-sm"
                  >
                    <Link to={bottomCta.buttonLink || DEFAULT_INDUSTRIES_LANDING_CMS.cta.buttonLink}>
                      {bottomCta.buttonText || DEFAULT_INDUSTRIES_LANDING_CMS.cta.buttonText}
                    </Link>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border-white/30 px-7 py-3 text-xs font-bold text-white transition-all hover:border-white hover:bg-white/10 md:text-sm"
                    asChild
                  >
                    <Link
                      to={
                        bottomCta.secondaryButtonLink ||
                        DEFAULT_INDUSTRIES_LANDING_CMS.cta.secondaryButtonLink
                      }
                    >
                      <MessageSquare className="h-4 w-4" />
                      {bottomCta.secondaryButtonText ||
                        DEFAULT_INDUSTRIES_LANDING_CMS.cta.secondaryButtonText}
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Industries;
