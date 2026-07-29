import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import { SolutionDetail } from '@/data/solutions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function getSolutionCardImage(solution: SolutionDetail): string {
  return solution.dashboardImage || '';
}

interface SolutionCardProps {
  solution: SolutionDetail;
  learnMoreLabel?: string;
  offeringsLabel?: string;
  featured?: boolean;
  index?: number;
}

export const SolutionCard = ({
  solution,
  learnMoreLabel = 'Learn more',
  offeringsLabel = 'Key Capabilities',
  featured = false,
  index = 0,
}: SolutionCardProps) => {
  const IconComponent = solution.icon;
  const offeringItems = solution.ourSolution?.capabilities?.length
    ? solution.ourSolution.capabilities
    : solution.features?.map((f) => f.title) ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link
        to={`/solutions/${solution.slug}`}
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300',
          featured
            ? 'border-emerald-500/35 shadow-[0_8px_40px_-12px_rgba(16,185,129,0.35)] hover:border-emerald-500/55 hover:shadow-[0_20px_50px_-12px_rgba(16,185,129,0.45)]'
            : 'border-slate-200/80 shadow-sm hover:border-emerald-500/25 hover:shadow-xl'
        )}
      >
        {featured && (
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-emerald-400/[0.04]" />
        )}

        <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50/50">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            {getSolutionCardImage(solution) ? (
              <img
                src={getSolutionCardImage(solution)}
                alt={solution.title}
                loading="lazy"
                className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-50">
                <IconComponent className="h-12 w-12 text-emerald-600/70 transition-transform duration-300 group-hover:scale-105" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
          </div>

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge className="border-none bg-white/95 text-[9px] font-bold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-sm">
              {solution.category}
            </Badge>
            {featured && (
              <Badge className="border-none bg-emerald-600 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                <Star className="mr-1 h-3 w-3 fill-current" />
                Featured
              </Badge>
            )}
          </div>

          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white/95 text-emerald-600 shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            <IconComponent className="h-5 w-5" />
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-6">
          <h3 className="font-display text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600">
            {solution.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-slate-500">
            {solution.desc || solution.heroDescription || solution.subtitle}
          </p>

          {offeringItems.length > 0 && (
            <div className="mt-5 flex-1">
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {offeringsLabel}
              </p>
              <ul className="space-y-2">
                {offeringItems.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span className="line-clamp-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 transition-colors group-hover:text-emerald-700">
              {learnMoreLabel}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default SolutionCard;
