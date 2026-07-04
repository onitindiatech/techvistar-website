import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteSection } from '@/components/SiteSection';
import { Button } from '@/components/ui/button';
import DomeGallery from '@/components/ui/DomeGallery';
import { Check, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';

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
  const { ref, isInView } = useAnimatedSection();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (activeIdx !== null) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [activeIdx]);

  // Keyboard navigation and escape key closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      
      if (e.key === 'Escape') {
        setActiveIdx(null);
      } else if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev === null ? null : (prev + 1) % WHATSAPP_CHAT_IMAGES.length));
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev === null ? null : (prev - 1 + WHATSAPP_CHAT_IMAGES.length) % WHATSAPP_CHAT_IMAGES.length));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx]);

  return (
    <SiteSection 
      ref={ref} 
      id="dome-gallery-section" 
      className="relative overflow-hidden bg-white border-y border-slate-100/80 !pt-16 !pb-16 md:!pt-24 md:!pb-24"
    >
      {/* Light Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(226, 232, 240, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(circle at 65% 50%, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 65% 50%, black 25%, transparent 75%)',
        }}
      />

      {/* Light green blurred glow and soft gradients */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-emerald-500/[0.025] rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/[0.015] rounded-full blur-[70px] pointer-events-none" />

      {/* Floating particles - subtle CSS animated dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[45%] w-1.5 h-1.5 rounded-full bg-emerald-400/20 animate-pulse" />
        <div className="absolute bottom-[25%] left-[12%] w-1 h-1 rounded-full bg-emerald-300/30" />
        <div className="absolute top-[40%] right-[5%] w-2 h-2 rounded-full bg-teal-400/10 animate-ping [animation-duration:4s]" />
        <div className="absolute bottom-[15%] right-[42%] w-1.5 h-1.5 rounded-full bg-emerald-400/25" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT SIDE (40%) */}
          <motion.div 
            className="lg:col-span-5 space-y-6 md:space-y-7"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-emerald-700">
                Project Demo
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-black text-slate-900 leading-[1.12] tracking-tight">
              Explore Our Projects <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                In An Immersive 3D Experience
              </span>
            </h2>

            {/* Description */}
            <p className="text-slate-500 text-sm sm:text-[0.95rem] leading-relaxed max-w-xl">
              Showcase our latest work through an interactive 3D project globe. Drag, rotate, and explore real projects with smooth animations.
            </p>

            {/* Feature Points */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                'Interactive 3D Experience',
                'Click Any Project',
                'Live Case Studies',
                'Real Business Solutions'
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-2.5 text-slate-700 font-medium text-[0.85rem] sm:text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-3">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl px-6 py-5 shadow-lg shadow-emerald-500/10 transition-all duration-300">
                <Link to="/work">
                  Explore Portfolio <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-200 hover:border-emerald-500/30 hover:bg-emerald-50/20 text-slate-700 font-semibold rounded-xl px-6 py-5 transition-all duration-300">
                <Link to="/work">
                  View Case Studies
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* RIGHT SIDE (60%) */}
          <motion.div 
            className="lg:col-span-7 w-full flex justify-center lg:justify-end items-center relative h-[380px] sm:h-[460px] md:h-[500px]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Wrapper slightly shifted right on desktop, with the auto-rotating interactive DomeGallery */}
            <div className="w-full h-full max-w-[550px] lg:translate-x-8 relative">
              <DomeGallery
                images={WHATSAPP_CHAT_IMAGES}
                overlayBlurColor="#ffffff" // Overlay blur color matches white background of section
                grayscale={false}
                fit={0.42} // Scaled down fit to make it 20-25% smaller
                minRadius={380} // Smaller minimum radius for the container
                maxRadius={500}
                imageBorderRadius="16px"
                openedImageBorderRadius="20px"
                openedImageWidth="380px"
                openedImageHeight="285px"
                dragSensitivity={18}
                segments={35}
                onImageClick={(index) => setActiveIdx(index)}
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Lightbox / Gallery Modal */}
      <AnimatePresence>
        {activeIdx !== null && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop with dark blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md cursor-pointer"
              onClick={() => setActiveIdx(null)}
            />

            {/* Modal Image Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl flex flex-col items-center pointer-events-none"
            >
              {/* Header Details with Image Count & Close Button */}
              <div className="w-full flex justify-between items-center px-4 py-2 text-white pointer-events-auto select-none max-w-3xl mb-2">
                {/* Counter */}
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10 text-xs font-semibold uppercase tracking-wider">
                  {activeIdx + 1} / {WHATSAPP_CHAT_IMAGES.length}
                </div>
                
                {/* Close Button */}
                <button 
                  onClick={() => setActiveIdx(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/25 transition-all text-white/80 hover:text-white cursor-pointer shadow-lg"
                  aria-label="Close Gallery"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Image Viewport & Navigation Buttons */}
              <div className="relative flex items-center justify-center w-full max-w-3xl pointer-events-auto">
                
                {/* Previous Button (Desktop/Tablet) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx((prev) => (prev === null ? null : (prev - 1 + WHATSAPP_CHAT_IMAGES.length) % WHATSAPP_CHAT_IMAGES.length));
                  }}
                  className="absolute left-[-60px] hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl"
                  aria-label="Previous Project"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Main Image Holder */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-[0_24px_50px_rgba(0,0,0,0.5)] aspect-[4/3] w-full max-h-[65vh] flex items-center justify-center select-none">
                  <motion.img 
                    key={activeIdx}
                    src={WHATSAPP_CHAT_IMAGES[activeIdx].src}
                    alt={WHATSAPP_CHAT_IMAGES[activeIdx].alt}
                    className="w-full h-full object-contain pointer-events-none"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                  />

                  {/* Navigation Overlays for Mobile/Tablet */}
                  <div className="absolute inset-y-0 left-0 w-1/4 flex items-center justify-start pl-3 md:hidden pointer-events-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIdx((prev) => (prev === null ? null : (prev - 1 + WHATSAPP_CHAT_IMAGES.length) % WHATSAPP_CHAT_IMAGES.length));
                      }}
                      className="w-9.5 h-9.5 rounded-full bg-black/45 border border-white/15 flex items-center justify-center text-white pointer-events-auto cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-end pr-3 md:hidden pointer-events-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIdx((prev) => (prev === null ? null : (prev + 1) % WHATSAPP_CHAT_IMAGES.length));
                      }}
                      className="w-9.5 h-9.5 rounded-full bg-black/45 border border-white/15 flex items-center justify-center text-white pointer-events-auto cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Next Button (Desktop/Tablet) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx((prev) => (prev === null ? null : (prev + 1) % WHATSAPP_CHAT_IMAGES.length));
                  }}
                  className="absolute right-[-60px] hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl"
                  aria-label="Next Project"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Caption Description Text */}
              <div className="w-full max-w-3xl text-center text-white/95 mt-4 px-4 font-sans text-sm sm:text-base font-semibold drop-shadow-md select-text pointer-events-auto">
                {WHATSAPP_CHAT_IMAGES[activeIdx].alt}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SiteSection>
  );
};
