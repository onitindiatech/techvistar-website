import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home } from 'lucide-react';
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
import { NAV_LINKS, SITE, NAVBAR_REGISTER_FORM } from '@/data';
import logo from '../logo.webp';

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
  const { toast } = useToast();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash === '#register') {
      setIsRegisterOpen(true);
      setIsMobileMenuOpen(false);
    }
  }, [location.hash]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const scrollToSection = (hash: string) => {
    const sectionId = hash.replace('#', '');
    const target = document.getElementById(sectionId);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', hash);
  };

  const handleNavClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith('/#')) {
      closeMobileMenu();
      return;
    }

    e.preventDefault();
    closeMobileMenu();
    const hash = href.replace('/', '');

    if (isHome) {
      scrollToSection(hash);
      return;
    }

    navigate(`/${hash}`);
  };

  const openRegisterModal = () => {
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

  /** Dark hero on home: transparent bar + light text until scroll */
  const onDarkHero = isHome && !isScrolled;

  const linkClass = cn(
    'text-sm font-medium transition-colors relative py-1',
    onDarkHero ? 'text-white/85 hover:text-white' : 'text-slate-600 hover:text-slate-900'
  );

  const underlineClass = cn(
    'absolute -bottom-0.5 left-0 h-0.5 rounded-full transition-all duration-300',
    onDarkHero ? 'bg-white/80 w-0 group-hover:w-full' : 'bg-primary w-0 group-hover:w-full'
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        // Mobile: always transparent so it floats over the video
        'border-b border-transparent bg-transparent',
        // Tablet/Desktop: switch to solid when scrolled or not on dark hero
        !onDarkHero && 'md:border-b md:border-slate-200/90 md:bg-white/95 md:shadow-sm md:backdrop-blur-md'
      )}
    >
      <nav className="container-custom">
        <div className="flex h-12 items-center justify-between sm:h-14 md:h-16 lg:h-[4.25rem]">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt={SITE.name}
              className={cn(
                'h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 rounded-full object-cover ring-2 transition-all',
                // Mobile always on dark hero (transparent header over video)
                'ring-white/20 md:ring-white/20',
                !onDarkHero && 'md:ring-slate-200'
              )}
            />
            <span
              className={cn(
                'text-sm sm:text-base md:text-lg font-bold font-display tracking-tight transition-colors',
                // Mobile always white text (floating over video)
                'text-white',
                !onDarkHero && 'md:text-slate-900'
              )}
            >
              {SITE.name}
            </span>
          </Link>

          <div className="hidden items-center gap-5 lg:gap-7 xl:gap-8 md:flex">
            <Link
              to="/"
              className={cn(linkClass, 'group flex items-center gap-1')}
              onClick={handleNavClick('/')}
              aria-label="Home"
            >
              <Home size={17} className="transition-transform group-hover:scale-105" />
              <span className={underlineClass} />
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={cn(linkClass, 'group')}
                onClick={handleNavClick(link.href)}
              >
                {link.label}
                <span className={underlineClass} />
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button
              variant="hero"
              size="default"
              className={cn(
                'rounded-full font-semibold',
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
              // Mobile always white text over the video
              'text-white'
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>



      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-xl md:hidden"
          >
            <div className="container-custom space-y-1 py-4">
              <Link
                to="/"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                onClick={handleNavClick('/')}
              >
                <Home size={16} />
                Home
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={handleNavClick(link.href)}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="hero" size="lg" className="mt-4 w-full" onClick={openRegisterModal}>
                Register now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{NAVBAR_REGISTER_FORM.dialog.title}</DialogTitle>
            <DialogDescription>
              {NAVBAR_REGISTER_FORM.dialog.description}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">{NAVBAR_REGISTER_FORM.dialog.fields.name.label}</Label>
              <Input
                id="reg-name"
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={NAVBAR_REGISTER_FORM.dialog.fields.name.placeholder}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">{NAVBAR_REGISTER_FORM.dialog.fields.email.label}</Label>
              <Input
                id="reg-email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={NAVBAR_REGISTER_FORM.dialog.fields.email.placeholder}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-phone">{NAVBAR_REGISTER_FORM.dialog.fields.phone.label}</Label>
              <Input
                id="reg-phone"
                type="tel"
                value={registerData.phone}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder={NAVBAR_REGISTER_FORM.dialog.fields.phone.placeholder}
                required
              />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? NAVBAR_REGISTER_FORM.dialog.submittingText : NAVBAR_REGISTER_FORM.dialog.submitButton}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
};
