import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectBySlug, getActiveProjects } from '@/services/portfolio.service';
import { decorateProject, Project } from '@/data/projects';
import { INDUSTRIES } from '@/data/industries';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Github, Calendar, Briefcase, User, Building2 } from 'lucide-react';
import { RichTextContent } from '@/components/common/RichTextContent';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
const ProjectDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: apiProject, isLoading: isDetailLoading } = useQuery({
    queryKey: ['projectDetails', slug],
    queryFn: () => getProjectBySlug(slug || ''),
    enabled: !!slug,
  });

  const project = apiProject ? decorateProject(apiProject) : undefined;

  const { data: apiProjects } = useQuery({
    queryKey: ['activeProjects'],
    queryFn: getActiveProjects,
    enabled: !!project,
  });

  const projectsData = (apiProjects || []).map(decorateProject);

  // Find related industries dynamically
  const matchingIndustries = project ? INDUSTRIES.filter(
    (ind) => 
      ind.caseStudies.includes(project.slug) || 
      ind.title.toLowerCase() === project.industry.toLowerCase() || 
      ind.id.toLowerCase() === project.industry.toLowerCase()
  ) : [];


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
              We couldn't find the project you were looking for. It may have been moved or renamed.
            </p>
            <Button asChild className="w-full bg-primary text-white hover:bg-primary/95">
              <Link to="/work">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Work
              </Link>
            </Button>
          </div>
          <Footer />
        </main>
      </>
    );
  }

  // Get 2-3 related projects based on category or tags, excluding current
  const relatedProjects = projectsData.filter((p) => p.id !== project.id)
    .map((p) => {
      // Calculate relevance score
      let score = 0;
      if (p.category === project.category) score += 3;
      const sharedTags = p.tags.filter((t) => project.tags.includes(t)).length;
      score += sharedTags;
      return { project: p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.project);

  return (
    <>
      {seoBlock}
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        
        {/* Project Hero Header */}
        <section className="bg-white border-b border-slate-200 py-12 mb-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <Link to="/work" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-6 transition-colors font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all projects
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/15 font-medium">
                    {project.category}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50">
                    {project.status}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold font-display text-slate-900 leading-tight">
                  {project.title}
                </h1>
              </div>

              <div className="flex gap-3 shrink-0">
                <a
                  href={project.liveUrl !== '#' ? project.liveUrl : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                    project.liveUrl === '#'
                      ? 'border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                      : 'border-slate-200 bg-primary text-white hover:bg-primary/95'
                  }`}
                  onClick={(e) => project.liveUrl === '#' && e.preventDefault()}
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
                <a
                  href={project.githubUrl !== '#' ? project.githubUrl : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                    project.githubUrl === '#'
                      ? 'border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={(e) => project.githubUrl === '#' && e.preventDefault()}
                >
                  <Github className="w-4 h-4" />
                  GitHub Code
                </a>
              </div>
            </div>
          </div>
        </section>

                {/* Project Content Area */}
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details & Deliverables */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Overview / Description */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 font-display">Project Overview</h2>
                <RichTextContent
                  content={project.longDescription}
                  className="text-slate-600 text-base leading-relaxed"
                />
              </div>

              {/* Key Features */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 font-display">Key Features</h2>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                  {project.keyFeatures.map((feature, i) => (
                    <li key={i} className="leading-relaxed">{feature}</li>
                  ))}
                </ul>
              </div>

              {/* Challenges & Solutions */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 font-display">Challenges & Engineering Solutions</h2>
                <ul className="list-decimal pl-5 space-y-4 text-slate-600">
                  {project.challenges.map((challenge, i) => (
                    <li key={i} className="leading-relaxed font-medium">
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Column: Meta Information Sidebar */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Project Metadata</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                      <div>
                        <span className="font-semibold text-slate-800">Client:</span> {project.client}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <User className="h-4 w-4 text-slate-400" />
                      <div>
                        <span className="font-semibold text-slate-800">Role:</span> {project.role}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <div>
                        <span className="font-semibold text-slate-800">Completed:</span> {new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </div>
                    </div>
                    {matchingIndustries.length > 0 && (
                      <div className="flex items-center gap-3 text-slate-600 text-sm">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <div>
                          <span className="font-semibold text-slate-800">Industry:</span>{' '}
                          {matchingIndustries.map((ind, idx) => (
                            <span key={ind.id}>
                              {idx > 0 && ', '}
                              <Link to={`/industries/${ind.slug}`} className="text-primary hover:underline font-medium">
                                {ind.title}
                              </Link>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>


                <hr className="border-slate-100" />

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Technologies Used</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs text-slate-500 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Gallery Section */}
          {project.gallery.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img
                      src={img}
                      alt={`${project.title} Screenshot ${i + 1}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Projects Section */}
          {relatedProjects.length > 0 && (
            <div className="mt-16 border-t border-slate-200 pt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-display">Related Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((rp) => (
                  <Card key={rp.id} className="border-slate-200 bg-white hover:shadow-md transition-shadow">
                    <div className="h-32 bg-slate-100 overflow-hidden relative">
                      <img src={rp.thumbnail} alt={rp.title} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <Badge variant="secondary" className="w-fit text-[10px] bg-primary/10 text-primary mb-1">
                        {rp.category}
                      </Badge>
                      <CardTitle className="text-sm font-bold text-slate-900 font-display line-clamp-1">
                        <Link to={`/work/${rp.slug}`} className="hover:text-primary">
                          {rp.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-slate-600 text-xs line-clamp-2 mb-3">
                        {rp.description}
                      </p>
                      <Link to={`/work/${rp.slug}`} className="text-xs font-semibold text-primary hover:underline">
                        View details →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </section>

        <Footer />
      </main>
    </>
  );
};

export default ProjectDetails;
