import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Rocket, Clock, DollarSign, TrendingUp, Shield, Star } from 'lucide-react';
import { Industry } from '@/data/industries';
import { getIndustryHeroImage } from '@/data/industry.adapter';
import { RichTextContent } from '@/components/common/RichTextContent';

import { MobileBackButton } from '@/components/ui/MobileBackButton';
import { AnimatedStat } from '@/components/ui/AnimatedStat';

interface IndustryHeroProps {
  industry: Industry;
}

export const IndustryHero = ({ industry }: IndustryHeroProps) => {
  const getStatIcon = (iconType?: string) => {
    switch (iconType) {
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

  const getThemeClasses = (colorTheme?: string) => {
    switch (colorTheme) {
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'gold':
        return 'bg-amber-100 text-amber-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-emerald-100 text-emerald-600';
    }
  };

  return (
    <section className="border-b border-slate-200 bg-white pb-8 pt-[4.5rem] md:pb-14 md:pt-28">
      <div className="mx-auto w-full px-4 md:px-6 lg:px-12 xl:px-20 detail-page-gutter">
        <MobileBackButton to="/industries" label="All Industries" className="mb-6" />

        <div className="relative z-10 flex w-full flex-col gap-12">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
            <div className="space-y-5 md:col-span-7">


              <h1 className="font-display text-[1.75rem] leading-[1.12] font-extrabold text-slate-900 md:text-5xl md:leading-tight">
                {industry.title}
              </h1>

              <p className="text-base font-bold leading-snug text-emerald-600 md:text-lg">
                {industry.heroTagline?.trim() || industry.shortDescription}
              </p>

              <RichTextContent
                content={industry.description}
                className="text-sm leading-relaxed text-slate-600"
              />

              {industry.benefits && industry.benefits.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Key Highlights
                  </p>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                    {industry.benefits.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-medium text-slate-700">
                        <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 p-0.5">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center py-4 md:col-span-5 md:py-0">
              <img
                src={getIndustryHeroImage(industry)}
                alt={industry.title}
                className="h-auto w-full max-w-[280px] rounded-2xl border border-slate-200/80 object-cover shadow-lg md:max-w-full"
              />
            </div>
          </div>

          {industry.statistics && industry.statistics.length > 0 && (
            <div className="space-y-6 border-t border-slate-200/60 pt-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {industry.statistics.map((stat, idx) => {
                  const IconComponent = getStatIcon(stat.iconType);
                  const theme = getThemeClasses(stat.colorTheme);
                  return (
                    <AnimatedStat
                      key={idx}
                      value={stat.value}
                      label={stat.label}
                      variant="hero-card"
                      icon={<IconComponent className="h-4 w-4" />}
                      themeIconClass={theme}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IndustryHero;
