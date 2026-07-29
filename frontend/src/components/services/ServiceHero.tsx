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

import { MobileBackButton } from '@/components/ui/MobileBackButton';
import { AnimatedStat } from '@/components/ui/AnimatedStat';

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
    <section className="bg-white border-b border-slate-200 pt-[4.5rem] pb-8 md:pt-28 md:pb-14 mb-6 md:mb-8">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-12 xl:px-20 detail-page-gutter">
        <MobileBackButton to="/services" label="All Services" className="mb-6" />

        {/* Main Grid: Centered Content */}
        <div className="flex flex-col gap-12 w-full relative z-10">
          
          {/* Main Content Area */}
          <div className="w-full space-y-6">
            
            {/* Top Half: Text Details & Robot Illustration side by side */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Text Area */}
              <div className="md:col-span-7 space-y-5">

                
                <h1 className="text-[1.75rem] leading-[1.12] md:text-5xl font-extrabold font-display text-slate-900 md:leading-tight">
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
                      <AnimatedStat
                        key={idx}
                        value={stat.value}
                        label={stat.label}
                        variant="hero-card"
                        icon={<IconComponent className="h-4 w-4" />}
                        themeIconClass={theme.iconBg}
                      />
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
