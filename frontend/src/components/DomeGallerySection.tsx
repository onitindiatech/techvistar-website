import DomeGallery from '@/components/ui/DomeGallery';
import { SiteSection } from '@/components/SiteSection';

// Import all project work images for the dome gallery
import cropHealth from '@/assets/crop_health_analysis.png';
import aiTranslator from '@/assets/ai_translator.png';
import aiTranslatorBatches from '@/assets/ai_translator_batches.png';
import clinicalRisk from '@/assets/clinical_risk_scoring.png';
import resumeReview from '@/assets/resume_review_assistant.png';
import sentimentNlp from '@/assets/sentiment_nlp_dashboard.png';
import sustainability from '@/assets/sustainability_dashboard.png';
import mobilityRouting from '@/assets/mobility_routing_dashboard.png';
import portfolioMockup from '@/assets/portfolio_laptop_mockup.jpg';

const WHATSAPP_CHAT_IMAGES = [
  { src: cropHealth, alt: 'Crop Health Analysis Dashboard' },
  { src: aiTranslator, alt: 'AI Translator Application' },
  { src: aiTranslatorBatches, alt: 'AI Translator Batch Processing' },
  { src: clinicalRisk, alt: 'Clinical Risk Scoring System' },
  { src: resumeReview, alt: 'Resume Review Assistant' },
  { src: sentimentNlp, alt: 'Sentiment NLP Dashboard' },
  { src: sustainability, alt: 'Sustainability Dashboard' },
  { src: mobilityRouting, alt: 'Mobility Routing Dashboard' },
  { src: portfolioMockup, alt: 'Portfolio Showcase' },
];

export const DomeGallerySection = () => {
  return (
    <SiteSection id="dome-gallery-section" className="!p-0 relative overflow-hidden h-screen flex flex-col">
      {/* Section header above the dome */}
      <div className="text-center pt-10 pb-4 shrink-0">
        <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-emerald-600 mb-3 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
          Our Work
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
          Project <span className="text-emerald-500">Showcase</span>
        </h2>
        <p className="text-slate-500 text-sm md:text-base mt-2 max-w-md mx-auto px-4">
          Drag to explore our portfolio in an immersive 3D dome. Click any tile to expand.
        </p>
      </div>

      {/* DomeGallery Container — fills remaining screen height */}
      <div className="flex-1 w-full min-h-0">
        <DomeGallery
          images={WHATSAPP_CHAT_IMAGES}
          overlayBlurColor="#f8fafc"
          grayscale={false}
          fit={0.55}
          minRadius={500}
          imageBorderRadius="16px"
          openedImageBorderRadius="20px"
          openedImageWidth="400px"
          openedImageHeight="300px"
          dragSensitivity={18}
          segments={35}
        />
      </div>
    </SiteSection>
  );
};
