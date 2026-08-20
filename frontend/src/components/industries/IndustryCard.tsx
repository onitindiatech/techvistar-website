import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Industry } from '@/data/industries';
import { getIndustryCardImage } from '@/data/industry.adapter';
import { Badge } from '@/components/ui/badge';

interface IndustryCardProps {
  industry: Industry;
  index?: number;
  learnMoreLabel?: string;
  offeringsLabel?: string;
}

export const IndustryCard = ({
  industry,
  index = 0,
  learnMoreLabel = 'Explore industry',
  offeringsLabel = 'Key Offerings',
}: IndustryCardProps) => {
  const IconComponent = industry.icon;
  const offeringItems =
    industry.solutions.length > 0
      ? industry.solutions.map((item) => item.title)
      : industry.offerings ?? [];

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
        to={`/industries/${industry.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-emerald-500/25 hover:shadow-xl"
      >
        <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50/50">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <img
              src={getIndustryCardImage(industry)}
              alt={industry.title}
              loading="lazy"
              className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
          </div>

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {industry.category && (
              <Badge className="border-none bg-white/95 text-[9px] font-bold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-sm">
                {industry.category}
              </Badge>
            )}
          </div>

          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white/95 text-emerald-600 shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            <IconComponent className="h-5 w-5" />
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-6">
          <h3 className="font-display text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600">
            {industry.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-base md:text-lg font-medium leading-relaxed text-slate-600">
            {industry.shortDescription}
          </p>

          {offeringItems.length > 0 && (
            <div className="mt-5 flex-1">
              <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                {offeringsLabel}
              </p>
              <ul className="space-y-2">
                {offeringItems.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm md:text-base font-medium text-slate-700">
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

export default IndustryCard;
