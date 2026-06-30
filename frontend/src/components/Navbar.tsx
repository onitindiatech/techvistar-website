import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Cpu, Code2, Smartphone, Cloud, Palette, FolderGit2, Briefcase, Building2, HelpCircle, UserCheck, Mail, ArrowRight, BookOpen, Users } from 'lucide-react';
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
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isCardNavOpen, setIsCardNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // Click outside to close card nav
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsCardNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCardNavOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  const handleLinkClick = () => {
    setIsCardNavOpen(false);
    closeMobileMenu();
  };

  const openRegisterModal = () => {
    setIsCardNavOpen(false);
    closeMobileMenu();
    setIsRegisterOpen(true);
  };

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

  const onDarkHero = isHome && !isScrolled && !isCardNavOpen;

  const cardNavItems = [
    {
      title: 'Services',
      description: 'Enterprise AI & digital engineering solutions.',
      accent: 'Services',
      links: [
        { label: 'AI Solutions', to: '/services/ai-automation', icon: Cpu },
        { label: 'Web Development', to: '/services/web-development', icon: Code2 },
        { label: 'Mobile Apps', to: '/services/mobile-app-development', icon: Smartphone },
        { label: 'Cloud & DevOps', to: '/services/cloud-devops', icon: Cloud },
        { label: 'UI/UX Design', to: '/services/brand-creative-design', icon: Palette },
      ]
    },
    {
      title: 'Work',
      description: 'Anonymized case studies and technologies.',
      accent: 'Work',
      links: [
        { label: 'Case Studies', to: '/work', icon: FolderGit2 },
        { label: 'Featured Projects', to: '/work?featured=true', icon: Briefcase },
        { label: 'Industries', to: '/work', icon: Building2 },
        { label: 'Technologies', to: '/work', icon: HelpCircle },
      ]
    },
    {
      title: 'Company',
      description: 'About our mission, team, and openings.',
      accent: 'Company',
      links: [
        { label: 'About', to: '/about', icon: UserCheck },
        { label: 'Careers', to: '/careers', icon: Briefcase },
        { label: 'Contact', to: '/#contact', icon: Mail },
        { label: 'FAQ', to: '/faq', icon: HelpCircle },
        { label: 'Blog', to: '/about', icon: BookOpen, disabled: true },
        { label: 'Team', to: '/about', icon: Users, disabled: true },
      ]
    }
  ];

  return (
    <motion.header
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'border-b border-transparent bg-transparent',
        (!onDarkHero || isScrolled) && 'border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md'
      )}
    >
      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
            <img
              src={logo}
              alt={SITE.name}
              className={cn(
                'h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-2 transition-all',
                onDarkHero ? 'ring-white/20' : 'ring-slate-200'
              )}
            />
            <span
              className={cn(
                'text-base md:text-lg font-bold font-display tracking-tight transition-colors',
                onDarkHero ? 'text-white' : 'text-slate-900'
              )}
            >
              {SITE.name}
            </span>
          </Link>

          {/* Center Navigation Toggle */}
          <div className="hidden items-center gap-3 md:flex">
            {!isHome && (
              <Link
                to="/"
                onClick={handleLinkClick}
                className={cn(
                  'text-sm font-semibold transition-all px-4 py-2 rounded-full border flex items-center gap-1.5',
                  onDarkHero
                    ? 'text-white border-white/10 bg-white/5 hover:bg-white/10'
                    : 'text-slate-700 border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 hover:text-slate-900'
                )}
              >
                <Home size={14} className="opacity-80" />
                <span>Home</span>
              </Link>
            )}
            <button
              onClick={() => setIsCardNavOpen(!isCardNavOpen)}
              className={cn(
                'text-sm font-semibold transition-all relative px-5 py-2 rounded-full flex items-center gap-2 border',
                onDarkHero 
                  ? 'text-white border-white/10 bg-white/5 hover:bg-white/10' 
                  : 'text-slate-700 border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 hover:text-slate-900'
              )}
            >
              <span>Explore TechVistar</span>
              <motion.span
                animate={{ rotate: isCardNavOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                ▼
              </motion.span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="hero"
              size="default"
              className={cn(
                'rounded-xl font-semibold',
                onDarkHero && 'shadow-lg shadow-primary/25'
              )}
              onClick={openRegisterModal}
            >
              {NAVBAR_REGISTER_FORM.headerButtonText}
            </Button>
          </div>

          <button
            className={cn(
              'rounded-lg p-1.5 transition-colors md:hidden',
              onDarkHero ? 'text-white' : 'text-slate-900'
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Desktop CardNav Dropdown Overlay */}
      <AnimatePresence>
        {isCardNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="hidden md:block absolute left-0 right-0 top-full bg-white border-b border-emerald-500/10 shadow-2xl overflow-hidden"
          >
            <div className="container-custom py-10">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } }
                }}
                className="grid grid-cols-3 gap-6"
              >
                {cardNavItems.map((card) => (
                  <motion.div
                    key={card.title}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
                    }}
                    onMouseEnter={() => setHoveredCard(card.title)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={cn(
                      'relative p-6 rounded-2xl border border-emerald-500/5 bg-slate-50/50 transition-all duration-300 flex flex-col',
                      hoveredCard === card.title 
                        ? 'border-emerald-500/20 bg-emerald-50/[0.15] shadow-md -translate-y-1' 
                        : 'shadow-sm'
                    )}
                  >
                    {/* Hover border glow template */}
                    <div 
                      className={cn(
                        "absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-teal-500/5 opacity-0 transition-opacity duration-500 pointer-events-none",
                        hoveredCard === card.title && "opacity-100"
                      )} 
                    />

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
                      {card.accent}
                    </span>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-slate-500 text-xs mb-6 font-medium">
                      {card.description}
                    </p>

                    <div className="space-y-2 mt-auto">
                      {card.links.map((link) => {
                        const IconComponent = link.icon;
                        const isLinkDisabled = 'disabled' in link && link.disabled;
                        
                        return (
                          <Link
                            key={link.label}
                            to={isLinkDisabled ? '#' : link.to}
                            onClick={(e) => {
                              if (isLinkDisabled) {
                                e.preventDefault();
                                return;
                              }
                              handleLinkClick();
                            }}
                            className={cn(
                              'group/link flex items-center justify-between px-3 py-2.5 rounded-xl border border-transparent transition-all duration-200',
                              isLinkDisabled
                                ? 'opacity-50 cursor-not-allowed hover:bg-transparent'
                                : 'hover:border-emerald-500/10 hover:bg-white hover:text-primary'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="p-1.5 rounded-lg bg-emerald-500/5 text-emerald-600 transition-colors group-hover/link:bg-primary group-hover/link:text-white">
                                <IconComponent className="h-4 w-4" />
                              </span>
                              <span className="text-sm font-semibold text-slate-700 group-hover/link:text-primary">
                                {link.label}
                              </span>
                            </div>
                            {!isLinkDisabled && (
                              <ArrowRight className="h-4 w-4 text-slate-400 group-hover/link:text-primary transition-all group-hover/link:translate-x-0.5" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile CardNav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-xl md:hidden overflow-y-auto max-h-[85vh]"
          >
            <div className="container-custom py-6 space-y-6">
              {cardNavItems.map((card) => (
                <div key={card.title} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                      {card.title}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {card.links.map((link) => {
                      const isLinkDisabled = 'disabled' in link && link.disabled;
                      if (isLinkDisabled) return null;
                      
                      return (
                        <Link
                          key={link.label}
                          to={link.to}
                          onClick={handleLinkClick}
                          className="flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/5 px-3 py-2.5 text-sm font-semibold text-white/95"
                        >
                          <link.icon className="h-4 w-4 text-emerald-400" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Button variant="hero" size="lg" className="w-full" onClick={openRegisterModal}>
                  Register now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
export default Navbar;
