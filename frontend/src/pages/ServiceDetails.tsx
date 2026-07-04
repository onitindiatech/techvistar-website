import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServiceBySlug } from '@/services/services.service';
import { decorateService } from '@/data/services';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';

// Subcomponents
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceSectionNavigation } from '@/components/services/ServiceSectionNavigation';
import { OverviewSection } from '@/components/services/OverviewSection';
import { SolutionsSection } from '@/components/services/SolutionsSection';
import { ProcessSection } from '@/components/services/ProcessSection';
import { TechnologySection } from '@/components/services/TechnologySection';
import { IndustriesSection } from '@/components/services/IndustriesSection';
import { CaseStudiesSection } from '@/components/services/CaseStudiesSection';
import { WhyChooseUsSection } from '@/components/services/WhyChooseUsSection';
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
  });

  // Find current service
  const service = apiService ? decorateService(apiService) : undefined;

  // Set document title and scroll to top
  useEffect(() => {
    if (service) {
      document.title = `${service.title} | TechVistar Services`;
    } else {
      document.title = 'Service Not Found | TechVistar';
    }
    window.scrollTo(0, 0);
  }, [service]);

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-0">
        
        {/* Hero Section */}
        <ServiceHero service={service} />

        <Breadcrumb />

        {/* Sticky Sub-Navbar */}
        <ServiceSectionNavigation />

        {/* Dynamic Detail Modules Content Area */}
        <section className="container mx-auto px-4 max-w-6xl mt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Main Column for Detail Blocks */}
            <div className="lg:col-span-2 space-y-8">
              <OverviewSection service={service} />
              <SolutionsSection service={service} />
              <ProcessSection service={service} />
              <TechnologySection service={service} />
              <IndustriesSection service={service} />
              <CaseStudiesSection service={service} />
              <WhyChooseUsSection service={service} />
              <FAQSection service={service} />
            </div>

            {/* Right Column Sidebar */}
            <div className="space-y-6">
              <ServiceSidebar />
            </div>

          </div>

          {/* Bottom Conversion Section */}
          <div className="mt-16">
            <CTASection service={service} />
          </div>

          {/* Related Services Section */}
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
