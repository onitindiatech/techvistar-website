import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getIndustryBySlug } from '@/services/industry.service';
import { decorateIndustry } from '@/data/industry.adapter';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical, seoFromApi } from '@/lib/seoResolve';
import { getIndustryHeroImage } from '@/data/industry.adapter';
import { IndustryHero } from '@/components/industries/IndustryHero';
import { IndustrySectionNavigation } from '@/components/industries/IndustrySectionNavigation';
import { IndustryOverviewSection } from '@/components/industries/IndustryOverviewSection';
import { IndustryOfferingsSection } from '@/components/industries/IndustryOfferingsSection';
import { IndustryProcessSection } from '@/components/industries/IndustryProcessSection';
import { IndustryTechnologySection } from '@/components/industries/IndustryTechnologySection';
import { IndustrySidebar } from '@/components/industries/IndustrySidebar';
import { IndustryCTASection } from '@/components/industries/IndustryCTASection';
import { RelatedIndustriesSection } from '@/components/industries/RelatedIndustriesSection';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';

export const IndustryDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: pagesConfigApi } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });
  const industriesLanding = mergePagesCmsConfig(pagesConfigApi).industriesLanding;

  const { data: apiIndustry, isLoading } = useQuery({
    queryKey: ['industryDetails', slug],
    queryFn: () => getIndustryBySlug(slug || ''),
    enabled: !!slug,
  });

  const industry = apiIndustry ? decorateIndustry(apiIndustry) : undefined;
  const industrySeo = apiIndustry ? seoFromApi(apiIndustry as Record<string, unknown>) : undefined;

  const seoBlock = (
    <PageSeo
      seo={industrySeo}
      defaults={{
        title: industry?.seoTitle || (industry ? `${industry.title} Industry Solutions | TechVistar` : 'Industry Not Found | TechVistar'),
        description: industry?.seoDescription || industry?.shortDescription || industry?.description || '',
        image: industry ? getIndustryHeroImage(industry) : undefined,
        url: industry ? buildCanonical(`/industries/${industry.slug}`) : buildCanonical('/industries'),
      }}
    />
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [industry?.slug]);

  if (isLoading) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
          <div className="font-display text-slate-500">Loading industry details...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!industry) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 pt-20">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
            <h1 className="mb-3 font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Industry Not Found
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-slate-600">
              We couldn&apos;t find the industry sector you were looking for. It may have been moved or updated.
            </p>
            <Button asChild className="w-full bg-primary text-white hover:bg-primary/95">
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

  const hasOfferings =
    (industry.detailedOfferings && industry.detailedOfferings.length > 0) ||
    industry.solutions.length > 0 ||
    industry.challenges.length > 0 ||
    (industry.offerings?.length ?? 0) > 0;
  const hasProcess = (industry.process?.length ?? 0) > 0;
  const hasTechnology = industry.technologies.length > 0;

  return (
    <>
      {seoBlock}
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-0">
        <IndustryHero industry={industry} />
        <IndustrySectionNavigation />

        <section className="mx-auto mt-8 w-full max-w-none px-4 pb-16 md:px-6 lg:px-12 xl:px-20 detail-page-gutter">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <IndustryOverviewSection industry={industry} />
              {hasOfferings && <IndustryOfferingsSection industry={industry} />}
              {hasProcess && <IndustryProcessSection industry={industry} />}
              {hasTechnology && <IndustryTechnologySection industry={industry} />}
            </div>

            <div className="space-y-6">
              <IndustrySidebar industry={industry} landingCms={industriesLanding} />
            </div>
          </div>

          <div className="mt-16 space-y-16">
            <IndustryCTASection industry={industry} />
            <RelatedIndustriesSection industry={industry} />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default IndustryDetails;
