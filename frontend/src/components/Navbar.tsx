import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, Cpu, Code2, Smartphone, Cloud, Palette, 
  FolderGit2, Briefcase, Building2, ArrowRight, Brain, Repeat, 
  Settings, Sparkles, Target, Layers 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { SITE, NAVBAR_REGISTER_FORM } from '@/data';
import logo from '../assets/logo.webp';

export const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Registration Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

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
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append('name', registerData.name);
      params.append('email', registerData.email);
      params.append('subject', 'Internship registration');
      params.append('message', `Phone: ${registerData.phone}`);

      const response = await fetch(
        NAVBAR_REGISTER_FORM.actionUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit registration');
      }

      toast({
        title: NAVBAR_REGISTER_FORM.toasts.success.title,
        description: NAVBAR_REGISTER_FORM.toasts.success.description,
      });
      setRegisterData({ name: '', email: '', phone: '' });
      setIsRegisterOpen(false);
    } catch {
      toast({
        title: NAVBAR_REGISTER_FORM.toasts.error.title,
        description: NAVBAR_REGISTER_FORM.toasts.error.description,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 sm:h-22 flex items-center',
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
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 h-full">
            {/* Home */}
            <Link
              to="/"
              className={cn(
                'text-[15px] font-semibold transition-all px-4 py-2.5 rounded-lg hover:bg-slate-50 tracking-wide',
                isLinkActive('/') ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-800 hover:text-emerald-600'
              )}
            >
              Home
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
                  'flex items-center gap-1 text-[15px] font-semibold transition-all px-4 py-2.5 rounded-lg hover:bg-slate-50 tracking-wide h-11',
                  activeDropdown === 'services' || isLinkActive('/services') ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-800 hover:text-emerald-600'
                )}
              >
                <span>Services</span>
                <ChevronDown className={cn('w-4 h-4 transition-transform duration-300', activeDropdown === 'services' && 'rotate-180')} />
              </button>
            </div>

            {/* Solutions (Dropdown Trigger) */}
            <div 
              className="h-full flex items-center relative"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions')}
                className={cn(
                  'flex items-center gap-1 text-[15px] font-semibold transition-all px-4 py-2.5 rounded-lg hover:bg-slate-50 tracking-wide h-11',
                  activeDropdown === 'solutions' ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-800 hover:text-emerald-600'
                )}
              >
                <span>Solutions</span>
                <ChevronDown className={cn('w-4 h-4 transition-transform duration-300', activeDropdown === 'solutions' && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'solutions' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-72 bg-white border border-slate-200/60 rounded-xl shadow-xl p-3 z-50 text-left"
                  >
                    <div className="space-y-0.5">
                      <Link
                        to="/work"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors"
                      >
                        <FolderGit2 className="w-4.5 h-4.5 text-emerald-600" />
                        <span>Case Studies</span>
                      </Link>
                      <Link
                        to="/work?featured=true"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors"
                      >
                        <Briefcase className="w-4.5 h-4.5 text-emerald-600" />
                        <span>Featured Projects</span>
                      </Link>
                      <Link
                        to="/industries"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors"
                      >
                        <Building2 className="w-4.5 h-4.5 text-emerald-600" />
                        <span>Industries</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Portfolio */}
            <Link
              to="/work"
              className={cn(
                'text-[15px] font-semibold transition-all px-4 py-2.5 rounded-lg hover:bg-slate-50 tracking-wide',
                isLinkActive('/work') ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-800 hover:text-emerald-600'
              )}
            >
              Portfolio
            </Link>

            {/* Blog */}
            <Link
              to="/about"
              className={cn(
                'text-[15px] font-semibold transition-all px-4 py-2.5 rounded-lg hover:bg-slate-50 tracking-wide',
                isLinkActive('/blog') ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-800 hover:text-emerald-600'
              )}
            >
              Blog
            </Link>

            {/* Join TSP (Careers) */}
            <Link
              to="/careers"
              className={cn(
                'text-[15px] font-semibold transition-all px-4 py-2.5 rounded-lg hover:bg-slate-50 tracking-wide',
                isLinkActive('/careers') ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-800 hover:text-emerald-600'
              )}
            >
              Join TSP
            </Link>

            {/* About */}
            <Link
              to="/about"
              className={cn(
                'text-[15px] font-semibold transition-all px-4 py-2.5 rounded-lg hover:bg-slate-50 tracking-wide',
                isLinkActive('/about') ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-800 hover:text-emerald-600'
              )}
            >
              About
            </Link>
          </nav>

          {/* Right: Premium Outline Contact CTA */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="inline-flex items-center gap-3.5 pl-6 pr-2 py-2 border border-slate-300 rounded-full hover:border-slate-800 hover:bg-slate-50 transition-all font-bold text-sm tracking-wide text-slate-800 active:scale-95 group"
            >
              <span>{NAVBAR_REGISTER_FORM.headerButtonText}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white group-hover:bg-slate-900 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
                className="absolute left-6 right-6 top-full mt-0 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/25 p-7 z-50 grid grid-cols-12 gap-6 text-left"
              >
                {/* Column 1: Development Services */}
                <div className="col-span-3 space-y-4">
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
                          <span className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                            <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                          </span>
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
                </div>

                {/* Column 2: Design Services */}
                <div className="col-span-3 space-y-4">
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
                          <span className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                            <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                          </span>
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
                </div>

                {/* Column 3: Cloud & AI */}
                <div className="col-span-3 space-y-4">
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
                          <span className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                            <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                          </span>
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
                </div>

                {/* Column 4: Featured Service Card */}
                <div className="col-span-3 bg-gradient-to-br from-slate-900 to-zinc-950 text-white rounded-xl p-5 flex flex-col justify-between h-full relative overflow-hidden group/featured shadow-md border border-slate-850">
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
                </div>
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
                  <Link to="/work" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">Solutions</Link>
                  <Link to="/work" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">Portfolio</Link>
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">Blog</Link>
                  <Link to="/careers" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">Join TSP</Link>
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[15px] font-bold text-slate-800 border-b border-slate-100">About</Link>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsRegisterOpen(true);
                    }}
                    className="flex items-center justify-between w-full pl-6 pr-2 py-2 border border-slate-300 rounded-full hover:border-slate-800 font-bold text-sm tracking-wide text-slate-800"
                  >
                    <span>{NAVBAR_REGISTER_FORM.headerButtonText}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Registration Modal Dialog Overlay */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white border border-slate-100 p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display text-slate-900">
              {NAVBAR_REGISTER_FORM.dialog.title}
            </DialogTitle>
            <DialogDescription className="text-sm font-semibold text-slate-500 mt-1">
              {NAVBAR_REGISTER_FORM.dialog.description}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="space-y-5 pt-3">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name" className="text-xs font-bold text-slate-700">
                {NAVBAR_REGISTER_FORM.dialog.fields.name.label}
              </Label>
              <Input
                id="reg-name"
                type="text"
                placeholder={NAVBAR_REGISTER_FORM.dialog.fields.name.placeholder}
                value={registerData.name}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary font-semibold text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-xs font-bold text-slate-700">
                {NAVBAR_REGISTER_FORM.dialog.fields.email.label}
              </Label>
              <Input
                id="reg-email"
                type="email"
                placeholder={NAVBAR_REGISTER_FORM.dialog.fields.email.placeholder}
                value={registerData.email}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary font-semibold text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-phone" className="text-xs font-bold text-slate-700">
                {NAVBAR_REGISTER_FORM.dialog.fields.phone.label}
              </Label>
              <Input
                id="reg-phone"
                type="tel"
                placeholder={NAVBAR_REGISTER_FORM.dialog.fields.phone.placeholder}
                value={registerData.phone}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, phone: e.target.value }))}
                required
                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary font-semibold text-sm"
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              className="w-full h-11 text-sm font-bold shadow-md hover:shadow-lg transition-all rounded-xl mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? NAVBAR_REGISTER_FORM.dialog.submittingText : NAVBAR_REGISTER_FORM.dialog.submitButton}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
