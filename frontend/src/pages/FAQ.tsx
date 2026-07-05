import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import { FAQs as STATIC_FAQS } from '@/data';
import { FAQSearch, FAQCategoryTabs, FAQAccordion } from '@/components/faq';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getActiveFAQs } from '@/services/faq.service';

// Import the generated 3D FAQ hero illustration
import faqHeroIllustration from '@/assets/faq_hero_illustration.png';

export const FAQ = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // ── Data source: API with static fallback ─────────────────────────────────
  const { data: apiFAQs } = useQuery({
    queryKey: ['faqs'],
    queryFn:  getActiveFAQs,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Map MongoDB documents to the FAQ shape expected by the child components.
  // faqId (backend) maps to id (frontend); all other fields are identical.
  const FAQs = useMemo(() => {
    if (!apiFAQs || apiFAQs.length === 0) return STATIC_FAQS;
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

  // Compute list of categories dynamically
  const categories = useMemo(() => {
    const list = new Set(FAQs.map((faq) => faq.category));
    return ['All', ...Array.from(list)];
  }, [FAQs]);

  // Compute counts for each category
  const counts = useMemo(() => {
    const countsMap: Record<string, number> = { All: FAQs.length };
    FAQs.forEach((faq) => {
      countsMap[faq.category] = (countsMap[faq.category] || 0) + 1;
    });
    return countsMap;
  }, [FAQs]);

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
  }, [query, activeCategory, FAQs]);

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
        <section className="pt-32 pb-16 bg-white border-b border-slate-200 relative overflow-hidden select-none">
          {/* Subtle background gradients inside hero */}
          <div className="pointer-events-none absolute top-[-50px] right-[-50px] w-96 h-96 bg-emerald-500/[0.02] rounded-full blur-[90px]" />
          <div className="pointer-events-none absolute bottom-0 left-10 w-80 h-80 bg-teal-500/[0.015] rounded-full blur-[80px]" />

          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              
              {/* Left Column: Title Copy & Search Bar */}
              <div className="md:col-span-7 text-left space-y-5">
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200/40 px-3.5 py-1.5 font-bold uppercase tracking-wider text-xs">
                  Answers & Resources
                </Badge>
                
                <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black text-slate-900 font-display tracking-tight leading-[1.1]">
                  Frequently Asked <br /> Questions
                </h1>
                
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-semibold max-w-xl">
                  Have questions about our deployment pipelines, design specs, security rules, or partnership plans? Find answers here.
                </p>

                {/* Relocated Search input here for direct interactive support */}
                <div className="pt-3 max-w-md">
                  <FAQSearch query={query} setQuery={setQuery} />
                </div>
              </div>

              {/* Right Column: 3D Illustration */}
              <div className="md:col-span-5 flex justify-center items-center">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square p-2 sm:p-5 transition-all duration-300 group">
                  {/* Animated glowing green shadow aura */}
                  <div className="absolute inset-4 bg-emerald-400/20 blur-[50px] rounded-full animate-pulse group-hover:bg-emerald-400/40 transition-colors duration-700" />
                  
                  <img 
                    src={faqHeroIllustration} 
                    alt="FAQ help center 3D illustration" 
                    className="relative z-10 w-full h-full object-contain select-none pointer-events-none mix-blend-multiply contrast-[1.05] drop-shadow-sm transition-all duration-500 group-hover:-translate-y-2"
                  />
                  
                  {/* Floating badge card overlay */}
                  <div 
                    className="absolute -top-3 -right-3 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-100 shadow-md text-[10px] font-extrabold text-slate-600 flex items-center gap-1.5 animate-bounce"
                    style={{ animationDuration: '4s' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Help Desk
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <Breadcrumb />

        {/* Content Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Category selection tabs */}
            <FAQCategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              counts={counts}
            />

            {/* Accordions Container */}
            <div className="bg-white/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mt-8">
              <FAQAccordion faqs={filteredFAQs} />
            </div>

            {/* Bottom contact redirection CTA card */}
            <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.02] shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-left">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-slate-900 text-base sm:text-lg">Still have questions?</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">Our support leads respond within 1 business day.</p>
                </div>
              </div>
              <Button asChild variant="hero" className="rounded-xl h-11 px-6 font-bold group shrink-0 cursor-pointer">
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
