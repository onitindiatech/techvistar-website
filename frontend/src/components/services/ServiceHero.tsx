import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Check,
  ArrowRight,
  Sparkles,
  Send,
  Rocket,
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Star
} from 'lucide-react';
import { Service, getServiceHeroImage } from '@/data/services';
import { RichTextContent } from '@/components/common/RichTextContent';

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
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
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
        return {
          iconBg: 'bg-emerald-100 text-emerald-600',
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-100 text-purple-600',
        };
      case 'gold':
        return {
          iconBg: 'bg-amber-100 text-amber-600',
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-100 text-blue-600',
        };
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-600',
        };
    }
  };

  return (
    <section className="bg-[#f8fafc] border-b border-slate-200 pt-24 pb-10 md:pt-28 md:pb-14 mb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/services" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all services
        </Link>

        {/* Main Grid: Centered Content */}
        <div className="flex flex-col gap-12 w-full relative z-10">
          
          {/* Main Content Area */}
          <div className="w-full space-y-6">
            
            {/* Top Half: Text Details & Robot Illustration side by side */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Text Area */}
              <div className="md:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  {service.heroBadge?.trim() || `${service.title} Solutions`}
                </div>
                
                <h1 className="text-3xl md:text-5xl font-extrabold font-display text-slate-900 leading-tight">
                  {service.title}
                </h1>
                
                <p className="text-base md:text-lg font-bold text-emerald-600 leading-snug">
                  {service.heroTagline?.trim() ||
                    `Accelerate your digital footprint with custom ${service.title.toLowerCase()} configurations.`}
                </p>
                
                <RichTextContent
                  content={service.longDescription}
                  className="text-slate-600 text-sm leading-relaxed"
                />

                {/* Key Highlights */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-semibold">
                    Key Highlights
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                    {service.benefits.map((highlight, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-700 font-medium">
                        <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 flex items-center justify-center p-0.5 mt-0.5 shrink-0 border border-emerald-100">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cover Image / Illustration Area */}
              <div className="md:col-span-5 flex items-center justify-center py-4 md:py-0">
                <img
                  src={getServiceHeroImage(service)}
                  alt={service.title}
                  className="w-full max-w-[280px] md:max-w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Bottom Half: Stats, Buttons, and Partner Logos */}
            <div className="space-y-6 pt-6 border-t border-slate-200/60">
              
              {/* Stats Cards */}
              {service.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {service.stats.map((stat, idx) => {
                    const IconComponent = getStatIcon(stat.iconType);
                    const theme = getThemeClasses(stat.colorTheme);
                    return (
                      <div key={idx} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`h-8 w-8 rounded-full ${theme.iconBg} flex items-center justify-center shrink-0`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-0.5">{stat.value}</p>
                          <p className="text-[10px] text-slate-500 leading-tight font-semibold">{stat.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}



            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
