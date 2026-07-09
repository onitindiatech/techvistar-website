import { JsonLd } from '@/components/JsonLd';
import { PageSeo } from '@/components/common/PageSeo';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ServicesSection } from '@/components/ServicesSection';
import { TechStackSection } from '@/components/TechStackSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { DomeGallerySection } from '@/components/DomeGallerySection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { useHomeCms } from '@/contexts/HomeCmsContext';
import { buildCanonical } from '@/lib/seoResolve';
import { seoFromItem } from '@/lib/seoAdmin';
import { DEFAULT_HOME_CMS } from '@/types/homeCms';

const Index = () => {
  const { seo } = useHomeCms();

  return (
    <>
      <PageSeo
        defaults={{
          title: seo.seoTitle || DEFAULT_HOME_CMS.seo.seoTitle,
          description: seo.seoDescription || DEFAULT_HOME_CMS.seo.seoDescription,
          url: seo.canonicalUrl || buildCanonical('/'),
        }}
        seo={seoFromItem(seo as unknown as Record<string, unknown>)}
      />
      <JsonLd />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-background">
        <Navbar />
        <HeroSection showAnnouncementBar />

        <ServicesSection />
        <TechStackSection />
        <ProjectsSection />
        <BenefitsSection />
        <DomeGallerySection />

        <ContactSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
