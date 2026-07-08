import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ServicesLandingConfig } from '@/types/servicesCms';

interface ServicesLandingHeroProps {
  landing: ServicesLandingConfig;
  backgroundImage: string;
  onExplore?: () => void;
}

export const ServicesLandingHero = ({
  landing,
  backgroundImage,
  onExplore,
}: ServicesLandingHeroProps) => {
  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-slate-950 pt-20">
      {backgroundImage && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950" />

      <motion.div
        className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-emerald-500/15 blur-[100px]"
        animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-teal-400/10 blur-[90px]"
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-5"
        >
          {landing.subtitle && (
            <Badge className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
              <Sparkles className="mr-1.5 inline h-3 w-3" />
              {landing.subtitle}
            </Badge>
          )}

          <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {landing.title.split(' ').length > 2 ? (
              <>
                {landing.title.split(' ').slice(0, -2).join(' ')}{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  {landing.title.split(' ').slice(-2).join(' ')}
                </span>
              </>
            ) : (
              <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                {landing.title}
              </span>
            )}
          </h1>

          {landing.description && (
            <p className="mx-auto max-w-2xl text-sm font-semibold leading-relaxed text-slate-300 sm:text-base md:text-lg">
              {landing.description}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            onClick={onExplore}
            size="lg"
            className="h-12 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500"
          >
            Explore Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesLandingHero;
