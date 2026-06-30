import { motion, useReducedMotion, Variants } from 'framer-motion';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  delay?: number;
  highlightWords?: string[];
  highlightClassName?: string;
}

export const AnimatedHeading = ({
  text,
  className = '',
  as = 'h2',
  delay = 0,
  highlightWords = [],
  highlightClassName = 'gradient-text',
}: AnimatedHeadingProps) => {
  const prefersReducedMotion = useReducedMotion();
  const Tag = as;

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(' ');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      variants={containerVariants}
      className={`inline-block ${className}`}
    >
      {words.map((word, idx) => {
        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
        const isHighlighted = highlightWords.some(hw => 
          cleanWord.toLowerCase() === hw.toLowerCase() || 
          word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <motion.span
            key={idx}
            variants={wordVariants}
            className={`inline-block mr-[0.25em] ${isHighlighted ? highlightClassName : ''}`}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.span>
  );
};
