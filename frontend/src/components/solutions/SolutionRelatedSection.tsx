import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { decorateSolution, resolveSolutionIcon, type SolutionDetail } from '@/data/solutions';
import { getActiveSolutions } from '@/services/solutions.service';

interface SectionProps {
  solution: SolutionDetail;
}

export const SolutionRelatedSection = ({ solution }: SectionProps) => {
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

  return (
    <section id="related-solutions" className="pt-10 border-t border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-display">Related Solutions</h2>
          <p className="text-slate-500 mt-2">Explore other enterprise solutions that pair well with this offering.</p>
        </div>
        <Link
          to="/solutions"
          className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1 transition-colors group text-sm md:text-base"
        >
          View all solutions
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((item, idx) => {
          const IconComponent = item.icon || resolveSolutionIcon('Brain');
          return (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white border border-slate-200 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 overflow-hidden flex flex-col h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all duration-300 mb-6">
                  <IconComponent className="w-6 h-6" />
                </div>

                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 block">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3">{item.subtitle}</p>
                </div>

                <div className="mt-auto pt-6 flex items-center text-emerald-600 font-medium text-sm group-hover:text-emerald-700 transition-colors">
                  <Link to={`/solutions/${item.slug}`} className="absolute inset-0 z-20">
                    <span className="sr-only">View {item.title}</span>
                  </Link>
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
