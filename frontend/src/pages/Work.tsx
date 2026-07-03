import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TechStackSection } from '@/components/TechStackSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, ArrowRight, Sparkles, Star, Briefcase, Building2, Smile, Award
} from 'lucide-react';
import workBg from '../assets/work-bg.png';
import portfolioLaptopImg from '../assets/portfolio_laptop_mockup.jpg';
import TextType from '@/components/ui/TextType';

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
  const filterHook = useProjectFilters();
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

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const featuredProjects = filteredProjects.slice(0, 4);

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

  const faqList = [
    { q: 'What is your technology handover model?', a: 'Upon project completion, we hand over full code ownership, version history, documentation, and cloud access keys.' },
    { q: 'How do you guarantee project delivery timelines?', a: 'We employ two-week Agile sprints, providing transparent task tracking dashboards, weekly reviews, and clear milestone schedules.' },
    { q: 'Do you offer ongoing production maintenance?', a: 'Yes. We provide structured SLA tiers covering server health checks, dependency upgrades, security patching, and scaling.' }
  ];

  return (
    <>
      {/* Light Theme Background matching reference exactly */}
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 animate-fade-in pb-16 relative overflow-x-hidden">
        <Navbar />

        {/* HERO SECTION */}
        <section 
          className="relative overflow-hidden bg-slate-50 pt-20 pb-6 md:pt-24 md:pb-8 border-b border-slate-100"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 z-0 pointer-events-none" />
          
          <div className="container-custom max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Heading and badge */}
            <div className="lg:col-span-7 space-y-6 pb-12 md:pb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Our Portfolio</span>
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.05]">
                Our Work
              </h1>
              
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-semibold max-w-2xl">
                Showcase production-ready digital products, enterprise platforms, AI solutions, SaaS applications and scalable software engineered for modern businesses.
              </p>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <a href="#projects-grid">
                  <Button className="h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2">
                    <span>Explore Our Projects</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Right side: 3D/Illustration Laptop Mockup Layout */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <motion.div
                className="relative w-full max-w-[550px] -top-8 md:-top-12"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Background glow shadow */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-100/40 to-teal-50/20 blur-3xl opacity-75" />
                
                <img
                  src={portfolioLaptopImg}
                  alt="TechVistar SaaS Mockup Illustration"
                  className="w-full h-auto object-contain relative z-10"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats pill row container below hero */}
        <div className="max-w-5xl mx-auto px-6 -mt-16 md:-mt-20 relative z-20">
          <div className="bg-white border border-slate-200/60 rounded-[24px] shadow-lg py-4 sm:py-5 px-6 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {successMetrics.map((met) => (
              <div key={met.label} className="flex flex-col items-center text-center space-y-1">
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100/50 mb-1">
                  {met.icon}
                </div>
                <h3 className="text-3xl font-extrabold text-emerald-600 leading-none">
                  {met.val}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{met.label}</p>
              </div>
            ))}
          </div>
        </div>

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
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors font-display line-clamp-1 leading-snug">
                      {project.title}
                    </h4>
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

        {/* SECTION 4 — PROJECT GRID */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-12">
          {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
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
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {project.title}
                      </h4>
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
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-md space-y-4">
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
                    <h5 className="text-xs font-extrabold text-slate-900">Chief of Operations</h5>
                    <span className="text-[10px] text-slate-400 font-semibold">Logistics Fleet Management Company</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-none">40%</h4>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 block leading-snug">Cloud Cost Saved</span>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-none">99.99%</h4>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 block leading-snug">API Uptime SLA</span>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-none">A+</h4>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 block leading-snug">Page Speed Rank</span>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-none">2.4x</h4>
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
                    <h4 className="font-extrabold text-slate-800 text-xs tracking-wide pt-1">{step.title}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              });
            })()}
          </motion.div>
        </section>

        {/* SECTION 7 — TECHNOLOGY STACK (UNTOUCHED) */}
        <TechStackSection />

        {/* SECTION 8 — INDUSTRIES */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Industries We Serve</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">Deploying tailored digital capabilities optimized for industry regulations.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Healthcare', desc: 'HIPAA-compliant telemedicine platforms and operational databases.' },
              { name: 'Finance', desc: 'High-security transaction systems and digital banking analytics.' },
              { name: 'Education', desc: 'Custom LMS architectures and student tracking dashboards.' },
              { name: 'Logistics', desc: 'Route optimization solvers, capacity scheduling, and GPS trackers.' },
              { name: 'Real Estate', desc: 'Multi-tenant property portals and CRM pipelines.' },
              { name: 'Manufacturing', desc: 'IoT sensor telemetry platforms and predictive maintenance schedulers.' },
              { name: 'Retail', desc: 'Scalable headless eCommerce backends and custom checkouts.' },
              { name: 'Government', desc: 'Secure civic portal databases and administrative dashboards.' }
            ].map((ind) => (
              <motion.div
                key={ind.name}
                whileHover={{ 
                  y: -5, 
                  scale: 1.04,
                  boxShadow: '0 10px 25px -5px rgba(16,185,129,0.15)',
                  borderColor: 'rgba(16,185,129,0.3)'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-sm cursor-pointer group/ind"
              >
                <h4 className="font-extrabold text-slate-900 text-sm group-hover/ind:text-emerald-600 transition-colors">{ind.name}</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{ind.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 9 — FAQ */}
        <section className="container-custom max-w-4xl mx-auto px-6 py-16 border-t border-slate-200/80">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 font-semibold">Find quick answers regarding delivery timelines, support and ownership.</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-md">
            {faqList.map((faq) => (
              <FAQAccordion key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </section>

        {/* SECTION 10 — FINAL CTA */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-12">
          <motion.div 
            whileHover={{ y: -2 }}
            className="rounded-3xl bg-gradient-to-br from-slate-100 to-white border border-slate-200/85 p-8 sm:p-12 text-center relative overflow-hidden shadow-md text-slate-900"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="max-w-2xl mx-auto relative z-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Ready to Build Your Next Product?</h3>
              <p className="text-slate-600 font-semibold text-sm sm:text-base leading-relaxed">
                Let's discuss your idea. Connect with our engineering leads to outline timelines, compliance metrics, and technical requirements.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-sm rounded-xl transition-all shadow-md">
                    Book Consultation
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="h-12 px-8 border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-slate-700 text-sm">
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

// FAQ Accordion
interface FAQAccordionProps {
  question: string;
  answer: string;
}

const FAQAccordion = ({ question, answer }: FAQAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-display font-extrabold text-base sm:text-lg text-slate-900 hover:text-emerald-600 transition-colors py-1"
      >
        <span>{question}</span>
        <span className="text-emerald-600 font-normal text-xl ml-4">{isOpen ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-slate-500 text-sm leading-relaxed mt-2.5 font-semibold">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Work;
