import { JsonLd } from '@/components/JsonLd';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';

import { ServicesSection } from '@/components/ServicesSection';
import { TechStackSection } from '@/components/TechStackSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { DomeGallerySection } from '@/components/DomeGallerySection';
import { JoinTeamPreview } from '@/components/JoinTeamPreview';
import { FAQSection } from '@/components/faq';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <>
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
        <JoinTeamPreview />
        <FAQSection pageFilter="home" limit={4} showViewAll layout="split" />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
