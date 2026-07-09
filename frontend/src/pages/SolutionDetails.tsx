import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { SOLUTIONS_DATA, decorateSolution } from '@/data/solutions';
import { useQuery } from '@tanstack/react-query';
import { getSolutionBySlug, getActiveSolutions } from '@/services/solutions.service';

// Subcomponents
import { SolutionHero } from '@/components/solutions/SolutionHero';
import { SolutionSectionNavigation } from '@/components/solutions/SolutionSectionNavigation';
import { SolutionOverviewSection } from '@/components/solutions/SolutionOverviewSection';
import { SolutionFeaturesSection } from '@/components/solutions/SolutionFeaturesSection';
import { SolutionProcessSection } from '@/components/solutions/SolutionProcessSection';
import { SolutionBenefitsSection } from '@/components/solutions/SolutionBenefitsSection';
import { SolutionTechStackSection } from '@/components/solutions/SolutionTechStackSection';

export const SolutionDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: apiSolution, isLoading: isDetailLoading } = useQuery({
    queryKey: ['solutionDetails', slug],
    queryFn: () => getSolutionBySlug(slug || ''),
    enabled: !!slug,
  });

  const solution = apiSolution ? decorateSolution(apiSolution) : (slug ? SOLUTIONS_DATA[slug] : undefined);

  const { data: apiSolutions } = useQuery({
    queryKey: ['activeSolutions'],
    queryFn: () => getActiveSolutions(),
    enabled: !!solution,
  });

  const solutionsData = apiSolutions && apiSolutions.length > 0 
    ? apiSolutions.map(decorateSolution) 
    : Object.values(SOLUTIONS_DATA);

  useEffect(() => {
    if (!solution && slug !== undefined) {
      navigate('/solutions');
    }
  }, [solution, slug, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isDetailLoading) {
    return (
      <>
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

  if (!solution) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-0">
        
        {/* Hero Section */}
        <SolutionHero solution={solution} />

        {/* Sticky Sub-Navbar */}
        <SolutionSectionNavigation />

        {/* Dynamic Detail Modules Content Area */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 mt-12 pb-8">
          <div className="flex flex-col space-y-12">
            <SolutionOverviewSection solution={solution} />
            <SolutionFeaturesSection solution={solution} />
            <SolutionProcessSection solution={solution} />
            <SolutionBenefitsSection solution={solution} />
            <SolutionTechStackSection solution={solution} />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};
export default SolutionDetails;
