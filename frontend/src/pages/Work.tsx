import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Briefcase, Cpu, Layers, Search, 
  ArrowRight, Sparkles, Star, Clock 
} from 'lucide-react';
import workBg from '../assets/work-bg.png';

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

// Realistic Industry SVG Icons
const IndustryIcons = {
  healthcare: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="w-6 h-6 text-emerald-600">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6M12 9v6" />
    </svg>
  ),
  finance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="w-6 h-6 text-emerald-600">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 21V3m0 18a9 9 0 100-18 9 9 0 000 18zM8 8h8M8 12h8M8 16h8" />
    </svg>
  ),
  education: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="w-6 h-6 text-emerald-600">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v7M6 18.8V12m12 6.8V12" />
    </svg>
  ),
  logistics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="w-6 h-6 text-emerald-600">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM19.5 18.75a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3.75h3l1.5 9h10.5l2.25-6.75H6" />
    </svg>
  ),
  realestate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="w-6 h-6 text-emerald-600">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5M4.5 21V6.75a2.25 2.25 0 012.25-2.25h10.5a2.25 2.25 0 012.25 2.25V21M7.5 7.5h1.5M7.5 12h1.5M7.5 16.5h1.5M15 7.5h1.5M15 12h1.5M15 16.5h1.5" />
    </svg>
  ),
  manufacturing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="w-6 h-6 text-emerald-600">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  retail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="w-6 h-6 text-emerald-600">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  government: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="w-6 h-6 text-emerald-600">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
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

  const featuredProject = filteredProjects.find(p => p.featured) || filteredProjects[0];

  const processSteps = [
    { title: 'Discovery', desc: 'Understanding your product requirements, constraints, and business metrics.' },
    { title: 'Planning', desc: 'Architecture mapping, database schema design, and milestone scheduling.' },
    { title: 'Design', desc: 'Interactive prototypes, UI/UX validation, and component design system setup.' },
    { title: 'Development', desc: 'Production-ready code execution, API mapping, and CI/CD pipelines.' },
    { title: 'Testing', desc: 'Comprehensive QA checks, load testing, and security code audits.' },
    { title: 'Deployment', desc: 'Secure cloud hosting, environment setups, and production release.' },
    { title: 'Support', desc: 'Continuous SLAs, telemetry monitoring, and feature iteration cycles.' }
  ];

  const techStack = [
    { name: 'React', logo: BrandLogos.react },
    { name: 'Next.js', logo: BrandLogos.nextjs },
    { name: 'Node.js', logo: BrandLogos.nodejs },
    { name: 'Python', logo: BrandLogos.python },
    { name: 'TypeScript', logo: BrandLogos.typescript },
    { name: 'AWS', logo: BrandLogos.aws },
    { name: 'Docker', logo: BrandLogos.docker },
    { name: 'MongoDB', logo: BrandLogos.mongodb },
    { name: 'PostgreSQL', logo: BrandLogos.postgresql },
    { name: 'OpenAI', logo: BrandLogos.openai },
    { name: 'Flutter', logo: BrandLogos.flutter },
    { name: 'Kubernetes', logo: BrandLogos.kubernetes }
  ];

  const industriesList = [
    { name: 'Healthcare', icon: IndustryIcons.healthcare, desc: 'HIPAA-compliant telemedicine platforms and operational databases.' },
    { name: 'Finance', icon: IndustryIcons.finance, desc: 'High-security transaction systems and digital banking analytics.' },
    { name: 'Education', icon: IndustryIcons.education, desc: 'Custom LMS architectures and student tracking dashboards.' },
    { name: 'Logistics', icon: IndustryIcons.logistics, desc: 'Route optimization solvers, capacity scheduling, and GPS trackers.' },
    { name: 'Real Estate', icon: IndustryIcons.realestate, desc: 'Multi-tenant property portals and CRM pipelines.' },
    { name: 'Manufacturing', icon: IndustryIcons.manufacturing, desc: 'IoT sensor telemetry platforms and predictive maintenance schedulers.' },
    { name: 'Retail', icon: IndustryIcons.retail, desc: 'Scalable headless eCommerce backends and custom checkouts.' },
    { name: 'Government', icon: IndustryIcons.government, desc: 'Secure civic portal databases and administrative dashboards.' }
  ];

  const successMetrics = [
    { label: 'Cloud Cost Saved', val: '40%' },
    { label: 'API Uptime SLA', val: '99.99%' },
    { label: 'Page Speed Rank', val: 'A+' },
    { label: 'Customer Growth', val: '2.4x' }
  ];

  const faqList = [
    { q: 'What is your technology handover model?', a: 'Upon project completion, we hand over full code ownership, version history, documentation, and cloud access keys.' },
    { q: 'How do you guarantee project delivery timelines?', a: 'We employ two-week Agile sprints, providing transparent task tracking dashboards, weekly reviews, and clear milestone schedules.' },
    { q: 'Do you offer ongoing production maintenance?', a: 'Yes. We provide structured SLA tiers covering server health checks, dependency upgrades, security patching, and scaling.' }
  ];

  return (
    <>
      {/* Light Theme Background matching About, Services, and Industries */}
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 animate-fade-in pb-16 relative">
        <Navbar />

        {/* SECTION 1 — HERO */}
        <section 
          className="relative overflow-hidden bg-zinc-950 pt-28 pb-16 md:pt-36 md:pb-24 border-b border-zinc-900 text-white"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Animated Mesh Waves + Mouse Parallax */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              x: mousePosition.x * 25,
              y: mousePosition.y * 25,
            }}
            animate={{
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
              style={{ backgroundImage: `url(${workBg})` }}
            />
            
            {/* Shifting green waves / glow effect */}
            <motion.div 
              animate={{ 
                x: [0, 20, -15, 0],
                y: [0, -15, 20, 0],
                scale: [1, 1.15, 0.9, 1]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute left-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[130px]" 
            />
            <motion.div 
              animate={{ 
                x: [0, -25, 20, 0],
                y: [0, 20, -25, 0],
                scale: [1, 0.85, 1.15, 1]
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-teal-500/10 blur-[130px]" 
            />
          </motion.div>

          {/* Tiny Floating Background Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400/80 rounded-full"
                style={{
                  left: `${(i * 13) % 100}%`,
                  top: `${(i * 17) % 100}%`,
                }}
                animate={{
                  y: [0, -35, 0],
                  x: [0, 15, 0],
                  opacity: [0.1, 0.8, 0.1],
                }}
                transition={{
                  duration: 8 + (i % 5) * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          <div className="container-custom max-w-7xl mx-auto px-6 relative z-10 space-y-12">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Portfolio</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-white tracking-tight leading-[1.1]">
                Our Work
              </h1>
              
              <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-semibold max-w-2xl">
                Showcase production-ready digital products, enterprise platforms, AI solutions, SaaS applications and scalable software engineered for modern businesses.
              </p>
            </div>

            {/* Glassmorphism Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-xl">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-500">50+</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Projects Delivered</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-xl">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-500">15+</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Industries</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-xl">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-500">98%</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Client Satisfaction</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-xl">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-500">5+</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Years Experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — FEATURED PROJECT */}
        {featuredProject && (
          <section className="container-custom max-w-7xl mx-auto px-6 py-16">
            <div className="mb-8">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Featured Case Study</span>
            </div>
            
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg grid md:grid-cols-12 gap-8 items-center text-slate-900"
            >
              {/* Left side: Project Image */}
              <div className="md:col-span-6 h-72 sm:h-96 rounded-2xl overflow-hidden relative border border-slate-200/60 bg-slate-100 flex items-center justify-center">
                <img 
                  src={featuredProject.thumbnail} 
                  alt={featuredProject.title} 
                  className="w-full h-full object-cover opacity-95 hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Right side: Project Details */}
              <div className="md:col-span-6 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                    {featuredProject.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {featuredProject.date.split('-')[0]}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                  {featuredProject.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                  {featuredProject.description}
                </p>

                {/* Meta details list */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Client Partner</span>
                    <span className="text-xs text-slate-900 font-bold mt-1 block">{featuredProject.client}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Our Role</span>
                    <span className="text-xs text-slate-900 font-bold mt-1 block">{featuredProject.role}</span>
                  </div>
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {featuredProject.technologies.map(tech => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-[10px] text-slate-600 font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                  <Link to={`/work/${featuredProject.slug}`}>
                    <Button className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md">
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                  <a href={featuredProject.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="h-10 border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-slate-700">
                      <span>Live Demo</span>
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* SECTION 3 — PROJECT FILTERS */}
        <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-y border-slate-200/80 py-4">
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
                <option value="">All Industries</option>
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>

              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="h-11 bg-white border border-slate-200 text-xs font-semibold rounded-xl px-4 text-slate-700 focus:outline-none"
              >
                <option value="">All Services</option>
                {services.map(srv => <option key={srv} value={srv}>{srv}</option>)}
              </select>

              <select
                value={selectedTechnology}
                onChange={(e) => setSelectedTechnology(e.target.value)}
                className="h-11 bg-white border border-slate-200 text-xs font-semibold rounded-xl px-4 text-slate-700 focus:outline-none"
              >
                <option value="">All Technologies</option>
                {technologies.map(tech => <option key={tech} value={tech}>{tech}</option>)}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-11 bg-white border border-slate-200 text-xs font-semibold rounded-xl px-4 text-slate-700 focus:outline-none"
              >
                <option value="">All Statuses</option>
                {statuses.map(st => <option key={st} value={st}>{st}</option>)}
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
                  whileHover={{ y: -4 }}
                  className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between group text-slate-900"
                >
                  <div className="space-y-4">
                    {/* Cover image container */}
                    <div className="h-48 overflow-hidden bg-slate-100 relative border-b border-slate-100">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-90 group-hover:scale-104 transition-transform duration-500"
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
                      <Button className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all shadow-md">
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
                <div className="flex gap-1 text-emerald-500">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed italic">
                  "TechVistar delivered our route optimization system ahead of schedule. The solver APIs and capacity constraints dashboard handled high-latency dispatch scripts with zero UI thread lag."
                </p>
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900">Chief of Operations</h5>
                    <span className="text-[10px] text-slate-400 font-semibold">Logistics Fleet Management Company</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              {successMetrics.map(met => (
                <div key={met.label} className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-none">{met.val}</h4>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 block leading-snug">{met.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — DEVELOPMENT PROCESS */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Development Process</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">Our structural path from product constraints to production deployment.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {processSteps.map((step, idx) => (
              <div 
                key={step.title}
                className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-3 relative shadow-sm"
              >
                <span className="text-[10px] font-bold text-emerald-600">Step 0{idx + 1}</span>
                <h4 className="font-extrabold text-slate-900 text-sm">{step.title}</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7 — TECHNOLOGY STACK */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Technology Stack</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">Production-hardened libraries we leverage across architecture frameworks.</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {techStack.map((tech) => (
              <motion.div
                key={tech.name}
                whileHover={{ 
                  y: -5, 
                  scale: 1.04,
                  boxShadow: '0 10px 25px -5px rgba(16,185,129,0.15)',
                  borderColor: 'rgba(16,185,129,0.3)'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col items-center justify-center gap-3.5 shadow-sm transition-colors cursor-pointer group/tech"
              >
                {/* Brand Logo with hover rotation & enlargement */}
                <motion.div 
                  className="flex items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover/tech:bg-emerald-500/10 group-hover/tech:border-emerald-500/20 group-hover/tech:scale-110 transition-all duration-300"
                  whileHover={{ rotate: 7 }}
                >
                  {tech.logo}
                </motion.div>
                <span className="text-[11px] font-bold text-slate-700 group-hover/tech:text-emerald-600 transition-colors">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 8 — INDUSTRIES */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Industries We Serve</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">Deploying tailored digital capabilities optimized for industry regulations.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {industriesList.map((ind) => (
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
                {/* Realistic Icon with hover animation */}
                <motion.div 
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 w-fit group-hover/ind:bg-emerald-500/10 group-hover/ind:border-emerald-500/20 group-hover/ind:scale-110 transition-all duration-300"
                  whileHover={{ rotate: 7 }}
                >
                  {ind.icon}
                </motion.div>
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
