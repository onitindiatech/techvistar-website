import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SolutionsExtendedCtaBlock } from '@/types/pagesCms';

interface SolutionsLandingCtaProps {
  cta: SolutionsExtendedCtaBlock;
}

export const SolutionsLandingCta = ({ cta }: SolutionsLandingCtaProps) => {
  const badge = cta.badge?.trim() || "Let's collaborate";
  const secondaryButtonText = cta.secondaryButtonText?.trim() || 'Contact Us';
  const secondaryButtonLink = cta.secondaryButtonLink?.trim() || '/contact';
  return (
    <section className="border-t border-slate-100 bg-slate-50 px-4 pb-16 pt-8 sm:px-6 md:pb-24">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative mx-auto w-full max-w-none overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-600 via-[#10B981] to-emerald-700 p-8 text-center text-white shadow-[0_20px_50px_rgba(16,185,129,0.15)] md:p-12"
        style={
          cta.backgroundImage
            ? {
                backgroundImage: `linear-gradient(rgba(5, 150, 105, 0.88), rgba(5, 150, 105, 0.92)), url(${cta.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-300/20 blur-2xl" />

        <div className="pointer-events-none absolute inset-0 z-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%">
            <pattern id="solutions-landing-cta-mesh" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#solutions-landing-cta-mesh)" />
          </svg>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex select-none items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="h-3 w-3 animate-pulse text-emerald-100" />
            <span>{badge}</span>
          </div>

          <h2 className="mx-auto max-w-2xl font-display text-2xl font-black leading-tight tracking-tight text-white md:text-4xl">
            {cta.title}
          </h2>

          <p className="mx-auto max-w-xl text-xs font-medium leading-relaxed text-emerald-50/90 md:text-sm">
            {cta.description}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                className="inline-flex h-11 items-center gap-2 rounded-xl border-none bg-white px-7 py-3 text-xs font-bold text-emerald-700 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] hover:bg-slate-50 hover:shadow-[0_12px_25px_-4px_rgba(0,0,0,0.2)] md:text-sm"
              >
                <Link to={cta.buttonLink || '/contact'}>{cta.buttonText}</Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="inline-flex h-11 items-center gap-2 rounded-xl border-white/30 px-7 py-3 text-xs font-bold text-white transition-all hover:border-white hover:bg-white/10 md:text-sm"
                asChild
              >
                <Link to={secondaryButtonLink}>
                  <MessageSquare className="h-4 w-4" />
                  {secondaryButtonText}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </section>
  );
};

export default SolutionsLandingCta;
