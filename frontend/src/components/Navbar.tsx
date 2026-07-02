import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, Cpu, Code2, Smartphone, Cloud, Palette, 
  FolderGit2, Briefcase, Building2, ArrowRight, Brain, Repeat, 
  Settings, Sparkles, Target, Layers, Shield 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE } from '@/data';
import logo from '../assets/logo.webp';

export const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
    setHoveredItem(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
    setHoveredItem(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLinkActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const devServices = [
    { label: 'Web Development', to: '/services/web-development', icon: Code2, desc: 'Scalable web applications.' },
    { label: 'Mobile Development', to: '/services/mobile-app-development', icon: Smartphone, desc: 'iOS & Android design.' },
    { label: 'Custom Software', to: '/services/ai-automation', icon: Cpu, desc: 'Tailored enterprise code.' },
    { label: 'SaaS Platforms', to: '/services/cloud-devops', icon: Cloud, desc: 'Multi-tenant applications.' },
  ];

  const designServices = [
    { label: 'UI/UX', to: '/services/brand-creative-design', icon: Palette, desc: 'User-centric products.' },
    { label: 'Branding', to: '/services/brand-creative-design', icon: Sparkles, desc: 'Unified visual identity.' },
    { label: 'Product Design', to: '/services/brand-creative-design', icon: Target, desc: 'Prototyping & validation.' },
    { label: 'Creative Design', to: '/services/brand-creative-design', icon: Layers, desc: 'Visual assets & illustrations.' },
  ];

  const cloudServices = [
    { label: 'Cloud', to: '/services/cloud-devops', icon: Cloud, desc: 'Secure cloud hosting & migrations.' },
    { label: 'DevOps', to: '/services/cloud-devops', icon: Settings, desc: 'Automation of CI/CD pipelines.' },
    { label: 'AI', to: '/services/ai-automation', icon: Brain, desc: 'Cognitive models & AI agents.' },
    { label: 'Automation', to: '/services/ai-automation', icon: Repeat, desc: 'RPA & workflow optimizers.' },
  ];

  const bizSolutions = [
    { label: 'Enterprise Software', to: '/solutions/enterprise-software', icon: Building2, desc: 'Core business platforms.' },
    { label: 'CRM Systems', to: '/solutions/crm-systems', icon: Target, desc: 'Customer insights & workflows.' },
    { label: 'ERP Platforms', to: '/solutions/erp-platforms', icon: Layers, desc: 'Integrated resource databases.' },
    { label: 'Business Automation', to: '/solutions/business-automation', icon: Repeat, desc: 'Operations orchestrators.' },
  ];

  const aiSolutions = [
    { label: 'AI Chatbots', to: '/solutions/ai-chatbots', icon: Brain, desc: 'Conversational support agents.' },
    { label: 'AI Agents', to: '/solutions/ai-agents', icon: Cpu, desc: 'Autonomous task executors.' },
    { label: 'Generative AI', to: '/solutions/generative-ai', icon: Sparkles, desc: 'Model fine-tuning services.' },
    { label: 'Document Intelligence', to: '/solutions/document-intelligence', icon: FolderGit2, desc: 'Automated OCR & extraction.' },
  ];

  const digSolutions = [
    { label: 'Cloud Migration', to: '/solutions/cloud-migration', icon: Cloud, desc: 'Infrastructure hosting structures.' },
    { label: 'API Integration', to: '/solutions/api-integration', icon: Code2, desc: 'Third-party unified API systems.' },
    { label: 'Data Analytics', to: '/solutions/data-analytics', icon: Settings, desc: 'Visual intelligence dashboards.' },
    { label: 'Cyber Security', to: '/solutions/cyber-security', icon: Shield, desc: 'Threat detection & lock-downs.' },
  ];

  // Framer Motion variants for stagger entry
  const megamenuVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.99 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.02
      }
    },
    exit: { 
      opacity: 0, 
      y: 8, 
      scale: 0.995,
      transition: {
        duration: 0.15,
        ease: 'easeIn'
      }
    }
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-20 sm:h-22 flex items-center',
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md shadow-slate-100/45 border-b border-slate-200/50' 
          : 'bg-white border-b border-slate-100'
      )}
    >
      <div className="container-custom w-full max-w-7xl mx-auto flex items-center justify-between px-6 relative h-full" ref={dropdownRef}>
        {/* Logo Branding */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src={logo}
            alt={SITE.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/10 group-hover:ring-emerald-500/30 transition-all duration-300"
          />
          <span className="text-xl font-extrabold font-display tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
            {SITE.name}
          </span>
        </Link>

        {/* Centered Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 h-full">
          {/* Home */}
          <Link
            to="/"
            onMouseEnter={() => setHoveredItem('Home')}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              'text-[15px] font-semibold transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 tracking-wide relative',
              isLinkActive('/') ? 'text-emerald-600' : 'text-slate-800 hover:text-emerald-600'
            )}
          >
            <span>Home</span>
            {hoveredItem === 'Home' && (
              <motion.span
                layoutId="navbar-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-emerald-600 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          {/* Services (Megamenu Dropdown Trigger) */}
          <div 
            className="h-full flex items-center"
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
              className={cn(
                'flex items-center gap-1.5 text-[15px] font-semibold transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 tracking-wide h-10 relative',
                activeDropdown === 'services' || isLinkActive('/services') ? 'text-emerald-600' : 'text-slate-800 hover:text-emerald-600'
              )}
            >
              <span>Services</span>
              <motion.span
                animate={{ rotate: activeDropdown === 'services' ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
              {hoveredItem === 'services' && (
                <motion.span
                  layoutId="navbar-underline"
                  className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-emerald-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Solutions (Megamenu Dropdown Trigger) */}
          <div 
            className="h-full flex items-center"
            onMouseEnter={() => handleMouseEnter('solutions')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions')}
              className={cn(
                'flex items-center gap-1.5 text-[15px] font-semibold transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 tracking-wide h-10 relative',
                activeDropdown === 'solutions' ? 'text-emerald-600' : 'text-slate-800 hover:text-emerald-600'
              )}
            >
              <span>Solutions</span>
              <motion.span
                animate={{ rotate: activeDropdown === 'solutions' ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
              {hoveredItem === 'solutions' && (
                <motion.span
                  layoutId="navbar-underline"
                  className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-emerald-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Industries */}
          <Link
            to="/industries"
            onMouseEnter={() => setHoveredItem('Industries')}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              'text-[15px] font-semibold transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 tracking-wide relative',
              isLinkActive('/industries') ? 'text-emerald-600' : 'text-slate-800 hover:text-emerald-600'
            )}
          >
            <span>Industries</span>
            {hoveredItem === 'Industries' && (
              <motion.span
                layoutId="navbar-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-emerald-600 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          {/* Portfolio */}
          <Link
            to="/work"
            onMouseEnter={() => setHoveredItem('Portfolio')}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              'text-[15px] font-semibold transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 tracking-wide relative',
              isLinkActive('/work') ? 'text-emerald-600' : 'text-slate-800 hover:text-emerald-600'
            )}
          >
            <span>Portfolio</span>
            {hoveredItem === 'Portfolio' && (
              <motion.span
                layoutId="navbar-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-emerald-600 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          {/* Careers */}
          <Link
            to="/careers"
            onMouseEnter={() => setHoveredItem('Careers')}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              'text-[15px] font-semibold transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 tracking-wide relative',
              isLinkActive('/careers') ? 'text-emerald-600' : 'text-slate-800 hover:text-emerald-600'
            )}
          >
            <span>Careers</span>
            {hoveredItem === 'Careers' && (
              <motion.span
                layoutId="navbar-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-emerald-600 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          {/* About */}
          <Link
            to="/about"
            onMouseEnter={() => setHoveredItem('About')}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              'text-[15px] font-semibold transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 tracking-wide relative',
              isLinkActive('/about') ? 'text-emerald-600' : 'text-slate-800 hover:text-emerald-600'
            )}
          >
            <span>About</span>
            {hoveredItem === 'About' && (
              <motion.span
                layoutId="navbar-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-emerald-600 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        </nav>

        {/* Right: Premium Outline Contact CTA (Direct Link to Contact Page) */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 10px 25px -5px rgba(16,185,129,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3.5 pl-6 pr-2 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full transition-all font-bold text-sm tracking-wide shadow-md shadow-emerald-500/10 group"
            >
              <span>Contact Us</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-emerald-700 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </motion.button>
          </Link>
        </div>

        {/* Mobile hamburger menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-800"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Services Megamenu dropdown aligned flush to the container bottom */}
        <AnimatePresence>
          {activeDropdown === 'services' && (
            <motion.div
              variants={megamenuVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
              className="absolute left-6 right-6 top-full mt-0 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/25 p-7 z-50 grid grid-cols-12 gap-6 text-left origin-top"
            >
              {/* Column 1: Development Services */}
              <motion.div variants={columnVariants} className="col-span-3 space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 px-3">Development Services</h4>
                <div className="space-y-0.5">
                  {devServices.map((srv) => {
                    const IconComp = srv.icon;
                    return (
                      <Link
                        key={srv.label}
                        to={srv.to}
                        onClick={() => setActiveDropdown(null)}
                        className="group/item flex items-start gap-3.5 py-3 px-3 rounded-xl hover:bg-emerald-500/[0.03] transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <motion.span whileHover={{ scale: 1.08 }} className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                          <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                        </motion.span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors leading-none">{srv.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium mt-1 leading-normal">{srv.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Column 2: Design Services */}
              <motion.div variants={columnVariants} className="col-span-3 space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 px-3">Design Services</h4>
                <div className="space-y-0.5">
                  {designServices.map((srv) => {
                    const IconComp = srv.icon;
                    return (
                      <Link
                        key={srv.label}
                        to={srv.to}
                        onClick={() => setActiveDropdown(null)}
                        className="group/item flex items-start gap-3.5 py-3 px-3 rounded-xl hover:bg-emerald-500/[0.03] transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <motion.span whileHover={{ scale: 1.08 }} className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                          <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                        </motion.span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors leading-none">{srv.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium mt-1 leading-normal">{srv.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Column 3: Cloud & AI */}
              <motion.div variants={columnVariants} className="col-span-3 space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 px-3">Cloud & AI</h4>
                <div className="space-y-0.5">
                  {cloudServices.map((srv) => {
                    const IconComp = srv.icon;
                    return (
                      <Link
                        key={srv.label}
                        to={srv.to}
                        onClick={() => setActiveDropdown(null)}
                        className="group/item flex items-start gap-3.5 py-3 px-3 rounded-xl hover:bg-emerald-500/[0.03] transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <motion.span whileHover={{ scale: 1.08 }} className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                          <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                        </motion.span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors leading-none">{srv.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium mt-1 leading-normal">{srv.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Column 4: Featured Service Card */}
              <motion.div 
                variants={columnVariants}
                whileHover={{ y: -3, scale: 1.005 }}
                className="col-span-3 bg-gradient-to-br from-slate-900 to-zinc-950 text-white rounded-xl p-5 flex flex-col justify-between h-full relative overflow-hidden group/featured shadow-md border border-slate-850"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="space-y-3.5 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Featured Service</span>
                  
                  {/* Illustration Container */}
                  <div className="w-full h-24 rounded-lg bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center overflow-hidden relative">
                    <svg className="w-14 h-14 text-emerald-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="25" y="25" width="50" height="50" rx="8" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '20s' }} />
                      <circle cx="50" cy="50" r="14" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
                      <path d="M50 42V58M42 50H58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  
                  <h5 className="text-sm font-extrabold font-display">Enterprise AI Integration</h5>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                    Automate business intelligence processes and integrate responsive LLM agents into your workflow.
                  </p>
                </div>

                <Link 
                  to="/services" 
                  onClick={() => setActiveDropdown(null)}
                  className="inline-flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all text-center group-hover/featured:scale-102 active:scale-98"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/featured:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solutions Megamenu dropdown aligned flush to the container bottom */}
        <AnimatePresence>
          {activeDropdown === 'solutions' && (
            <motion.div
              variants={megamenuVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
              className="absolute left-6 right-6 top-full mt-0 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/25 p-7 z-50 grid grid-cols-12 gap-6 text-left origin-top"
            >
              {/* Column 1: Business Solutions */}
              <motion.div variants={columnVariants} className="col-span-3 space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 px-3">Business Solutions</h4>
                <div className="space-y-0.5">
                  {bizSolutions.map((srv) => {
                    const IconComp = srv.icon;
                    return (
                      <Link
                        key={srv.label}
                        to={srv.to}
                        onClick={() => setActiveDropdown(null)}
                        className="group/item flex items-start gap-3.5 py-3 px-3 rounded-xl hover:bg-emerald-500/[0.03] transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <motion.span whileHover={{ scale: 1.08 }} className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                          <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                        </motion.span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors leading-none">{srv.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium mt-1 leading-normal">{srv.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Column 2: AI Solutions */}
              <motion.div variants={columnVariants} className="col-span-3 space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 px-3">AI Solutions</h4>
                <div className="space-y-0.5">
                  {aiSolutions.map((srv) => {
                    const IconComp = srv.icon;
                    return (
                      <Link
                        key={srv.label}
                        to={srv.to}
                        onClick={() => setActiveDropdown(null)}
                        className="group/item flex items-start gap-3.5 py-3 px-3 rounded-xl hover:bg-emerald-500/[0.03] transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <motion.span whileHover={{ scale: 1.08 }} className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                          <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                        </motion.span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors leading-none">{srv.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium mt-1 leading-normal">{srv.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Column 3: Digital Solutions */}
              <motion.div variants={columnVariants} className="col-span-3 space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 px-3">Digital Solutions</h4>
                <div className="space-y-0.5">
                  {digSolutions.map((srv) => {
                    const IconComp = srv.icon;
                    return (
                      <Link
                        key={srv.label}
                        to={srv.to}
                        onClick={() => setActiveDropdown(null)}
                        className="group/item flex items-start gap-3.5 py-3 px-3 rounded-xl hover:bg-emerald-500/[0.03] transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <motion.span whileHover={{ scale: 1.08 }} className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                          <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                        </motion.span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors leading-none">{srv.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium mt-1 leading-normal">{srv.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Column 4: Featured Solution Card */}
              <motion.div 
                variants={columnVariants}
                whileHover={{ y: -3, scale: 1.005 }}
                className="col-span-3 bg-gradient-to-br from-slate-900 to-zinc-950 text-white rounded-xl p-5 flex flex-col justify-between h-full relative overflow-hidden group/featured shadow-md border border-slate-850"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="space-y-3.5 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Featured Solution</span>
                  
                  {/* Illustration Container */}
                  <div className="w-full h-24 rounded-lg bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center overflow-hidden relative">
                    <svg className="w-14 h-14 text-emerald-400 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="12" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M50 20L50 80M20 50L80 50" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                    </svg>
                  </div>
                  
                  <h5 className="text-sm font-extrabold font-display">Intelligent Workflows</h5>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                    Deploy autonomous digital agents to automate recurring business reporting and customer requests.
                  </p>
                </div>

                <Link 
                  to="/solutions" 
                  onClick={() => setActiveDropdown(null)}
                  className="inline-flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all text-center group-hover/featured:scale-102 active:scale-98"
                >
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/featured:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl overflow-y-auto max-h-[85vh] z-40"
          >
            <div className="container-custom py-6 px-5 space-y-6">
              <div className="space-y-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">Home</Link>
                <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">Services</Link>
                <Link to="/solutions" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">Solutions</Link>
                <Link to="/industries" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">Industries</Link>
                <Link to="/work" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">Portfolio</Link>
                <Link to="/careers" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">Careers</Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">About</Link>
              </div>

              <div className="pt-4">
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="flex items-center justify-between w-full pl-6 pr-2 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full font-bold text-sm tracking-wide shadow-md">
                    <span>Contact Us</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
