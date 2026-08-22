import { CmsHref } from '@/components/common/CmsHref';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig, DEFAULT_SOLUTIONS_LANDING_CMS } from '@/types/pagesCms';

/**
 * Detail-page bottom CTA — reuses Solutions Landing CMS `cta` block
 * (same content source as /solutions), styled like Services Detail CTASection.
 */
export const SolutionCTASection = () => {
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const cta =
    mergePagesCmsConfig(pagesConfig).solutionsLanding.cta ||
    DEFAULT_SOLUTIONS_LANDING_CMS.cta;

  if (!cta?.title?.trim()) return null;

  const badge = cta.badge?.trim() || "Let's collaborate";
  const secondaryButtonText = cta.secondaryButtonText?.trim() || 'Contact Us';
  const secondaryButtonLink = cta.secondaryButtonLink?.trim() || '/contact';

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      id="contact"
      className="relative overflow-hidden bg-[#041a3d] border border-[#041a3d]/30 rounded-3xl p-8 md:p-12 text-white shadow-[0_20px_50px_rgba(5,27,61,0.25)] scroll-mt-24 text-center w-full"
      style={
        cta.backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(4, 26, 61, 0.9), rgba(4, 26, 61, 0.94)), url(${cta.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none z-0 opacity-10" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="solution-detail-cta-mesh" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#solution-detail-cta-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold select-none">
          <Sparkles className="h-3 w-3 text-blue-200 animate-pulse" />
          <span>{badge}</span>
        </div>

        <h2 className="text-2xl md:text-4xl font-black font-display tracking-tight leading-tight max-w-2xl mx-auto">
          {cta.title}
        </h2>

        {cta.description?.trim() && (
          <p className="text-blue-100/90 text-base max-w-xl mx-auto leading-relaxed font-medium">
            {cta.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 justify-center pt-2">
          {cta.buttonText?.trim() && (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-7 text-xs font-extrabold text-[#041a3d] shadow-md transition-all hover:bg-slate-100 md:text-sm cursor-pointer group"
            >
              <CmsHref href={cta.buttonLink || '/contact'} className="inline-flex items-center gap-2 text-[#041a3d]">
                <span>{cta.buttonText}</span>
              </CmsHref>
            </motion.button>
          )}

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-7 text-xs font-extrabold text-white transition-all hover:border-white hover:bg-white/10 md:text-sm cursor-pointer group"
          >
            <CmsHref href={secondaryButtonLink} className="inline-flex items-center gap-2 text-white">
              <MessageSquare className="h-4.5 w-4.5 text-white" />
              <span>{secondaryButtonText}</span>
            </CmsHref>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default SolutionCTASection;
