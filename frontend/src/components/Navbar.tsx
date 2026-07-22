import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE } from '@/data';
import { useQuery } from '@tanstack/react-query';
import { getPublicPagesConfig } from '@/services/pages.service';
import { getActiveServices } from '@/services/services.service';
import { getActiveSolutions } from '@/services/solutions.service';
import { buildServiceNavColumns, buildSolutionNavColumns } from '@/lib/navMegaMenu';
import { mergePagesCmsConfig } from '@/types/pagesCms';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import logo from '../assets/logo.webp';

export const Navbar = () => {
  const location = useLocation();
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });
  const { data: activeServices } = useQuery({
    queryKey: ['activeServices'],
    queryFn: getActiveServices,
  });
  const { data: activeSolutions } = useQuery({
    queryKey: ['activeSolutions'],
    queryFn: () => getActiveSolutions(),
  });
  const serviceNavColumns = useMemo(
    () => buildServiceNavColumns(activeServices),
    [activeServices],
  );
  const solutionNavColumns = useMemo(
    () => buildSolutionNavColumns(activeSolutions),
    [activeSolutions],
  );
  const websiteSettings = mergePagesCmsConfig(pagesConfig).websiteSettings;
  const navLogo = websiteSettings.logo?.trim() || logo;
  const companyName = websiteSettings.companyName?.trim() || SITE.name;
  const ctaText = websiteSettings.navbar.ctaButtonText || 'Contact Us';
  const ctaLink = websiteSettings.navbar.ctaButtonLink || '/contact';
  const showAnnouncement =
    websiteSettings.navbar.announcementBarEnabled &&
    Boolean(websiteSettings.navbar.announcementText?.trim());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileSolutionsOpen, setIsMobileSolutionsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    const updateHeight = () => {
      const height = navbar.offsetHeight;
      document.documentElement.style.setProperty('--primary-nav-height', `${height}px`);
      window.dispatchEvent(new CustomEvent('primary-nav-height-change', { detail: height }));
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    resizeObserver.observe(navbar);

    window.addEventListener('resize', updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [showAnnouncement]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showAnnouncement) {
      document.documentElement.setAttribute('data-announcement-bar', 'true');
    } else {
      document.documentElement.removeAttribute('data-announcement-bar');
    }
    return () => document.documentElement.removeAttribute('data-announcement-bar');
  }, [showAnnouncement]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsMobileServicesOpen(false);
      setIsMobileSolutionsOpen(false);
    }
  }, [isMobileMenuOpen]);

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
    <div ref={navbarRef} className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {showAnnouncement ? (
        <AnnouncementBar
          text={websiteSettings.navbar.announcementText}
          link={websiteSettings.navbar.announcementLink}
          buttonText={websiteSettings.navbar.announcementButtonText}
        />
      ) : null}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-[56px] md:h-20 flex items-center',
          isScrolled
            ? 'bg-white shadow-md shadow-slate-100/45 border-b border-slate-200/50'
            : 'bg-white border-b border-slate-100'
        )}
      >
      <div className="w-full mx-auto flex items-center justify-between px-4 md:px-6 lg:px-12 xl:px-20 relative h-full gap-2" ref={dropdownRef}>
        {/* Logo Branding — always returns to homepage */}
        <Link
          to="/"
          aria-label={`${companyName} — Home`}
          className="flex items-center gap-2 md:gap-3 group shrink min-w-0 cursor-pointer rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2"
        >
          <img
            src={navLogo}
            alt={SITE.name}
            className="h-[34px] w-[34px] md:h-10 md:w-10 rounded-full object-cover ring-2 ring-emerald-500/10 group-hover:ring-emerald-500/30 transition-all duration-300 shrink-0"
          />
          <span className="text-base md:text-xl font-extrabold font-display tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors truncate max-w-[9.5rem] sm:max-w-[12rem] md:max-w-none">
            {companyName}
          </span>
        </Link>

        {/* Centered Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 h-full">
          {/* About */}
          <Link
            to="/about"
            onMouseEnter={() => setHoveredItem('About')}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              'text-nav transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 relative',
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

          {/* Services (Megamenu Dropdown Trigger) */}
          <div 
            className="h-full flex items-center"
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
              className={cn(
                'flex items-center gap-1.5 text-nav transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 h-10 relative',
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
                'flex items-center gap-1.5 text-nav transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 h-10 relative',
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

          {/* Portfolio */}
          <Link
            to="/work"
            onMouseEnter={() => setHoveredItem('Portfolio')}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              'text-nav transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 relative',
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
              'text-nav transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 relative',
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

          {/* Industries */}
          <Link
            to="/industries"
            onMouseEnter={() => setHoveredItem('Industries')}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              'text-nav transition-all px-3.5 py-2 rounded-lg hover:bg-slate-50 relative',
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
        </nav>

        {/* Right: Premium Contact CTA */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <Link to={ctaLink}>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 h-10 pl-4 pr-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors duration-200 text-sm font-semibold tracking-tight shadow-[0_1px_2px_rgba(16,185,129,0.2),0_4px_12px_-2px_rgba(16,185,129,0.35)] hover:shadow-[0_2px_4px_rgba(16,185,129,0.25),0_8px_20px_-4px_rgba(16,185,129,0.4)] group"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform duration-200" />
            </motion.button>
          </Link>
        </div>

        {/* Mobile hamburger menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden mobile-touch-target inline-flex items-center justify-center p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-800 shrink-0"
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
              {serviceNavColumns.map((column) => (
                <motion.div key={column.title} variants={columnVariants} className="col-span-3 space-y-4">
                  <div className="mb-1 px-3 text-label font-extrabold uppercase text-slate-400">{column.title}</div>
                  <div className="space-y-0.5">
                    {column.items.map((srv) => {
                      const IconComp = srv.icon;
                      return (
                        <Link
                          key={srv.slug}
                          to={srv.to}
                          onClick={() => setActiveDropdown(null)}
                          className="group/item flex items-start gap-3.5 py-3 px-3 rounded-xl hover:bg-emerald-500/[0.03] transition-all duration-200 hover:-translate-y-0.5"
                        >
                          <motion.span whileHover={{ scale: 1.08 }} className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                            <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                          </motion.span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-mega text-slate-800 group-hover/item:text-emerald-700 transition-colors">{srv.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                            </div>
                            <p className="mt-1 text-mega-desc text-slate-400">{srv.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              {/* Column 4: Featured Service Card */}
              <motion.div 
                variants={columnVariants}
                whileHover={{ y: -3, scale: 1.005 }}
                className="col-span-3 bg-gradient-to-br from-slate-900 to-zinc-950 text-white rounded-xl p-5 flex flex-col justify-between h-full relative overflow-hidden group/featured shadow-md border border-slate-850"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="space-y-3.5 relative z-10">
                  <span className="text-label uppercase text-emerald-400">Featured Service</span>
                  
                  {/* Illustration Container */}
                  <div className="w-full h-24 rounded-lg bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center overflow-hidden relative">
                    <svg className="w-14 h-14 text-emerald-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="25" y="25" width="50" height="50" rx="8" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '20s' }} />
                      <circle cx="50" cy="50" r="14" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
                      <path d="M50 42V58M42 50H58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  
                  <div className="text-sm font-extrabold font-display">Enterprise AI Integration</div>
                  <p className="text-mega-desc font-semibold text-slate-400">
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
              {solutionNavColumns.map((column) => (
                <motion.div key={column.title} variants={columnVariants} className="col-span-3 space-y-4">
                  <div className="mb-1 px-3 text-label font-extrabold uppercase text-slate-400">{column.title}</div>
                  <div className="space-y-0.5">
                    {column.items.map((srv) => {
                      const IconComp = srv.icon;
                      return (
                        <Link
                          key={srv.slug}
                          to={srv.to}
                          onClick={() => setActiveDropdown(null)}
                          className="group/item flex items-start gap-3.5 py-3 px-3 rounded-xl hover:bg-emerald-500/[0.03] transition-all duration-200 hover:-translate-y-0.5"
                        >
                          <motion.span whileHover={{ scale: 1.08 }} className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700 transition-all duration-300 mt-0.5 shrink-0">
                            <IconComp className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                          </motion.span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-mega text-slate-800 group-hover/item:text-emerald-700 transition-colors">{srv.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                            </div>
                            <p className="mt-1 text-mega-desc text-slate-400">{srv.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              {/* Column 4: Featured Solution Card */}
              <motion.div 
                variants={columnVariants}
                whileHover={{ y: -3, scale: 1.005 }}
                className="col-span-3 bg-gradient-to-br from-slate-900 to-zinc-950 text-white rounded-xl p-5 flex flex-col justify-between h-full relative overflow-hidden group/featured shadow-md border border-slate-850"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="space-y-3.5 relative z-10">
                  <span className="text-label uppercase text-emerald-400">Featured Solution</span>
                  
                  {/* Illustration Container */}
                  <div className="w-full h-24 rounded-lg bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center overflow-hidden relative">
                    <svg className="w-14 h-14 text-emerald-400 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="12" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M50 20L50 80M20 50L80 50" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                    </svg>
                  </div>
                  
                  <div className="text-sm font-extrabold font-display">Intelligent Workflows</div>
                  <p className="text-mega-desc font-semibold text-slate-400">
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
            <div className="container-custom py-4 md:py-6 px-4 md:px-5 space-y-4 md:space-y-6">
              <div className="space-y-1 md:space-y-2">
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block border-b border-slate-100 py-2.5 text-nav font-bold text-slate-800">About</Link>

                {/* Services Accordion */}
                <div>
                  <button
                    onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                    className="flex w-full items-center justify-between border-b border-slate-100 py-2.5 text-left text-nav font-bold text-slate-800"
                  >
                    <span>Services</span>
                    <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-205", isMobileServicesOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {isMobileServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 py-2 border-l-2 border-emerald-500/20 space-y-3 mt-1 overflow-hidden"
                      >
                        <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-xs font-bold text-emerald-600 uppercase tracking-wider">→ View All Services</Link>
                        
                        {serviceNavColumns.map((column, columnIndex) => (
                          <div key={column.title} className={cn('space-y-2', columnIndex === 0 ? 'pt-1' : 'pt-2')}>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-450 block">{column.title.replace(/ Services$/, '')}</span>
                            {column.items.map((srv) => (
                              <Link key={srv.slug} to={srv.to} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-1 text-sm font-semibold text-slate-700 hover:text-emerald-600">
                                <srv.icon className="w-3.5 h-3.5 text-emerald-500/70" />
                                <span>{srv.label}</span>
                              </Link>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Solutions Accordion */}
                <div>
                  <button
                    onClick={() => setIsMobileSolutionsOpen(!isMobileSolutionsOpen)}
                    className="flex w-full items-center justify-between border-b border-slate-100 py-2.5 text-left text-nav font-bold text-slate-800"
                  >
                    <span>Solutions</span>
                    <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-205", isMobileSolutionsOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {isMobileSolutionsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 py-2 border-l-2 border-emerald-500/20 space-y-3 mt-1 overflow-hidden"
                      >
                        <Link to="/solutions" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-xs font-bold text-emerald-600 uppercase tracking-wider">→ View All Solutions</Link>
                        
                        {solutionNavColumns.map((column, columnIndex) => (
                          <div key={column.title} className={cn('space-y-2', columnIndex === 0 ? 'pt-1' : 'pt-2')}>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-450 block">{column.title.replace(/ Solutions$/, '')}</span>
                            {column.items.map((srv) => (
                              <Link key={srv.slug} to={srv.to} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-1 text-sm font-semibold text-slate-700 hover:text-emerald-600">
                                <srv.icon className="w-3.5 h-3.5 text-emerald-500/70" />
                                <span>{srv.label}</span>
                              </Link>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/work" onClick={() => setIsMobileMenuOpen(false)} className="block border-b border-slate-100 py-2.5 text-nav font-bold text-slate-800">Portfolio</Link>
                <Link to="/careers" onClick={() => setIsMobileMenuOpen(false)} className="block border-b border-slate-100 py-2.5 text-nav font-bold text-slate-800">Careers</Link>
                <Link to="/industries" onClick={() => setIsMobileMenuOpen(false)} className="block border-b border-slate-100 py-2.5 text-nav font-bold text-slate-800">Industries</Link>
              </div>

              <div className="pt-4">
                <Link to={ctaLink} onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="inline-flex items-center justify-center gap-2 w-full h-11 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold tracking-tight shadow-[0_1px_2px_rgba(16,185,129,0.2),0_4px_12px_-2px_rgba(16,185,129,0.35)] transition-colors duration-200">
                    <span>{ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-90" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.header>
    </div>
  );
};

export default Navbar;
