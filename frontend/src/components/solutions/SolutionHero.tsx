import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { SolutionDetail, resolveSolutionIcon } from '@/data/solutions';

import { MobileBackButton } from '@/components/ui/MobileBackButton';
import { AnimatedStat } from '@/components/ui/AnimatedStat';

interface SolutionHeroProps {
  solution: SolutionDetail;
}

const FLOATING_CARD_POSITIONS = [
  'absolute -top-6 -left-6 md:-left-10',
  'absolute top-1/2 -left-8 md:-left-12',
  'absolute top-4 -right-4 md:-right-8',
  'absolute bottom-6 -right-6 md:-right-10',
];

const FLOATING_CARD_DELAYS = [0.5, 0.7, 0.6, 0.8];

const FLOATING_ICON_STYLES = [
  'h-10 w-10 rounded-full bg-emerald-100 text-emerald-600',
  'h-10 w-10 rounded-full bg-blue-100 text-blue-600',
  'h-10 w-10 rounded-xl bg-purple-100 text-purple-600',
  'h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600',
];

export const SolutionHero = ({ solution }: SolutionHeroProps) => {
  const topFeatures = solution.features.slice(0, 4);
  const badgeText = solution.heroBadge || solution.category;
  const backLinkText = solution.backLinkText;
  const floatingCards = solution.heroFloatingCards.slice(0, 4);
  const heroStats = solution.heroStats.slice(0, 4);

  return (
    <section className="relative bg-gradient-to-b from-emerald-50/40 to-white pt-[4.5rem] pb-4 md:pt-24 md:pb-8 overflow-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 xl:px-20 relative z-10 detail-page-gutter">
        
        <MobileBackButton to="/solutions" label="All Solutions" className="mb-4" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-6">
          
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left">
            

            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-[1.75rem] leading-[1.12] md:text-5xl lg:text-[3.5rem] font-extrabold font-display text-slate-900 md:leading-[1.1] tracking-tight mb-4 md:mb-6">
                {solution.title}
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-base md:text-lg font-bold text-emerald-600 leading-snug mb-4 max-w-xl"
            >
              {solution.subtitle}
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm md:text-base text-slate-600 leading-relaxed mb-8 max-w-xl"
            >
              {solution.heroDescription}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 w-full"
            >
              {topFeatures.map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                      <FeatIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{feat.title}</span>
                  </div>
                );
              })}
            </motion.div>

          </div>

          <div className="lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end mt-10 lg:mt-0">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-[600px] xl:max-w-[700px] z-10 perspective-1000"
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/60 bg-white"
              >
                <img
                  src={solution.dashboardImage}
                  alt="Dashboard Preview"
                  className="w-full h-auto object-cover object-top"
                />
              </motion.div>

              {floatingCards.map((card, idx) => {
                const CardIcon = resolveSolutionIcon(card.icon);
                return (
                  <motion.div 
                    key={`${card.label}-${idx}`}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20, ...(idx === 1 || idx === 3 ? { y: 20 } : {}) }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.6, delay: FLOATING_CARD_DELAYS[idx] || 0.5 }}
                    className={`${FLOATING_CARD_POSITIONS[idx] || FLOATING_CARD_POSITIONS[0]} bg-white/90 backdrop-blur-md border border-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 flex flex-col items-center gap-1 z-20 hover:-translate-y-1 transition-transform`}
                  >
                    <div className={`${FLOATING_ICON_STYLES[idx] || FLOATING_ICON_STYLES[0]} flex items-center justify-center mb-1`}>
                      <CardIcon className="h-5 w-5" />
                    </div>
                    <span className={`${card.value.length > 4 ? 'text-sm' : 'text-lg'} font-black text-slate-900`}>{card.value}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{card.label}</span>
                  </motion.div>
                );
              })}

            </motion.div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-[24px] p-4 md:p-6 shadow-sm border border-slate-100/60"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {heroStats.map((stat, idx) => {
              const StatIcon = resolveSolutionIcon(stat.icon);
              return (
                <AnimatedStat
                  key={`${stat.label}-${idx}`}
                  value={stat.value}
                  label={stat.label}
                  description={stat.description}
                  variant="solution-card"
                  icon={<StatIcon className="h-[18px] w-[18px]" strokeWidth={2.5} />}
                />
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default SolutionHero;
