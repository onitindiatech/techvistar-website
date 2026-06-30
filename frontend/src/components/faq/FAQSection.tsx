import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FAQs } from '@/data';
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
}: FAQSectionProps) => {
  const { ref, isInView } = useAnimatedSection();

  const filteredFAQs = useMemo(() => {
    let items = [...FAQs];

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
  }, [pageFilter, categoryFilter, featuredOnly, limit]);

  if (filteredFAQs.length === 0) return null;

  return (
    <SiteSection ref={ref} id="faq-section" variant="muted" className="py-20 border-t border-slate-100 relative">
      <div className="container-custom relative z-10">
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
      </div>
    </SiteSection>
  );
};
export default FAQSection;
