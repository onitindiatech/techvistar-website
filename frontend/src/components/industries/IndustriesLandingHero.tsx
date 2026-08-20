import { CmsHref } from '@/components/common/CmsHref';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  DEFAULT_INDUSTRIES_LANDING_CMS,
  IndustriesLandingCmsConfig,
} from '@/types/pagesCms';

interface IndustriesLandingHeroProps {
  landing: IndustriesLandingCmsConfig;
  backgroundImage: string;
  onExplore?: () => void;
}

export const IndustriesLandingHero = ({
  landing,
  backgroundImage,
  onExplore,
}: IndustriesLandingHeroProps) => {
  const hero = landing.hero;
  const ctaText =
    hero.ctaText?.trim() || DEFAULT_INDUSTRIES_LANDING_CMS.hero.ctaText;
  const ctaLink =
    hero.ctaLink?.trim() || DEFAULT_INDUSTRIES_LANDING_CMS.hero.ctaLink;

  const title = hero.subtitle?.trim() ? (
    <>
      {hero.title}
      <br />
      <span className="hero-highlight-text--static inline-block font-black">
        {hero.subtitle}
      </span>
    </>
  ) : (
    hero.title
  );

  const ctaButton = ctaText ? (
    ctaLink.startsWith('#') ? (
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={onExplore}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#041a3d] hover:bg-[#021028] px-6 text-sm font-extrabold text-white shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] transition-all cursor-pointer group"
      >
        <span>{ctaText}</span>
        <ArrowRight className="h-4 w-4 stroke-[2.5] text-white group-hover:translate-x-0.5 transition-transform duration-200" />
      </motion.button>
    ) : (
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#041a3d] hover:bg-[#021028] px-6 text-sm font-extrabold text-white shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] transition-all cursor-pointer group"
      >
        <CmsHref href={ctaLink} className="inline-flex items-center gap-2 text-white">
          <span>{ctaText}</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5] text-white group-hover:translate-x-0.5 transition-transform duration-200" />
        </CmsHref>
      </motion.button>
    )
  ) : null;

  return (
    <PageHeader
      title={title}
      subtitle={hero.eyebrow}
      description={hero.description}
      backgroundImage={backgroundImage}
    >
      {ctaButton ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center gap-4"
        >
          {ctaButton}
        </motion.div>
      ) : null}
    </PageHeader>
  );
};

export default IndustriesLandingHero;
