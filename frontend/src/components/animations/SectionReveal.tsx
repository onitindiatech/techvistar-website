import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  className?: string;
  viewportOnce?: boolean;
}

export const SectionReveal = ({
  children,
  staggerChildren = 0.1,
  delayChildren = 0,
  className = '',
  viewportOnce = true,
}: SectionRevealProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: '-40px' }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
