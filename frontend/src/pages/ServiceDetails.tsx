import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServiceBySlug } from '@/services/services.service';
import { getServicesCmsConfig } from '@/services/servicesCmsConfig.service';
import { decorateService } from '@/data/services';
import { usePageSeo } from '@/hooks/usePageSeo';
import { mergeServicesCmsConfig } from '@/types/servicesCms';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceSectionNavigation } from '@/components/services/ServiceSectionNavigation';
import { OverviewSection } from '@/components/services/OverviewSection';
import { SolutionsSection } from '@/components/services/SolutionsSection';
import { ProcessSection } from '@/components/services/ProcessSection';
import { TechnologySection } from '@/components/services/TechnologySection';
import { IndustriesSection } from '@/components/services/IndustriesSection';
import { CaseStudiesSection } from '@/components/services/CaseStudiesSection';
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

  usePageSeo({
    title: service?.seoTitle || (service ? `${service.title} | TechVistar Services` : undefined),
    description: service?.seoDescription || service?.shortDescription,
    fallbackTitle: 'Service Not Found | TechVistar',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service?.slug]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
          <div className="text-slate-500 font-display">Loading service details...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 pt-20">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm text-center">
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight mb-3">
              Service Not Found
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              We couldn't find the service you were looking for. It may have been moved or renamed.
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-0">
        <ServiceHero service={service} />
        <ServiceSectionNavigation showFaq={showFaq} />

        <section className="container mx-auto px-4 max-w-6xl mt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <OverviewSection service={service} />
              <SolutionsSection service={service} />
              <ProcessSection service={service} />
              <TechnologySection service={service} />
              <IndustriesSection service={service} />
              <CaseStudiesSection service={service} />
              {showFaq && <FAQSection service={service} />}
            </div>

            <div className="space-y-6">
              <ServiceSidebar service={service} cmsConfig={cmsConfig} />
            </div>
          </div>

          <div className="mt-16">
            <CTASection service={service} cmsConfig={cmsConfig} />
          </div>

          <div className="mt-16">
            <RelatedServicesSection service={service} />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default ServiceDetails;
