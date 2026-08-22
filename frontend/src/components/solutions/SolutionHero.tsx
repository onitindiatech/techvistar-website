import {
  Check,
  Rocket,
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Star,
  Users,
  Headphones,
} from 'lucide-react';
import { SolutionDetail, resolveSolutionIcon } from '@/data/solutions';
import { MobileBackButton } from '@/components/ui/MobileBackButton';
import { AnimatedStat } from '@/components/ui/AnimatedStat';
import { RichTextContent } from '@/components/common/RichTextContent';

interface SolutionHeroProps {
  solution: SolutionDetail;
}

const STAT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  clock: Clock,
  dollar: DollarSign,
  chart: TrendingUp,
  shield: Shield,
  star: Star,
  trendingup: TrendingUp,
  users: Users,
  headphones: Headphones,
};

const STAT_THEME_CLASSES = [
  'bg-emerald-100 text-emerald-600',
  'bg-purple-100 text-purple-600',
  'bg-amber-100 text-amber-600',
  'bg-blue-100 text-blue-600',
];

export const SolutionHero = ({ solution }: SolutionHeroProps) => {
  const badgeText = solution.heroBadge || solution.category;
  const heroHighlights = solution.features.slice(0, 4);
  const heroStats = solution.heroStats.slice(0, 4);

  const getStatIcon = (iconName: string) => {
    const key = iconName.toLowerCase().replace(/[^a-z]/g, '');
    return STAT_ICON_MAP[key] || resolveSolutionIcon(iconName) || Rocket;
  };

  return (
    <section className="bg-white border-b border-slate-200 pt-[4.5rem] pb-8 md:pt-28 md:pb-14 mb-6 md:mb-8">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-12 xl:px-20 detail-page-gutter">
        <MobileBackButton to="/solutions" label="All Solutions" className="mb-6" />

        <div className="flex flex-col gap-12 w-full relative z-10">
          <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-semibold uppercase tracking-wider">
                  {badgeText}
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold font-display text-slate-900 leading-tight">
                  {solution.title}
                </h1>

                <p className="text-xl md:text-2xl font-bold font-display text-emerald-600 leading-snug">
                  {solution.subtitle}
                </p>

                <RichTextContent
                  content={solution.heroDescription}
                  className="text-slate-600 !text-lg leading-relaxed [&_p]:!text-lg"
                />

                {heroHighlights.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 leading-snug">
                      Key Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                      {heroHighlights.map((highlight, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start text-base md:text-lg text-slate-600 font-normal leading-relaxed">
                          <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 flex items-center justify-center p-0.5 mt-1 shrink-0 border border-emerald-100">
                            <Check className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span>{highlight.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-5 flex items-center justify-center py-4 md:py-0">
                <img
                  src={solution.dashboardImage}
                  alt={solution.title}
                  className="w-full max-w-[280px] md:max-w-full h-auto object-contain"
                />
              </div>
            </div>

            {heroStats.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-200/60">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {heroStats.map((stat, idx) => {
                    const IconComponent = getStatIcon(stat.icon);
                    const themeIconClass = STAT_THEME_CLASSES[idx % STAT_THEME_CLASSES.length];
                    return (
                      <AnimatedStat
                        key={`${stat.label}-${idx}`}
                        value={stat.value}
                        label={stat.label}
                        variant="hero-card"
                        icon={<IconComponent className="h-4 w-4" />}
                        themeIconClass={themeIconClass}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionHero;
