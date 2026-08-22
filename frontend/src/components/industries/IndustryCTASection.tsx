import { CmsHref } from '@/components/common/CmsHref';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Industry } from '@/data/industries';
import { resolveIndustryCtaBlock } from '@/types/industriesCms';

interface IndustryCTASectionProps {
  industry: Industry;
}

export const IndustryCTASection = ({ industry }: IndustryCTASectionProps) => {
  const cta = resolveIndustryCtaBlock(industry);

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full scroll-mt-24 overflow-hidden rounded-3xl border border-[#041a3d]/30 bg-[#041a3d] p-8 text-center text-white shadow-[0_20px_50px_rgba(5,27,61,0.25)] md:p-12"
    >
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />

      <div className="pointer-events-none absolute inset-0 z-0 opacity-10" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="industry-cta-mesh" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#industry-cta-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="inline-flex select-none items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="h-3 w-3 animate-pulse text-blue-200" />
          <span>{cta.badge}</span>
        </div>

        <h2 className="mx-auto max-w-2xl font-display text-2xl font-black leading-tight tracking-tight md:text-4xl">
          {cta.headline}
        </h2>

        {cta.body && (
          <p className="mx-auto max-w-xl text-base md:text-lg font-medium leading-relaxed text-blue-100/90">
            {cta.body}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-extrabold text-[#041a3d] shadow-md transition-all hover:bg-slate-100 md:text-base cursor-pointer group"
          >
            <CmsHref href="/contact" className="inline-flex items-center gap-2 text-[#041a3d]">
              <span>{cta.primaryButtonLabel}</span>
              <ArrowRight className="h-4 w-4 text-[#041a3d] group-hover:translate-x-0.5 transition-transform duration-200" />
            </CmsHref>
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-7 text-sm font-extrabold text-white transition-all hover:border-white hover:bg-white/10 md:text-base cursor-pointer group"
          >
            <CmsHref href={cta.secondaryButtonHref} className="inline-flex items-center gap-2 text-white">
              <MessageSquare className="h-4 w-4 text-white" />
              <span>{cta.secondaryButtonLabel}</span>
            </CmsHref>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default IndustryCTASection;
