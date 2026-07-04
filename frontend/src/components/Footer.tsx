import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DotGrid } from '@/components/DotGrid';
import logo from '../assets/logo.webp';
import { 
  Phone, Mail, MapPin, Clock, ArrowRight, ArrowUp, Star,
  Linkedin, Github, Instagram, Twitter, Youtube
} from 'lucide-react';
import { subscribeNewsletter } from '@/services/newsletter.service';

export const Footer = () => {
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
        description: "You've been added to our newsletter list for TechVistar engineering updates.",
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

  const itemFadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  return (
    <footer className="relative overflow-hidden bg-[#05070B] border-t border-zinc-900 text-slate-400 py-16 md:py-24 select-none">
      
      {/* Background DotGrid Animation */}
      <DotGrid 
        dotSize={5} 
        gap={15} 
        baseColor="#2F293A" 
        activeColor="#306035" 
        proximity={120} 
        opacity={0.35} 
      />

      {/* Subtle emerald radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container-custom max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        
        {/* TOP ROW: Column grids */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8"
        >
          {/* Column 1: Left Premium Contact Card */}
          <motion.div variants={itemFadeUp} className="lg:col-span-4 md:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={logo} alt="TechVistar" className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/10" />
              <span className="text-xl font-bold font-display text-white tracking-tight">TechVistar</span>
            </Link>
            
            <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-bold max-w-sm">
              Deploying enterprise software architecture, cognitive AI models, and secure cloud infrastructures engineered for scalable conversions.
            </p>

            {/* Info details with subtle hover glow */}
            <div className="space-y-3.5 border-t border-white/5 pt-5 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-3 group/info">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/info:bg-emerald-500/20 transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+918800000000" className="text-slate-200 hover:text-emerald-400 transition-colors font-bold">+91 88000 00000</a>
              </div>
              <div className="flex items-center gap-3 group/info">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/info:bg-emerald-500/20 transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:hello@techvistar.com" className="text-slate-200 hover:text-emerald-400 transition-colors font-bold">hello@techvistar.com</a>
              </div>
              <div className="flex items-start gap-3 group/info">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/info:bg-emerald-500/20 transition-all duration-300 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-slate-200 leading-relaxed font-bold">A-75, Sector 4, Noida, UP 201301</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-slate-400 font-bold">Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>

            {/* Google Rating Section - Themed Button */}
            <motion.a 
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3.5 bg-emerald-950/20 hover:bg-emerald-900/40 border border-emerald-500/20 hover:border-emerald-500/50 rounded-xl p-3 px-4 shadow-[0_0_15px_rgba(16,185,129,0.03)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer"
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
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Trusted by businesses</span>
                </div>
              </div>
            </motion.a>
          </motion.div>

          {/* Column 2: Services List */}
          <motion.div variants={itemFadeUp} className="lg:col-span-2 md:col-span-1 space-y-5">
            <h4 className="font-extrabold font-display text-white text-xs uppercase tracking-widest border-b border-white/5 pb-2">Services</h4>
            <ul className="space-y-3 font-bold text-xs sm:text-sm">
              {[
                { label: 'Web Development', href: '/services' },
                { label: 'Mobile Apps', href: '/services' },
                { label: 'UI/UX Design', href: '/services' },
                { label: 'AI Solutions', href: '/services' },
                { label: 'Cloud Migration', href: '/services' },
                { label: 'DevOps Pipelines', href: '/services' },
                { label: 'Automation Bots', href: '/services' },
                { label: 'Custom Software', href: '/services' },
              ].map((link) => (
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
          <motion.div variants={itemFadeUp} className="lg:col-span-2 md:col-span-1 space-y-5">
            <h4 className="font-extrabold font-display text-white text-xs uppercase tracking-widest border-b border-white/5 pb-2">Industries</h4>
            <ul className="space-y-3 font-bold text-xs sm:text-sm">
              {[
                { label: 'Healthcare', href: '/industries' },
                { label: 'Finance & Banking', href: '/industries' },
                { label: 'LMS Education', href: '/industries' },
                { label: 'Manufacturing', href: '/industries' },
                { label: 'eCommerce Retail', href: '/industries' },
                { label: 'Real Estate CRM', href: '/industries' },
                { label: 'Logistics Tracker', href: '/industries' },
                { label: 'Civic Government', href: '/industries' },
              ].map((link) => (
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
          <motion.div variants={itemFadeUp} className="lg:col-span-2 md:col-span-1 space-y-5">
            <h4 className="font-extrabold font-display text-white text-xs uppercase tracking-widest border-b border-white/5 pb-2">Company</h4>
            <ul className="space-y-3 font-bold text-xs sm:text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Portfolio', href: '/work' },
                { label: 'Core Solutions', href: '/solutions' },
                { label: 'Our Industries', href: '/industries' },
                { label: 'Careers', href: '/careers' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Portal FAQ', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Use', href: '/terms' },
              ].map((link) => (
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
          <motion.div variants={itemFadeUp} className="lg:col-span-2 md:col-span-1 space-y-5">
            <h4 className="font-extrabold font-display text-white text-xs uppercase tracking-widest border-b border-white/5 pb-2">Newsletter</h4>
            
            <div className="space-y-3">
              <h5 className="text-white text-xs font-bold leading-snug">Stay updated with TechVistar</h5>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                Get product updates, technology insights, and engineering articles.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1.5">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/[0.02] border-white/5 text-white placeholder:text-slate-600 text-xs h-10 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30"
                required
              />
              <Button type="submit" disabled={isSubmitting} size="default" className="w-full h-10 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:opacity-95">
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </motion.div>
        </motion.div>

        {/* BOTTOM ROW: Socials & copyright info bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-xs font-semibold">
          
          {/* Social circular buttons */}
          <div className="flex gap-3 order-2 md:order-1">
            {[
              { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
              { label: 'GitHub', href: 'https://github.com', icon: Github },
              { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
              { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
              { label: 'YouTube', href: 'https://youtube.com', icon: Youtube }
            ].map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -3, scale: 1.05, rotate: 3, boxShadow: '0 0 15px rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }}
                  className="w-9 h-9 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </div>

          {/* Center Copyright Info */}
          <p className="text-slate-500 order-3 md:order-2 text-center">
            &copy; {new Date().getFullYear()} TechVistar. Made with ❤️ by TechVistar.
          </p>

          {/* Right Links & Back to Top */}
          <div className="flex items-center gap-6 order-1 md:order-3">
            <div className="flex gap-4 text-slate-500">
              <a href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-emerald-400 transition-colors">Terms</a>
              <a href="/cookies" className="hover:text-emerald-400 transition-colors">Cookies</a>
              <a href="/sitemap" className="hover:text-emerald-400 transition-colors">Sitemap</a>
            </div>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2, backgroundColor: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }}
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
