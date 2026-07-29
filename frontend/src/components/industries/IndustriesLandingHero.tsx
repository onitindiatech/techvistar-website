import { Link } from 'react-router-dom';
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
      {hero.title}{' '}
      <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
        {hero.subtitle}
      </span>
    </>
  ) : (
    hero.title
  );

  const ctaButton = ctaText ? (
    ctaLink.startsWith('#') ? (
      <Button
        onClick={onExplore}
        size="lg"
        className="h-12 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500"
      >
        {ctaText}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    ) : (
      <Button
        asChild
        size="lg"
        className="h-12 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500"
      >
        <Link to={ctaLink}>
          {ctaText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
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
