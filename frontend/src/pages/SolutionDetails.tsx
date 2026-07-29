import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { decorateSolution } from '@/data/solutions';
import { useQuery } from '@tanstack/react-query';
import { getSolutionBySlug } from '@/services/solutions.service';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical, seoFromApi } from '@/lib/seoResolve';

import { SolutionHero } from '@/components/solutions/SolutionHero';
import { SolutionSectionNavigation } from '@/components/solutions/SolutionSectionNavigation';
import { SolutionOverviewSection } from '@/components/solutions/SolutionOverviewSection';
import { SolutionFeaturesSection } from '@/components/solutions/SolutionFeaturesSection';
import { SolutionProcessSection } from '@/components/solutions/SolutionProcessSection';
import { SolutionBenefitsSection } from '@/components/solutions/SolutionBenefitsSection';
import { SolutionTechStackSection } from '@/components/solutions/SolutionTechStackSection';
import { SolutionRelatedSection } from '@/components/solutions/SolutionRelatedSection';
import { SolutionSidebar } from '@/components/solutions/SolutionSidebar';

export const SolutionDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: apiSolution, isLoading: isDetailLoading } = useQuery({
    queryKey: ['solutionDetails', slug],
    queryFn: () => getSolutionBySlug(slug || ''),
    enabled: !!slug,
  });

  const solution = apiSolution ? decorateSolution(apiSolution) : undefined;

  const solutionSeo = apiSolution
    ? seoFromApi(apiSolution as Record<string, unknown>)
    : undefined;

  const seoBlock = (
    <PageSeo
      seo={solutionSeo}
      defaults={{
        title: solution?.seoTitle || (solution ? `${solution.title} | TechVistar Solutions` : 'Solution Not Found | TechVistar'),
        description: solution?.seoDescription || solution?.heroDescription || solution?.subtitle || '',
        image: solution?.dashboardImage,
        url: solution ? buildCanonical(`/solutions/${solution.slug}`) : buildCanonical('/solutions'),
      }}
    />
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isDetailLoading) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
          <div className="text-slate-500 font-display flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            Loading solution details...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!solution) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 pt-20">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm text-center">
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight mb-3">
              Solution Not Found
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              We couldn&apos;t find the solution you were looking for. It may have been moved or renamed.
            </p>
            <a
              href="/solutions"
              className="inline-flex items-center justify-center w-full rounded-xl bg-primary text-white hover:bg-primary/95 h-10 px-4 text-sm font-bold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Solutions
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      {seoBlock}
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-0">
        <SolutionHero solution={solution} />
        <SolutionSectionNavigation navItems={solution.sectionCopy.navItems} />

        <section className="mx-auto mt-12 w-full max-w-7xl px-4 pb-8 md:px-6 lg:px-12 xl:px-20 detail-page-gutter">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col space-y-12 lg:col-span-2">
              <SolutionOverviewSection solution={solution} />
              <SolutionFeaturesSection solution={solution} />
              <SolutionProcessSection solution={solution} />
              <SolutionBenefitsSection solution={solution} />
              <SolutionTechStackSection solution={solution} />
              <SolutionRelatedSection solution={solution} />
            </div>
            <div className="space-y-6">
              <SolutionSidebar solution={solution} />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};
export default SolutionDetails;
