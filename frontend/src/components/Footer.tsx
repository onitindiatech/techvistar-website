import { useState, type CSSProperties, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LazyMount } from '@/components/common/LazyMount';
import logo from '../assets/logo.webp';
import {
  Phone, Mail, MapPin, Clock, ArrowRight, ArrowUp, Star,
  Linkedin, Github, Instagram, Twitter, Youtube, Facebook, Dribbble,
} from 'lucide-react';
import { subscribeNewsletter } from '@/services/newsletter.service';
import { useFooterContent } from '@/hooks/useFooterContent';

const LazyDotGrid = lazy(() =>
  import('@/components/DotGrid').then((m) => ({ default: m.DotGrid })),
);

type SocialIcon = (props: { className?: string }) => JSX.Element;

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function MediumIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.09 6.41c.05-.45-.13-.85-.53-1.02L2.2 4.5v-.3h6.15l4.75 10.45L17.5 4.2h5.88v.3l-1.6.77c-.14.05-.22.18-.19.33v10.5c-.03.15.05.28.19.33l1.56.76v.3h-7.84v-.3l1.62-.79c.16-.08.16-.2.16-.33V7.3l-4.5 11.4h-.6L5.7 7.3v7.64c-.04.3.06.6.28.82l2.04 2.47v.3H2.1v-.3l2.04-2.47c.21-.22.3-.52.28-.82V6.41z" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 7h-7V5.5h7V7zM9.4 10.8c.8-.4 1.3-1.1 1.3-2.1 0-1.8-1.4-2.7-3.7-2.7H2v11.9h5.3c2.4 0 4.5-1.2 4.5-3.6 0-1.5-.8-2.6-2.4-3.5zM5.2 8.1h2c1 0 1.6.4 1.6 1.2S8.1 10.5 7 10.5H5.2V8.1zm2.3 6.9H5.2v-2.8h2.4c1.2 0 1.9.5 1.9 1.4 0 1-.8 1.4-2 1.4zM16.9 15.4c2.2 0 3.8-1.1 3.9-3h-2.1c-.2.8-.9 1.3-1.8 1.3-1.3 0-2.1-1-2.1-2.5h6.2c.1-3.2-1.7-5.5-4.5-5.5-2.6 0-4.5 2-4.5 4.8 0 2.9 1.9 4.9 4.9 4.9zm-.4-7.4c1 0 1.7.7 1.9 1.8h-3.9c.2-1.1 1-1.8 2-1.8z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, SocialIcon> = {
  linkedin: Linkedin as SocialIcon,
  github: Github as SocialIcon,
  instagram: Instagram as SocialIcon,
  twitter: Twitter as SocialIcon,
  youtube: Youtube as SocialIcon,
  facebook: Facebook as SocialIcon,
  discord: DiscordIcon,
  medium: MediumIcon,
  behance: BehanceIcon,
  dribbble: Dribbble as SocialIcon,
};

export const Footer = () => {
  const footer = useFooterContent();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    
    try {
      await subscribeNewsletter({
        email,
        source: 'footer',
      });

      toast({
        title: "Successfully Subscribed!",
        description: "You've been added to our newsletter list for Veenero engineering updates.",
      });
      setEmail('');
    } catch (err: any) {
      toast({
        title: "Subscription Failed",
        description: err.message || "Please check your inputs and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const footerStyle: CSSProperties = {
    backgroundColor: footer.backgroundColor,
    ...(footer.backgroundImage
      ? {
          backgroundImage: `url(${footer.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {}),
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  return (
    <footer
      className="relative overflow-hidden border-t border-zinc-900 text-slate-400 py-8 md:py-24 select-none"
      style={footerStyle}
    >
      
      {/* Background DotGrid Animation — deferred (GSAP) */}
      <LazyMount minHeight="0" rootMargin="400px 0px">
        <Suspense fallback={null}>
          <LazyDotGrid
            dotSize={5}
            gap={15}
            baseColor="#2F293A"
            activeColor="#306035"
            proximity={120}
            opacity={0.35}
          />
        </Suspense>
      </LazyMount>

      {/* Subtle emerald radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(100vw,600px)] h-[200px] md:h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container-custom max-w-7xl mx-auto px-4 md:px-6 relative z-10 space-y-8 md:space-y-16">
        
        {/* TOP ROW: Column grids */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-12 lg:gap-8"
        >
          {/* Column 1: Left Premium Contact Card */}
          <motion.div variants={itemFadeUp} className="lg:col-span-4 md:col-span-2 space-y-4 md:space-y-6">
            <Link to="/" className="inline-flex items-center gap-2.5 md:gap-3 min-w-0">
              <img src={footer.logo || logo} alt={footer.heading} className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-emerald-500/10 shrink-0" />
              <span className="truncate font-display text-heading-xs text-white md:text-heading-sm">{footer.heading}</span>
            </Link>
            
            <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-bold max-w-sm">
              {footer.companyDescription}
            </p>

            {/* Info details with subtle hover glow */}
            <div className="space-y-2.5 md:space-y-3.5 border-t border-white/5 pt-4 md:pt-5 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-3 group/info">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/info:bg-emerald-500/20 transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <a href={`tel:${footer.phone.replace(/\s/g, '')}`} className="text-slate-200 hover:text-emerald-400 transition-colors font-bold">{footer.phone}</a>
              </div>
              <div className="flex items-center gap-3 group/info">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/info:bg-emerald-500/20 transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <a href={`mailto:${footer.email}`} className="text-slate-200 hover:text-emerald-400 transition-colors font-bold">{footer.email}</a>
              </div>
              <div className="flex items-start gap-3 group/info">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/info:bg-emerald-500/20 transition-all duration-300 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-slate-200 leading-relaxed font-bold">{footer.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-slate-400 font-bold">{footer.workingHours}</span>
              </div>
            </div>

            {/* Google Rating Section - Themed Button */}
            <motion.a 
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 md:gap-3.5 bg-emerald-950/20 hover:bg-emerald-900/40 border border-emerald-500/20 hover:border-emerald-500/50 rounded-xl p-2.5 md:p-3 px-3 md:px-4 shadow-[0_0_15px_rgba(14,165,233,0.03)] hover:shadow-[0_0_20px_rgba(14,165,233,0.2)] transition-all duration-300 cursor-pointer"
            >
              {/* Google G icon */}
              <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-0.5 text-yellow-500">
                  <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-white text-xs font-bold">4.9 / 5</span>
                  <span className="text-label uppercase text-emerald-400">Trusted by businesses</span>
                </div>
              </div>
            </motion.a>
          </motion.div>

          {/* Link columns — 2-up on mobile, original grid from md */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:contents">
          {/* Column 2: Services List */}
          <motion.div variants={itemFadeUp} className="lg:col-span-2 md:col-span-1 space-y-3 md:space-y-5">
            <div className="border-b border-white/5 pb-1.5 font-sans text-sm sm:text-base font-extrabold uppercase tracking-wider text-white md:pb-2">Services</div>
            <ul className="space-y-2 md:space-y-3 font-bold text-sm sm:text-base">
              {footer.serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-slate-300 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group/lnk"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover/lnk:opacity-100 group-hover/lnk:translate-x-1 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Industries Serve List */}
          <motion.div variants={itemFadeUp} className="lg:col-span-2 md:col-span-1 space-y-3 md:space-y-5">
            <div className="border-b border-white/5 pb-1.5 font-sans text-sm sm:text-base font-extrabold uppercase tracking-wider text-white md:pb-2">Industries</div>
            <ul className="space-y-2 md:space-y-3 font-bold text-sm sm:text-base">
              {footer.industryLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-slate-300 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group/lnk"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover/lnk:opacity-100 group-hover/lnk:translate-x-1 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Company Links */}
          <motion.div variants={itemFadeUp} className="lg:col-span-2 md:col-span-1 space-y-3 md:space-y-5">
            <div className="border-b border-white/5 pb-1.5 font-sans text-sm sm:text-base font-extrabold uppercase tracking-wider text-white md:pb-2">Company</div>
            <ul className="space-y-2 md:space-y-3 font-bold text-sm sm:text-base">
              {footer.companyLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-slate-300 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group/lnk"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover/lnk:opacity-100 group-hover/lnk:translate-x-1 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 5: Premium Newsletter Card */}
          <motion.div variants={itemFadeUp} className="col-span-2 lg:col-span-2 md:col-span-1 space-y-3 md:space-y-5">
            <div className="border-b border-white/5 pb-1.5 font-sans text-sm sm:text-base font-extrabold uppercase tracking-wider text-white md:pb-2">Newsletter</div>
            
            <div className="space-y-3">
              <div className="text-white text-sm font-bold leading-snug">{footer.newsletterHeading}</div>
              <p className="text-sm text-slate-300 font-semibold leading-relaxed">
                {footer.newsletterDescription}
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1.5">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/[0.02] border-white/5 text-white placeholder:text-slate-600 text-sm h-10 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30"
                required
              />
              <motion.button 
                whileHover={{ y: -1 }}
                whileTap={{ y: 0, scale: 0.98 }}
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-10 bg-[#041a3d] hover:bg-[#021028] text-white font-extrabold text-sm rounded-xl shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
              </motion.button>
            </form>
          </motion.div>
          </div>
        </motion.div>

        {/* BOTTOM ROW: Socials & copyright info bar */}
        <div className="pt-5 md:pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative z-10 text-[11px] md:text-xs font-semibold">
          
          {/* Social circular buttons */}
          <div className="flex gap-3 order-2 md:order-1">
            {footer.socialLinks.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform.toLowerCase()];
              if (!Icon) return null;
              return (
                <motion.a
                  key={social.platform + social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  whileHover={{ y: -3, scale: 1.05, rotate: 3, boxShadow: '0 0 15px rgba(14,165,233,0.15)', borderColor: 'rgba(14,165,233,0.3)' }}
                  className="w-9 h-9 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </div>

          {/* Center Copyright Info */}
          <p className="text-slate-500 order-3 md:order-2 text-center max-w-xs md:max-w-none leading-relaxed">
            {footer.copyright}
            {footer.bottomText ? ` ${footer.bottomText}` : ''}
          </p>

          {/* Right Links & Back to Top */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 order-1 md:order-3">
            {footer.legalLinks.length > 0 && (
              <div className="flex gap-4 text-slate-500">
                {footer.legalLinks.map((link) =>
                  link.href.startsWith('http') ? (
                    <a
                      key={link.label + link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label + link.href}
                      to={link.href}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            )}

            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2, backgroundColor: 'rgba(14,165,233,0.15)', borderColor: 'rgba(14,165,233,0.3)' }}
              className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-emerald-400 flex items-center justify-center transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
