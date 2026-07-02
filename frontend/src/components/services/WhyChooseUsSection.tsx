import { Service } from '@/data/services';
import { Star, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface SectionProps {
  service: Service;
}

export const WhyChooseUsSection = ({ service }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  const defaultWhy = [
    { title: 'Reliable Delivery Lifecycle', description: 'Every stage is explicitly mapped, scoped, and signed off under clear milestones.' },
    { title: 'Production-Ready Code', description: 'We write fully optimized, tested, and secure components that your internal engineering teams can run easily.' }
  ];

  const list = service.whyChooseUs || defaultWhy;

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
    <section id="why-us" className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 scroll-mt-24 shadow-sm">
      
      {/* Accent backdrop radial light */}
      <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-emerald-500/[0.03] blur-3xl pointer-events-none z-0" />
      <div className="absolute left-0 bottom-0 w-80 h-80 rounded-full bg-sky-500/[0.03] blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-2 mb-6">
        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display">Why Choose TechVistar</h2>
      </div>

      {/* Grid of highlight cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 relative z-10"
      >
        {list.map((item, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            className="group flex gap-4 p-5 rounded-2xl border-2 border-emerald-500/10 bg-emerald-50/10 hover:bg-emerald-500/[0.04] hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_12px_30px_-10px_rgba(16,185,129,0.12)]"
          >
            {/* Clean, simple highlighted star badge */}
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-100/30 group-hover:scale-105 group-hover:bg-emerald-500 transition-all duration-300">
              <Star className="h-4 w-4 fill-emerald-600 text-emerald-600 group-hover:fill-white group-hover:text-white transition-all duration-300" />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors mb-1 font-display tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
export default WhyChooseUsSection;
