import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import { Service, getServiceCardImage } from '@/data/services';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ServiceCardVariant = 'landing' | 'homepage-featured' | 'homepage-compact';

interface ServiceCardProps {
  service: Service;
  learnMoreLabel?: string;
  offeringsLabel?: string;
  featured?: boolean;
  index?: number;
  variant?: ServiceCardVariant;
}

export const ServiceCard = ({
  service,
  learnMoreLabel = 'Learn more',
  offeringsLabel = 'Key Offerings',
  featured = false,
  index = 0,
  variant = 'landing',
}: ServiceCardProps) => {
  const IconComponent = service.icon;
  const exploreLabel =
    variant === 'homepage-compact' || variant === 'homepage-featured' ? 'Explore' : learnMoreLabel;

  if (variant === 'homepage-featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ y: -4, scale: 1.005 }}
        className="h-full"
      >
        <Link
          to={`/services/${service.slug}`}
          className="group flex h-[220px] overflow-hidden rounded-[24px] border border-white/60 bg-white/80 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all duration-300 hover:border-emerald-500/25 hover:shadow-[0_20px_48px_-16px_rgba(16,185,129,0.18)] md:h-[240px]"
        >
          <div className="relative w-[38%] shrink-0 overflow-hidden">
            <img
              src={getServiceCardImage(service)}
              alt={service.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/50 via-slate-950/20 to-transparent" />
          </div>

          <div className="relative flex min-w-0 flex-1 flex-col justify-between p-5 md:p-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-none bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  <Star className="mr-1 inline h-3 w-3 fill-current" />
                  Featured
                </Badge>
                <Badge
                  variant="secondary"
                  className="border-none bg-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-600"
                >
                  {service.category}
                </Badge>
              </div>
              <h3 className="font-display text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-700 md:text-xl">
                {service.title}
              </h3>
              <p className="line-clamp-2 text-sm font-medium leading-relaxed text-slate-500">
                {service.shortDescription}
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-1.5 text-xs font-bold text-emerald-600 transition-colors group-hover:text-emerald-700">
              {exploreLabel}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === 'homepage-compact') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: index * 0.04 }}
        whileHover={{ y: -6 }}
        className="h-full"
      >
        <Link
          to={`/services/${service.slug}`}
          className="group flex h-[170px] flex-col justify-between overflow-hidden rounded-[22px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_16px_40px_-12px_rgba(16,185,129,0.14)] md:h-[180px]"
        >
          <div className="flex min-h-0 flex-1 gap-4">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
              <img
                src={getServiceCardImage(service)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-700 md:text-base">
                {service.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-relaxed text-slate-500 md:text-sm">
                {service.shortDescription}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 transition-colors group-hover:text-emerald-700 md:text-xs">
              {exploreLabel}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </motion.article>
    );
  }

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
        to={`/services/${service.slug}`}
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
            <img
              src={getServiceCardImage(service)}
              alt={service.title}
              loading="lazy"
              className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
          </div>

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge className="border-none bg-white/95 text-[9px] font-bold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-sm">
              {service.category}
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
            {service.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-slate-500">
            {service.shortDescription}
          </p>

          {service.offerings.length > 0 && (
            <div className="mt-5 flex-1">
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {offeringsLabel}
              </p>
              <ul className="space-y-2">
                {service.offerings.slice(0, 3).map((item, i) => (
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

export default ServiceCard;
