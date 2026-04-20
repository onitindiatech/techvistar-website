import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
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
import { AnnouncementMarquee } from '@/components/AnnouncementMarquee';
import { useToast } from '@/hooks/use-toast';
import { NAV_LINKS } from '@/lib/constants';
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
        'https://script.google.com/macros/s/AKfycbyVFalUML0Mnb-S2RuoCA68d5422p5MvMWF_id4Uw-MIQyiH5PxiglxPGdHDV47QJ22/exec',
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
        title: 'Registration submitted',
        description: 'Thank you. Our team will contact you shortly.',
      });
      setRegisterData({ name: '', email: '', phone: '' });
      setIsRegisterOpen(false);
    } catch {
      toast({
        title: 'Submission failed',
        description: 'Unable to submit now. Please try again shortly.',
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
        onDarkHero
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md'
      )}
    >
      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between md:h-[4.25rem]">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="TechVistar"
              className={cn(
                'h-11 w-11 rounded-full object-cover ring-2 transition-all',
                onDarkHero ? 'ring-white/20' : 'ring-slate-200'
              )}
            />
            <span
              className={cn(
                'text-lg font-bold font-display tracking-tight transition-colors',
                onDarkHero ? 'text-white' : 'text-slate-900'
              )}
            >
              TechVistar
            </span>
          </Link>

          <div className="hidden items-center gap-5 lg:gap-7 xl:gap-8 md:flex">
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
              Register now
            </Button>
          </div>

          <button
            className={cn(
              'rounded-lg p-2 transition-colors md:hidden',
              onDarkHero ? 'text-white' : 'text-slate-900'
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {isHome ? <AnnouncementMarquee variant={onDarkHero ? 'dark' : 'light'} /> : null}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-slate-200 bg-white shadow-lg md:hidden"
          >
            <div className="container-custom space-y-1 py-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block rounded-lg px-2 py-3 text-sm font-medium text-slate-700 hover:bg-muted hover:text-primary"
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
            <DialogTitle className="font-display text-xl">Register now</DialogTitle>
            <DialogDescription>
              Share your details and our team will connect with you about the next batch.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Full name</Label>
              <Input
                id="reg-name"
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email ID</Label>
              <Input
                id="reg-email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-phone">Number</Label>
              <Input
                id="reg-phone"
                type="tel"
                value={registerData.phone}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 9876543210"
                required
              />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
};
