import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getProjectBySlug, getActiveProjects } from '@/services/portfolio.service';
import { decorateProject, Project } from '@/data/projects';
import { INDUSTRIES } from '@/data/industries';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Github, Calendar, Briefcase, User, Building2, Lightbulb, Check } from 'lucide-react';
import { RichTextContent } from '@/components/common/RichTextContent';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import workBg from '../assets/work-bg-new.png';
import { PageHeader } from '@/components/ui/PageHeader';
import '../components/ui/GlassIcons.css';

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



  return (
    <>
      {seoBlock}
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-12 md:pb-16">
        
        {/* Project Hero Header */}
        <section className="relative overflow-hidden bg-zinc-950 border-b border-zinc-900 pt-28 pb-10 md:pt-32 md:pb-16 mb-8 text-white">
          <div className="absolute inset-0 z-0 opacity-60 pointer-events-none" style={{ backgroundImage: `url(${workBg})`, backgroundSize: 'auto 85%', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-0 pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <Link to="/work" className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-6 md:mb-8 transition-colors font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all projects
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    {project.category}
                  </Badge>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-300 bg-zinc-800/50">
                    {project.status}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold font-display text-white leading-tight max-w-3xl">
                  {project.title}
                </h1>
              </div>
            </div>
          </div>
        </section>

                {/* Project Content Area */}
        <section className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details & Deliverables */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Overview / Description */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                        <Briefcase className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 font-display tracking-tight">Overview</h2>
                    </div>
                    <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                    
                    <RichTextContent
                      content={project.longDescription}
                      className="text-slate-600 text-base leading-relaxed"
                    />

                    {project.challenges && project.challenges.length > 0 && (
                      <div className="bg-emerald-50/80 rounded-2xl p-6 border border-emerald-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Lightbulb className="h-4 w-4 text-emerald-700 font-bold" />
                          </div>
                          <span className="font-bold text-emerald-800">Key Insight</span>
                        </div>
                        <p className="text-emerald-700 font-medium leading-relaxed pl-11">
                          {project.challenges[0]}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm w-full">
                    <img 
                      src={project.gallery?.[0] || project.thumbnail} 
                      alt={project.title}
                      className="rounded-xl border border-slate-200 shadow-sm w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 font-display">Key Features</h2>
                <div className="flex flex-col gap-4">
                  {project.keyFeatures.map((feature, i) => {
                    const gradientMapping = [
                      'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
                      'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
                      'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
                      'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
                      'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
                      'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))'
                    ];
                    const bgGradient = gradientMapping[i % gradientMapping.length];
                    
                    return (
                      <div key={i} className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-slate-100 hover:border-emerald-500/30 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_-8px_rgba(16,185,129,0.12)] transition-all duration-300">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 relative">
                          <div className="icon-btn pointer-events-none scale-[0.4] sm:scale-50 origin-top-left absolute top-0 left-0">
                            <span className="icon-btn__back" style={{ background: bgGradient }}></span>
                            <span className="icon-btn__front">
                              <span className="icon-btn__icon">
                                <Check className="w-6 h-6 text-white" />
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors font-display">
                            {feature}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Challenges & Solutions */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 font-display">Challenges & Engineering Solutions</h2>
                <div className="space-y-4">
                  {project.challenges.map((challenge, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group bg-slate-50 border border-slate-100 rounded-xl p-5 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-300 flex items-start gap-4"
                    >
                      <div className="mt-0.5 h-8 w-8 rounded-full bg-white text-emerald-600 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        {i + 1}
                      </div>
                      <p className="leading-relaxed font-medium text-slate-700 text-sm md:text-base pt-0.5 group-hover:text-slate-900 transition-colors">
                        {challenge}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Meta Information Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-28 self-start">
              <div className="bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-2xl p-5 md:p-6 space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />
                
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Project Metadata</h3>
                  <div className="space-y-3">
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





        </section>

      </main>
      <Footer />
    </>
  );
};

export default ProjectDetails;
