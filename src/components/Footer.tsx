import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { FOOTER_DESCRIPTION, FOOTER_LINKS, FOOTER_NEWSLETTER, FOOTER_COPYRIGHT } from '@/data';
import logo from '../assets/logo.webp';

export const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const response = await fetch(
        FOOTER_NEWSLETTER.actionUrl,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        toast({
          title: FOOTER_NEWSLETTER.toasts.success.title,
          description: FOOTER_NEWSLETTER.toasts.success.description,
        });
        setEmail('');
      } else {
        throw new Error('Failed');
      }
    } catch {
      toast({
        title: FOOTER_NEWSLETTER.toasts.error.title,
        description: FOOTER_NEWSLETTER.toasts.error.description,
        variant: 'destructive',
      });
    }
  };

  return (
    <footer className="bg-[#0a1f1c] text-emerald-100/70 border-t border-emerald-950/80">
      <div className="container-custom py-14 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src={logo} alt="TechVistar" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
              <span className="text-lg font-bold font-display text-white tracking-tight">TechVistar</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm text-emerald-100/65">
              {FOOTER_DESCRIPTION}
            </p>
            <div className="flex gap-2">
              {FOOTER_LINKS.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-200/70 hover:text-white hover:border-emerald-600/60 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold font-display text-white mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-display text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-display text-white mb-4 text-sm uppercase tracking-wider">{FOOTER_NEWSLETTER.title}</h4>
            <p className="text-sm mb-4">{FOOTER_NEWSLETTER.description}</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder={FOOTER_NEWSLETTER.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-emerald-950/50 border-emerald-800/80 text-white placeholder:text-emerald-200/40 text-sm"
                required
              />
              <Button type="submit" size="default" className="shrink-0 bg-primary hover:bg-primary/90">
                {FOOTER_NEWSLETTER.buttonText}
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-emerald-200/45">© {new Date().getFullYear()} {FOOTER_COPYRIGHT.text}</p>
          <div className="flex gap-8">
            {FOOTER_COPYRIGHT.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-emerald-200/45 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
