import { CmsHref } from '@/components/common/CmsHref';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';
import { IMAGE_MAP, ProjectCtaBlock } from '@/data/projects';
import type { PortfolioLandingCtaBlock } from '@/types/pagesCms';

function resolveLandingBackground(imageKeyOrUrl: string): string {
  return IMAGE_MAP[imageKeyOrUrl] || imageKeyOrUrl;
}

interface ProjectCTASectionProps {
  projectCta?: ProjectCtaBlock;
}

export const ProjectCTASection = ({ projectCta }: ProjectCTASectionProps) => {
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const landing = mergePagesCmsConfig(pagesConfig).portfolioLanding;
  const globalCta: PortfolioLandingCtaBlock = landing.cta;

  const hasProjectCta = projectCta?.title?.trim();
  const cta = hasProjectCta
    ? {
        badge: projectCta!.badge || '',
        title: projectCta!.title || '',
        description: projectCta!.description || '',
        buttonText: projectCta!.buttonText || '',
        buttonLink: projectCta!.buttonLink || '/contact',
        secondaryButtonText: projectCta!.secondaryButtonText || '',
        secondaryButtonLink: projectCta!.secondaryButtonLink || '/work',
        backgroundImage: '',
      }
    : globalCta;

  if (!cta?.title?.trim()) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      id="contact"
      className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-[#10B981] to-emerald-700 border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-white shadow-[0_20px_50px_rgba(16,185,129,0.15)] scroll-mt-24 text-center w-full"
      style={
        !hasProjectCta && (cta as PortfolioLandingCtaBlock).backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(5, 150, 105, 0.88), rgba(5, 150, 105, 0.92)), url(${resolveLandingBackground((cta as PortfolioLandingCtaBlock).backgroundImage!)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-emerald-300/20 blur-2xl pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none z-0 opacity-10" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="project-cta-mesh" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#project-cta-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        {cta.badge?.trim() && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold select-none">
            <Sparkles className="h-3 w-3 text-emerald-100 animate-pulse" />
            <span>{cta.badge}</span>
          </div>
        )}

        <h2 className="text-2xl md:text-4xl font-black font-display tracking-tight leading-tight max-w-2xl mx-auto">
          {cta.title}
        </h2>

        {cta.description?.trim() && (
          <p className="text-emerald-50/90 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-medium">
            {cta.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 justify-center pt-2">
          {cta.buttonText?.trim() && (
            <Button
              asChild
              className="bg-white text-emerald-700 hover:bg-slate-50 font-bold border-none shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_-4px_rgba(0,0,0,0.2)] px-7 py-3 rounded-xl inline-flex items-center gap-2 transition-all h-11 text-xs md:text-sm"
            >
              <CmsHref href={cta.buttonLink || '/contact'}>{cta.buttonText}</CmsHref>
            </Button>
          )}
          {cta.secondaryButtonText?.trim() && (
            <Button
              asChild
              variant="outline"
              className="border-white/30 hover:border-white text-white hover:bg-white/10 font-bold px-7 py-3 rounded-xl inline-flex items-center gap-2 h-11 text-xs md:text-sm transition-all"
            >
              <CmsHref href={cta.secondaryButtonLink || '/work'}>
                <MessageSquare className="h-4.5 w-4.5 mr-2" />
                {cta.secondaryButtonText}
              </CmsHref>
            </Button>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default ProjectCTASection;
