import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { FAQs as STATIC_FAQS } from '@/data';
import { getActiveFAQs } from '@/services/faq.service';
import { FAQAccordion } from './FAQAccordion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SiteSection } from '@/components/SiteSection';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { Button } from '@/components/ui/button';

interface FAQSectionProps {
  pageFilter?: 'home' | 'services' | 'work' | 'careers' | 'contact' | 'all';
  categoryFilter?: 'General' | 'Services' | 'Work' | 'Careers' | 'Contact' | 'AI' | 'Backend' | 'Frontend';
  featuredOnly?: boolean;
  limit?: number;
  title?: string;
  highlight?: string;
  description?: string;
  showViewAll?: boolean;
  layout?: 'centered' | 'split';
}

export const FAQSection = ({
  pageFilter,
  categoryFilter,
  featuredOnly = false,
  limit,
  title = "Frequently Asked Questions",
  highlight = "FAQ",
  description = "Here are some common questions about working with TechVistar. Can't find what you're looking for? Let's talk.",
  showViewAll = false,
  layout = "centered",
}: FAQSectionProps) => {
  const { ref, isInView } = useAnimatedSection();
  const [isExpanded, setIsExpanded] = useState(false);

  // ── Data source: API with static fallback ──────────────────────────────────
  const { data: apiFAQs, isSuccess } = useQuery({
    queryKey: ['faqs'],
    queryFn:  getActiveFAQs,
    staleTime: 5 * 60 * 1000,
  });

  // Prefer API data once loaded; static seed data only before the first successful fetch.
  const allFAQs = useMemo(() => {
    if (isSuccess) {
      return (apiFAQs ?? []).map((f: any) => ({
        id:       f.faqId,
        question: f.question,
        answer:   f.answer,
        category: f.category,
        page:     f.page,
        tags:     f.tags ?? [],
        featured: f.featured ?? false,
      }));
    }
    return [...STATIC_FAQS];
  }, [apiFAQs, isSuccess]);

  const filteredFAQs = useMemo(() => {
    let items = allFAQs;

    if (featuredOnly) {
      items = items.filter((faq) => faq.featured);
    }
    if (pageFilter && pageFilter !== 'all') {
      items = items.filter((faq) => faq.page === pageFilter || faq.page === 'all');
    }
    if (categoryFilter) {
      items = items.filter((faq) => faq.category === categoryFilter);
    }

    return [...items].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [allFAQs, pageFilter, categoryFilter, featuredOnly]);

  const displayedFAQs = useMemo(() => {
    if (limit && !isExpanded) {
      return filteredFAQs.slice(0, limit);
    }
    return filteredFAQs;
  }, [filteredFAQs, limit, isExpanded]);

  if (filteredFAQs.length === 0) return null;

  return (
    <SiteSection ref={ref} id="faq-section" variant="muted" className="!pt-6 !pb-6 md:!pt-8 md:!pb-8 border-t border-slate-100 relative">
      <div className="container-custom relative z-10">
        {layout === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5 flex flex-col justify-start text-left">
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  FAQs
                </span>
              </div>
              <h2 className="mb-4 font-display text-2xl font-extrabold leading-[1.15] tracking-tight md:text-4xl lg:text-[2.65rem] text-slate-950">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base leading-relaxed font-semibold text-slate-500 mb-6 max-w-md">
                {description}
              </p>

              {/* 3D FAQ Illustration */}
              <div className="relative w-full max-w-[280px] h-[220px] mx-auto lg:mx-0 mt-2 pointer-events-none select-none flex items-center justify-center">
                {/* Orbit lines background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full opacity-60" viewBox="0 0 280 220" fill="none">
                    <path d="M30,150 C60,190 220,190 250,150" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.5" strokeDasharray="4,4" />
                    <path d="M15,110 C30,70 250,70 265,110" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.5" strokeDasharray="4,4" />
                  </svg>
                </div>

                {/* Orbiting spheres */}
                <div className="absolute top-[30%] left-[8%] w-3 h-3 bg-emerald-400 rounded-full blur-[0.5px] animate-bounce" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[20%] left-[28%] w-2 h-2 bg-emerald-500 rounded-full blur-[0.2px] animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute top-[60%] right-[4%] w-2.5 h-2.5 bg-emerald-400 rounded-full blur-[0.3px]" />
                <div className="absolute top-[18%] right-[28%] w-2.5 h-2.5 bg-emerald-500 rounded-full blur-[0.4px] animate-pulse" />

                {/* 3D Podium / Disc */}
                <div className="absolute bottom-[15%] w-[160px] h-[48px] bg-slate-200/60 rounded-full shadow-[0_12px_24px_rgba(15,23,42,0.12)] border-b-4 border-slate-300/80 flex items-center justify-center">
                  <div className="w-[140px] h-[34px] bg-emerald-50 rounded-full border border-emerald-100" />
                </div>

                {/* Floating 3D Question Mark (Positioned absolutely above the podium so it is never cut off) */}
                <div className="absolute bottom-[24%] text-primary text-[4.5rem] font-black leading-none drop-shadow-[0_10px_15px_rgba(16,185,129,0.25)] animate-bounce select-none z-20" style={{ animationDuration: '6s' }}>
                  ?
                </div>

                {/* Left speech bubble */}
                <div className="absolute top-[10%] left-0 bg-slate-100/90 border border-slate-200/60 rounded-2xl px-3 py-2 shadow-[0_8px_20px_rgba(15,23,42,0.06)] backdrop-blur-md flex flex-col items-start max-w-[140px] animate-pulse" style={{ animationDuration: '8s' }}>
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">Got a question?</span>
                  <span className="text-[8px] font-semibold text-slate-500 mt-0.5 leading-none">We're here to help!</span>
                  {/* Speech bubble arrow */}
                  <div className="absolute -bottom-1.5 left-5 w-2.5 h-2.5 bg-slate-100 border-r border-b border-slate-200/60 transform rotate-45" />
                </div>

                {/* Right green speech bubble */}
                <div className="absolute top-[28%] right-[10%] bg-emerald-500 text-white rounded-2xl px-3 py-2 shadow-[0_8px_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-1 transform hover:scale-105 transition-transform duration-300">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                  {/* Speech bubble arrow */}
                  <div className="absolute -bottom-1 left-4 w-2 h-2 bg-emerald-500 transform rotate-45" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <FAQAccordion faqs={displayedFAQs} />

              {showViewAll && filteredFAQs.length > (limit || 0) && !isExpanded && (
                <div className="text-center mt-6">
                  <Button onClick={() => setIsExpanded(true)} variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl h-11 px-6 font-bold group">
                    <span className="inline-flex items-center gap-2">
                      View More FAQs
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Button>
                </div>
              )}
              {isExpanded && !!limit && filteredFAQs.length > limit && (
                <div className="text-center mt-6">
                  <Button onClick={() => setIsExpanded(false)} variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl h-11 px-6 font-bold group">
                    <span className="inline-flex items-center gap-2">
                      Show Less FAQs
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <SectionHeader
              tag="FAQ"
              title={title}
              highlight={highlight}
              description={description}
              isInView={isInView}
            />

            <div className="mx-auto max-w-3xl mt-10">
              <FAQAccordion faqs={displayedFAQs} />

              {showViewAll && filteredFAQs.length > (limit || 0) && !isExpanded && (
                <div className="text-center mt-6">
                  <Button onClick={() => setIsExpanded(true)} variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl h-11 px-6 font-bold group">
                    <span className="inline-flex items-center gap-2">
                      View More FAQs
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Button>
                </div>
              )}
              {isExpanded && !!limit && filteredFAQs.length > limit && (
                <div className="text-center mt-6">
                  <Button onClick={() => setIsExpanded(false)} variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl h-11 px-6 font-bold group">
                    <span className="inline-flex items-center gap-2">
                      Show Less FAQs
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </SiteSection>
  );
};
export default FAQSection;
