import { JsonLd } from '@/components/JsonLd';
import { PageSeo } from '@/components/common/PageSeo';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { lazySection } from '@/components/common/LazySection';
import { ContactSection } from '@/components/ContactSection';
import { useHomeCms } from '@/contexts/HomeCmsContext';
import { buildCanonical } from '@/lib/seoResolve';
import { seoFromItem } from '@/lib/seoAdmin';
import { DEFAULT_HOME_CMS } from '@/types/homeCms';

const ServicesSection = lazySection(
  () => import('@/components/ServicesSection'),
  'ServicesSection',
);
const TechStackSection = lazySection(
  () => import('@/components/TechStackSection'),
  'TechStackSection',
);
const ProjectsSection = lazySection(
  () => import('@/components/ProjectsSection'),
  'ProjectsSection',
);
const BenefitsSection = lazySection(
  () => import('@/components/BenefitsSection'),
  'BenefitsSection',
);
const DomeGallerySection = lazySection(
  () => import('@/components/DomeGallerySection'),
  'DomeGallerySection',
);

const Index = () => {
  const { seo } = useHomeCms();

  return (
    <>
      <PageSeo
        defaults={{
          title: seo.seoTitle || DEFAULT_HOME_CMS.seo.seoTitle,
          description: seo.seoDescription || DEFAULT_HOME_CMS.seo.seoDescription,
          url: buildCanonical('/'),
        }}
        seo={seoFromItem(seo as unknown as Record<string, unknown>)}
      />
      <JsonLd />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />

        <ServicesSection minHeight="320px" />
        <TechStackSection minHeight="280px" />
        <ProjectsSection minHeight="480px" />
        <BenefitsSection minHeight="360px" />
        <DomeGallerySection minHeight="520px" />

        {/* Eager mount so hero "Get in touch" can resolve #contact immediately */}
        <ContactSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
