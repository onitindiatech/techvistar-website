import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedHeading } from '@/components/animations/AnimatedHeading';

interface SectionHeaderProps {
  tag: string;
  title: string;
  highlight: string;
  description: string;
  isInView: boolean;
  /** Use on light banded sections (default). Set false for dark hero-style blocks. */
  light?: boolean;
  /** Optional id for the section heading (accessibility / in-page links). */
  headingId?: string;
  className?: string;
}

export const SectionHeader = ({
  tag,
  title,
  highlight,
  description,
  isInView,
  light = true,
  headingId,
  className,
}: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn('mx-auto mb-14 max-w-3xl text-center md:mb-16', className)}
    >
      <div className="mb-4 flex flex-col items-center gap-2">
        <span
          className={cn(
            'text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]',
            light ? 'text-primary' : 'text-emerald-300'
          )}
        >
          {tag}
        </span>
        <span
          className={cn(
            'h-0.5 w-8 rounded-full transition-all duration-500',
            isInView 
              ? (light ? 'bg-primary w-12' : 'bg-emerald-400 w-12')
              : 'w-0'
          )}
          aria-hidden
        />
      </div>
      <h2
        id={headingId}
        className={cn(
          'mb-5 font-display text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl lg:text-[2.75rem]',
          light ? 'text-slate-950' : 'text-white'
        )}
      >
        <AnimatedHeading
          text={`${title} ${highlight}`}
          as="h2"
          highlightWords={[highlight]}
          highlightClassName="gradient-text"
        />
      </h2>
      <p
        className={cn(
          'mx-auto max-w-2xl text-base leading-relaxed md:text-lg font-medium',
          light ? 'text-slate-600' : 'text-slate-300'
        )}
      >
        {description}
      </p>
    </motion.div>
  );
};
