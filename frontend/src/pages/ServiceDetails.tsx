import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServiceBySlug } from '@/services/services.service';
import { getServicesCmsConfig } from '@/services/servicesCmsConfig.service';
import { decorateService } from '@/data/services';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import { getServiceCardImage } from '@/data/services';
import { mergeServicesCmsConfig } from '@/types/servicesCms';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceSectionNavigation } from '@/components/services/ServiceSectionNavigation';
import { OverviewSection } from '@/components/services/OverviewSection';
import { SolutionsSection } from '@/components/services/SolutionsSection';
import { BenefitsSection } from '@/components/services/BenefitsSection';
import { ProcessSection } from '@/components/services/ProcessSection';
import { TechnologySection } from '@/components/services/TechnologySection';
import { FAQSection } from '@/components/services/FAQSection';
import { ServiceSidebar } from '@/components/services/ServiceSidebar';
import { CTASection } from '@/components/services/CTASection';
import { RelatedServicesSection } from '@/components/services/RelatedServicesSection';

const ServiceDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: apiService, isLoading } = useQuery({
    queryKey: ['serviceDetails', slug],
    queryFn: () => getServiceBySlug(slug || ''),
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { data: cmsConfigApi } = useQuery({
    queryKey: ['servicesCmsConfig'],
    queryFn: getServicesCmsConfig,
    staleTime: 60_000,
  });

  const cmsConfig = mergeServicesCmsConfig(cmsConfigApi);
  const service = apiService ? decorateService(apiService) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service?.slug]);

  const seoBlock = (
    <PageSeo
      seo={service}
      defaults={{
        title: service ? `${service.title} | TechVistar Services` : 'Service Not Found | TechVistar',
        description: service?.shortDescription || '',
        image: service ? getServiceCardImage(service) : undefined,
        url: service ? buildCanonical(`/services/${service.slug}`) : buildCanonical('/services'),
      }}
    />
  );

  if (isLoading) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
          <div className="font-display text-slate-500">Loading service details...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!service) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 pt-20">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
            <h1 className="mb-3 font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Service Not Found
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-slate-600">
              We couldn&apos;t find the service you were looking for. It may have been moved or renamed.
            </p>
            <Button asChild className="w-full bg-primary text-white hover:bg-primary/95">
              <Link to="/services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Link>
            </Button>
          </div>
          <Footer />
        </main>
      </>
    );
  }

  const showFaq = (service.faqs?.length ?? 0) > 0;
  const showBenefits =
    (service.benefits?.length ?? 0) > 0 || (service.whyChooseUs?.length ?? 0) > 0;

  return (
    <>
      {seoBlock}
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-0">
        <ServiceHero service={service} />
        <ServiceSectionNavigation showFaq={showFaq} showBenefits={showBenefits} />

        <section className="container mx-auto max-w-6xl px-4 pb-16 pt-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <OverviewSection service={service} />
              <SolutionsSection service={service} />
              <BenefitsSection service={service} />
              <ProcessSection service={service} />
              <TechnologySection service={service} />
              {showFaq && <FAQSection service={service} />}
            </div>

            <div className="space-y-6">
              <ServiceSidebar service={service} cmsConfig={cmsConfig} />
            </div>
          </div>

          <div className="mt-16">
            <RelatedServicesSection service={service} />
          </div>

          <div className="mt-16">
            <CTASection service={service} cmsConfig={cmsConfig} />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default ServiceDetails;
