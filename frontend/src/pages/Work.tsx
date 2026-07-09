import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getActiveProjects } from '@/services/portfolio.service';
import { decorateProject } from '@/data/projects';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, ArrowRight, Star, Briefcase, Building2, Smile, Award
} from 'lucide-react';
import workBg from '../assets/work-bg.png';
import TextType from '@/components/ui/TextType';
import { PageHeader } from '@/components/ui/PageHeader';

// High Quality Brand SVG Logos
const BrandLogos = {
  react: (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-7 h-7 fill-none stroke-[#61dafb] transition-transform duration-300">
      <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
      <g stroke-width="1">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  ),
  nextjs: (
    <svg viewBox="0 0 180 180" className="w-7 h-7 fill-current text-slate-900 transition-transform duration-300">
      <mask id="next-mask"><circle cx="90" cy="90" r="90" fill="white"/></mask>
      <circle cx="90" cy="90" r="90" fill="black"/>
      <path d="M149.508 157.52L69.142 54H54v72h14.4v-46.043l71.183 91.24c3.957-3.92 7.575-8.243 10.772-12.893z" fill="white" mask="url(#next-mask)"/>
      <path d="M115.2 54h14.4v72h-14.4z" fill="white" mask="url(#next-mask)"/>
    </svg>
  ),
  nodejs: (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#68a063] transition-transform duration-300">
      <path d="M12 0L2 5.7v12.6L12 24l10-5.7V5.7L12 0zm1.2 5l5.2 3v6l-5.2 3V5zm-2.4 0v12l-5.2-3v-6l5.2-3z" />
    </svg>
  ),
  python: (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-[#306998] transition-transform duration-300">
      <path d="M11.9 0A5.3 5.3 0 0 0 6.6 5.3v2H8.7V5.3a3.3 3.3 0 0 1 6.6 0v1.1h2.1V5.3A5.3 5.3 0 0 0 12.1 0h-.2zm-3.2 8.7a5.3 5.3 0 0 0-5.3 5.3v1.1h2.1v-1.1a3.3 3.3 0 0 1 6.6 0v2H12.3v-2a5.3 5.3 0 0 0-5.3-5.3h-.3zm11.9 0a5.3 5.3 0 0 0-5.3 5.3v1.1h2.1v-1.1a3.3 3.3 0 0 1 6.6 0v-5.3a5.3 5.3 0 0 0-5.3-5.3v2.1z" />
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-[#3178c6] transition-transform duration-300">
      <path d="M0 0h24v24H0V0zm20.8 19.3c0-1.8-1.5-2.6-3.8-3.1-1.7-.4-2-.8-2-1.4 0-.6.5-1 1.4-1 .9 0 1.5.3 1.9.9l1.8-1.2c-.7-1.1-2-1.7-3.7-1.7-2.3 0-3.8 1.3-3.8 3.2 0 1.8 1.2 2.6 3.6 3.1 1.8.4 2.2.9 2.2 1.5 0 .7-.7 1.1-1.6 1.1-1.3 0-2.1-.6-2.5-1.5L10 19.1c.6 1.5 2.1 2.3 4.4 2.3 2.5.1 4.4-1.1 4.4-3.1zm-8.9-8.4H9.5v8.5H7.2v-8.5H4.8V9h7.1v1.9z" />
    </svg>
  ),
  mongodb: (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#13aa52] transition-transform duration-300">
      <path d="M12 0c-.8 0-1.6.4-2.1 1-.4.5-.7 1.3-.7 2.2 0 1.2.5 2.6 1.2 4.1.7 1.5 1.5 3 2.1 4.2.7-1.2 1.5-2.7 2.1-4.2.7-1.5 1.2-2.9 1.2-4.1 0-.9-.3-1.7-.7-2.2-.5-.6-1.3-1-2.1-1zM11 9.5c-.7 1.5-1.2 3.1-1.2 4.7 0 2.4 1 4.5 2.2 6.2 1.2-1.7 2.2-3.8 2.2-6.2 0-1.6-.5-3.2-1.2-4.7-.6 1.2-1.3 2.5-2 3.8-.7-1.3-1.4-2.6-2-3.8z" />
    </svg>
  ),
  postgresql: (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#336791] transition-transform duration-300">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-4H8v-2h3v-2h2v2h3v2h-3v4z" />
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#0db7ed] transition-transform duration-300">
      <path d="M13.983 8.871h-2.148V6.723h2.148zm2.525 0h-2.147V6.723h2.147zm2.524 0h-2.147V6.723h2.147zm-5.048-2.524h-2.148V4.199h2.148zm2.524 0h-2.147V4.199h2.147zm-7.572 5.048h-2.148V9.243h2.148zm2.525 0h-2.148V9.243h2.148zm2.524 0h-2.147V9.243h2.147zm8.307 2.115c-.131-.383-.435-.747-.899-.899a7.352 7.352 0 00-.91-.186c.01-.225.015-.453.015-.684v-.328h-1.077v.328c0 .285-.01.567-.03.847-.075.986-.411 1.944-1.01 2.766-.549.754-1.306 1.341-2.203 1.704v.006c-1.311.536-2.775.536-4.086 0l-.06-.024c-1.67-.681-2.91-2.072-3.414-3.824H0c.348 2.502 1.956 4.671 4.298 5.759 1.91.887 4.103 1.034 6.13.411 2.378-.731 4.382-2.457 5.485-4.73a8.948 8.948 0 001.378-1.503c.536-.75.875-1.597 1.002-2.483a3.57 3.57 0 00.024-.51z" />
    </svg>
  ),
  aws: (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#ff9900] transition-transform duration-300">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.2 13h-2.4V8.4H8.6V7.2h6.8v1.2H13.2V15z" />
    </svg>
  ),
  openai: (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#10a37f] transition-transform duration-300">
      <path d="M22.5 12.5c0-.6-.2-1.1-.5-1.5.3-.4.5-1 .5-1.6 0-.7-.3-1.4-.8-1.8.2-.5.3-1 .2-1.6-.1-.7-.5-1.3-1.1-1.7-.3-.2-.7-.3-1.1-.3-.3-.4-.7-.7-1.2-.8-.7-.2-1.4-.1-2 .3-.4-.3-1-.5-1.6-.5s-1.2.2-1.6.5c-.6-.4-1.3-.5-2-.3-.5.1-.9.4-1.2.8-.4 0-.8.1-1.1.3-.6.4-1 1-1.1 1.7-.1.6 0 1.1.2 1.6-.5.4-.8 1.1-.8 1.8 0 .6.2 1.2.5 1.6-.3.4-.5 1-.5 1.5 0 .7.3 1.4.8 1.8-.2.5-.3 1-.2 1.6.1.7.5 1.3 1.1 1.7.3.2.7.3 1.1.3.3.4.7.7 1.2.8.7.2 1.4.1 2-.3.4.3 1 .5 1.6.5s1.2-.2 1.6-.5c.6.4 1.3.5 2 .3.5-.1.9-.4 1.2-.8.4 0-.8-.1 1.1-.3.6-.4 1-1 1.1-1.7.1-.6 0-1.1-.2-1.6.5-.4.8-1.1.8-1.8z" />
    </svg>
  ),
  flutter: (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#02569b] transition-transform duration-300">
      <path d="M13.5 0L1.5 12l4.5 4.5L22.5 0H13.5zm4.5 12l-4.5 4.5 4.5 4.5H22.5L18 12z" />
    </svg>
  ),
  kubernetes: (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#326ce5] transition-transform duration-300">
      <path d="M12 0L1.7 3.7l1.5 11.2L12 24l8.8-9.1 1.5-11.2L12 0zm0 4.1l5.5 2.1-1 7.1-4.5 4.8-4.5-4.8-1-7.1 5.5-2.1z" />
    </svg>
  ),
};

export const Work = () => {
  const { data: apiProjects, isLoading } = useQuery({
    queryKey: ['activeProjects'],
    queryFn: getActiveProjects,
  });

  const projectsData = (apiProjects || []).map(decorateProject);
  const filterHook = useProjectFilters(projectsData);

  const { 
    filteredProjects, 
    selectedIndustry, 
    setSelectedIndustry, 
    industries,
    selectedService, 
    setSelectedService, 
    services,
    selectedTechnology, 
    setSelectedTechnology, 
    technologies,
    selectedStatus, 
    setSelectedStatus, 
    statuses,
    searchQuery, 
    setSearchQuery,
    sortBy,
    setSortBy
  } = filterHook;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
          <div className="text-slate-500 font-display">Loading portfolio...</div>
        </main>
        <Footer />
      </>
    );
  }

  const featuredProjects = projectsData.filter((p) => p.featured === true);
  const normalProjects = filteredProjects.filter((p) => p.featured !== true);

  const processSteps = [
    { title: 'Discovery', desc: 'Understanding your product requirements, constraints, and business metrics.' },
    { title: 'Planning', desc: 'Architecture mapping, database schema design, and milestone scheduling.' },
    { title: 'Design', desc: 'Interactive prototypes, UI/UX validation, and component design system setup.' },
    { title: 'Development', desc: 'Production-ready code execution, API mapping, and CI/CD pipelines.' },
    { title: 'Testing', desc: 'Comprehensive QA checks, load testing, and security code audits.' },
    { title: 'Deployment', desc: 'Secure cloud hosting, environment setups, and production release.' },
    { title: 'Support', desc: 'Continuous SLAs, telemetry monitoring, and feature iteration cycles.' }
  ];

  const successMetrics = [
    { label: 'Projects Delivered', val: '50+', icon: <Briefcase className="w-5 h-5 text-emerald-600" /> },
    { label: 'Industries', val: '15+', icon: <Building2 className="w-5 h-5 text-emerald-600" /> },
    { label: 'Client Satisfaction', val: '98%', icon: <Smile className="w-5 h-5 text-emerald-600" /> },
    { label: 'Years Experience', val: '5+', icon: <Award className="w-5 h-5 text-emerald-600" /> }
  ];



  return (
    <>
      {/* Light Theme Background matching reference exactly */}
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 animate-fade-in pb-16 relative overflow-x-hidden">
        <Navbar />

        {/* HERO SECTION */}
        <PageHeader 
          title="Our Work"
          subtitle="Our Portfolio"
          description="Showcase production-ready digital products, enterprise platforms, AI solutions, SaaS applications and scalable software engineered for modern businesses."
          backgroundImage={workBg}
        />

        {/* SECTION 3 — PROJECT FILTERS */}
        <section id="projects-grid" className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-y border-slate-200/80 py-4">
          <div className="container-custom max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-11 bg-white border-slate-200 text-slate-900 rounded-xl text-xs font-semibold focus-visible:ring-emerald-500/20"
              />
            </div>

            {/* Select Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="h-11 bg-white border border-slate-200 text-xs font-semibold rounded-xl px-4 text-slate-700 focus:outline-none"
              >
                <option value="All">All Industries</option>
                {industries.filter(ind => ind !== 'All').map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>

              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="h-11 bg-white border border-slate-200 text-xs font-semibold rounded-xl px-4 text-slate-700 focus:outline-none"
              >
                <option value="All">All Services</option>
                {services.filter(srv => srv !== 'All').map(srv => <option key={srv} value={srv}>{srv}</option>)}
              </select>

              <select
                value={selectedTechnology}
                onChange={(e) => setSelectedTechnology(e.target.value)}
                className="h-11 bg-white border border-slate-200 text-xs font-semibold rounded-xl px-4 text-slate-700 focus:outline-none"
              >
                <option value="All">All Technologies</option>
                {technologies.filter(tech => tech !== 'All').map(tech => <option key={tech} value={tech}>{tech}</option>)}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-11 bg-white border border-slate-200 text-xs font-semibold rounded-xl px-4 text-slate-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                {statuses.filter(st => st !== 'All').map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 2 — RECENT WORK / FEATURED PROJECTS */}
        <section className="container-custom max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-20">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Recent Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">Featured Projects</h2>
            <p className="text-sm text-slate-500 font-semibold">Innovative solutions that drive real business impact</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -6 }}
                className="bg-white border border-slate-200/60 hover:border-emerald-500/40 hover:shadow-[0_15px_30px_-8px_rgba(16,185,129,0.15)] transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between group text-slate-900"
              >
                <div className="space-y-4">
                  {/* Category Badge & Cover image */}
                  <div className="h-44 overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center relative">
                    <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-103"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider z-10 shadow-md">
                      {project.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors font-display line-clamp-1 leading-snug">
                      {project.title}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100/60 flex items-center justify-between">
                  <Link to={`/work/${project.slug}`} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700 transition-colors">
                    View Case Study
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 duration-300" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 4 — PROJECT GRID */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Explore More Projects
            </h2>
            <p className="text-sm text-slate-500 font-semibold">
              Discover additional case studies and technical implementations across industries.
            </p>
          </div>
          {normalProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {normalProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-slate-200/60 hover:border-emerald-500/40 hover:shadow-[0_15px_30px_-8px_rgba(16,185,129,0.15)] transition-all duration-300 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between group text-slate-900"
                >
                  <div className="space-y-4">
                    {/* Cover image container */}
                    <div className="h-48 overflow-hidden bg-white relative border-b border-slate-100 flex items-center justify-center">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-102"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider z-10 shadow-md">
                        {project.industry}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {project.title}
                      </div>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.slice(0, 3).map(tech => (
                          <span key={tech} className="px-2 py-0.5 rounded bg-slate-50 text-[9px] text-slate-500 font-semibold border border-slate-100">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-[9px] text-slate-400 font-semibold self-center ml-1">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-slate-100 flex gap-3">
                    <Link to={`/work/${project.slug}`} className="flex-1">
                      <Button className="w-full h-9 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-all shadow-md">
                        View Project
                      </Button>
                    </Link>
                    <Link to={`/work/${project.slug}`}>
                      <Button variant="outline" className="h-9 border-slate-200 hover:bg-slate-50 font-bold rounded-lg text-xs text-slate-600 px-3.5">
                        Case Study
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200/60 rounded-2xl max-w-md mx-auto px-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-700 mb-1">No case studies match.</h3>
              <p className="text-slate-400 text-xs font-semibold">Try modifying your text search query or filter tags.</p>
            </div>
          )}
        </section>

        {/* SECTION 5 — CLIENT SUCCESS */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Trusted by Businesses Across Industries</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">Delivering high-performance architecture that drives product conversion.</p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            <div className="md:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] transition-all duration-300 space-y-4">
                <div className="flex gap-1 text-amber-400 border border-slate-200/80 rounded-full px-3 py-1 w-fit bg-amber-50/30">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <div className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed italic">
                  "
                  <TextType 
                    text={[
                      "TechVistar delivered our route optimization system ahead of schedule.",
                      "The solver APIs and capacity constraints dashboard handled high-latency dispatch scripts with zero UI thread lag."
                    ]}
                    typingSpeed={40}
                    pauseDuration={3000}
                    showCursor={true}
                    cursorCharacter="|"
                    as="span"
                  />
                  "
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">Chief of Operations</div>
                    <span className="text-[10px] text-slate-400 font-semibold">Logistics Fleet Management Company</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-none">40%</div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 block leading-snug">Cloud Cost Saved</span>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-none">99.99%</div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 block leading-snug">API Uptime SLA</span>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-none">A+</div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 block leading-snug">Page Speed Rank</span>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-none">2.4x</div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 block leading-snug">Customer Growth</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — DEVELOPMENT PROCESS (UNTOUCHED) */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Development Process</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">Our structural path from product constraints to production deployment.</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.06
                }
              }
            }}
            className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
          >
            {(() => {
              const stepColors = [
                { bg: 'bg-emerald-50/80', border: 'border-emerald-100/70', hoverBorder: 'hover:border-emerald-400/40', badge: 'bg-emerald-500/10 text-emerald-700' },
                { bg: 'bg-blue-50/80', border: 'border-blue-100/70', hoverBorder: 'hover:border-blue-400/40', badge: 'bg-blue-500/10 text-blue-700' },
                { bg: 'bg-indigo-50/80', border: 'border-indigo-100/70', hoverBorder: 'hover:border-indigo-400/40', badge: 'bg-indigo-500/10 text-indigo-700' },
                { bg: 'bg-amber-50/80', border: 'border-amber-100/70', hoverBorder: 'hover:border-amber-400/40', badge: 'bg-amber-500/10 text-amber-700' },
                { bg: 'bg-rose-50/80', border: 'border-rose-100/70', hoverBorder: 'hover:border-rose-400/40', badge: 'bg-rose-500/10 text-rose-700' },
                { bg: 'bg-teal-50/80', border: 'border-teal-100/70', hoverBorder: 'hover:border-teal-400/40', badge: 'bg-teal-500/10 text-teal-700' },
                { bg: 'bg-violet-50/80', border: 'border-violet-100/70', hoverBorder: 'hover:border-violet-400/40', badge: 'bg-violet-500/10 text-violet-700' }
              ];

              return processSteps.map((step, idx) => {
                const color = stepColors[idx % stepColors.length];
                return (
                  <motion.div 
                    key={step.title}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { type: "spring", stiffness: 100, damping: 15 }
                      }
                    }}
                    whileHover={{ 
                      y: -5,
                      scale: 1.02,
                      boxShadow: '0 12px 25px -10px rgba(0,0,0,0.08)'
                    }}
                    className={`border rounded-xl p-5 space-y-3 relative transition-all duration-300 cursor-default select-none shadow-sm ${color.bg} ${color.border} ${color.hoverBorder}`}
                  >
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${color.badge}`}>
                      Step 0{idx + 1}
                    </span>
                    <div className="font-extrabold text-slate-800 text-xs tracking-wide pt-1">{step.title}</div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              });
            })()}
          </motion.div>
        </section>





        {/* SECTION 10 — FINAL CTA */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-12">
          <motion.div 
            whileHover={{ y: -2 }}
            className="rounded-3xl bg-gradient-to-r from-emerald-600 via-[#10B981] to-emerald-700 border border-emerald-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.15)] text-white"
          >
            {/* Blurred background glows */}
            <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-emerald-300/20 blur-2xl pointer-events-none" />
            
            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-10" aria-hidden="true">
              <svg width="100%" height="100%">
                <pattern id="cta-mesh-work" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#cta-mesh-work)" />
              </svg>
            </div>

            <div className="max-w-2xl mx-auto relative z-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">Ready to Build Your Next Product?</h3>
              <p className="text-emerald-50/90 font-medium text-sm sm:text-base leading-relaxed">
                Let's discuss your idea. Connect with our engineering leads to outline timelines, compliance metrics, and technical requirements.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button className="h-12 px-8 bg-white hover:bg-slate-50 text-emerald-700 font-bold text-sm rounded-xl transition-all shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_-4px_rgba(0,0,0,0.2)]">
                    Book Consultation
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="h-12 px-8 border-white/30 hover:border-white text-white hover:bg-white/10 font-bold rounded-xl text-sm transition-all bg-transparent">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer />
    </>
  );
};



export default Work;
