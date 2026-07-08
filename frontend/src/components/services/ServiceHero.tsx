import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Rocket,
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Star,
} from 'lucide-react';
import { Service, getServiceHeroImage } from '@/data/services';
import { RichTextContent } from '@/components/common/RichTextContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ServiceHeroProps {
  service: Service;
}

export const ServiceHero = ({ service }: ServiceHeroProps) => {
  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const getStatIcon = (iconType: string) => {
    switch (iconType) {
      case 'rocket':
        return Rocket;
      case 'clock':
        return Clock;
      case 'dollar':
        return DollarSign;
      case 'chart':
        return TrendingUp;
      case 'shield':
        return Shield;
      case 'star':
        return Star;
      default:
        return Rocket;
    }
  };

  const getThemeClasses = (colorTheme: string) => {
    switch (colorTheme) {
      case 'green':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
      case 'purple':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/25';
      case 'gold':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
      case 'blue':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/25';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/25';
    }
  };

  const heroImage = getServiceHeroImage(service);

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-24 pb-16 md:pt-28 md:pb-20">
      {heroImage && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-contain bg-right bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />
      <motion.div
        className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-emerald-500/15 blur-[100px]"
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <Link
          to="/services"
          className="mb-8 inline-flex items-center text-sm font-semibold text-slate-400 transition-colors hover:text-emerald-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all services
        </Link>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <Badge className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-400">
              <Sparkles className="mr-1.5 inline h-3 w-3" />
              {service.heroBadge?.trim() || `${service.category} Solutions`}
            </Badge>

            <h1 className="font-display text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {service.title}
            </h1>

            <p className="text-base font-bold leading-snug text-emerald-400 md:text-lg">
              {service.heroTagline?.trim() ||
                `Enterprise-grade ${service.title.toLowerCase()} built for scale, security, and measurable outcomes.`}
            </p>

            <RichTextContent
              content={service.shortDescription}
              className="max-w-xl text-sm font-medium leading-relaxed text-slate-300 md:text-base"
            />

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={scrollToSection('offerings')}
                className="h-11 rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500"
              >
                View Offerings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={scrollToSection('contact')}
                variant="outline"
                className="h-11 rounded-xl border-white/15 bg-white/5 font-bold text-white hover:bg-white/10"
              >
                Book Consultation
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-2xl" />
              <img
                src={heroImage}
                alt={service.title}
                className="relative z-10 w-full max-w-sm object-contain drop-shadow-2xl md:max-w-md"
              />
            </div>
          </div>
        </div>

        {service.stats && service.stats.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-3 border-t border-white/10 pt-10 sm:grid-cols-4">
            {service.stats.map((stat, idx) => {
              const IconComponent = getStatIcon(stat.iconType);
              const theme = getThemeClasses(stat.colorTheme);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.08]"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${theme}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none text-white">{stat.value}</p>
                    <p className="mt-1 text-[10px] font-semibold leading-tight text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {service.benefits.length > 0 && (
          <div className="mt-8 hidden border-t border-white/10 pt-8 md:block">
            <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Key Highlights
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {service.benefits.slice(0, 4).map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs font-medium text-slate-300">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                    <Check className="h-2.5 w-2.5 text-emerald-400" />
                  </div>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceHero;
