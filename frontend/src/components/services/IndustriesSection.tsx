import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Service } from '@/data/services';
import { getActiveIndustries } from '@/services/industry.service';
import { decorateIndustry } from '@/data/industry.adapter';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import '../ui/GlassIcons.css';

interface SectionProps {
  service: Service;
}

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
};

export const IndustriesSection = ({ service }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  const { data: apiIndustries } = useQuery({
    queryKey: ['activeIndustries'],
    queryFn: () => getActiveIndustries(),
  });

  const industries = (apiIndustries || []).map(decorateIndustry);

  const slugList =
    service.relatedIndustrySlugs && service.relatedIndustrySlugs.length > 0
      ? service.relatedIndustrySlugs
      : [];

  let matchedIndustries = slugList.length
    ? slugList
        .map((slug) => industries.find((ind) => ind.slug === slug))
        .filter(Boolean)
    : industries.filter((ind) => ind.services?.includes(service.slug));

  if (matchedIndustries.length === 0 && service.industries?.length) {
    matchedIndustries = industries.filter((ind) =>
      service.industries?.some(
        (label) =>
          label.toLowerCase().includes(ind.title.toLowerCase()) ||
          ind.title.toLowerCase().includes(label.toLowerCase())
      )
    );
  }

  const getGlassColor = (colorClass: string) => {
    const cls = colorClass.toLowerCase();
    if (cls.includes('emerald') || cls.includes('green')) return 'green';
    if (cls.includes('amber') || cls.includes('yellow') || cls.includes('orange')) return 'orange';
    if (cls.includes('blue') || cls.includes('sky')) return 'blue';
    if (cls.includes('indigo')) return 'indigo';
    if (cls.includes('purple') || cls.includes('violet')) return 'purple';
    if (cls.includes('red') || cls.includes('rose')) return 'red';
    return 'green';
  };

  const getBackgroundStyle = (color: string) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="industries" className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 scroll-mt-24 shadow-sm">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="industries-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#industries-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display">Industries We Serve</h2>
      </div>

      <p className="relative z-10 text-xs text-slate-500 mb-6">
        Adapting our delivery frameworks to the specific requirements of target sectors:
      </p>

      {matchedIndustries.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 relative z-10"
        >
          {matchedIndustries.map((ind) => {
            if (!ind) return null;
            const IndustryIcon = ind.icon || ShieldCheck;
            const glassColor = getGlassColor(ind.industriesColor || '');

            return (
              <motion.div
                key={ind.id}
                variants={itemVariants}
                whileHover={prefersReducedMotion ? {} : { y: -4 }}
                className="group h-full"
              >
                <Link
                  to={`/industries/${ind.slug}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-100 hover:border-emerald-500/20 hover:shadow-[0_12px_25px_-8px_rgba(16,185,129,0.1)] transition-all duration-300 h-full"
                >
                  <div className="icon-btn pointer-events-none scale-[0.6] origin-top-left -mb-6 -mr-6 shrink-0">
                    <span className="icon-btn__back" style={getBackgroundStyle(glassColor)}></span>
                    <span className="icon-btn__front">
                      <span className="icon-btn__icon">
                        <IndustryIcon className="h-6 w-6 text-white" />
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug truncate">
                      {ind.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5 mt-0.5 group-hover:text-emerald-600 transition-colors">
                      Explore solutions
                      <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <p className="relative z-10 text-slate-500 text-xs font-medium">
          No specific industry connections configured for this service stack.
        </p>
      )}
    </section>
  );
};
export default IndustriesSection;
