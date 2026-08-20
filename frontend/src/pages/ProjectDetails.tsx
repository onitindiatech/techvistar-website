import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectBySlug, getActiveProjects } from '@/services/portfolio.service';
import { decorateProject, PROJECTS } from '@/data/projects';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import { ProjectHero } from '@/components/portfolio/ProjectHero';
import { ProjectSectionNavigation } from '@/components/portfolio/ProjectSectionNavigation';
import { ProjectOverviewSection } from '@/components/portfolio/ProjectOverviewSection';
import { ProjectFeaturesSection } from '@/components/portfolio/ProjectFeaturesSection';
import { ProjectTechnologySection } from '@/components/portfolio/ProjectTechnologySection';
import { ProjectGallerySection } from '@/components/portfolio/ProjectGallerySection';
import { ProjectChallengesSection } from '@/components/portfolio/ProjectChallengesSection';
import { ProjectProcessSection } from '@/components/portfolio/ProjectProcessSection';
import { ProjectRelatedSection } from '@/components/portfolio/ProjectRelatedSection';
import { ProjectSidebar } from '@/components/portfolio/ProjectSidebar';
import { ProjectCTASection } from '@/components/portfolio/ProjectCTASection';

const ProjectDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: apiProject, isLoading: isDetailLoading } = useQuery({
    queryKey: ['projectDetails', slug],
    queryFn: () => getProjectBySlug(slug || ''),
    enabled: !!slug,
    retry: 1,
  });

  const project = useMemo(() => {
    if (apiProject) {
      const dec = decorateProject(apiProject);
      if (dec) return dec;
    }
    if (!slug) return undefined;
    return (
      PROJECTS.find((p) => p.slug === slug) ||
      PROJECTS.find((p) => p.slug.includes(slug) || slug.includes(p.slug))
    );
  }, [apiProject, slug]);

  const { data: apiProjects } = useQuery({
    queryKey: ['activeProjects'],
    queryFn: getActiveProjects,
    enabled: !!project,
  });

  const projectsData = useMemo(() => {
    const loaded = (apiProjects || []).map(decorateProject).filter(Boolean);
    const loadedSlugs = new Set(loaded.map((p) => p.slug));
    const fallbackList = PROJECTS.filter((p) => !loadedSlugs.has(p.slug));
    return [...loaded, ...fallbackList];
  }, [apiProjects]);

  const relatedProjects = useMemo(() => {
    if (!project) return [];
    const scored = projectsData
      .filter((p) => p.id !== project.id && p.slug !== project.slug)
      .map((p) => {
        let score = 0;
        if (p.category === project.category) score += 3;
        const sharedTags = p.tags.filter((t) => project.tags.includes(t)).length;
        score += sharedTags;
        return { project: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.project);
    return scored.slice(0, 3);
  }, [project, projectsData]);

  const navItems = useMemo(() => {
    if (!project) return [];
    return [
      { id: 'overview', label: 'Overview' },
      ...(project.keyFeatures.length > 0 || project.detailedFeatures.length > 0 ? [{ id: 'features', label: 'Features' }] : []),
      ...(project.technologies.length > 0 ? [{ id: 'technology', label: 'Tech Stack' }] : []),
      ...(project.process.length > 0 ? [{ id: 'process', label: 'Process' }] : []),
      ...(project.challenges.length > 0 ? [{ id: 'challenges', label: 'Challenges' }] : []),
      { id: 'contact', label: 'Contact' },
    ];
  }, [project]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project?.slug]);

  const seoBlock = (
    <PageSeo
      seo={project}
      defaults={{
        title: project ? `${project.title} | TechVistar Portfolio` : 'Project Not Found | TechVistar',
        description: project?.description || '',
        image: project?.thumbnail,
        url: project ? buildCanonical(`/work/${project.slug}`) : buildCanonical('/work'),
      }}
    />
  );

  if (isDetailLoading) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
          <div className="text-slate-500 font-display">Loading project details...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 pt-20">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm text-center">
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight mb-3">
              Project Not Found
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              We couldn&apos;t find the project you were looking for. It may have been moved or renamed.
            </p>
            <Button asChild className="w-full bg-primary text-white hover:bg-primary/95">
              <Link to="/work">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Work
              </Link>
            </Button>
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
        <ProjectHero project={project} />
        <ProjectSectionNavigation navItems={navItems} />

        <section className="w-full mx-auto px-4 md:px-6 lg:px-12 xl:px-20 mt-8 pb-16 detail-page-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProjectOverviewSection project={project} />
              <ProjectFeaturesSection project={project} />
              <ProjectTechnologySection project={project} />
              <ProjectProcessSection project={project} />
              <ProjectChallengesSection project={project} />
              <ProjectRelatedSection relatedProjects={relatedProjects} />
            </div>

            <div className="space-y-6">
              <ProjectSidebar project={project} />
            </div>
          </div>

          <div className="mt-16">
            <ProjectCTASection projectCta={project.ctaBlock} />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default ProjectDetails;
