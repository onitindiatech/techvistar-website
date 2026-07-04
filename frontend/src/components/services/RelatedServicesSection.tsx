import { useQuery } from '@tanstack/react-query';
import { getActiveServices } from '@/services/services.service';
import { Service, decorateService } from '@/data/services';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SectionProps {
  service: Service;
}

interface ServiceBrand {
  bg: string;
  text: string;
  border: string;
}

export const RelatedServicesSection = ({ service }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  const { data: apiServices } = useQuery({
    queryKey: ['activeServices'],
    queryFn: getActiveServices,
  });

  const activeServices = (apiServices || []).map(decorateService);

  // Exclude current service and limit to 3 active ones
  const relatedServices = activeServices.filter((s) => s.id !== service.id && s.status === 'active')
    .slice(0, 3);

  if (relatedServices.length === 0) return null;

  // Map slugs to clean brand color configurations for the icon badge
  const getBrandStyle = (slug: string): ServiceBrand => {
    if (slug.includes('web')) {
      return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100/50' };
    }
    if (slug.includes('mobile')) {
      return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100/50' };
    }
    if (slug.includes('ui-ux')) {
      return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100/50' };
    }
    if (slug.includes('cloud')) {
      return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100/50' };
    }
    if (slug.includes('brand')) {
      return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100/50' };
    }
    if (slug.includes('marketing')) {
      return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100/50' };
    }
    return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100/50' };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section id="related" className="border-t border-slate-200/80 pt-12 scroll-mt-24">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Other Services</h2>
      </div>

      {/* Grid of related cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {relatedServices.map((rs) => {
          const ServiceIcon = rs.icon || Sparkles;
          const brand = getBrandStyle(rs.slug);

          return (
            <motion.div
              key={rs.id}
              variants={itemVariants}
              whileHover={prefersReducedMotion ? {} : { y: -6 }}
              className="group/card h-full"
            >
              <Link 
                to={`/services/${rs.slug}`}
                className="flex flex-col justify-between rounded-2xl bg-white/70 backdrop-blur-md border border-slate-100 hover:border-emerald-500/30 hover:shadow-[0_15px_30px_-8px_rgba(16,185,129,0.12)] transition-all duration-300 h-full overflow-hidden"
              >
                <div>
                  {/* Thumbnail Image Header */}
                  <div className="relative aspect-video w-full overflow-hidden bg-transparent border-b border-slate-100/50">
                    <img 
                      src={rs.coverImage} 
                      alt={rs.title} 
                      className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover/card:scale-105 mix-blend-multiply contrast-115 brightness-102"
                    />
                    
                    {/* Category Badge on top of Image */}
                    <Badge variant="secondary" className="absolute top-3 left-3 text-[9px] font-semibold bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded-md shadow-sm">
                      {rs.category}
                    </Badge>

                    {/* Icon Badge on top of Image */}
                    <div className={`absolute top-3 right-3 h-8 w-8 rounded-lg ${brand.bg}/90 backdrop-blur-sm ${brand.text} border ${brand.border} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover/card:scale-105`}>
                      <ServiceIcon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-slate-900 group-hover/card:text-emerald-700 transition-colors font-display line-clamp-1 mb-2">
                      {rs.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {rs.shortDescription}
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
export default RelatedServicesSection;
