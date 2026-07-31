import type { ElementType } from 'react';
import { Check, ExternalLink, Github, Rocket, Clock, DollarSign, BarChart3, Shield, Star } from 'lucide-react';
import { Project } from '@/data/projects';
import { MobileBackButton } from '@/components/ui/MobileBackButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RichTextContent } from '@/components/common/RichTextContent';
import { AnimatedStat } from '@/components/ui/AnimatedStat';

const STAT_ICON_MAP: Record<string, ElementType> = {
  rocket: Rocket, clock: Clock, dollar: DollarSign, chart: BarChart3, shield: Shield, star: Star,
};
const STAT_THEME_CLASSES: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-600',
  purple: 'bg-purple-100 text-purple-600',
  gold: 'bg-amber-100 text-amber-600',
  blue: 'bg-blue-100 text-blue-600',
};

interface ProjectHeroProps {
  project: Project;
}

const isValidProjectUrl = (url: string) => Boolean(url?.trim()) && url.trim() !== '#';

export const ProjectHero = ({ project }: ProjectHeroProps) => {
  const heroHighlights = project.keyFeatures.slice(0, 4);
  const hasLiveUrl = isValidProjectUrl(project.liveUrl);
  const hasGithubUrl = isValidProjectUrl(project.githubUrl);

  const heroTagline = project.description.split(/(?<=[.!?])\s+/)[0] || project.description;

  return (
    <section className="bg-white border-b border-slate-200 pt-[4.5rem] pb-8 md:pt-28 md:pb-14 mb-6 md:mb-8">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-12 xl:px-20 detail-page-gutter">
        <MobileBackButton to="/work" label="All Projects" className="mb-6" />

        <div className="flex flex-col gap-12 w-full relative z-10">
          <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-semibold uppercase tracking-wider">
                    {project.category}
                  </div>
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider"
                  >
                    {project.status}
                  </Badge>
                </div>

                <h1 className="text-[1.75rem] leading-[1.12] md:text-5xl font-extrabold font-display text-slate-900 md:leading-tight">
                  {project.title}
                </h1>

                <p className="text-base md:text-lg font-bold text-emerald-600 leading-snug">
                  {heroTagline}
                </p>

                <RichTextContent
                  content={project.longDescription}
                  className="text-slate-600 text-sm leading-relaxed"
                />

                {heroHighlights.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-semibold">
                      Key Highlights
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                      {heroHighlights.map((highlight, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-700 font-medium">
                          <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 flex items-center justify-center p-0.5 mt-0.5 shrink-0 border border-emerald-100">
                            <Check className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(hasLiveUrl || hasGithubUrl) && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {hasLiveUrl && (
                      <Button asChild className="bg-primary text-white hover:bg-primary/95">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {hasGithubUrl && (
                      <Button asChild variant="outline" className="border-slate-200 bg-white hover:bg-slate-50">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          GitHub Code
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-5 flex items-center justify-center py-4 md:py-0">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full max-w-[280px] md:max-w-full h-auto object-contain"
                />
              </div>
            </div>

            {project.stats.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-200/60">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {project.stats.map((stat, idx) => {
                    const Icon = STAT_ICON_MAP[stat.iconType] || BarChart3;
                    const themeIconClass = STAT_THEME_CLASSES[stat.colorTheme] || STAT_THEME_CLASSES.green;
                    return (
                      <AnimatedStat
                        key={idx}
                        value={stat.value}
                        label={stat.label}
                        variant="hero-card"
                        icon={<Icon className="h-4 w-4" />}
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

export default ProjectHero;
