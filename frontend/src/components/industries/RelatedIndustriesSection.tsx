import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Industry } from '@/data/industries';
import { getActiveIndustries } from '@/services/industry.service';
import { decorateIndustry, getIndustryCardImage } from '@/data/industry.adapter';
import { Badge } from '@/components/ui/badge';

interface RelatedIndustriesSectionProps {
  industry: Industry;
}

export const RelatedIndustriesSection = ({ industry }: RelatedIndustriesSectionProps) => {
  const { data: apiIndustries } = useQuery({
    queryKey: ['activeIndustries'],
    queryFn: () => getActiveIndustries(),
    staleTime: 5 * 60 * 1000,
  });

  const allIndustries = (apiIndustries || [])
    .map((item: unknown) => decorateIndustry(item))
    .filter((item): item is Industry => item !== null && item.slug !== industry.slug);

  const curatedSlugs = industry.relatedIndustrySlugs?.filter(Boolean) || [];
  const related =
    curatedSlugs.length > 0
      ? curatedSlugs
          .map((slug) => allIndustries.find((item) => item.slug === slug))
          .filter((item): item is Industry => Boolean(item))
          .slice(0, 6)
      : allIndustries.slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-8 font-display text-heading-sm text-slate-900">Related Industries</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {related.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                to={`/industries/${item.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all hover:border-emerald-500/30 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-50/50">
                  <img
                    src={getIndustryCardImage(item)}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/80 bg-white/95 text-emerald-600 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  {item.category && (
                    <Badge className="mb-2 w-fit border-none bg-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      {item.category}
                    </Badge>
                  )}
                  <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-emerald-600">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs font-medium text-slate-500">{item.shortDescription}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedIndustriesSection;
