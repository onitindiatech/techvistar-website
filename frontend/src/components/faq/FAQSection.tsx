import React, { useMemo } from 'react';
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
  description = "Find quick answers to common questions about our team, delivery pipelines, and engineering standards.",
  showViewAll = false,
  layout = "centered",
}: FAQSectionProps) => {
  const { ref, isInView } = useAnimatedSection();

  // ── Data source: API with static fallback ──────────────────────────────────
  const { data: apiFAQs } = useQuery({
    queryKey: ['faqs'],
    queryFn:  getActiveFAQs,
    staleTime: 5 * 60 * 1000,
  });

  // Map API response to the component-expected shape, or fall back to static data
  const allFAQs = useMemo(() => {
    if (!apiFAQs || apiFAQs.length === 0) return [...STATIC_FAQS];
    return apiFAQs.map((f: any) => ({
      id:       f.faqId,
      question: f.question,
      answer:   f.answer,
      category: f.category,
      page:     f.page,
      tags:     f.tags ?? [],
      featured: f.featured ?? false,
    }));
  }, [apiFAQs]);

  const filteredFAQs = useMemo(() => {
    let items = allFAQs;

    if (featuredOnly) {
      items = items.filter((faq) => faq.featured);
    }
    if (pageFilter && pageFilter !== 'all') {
      items = items.filter((faq) => faq.page === pageFilter);
    }
    if (categoryFilter) {
      items = items.filter((faq) => faq.category === categoryFilter);
    }
    if (limit) {
      items = items.slice(0, limit);
    }

    return items;
  }, [allFAQs, pageFilter, categoryFilter, featuredOnly, limit]);

  if (filteredFAQs.length === 0) return null;

  return (
    <SiteSection ref={ref} id="faq-section" variant="muted" className="py-20 border-t border-slate-100 relative">
      <div className="container-custom relative z-10">
        {layout === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5 flex flex-col justify-start text-left">
              <div className="mb-4 flex flex-col items-start gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  FAQ
                </span>
                <span className="h-0.5 w-12 rounded-full bg-primary" aria-hidden />
              </div>
              <h2 className="mb-5 font-display text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl lg:text-[2.75rem] text-slate-950">
                {title} <span className="gradient-text">{highlight}</span>
              </h2>
              <p className="text-sm md:text-base leading-relaxed font-semibold text-slate-500">
                {description}
              </p>
            </div>

            <div className="lg:col-span-7">
              <FAQAccordion faqs={filteredFAQs} />

              {showViewAll && (
                <div className="text-center mt-10">
                  <Button asChild variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl h-11 px-6 font-bold group">
                    <Link to="/faq" className="inline-flex items-center gap-2">
                      View All FAQs
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
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
              <FAQAccordion faqs={filteredFAQs} />

              {showViewAll && (
                <div className="text-center mt-10">
                  <Button asChild variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl h-11 px-6 font-bold group">
                    <Link to="/faq" className="inline-flex items-center gap-2">
                      View All FAQs
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
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
