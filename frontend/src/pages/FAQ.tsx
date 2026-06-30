import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import { FAQs } from '@/data';
import { FAQSearch, FAQCategoryTabs, FAQAccordion } from '@/components/faq';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const FAQ = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Compute list of categories dynamically
  const categories = useMemo(() => {
    const list = new Set(FAQs.map((faq) => faq.category));
    return ['All', ...Array.from(list)];
  }, []);

  // Compute counts for each category
  const counts = useMemo(() => {
    const countsMap: Record<string, number> = { All: FAQs.length };
    FAQs.forEach((faq) => {
      countsMap[faq.category] = (countsMap[faq.category] || 0) + 1;
    });
    return countsMap;
  }, []);

  // Filter FAQs based on search query and selected category
  const filteredFAQs = useMemo(() => {
    return FAQs.filter((faq) => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      const matchesSearch =
        query === '' ||
        faq.question.toLowerCase().includes(query.toLowerCase()) ||
        faq.answer.toLowerCase().includes(query.toLowerCase()) ||
        faq.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [query, activeCategory]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Background glow blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.03] blur-[120px] -z-10" />
        <div className="pointer-events-none absolute bottom-10 right-1/4 h-[500px] w-[500px] rounded-full bg-teal-500/[0.02] blur-[120px] -z-10" />

        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/15 font-bold mb-3 uppercase tracking-wider">
              Answers & Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 font-display tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-semibold">
              Have questions about our deployment pipelines, design specs, security rules, or partnership plans? Find answers here.
            </p>
          </div>
        </section>

        <Breadcrumb />

        {/* Content Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Search Input */}
            <div className="mb-8">
              <FAQSearch query={query} setQuery={setQuery} />
            </div>

            {/* Category selection tabs */}
            <FAQCategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              counts={counts}
            />

            {/* Accordions */}
            <div className="bg-white/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm mt-8">
              <FAQAccordion faqs={filteredFAQs} />
            </div>

            {/* Bottom contact redirection CTA card */}
            <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.02] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-left">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-slate-900 text-base sm:text-lg">Still have questions?</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">Our support leads respond within 1 business day.</p>
                </div>
              </div>
              <Button asChild variant="hero" className="rounded-xl h-11 px-6 font-bold group shrink-0">
                <Link to="/#contact" className="inline-flex items-center gap-2">
                  Get in Touch
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default FAQ;
