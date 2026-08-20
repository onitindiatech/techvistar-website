import { CmsHref } from '@/components/common/CmsHref';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SolutionsLandingCmsConfig } from '@/types/pagesCms';

interface SolutionsLandingHeroProps {
  landing: SolutionsLandingCmsConfig;
  backgroundImage: string;
  onExplore?: () => void;
}

export const SolutionsLandingHero = ({
  landing,
  backgroundImage,
  onExplore,
}: SolutionsLandingHeroProps) => {
  const hero = landing.hero;
  const ctaText = hero.ctaText?.trim() || 'Explore Solutions';
  const ctaLink = hero.ctaLink?.trim() || '#all-solutions';

  const title = hero.title?.trim() || 'Enterprise Solutions';
  const eyebrow = hero.eyebrow?.trim() || 'Our Capabilities';
  const description =
    hero.description?.trim() ||
    'Deploying robust business automation, production-grade intelligence models, and highly secure cloud environments built to scale operations.';

  const ctaButton =
    ctaLink.startsWith('#') ? (
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={onExplore}
        className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#041a3d] hover:bg-[#021028] text-white rounded-xl transition-all duration-200 text-sm font-extrabold tracking-tight shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] group cursor-pointer"
      >
        <span>{ctaText}</span>
        <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform duration-200" />
      </motion.button>
    ) : (
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#041a3d] hover:bg-[#021028] text-white rounded-xl transition-all duration-200 text-sm font-extrabold tracking-tight shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] group cursor-pointer"
      >
        <CmsHref href={ctaLink} className="inline-flex items-center gap-2 text-white">
          <span>{ctaText}</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform duration-200" />
        </CmsHref>
      </motion.button>
    );

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-28 pb-10 md:pt-32 md:pb-12">
      {backgroundImage && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[length:auto_90%] bg-right-bottom bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

      <motion.div
        className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-emerald-500/15 blur-[100px]"
        animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-teal-400/10 blur-[90px]"
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(14,165,233,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,165,233,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container relative z-10 mx-auto max-w-5xl px-4 text-left md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-5"
        >


          <h1 className="mb-4 font-display text-4xl font-extrabold text-white md:text-5xl">{title}</h1>

          <p className="max-w-2xl text-sm font-semibold leading-relaxed text-slate-300 sm:text-base md:text-lg">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-start gap-4"
        >
          {ctaButton}
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionsLandingHero;
