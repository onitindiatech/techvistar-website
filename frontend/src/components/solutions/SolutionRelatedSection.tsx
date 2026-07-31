import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { decorateSolution, type SolutionDetail } from '@/data/solutions';
import { getActiveSolutions } from '@/services/solutions.service';
import { Badge } from '@/components/ui/badge';
import { getSolutionCardImage } from '@/components/solutions/SolutionCard';

interface SectionProps {
  solution: SolutionDetail;
}

interface SolutionBrand {
  bg: string;
  text: string;
  border: string;
}

export const SolutionRelatedSection = ({ solution }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  const { data: apiSolutions } = useQuery({
    queryKey: ['activeSolutions'],
    queryFn: getActiveSolutions,
    staleTime: 60_000,
  });

  const activeSolutions = useMemo(
    () => (apiSolutions || []).map(decorateSolution),
    [apiSolutions],
  );

  const slugOrder = solution.relatedSolutionSlugs?.filter(Boolean) ?? [];
  let related =
    slugOrder.length > 0
      ? slugOrder
          .map((slug) =>
            activeSolutions.find((item) => item.slug === slug && item.slug !== solution.slug),
          )
          .filter((item): item is SolutionDetail => Boolean(item))
      : activeSolutions.filter((item) => item.slug !== solution.slug).slice(0, 3);

  related = related.slice(0, 3);

  if (related.length === 0) return null;

  const getBrandStyle = (slug: string): SolutionBrand => {
    if (slug.includes('enterprise')) {
      return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100/50' };
    }
    if (slug.includes('ai') || slug.includes('automation')) {
      return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100/50' };
    }
    if (slug.includes('cloud')) {
      return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100/50' };
    }
    return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100/50' };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="related-solutions" className="border-t border-slate-200/80 pt-12 scroll-mt-24">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
            <Sparkles className="h-3 w-3 text-emerald-600" />
          </div>
          <h2 className="font-display text-heading-sm text-slate-900">Related Solutions</h2>
        </div>
        <Link
          to="/solutions"
          className="group flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
        >
          View all solutions
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {related.map((item) => {
          const SolutionIcon = item.icon || Sparkles;
          const brand = getBrandStyle(item.slug);

          return (
            <motion.div
              key={item.slug}
              variants={itemVariants}
              whileHover={prefersReducedMotion ? {} : { y: -6 }}
              className="group/card h-full"
            >
              <Link
                to={`/solutions/${item.slug}`}
                className="flex flex-col justify-between rounded-2xl bg-white/70 backdrop-blur-md border border-slate-100 hover:border-emerald-500/30 hover:shadow-[0_15px_30px_-8px_rgba(16,185,129,0.12)] transition-all duration-300 h-full overflow-hidden"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-transparent border-b border-slate-100/50">
                    <img
                      src={getSolutionCardImage(item)}
                      alt={item.title}
                      className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover/card:scale-105 mix-blend-multiply contrast-115 brightness-102"
                    />

                    <Badge
                      variant="secondary"
                      className="absolute top-3 left-3 text-[9px] font-semibold bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded-md shadow-sm"
                    >
                      {item.category}
                    </Badge>

                    <div
                      className={`absolute top-3 right-3 h-8 w-8 rounded-lg ${brand.bg}/90 backdrop-blur-sm ${brand.text} border ${brand.border} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover/card:scale-105`}
                    >
                      <SolutionIcon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-sm font-bold text-slate-900 group-hover/card:text-emerald-700 transition-colors font-display line-clamp-1 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100/50">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover/card:text-emerald-700 transition-colors">
                    View details
                    <span className="group-hover/card:translate-x-1 transition-transform duration-300">&rarr;</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default SolutionRelatedSection;
