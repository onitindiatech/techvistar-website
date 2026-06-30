import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  scale?: number;
}

export const HoverCard = ({
  children,
  className = '',
  depth = 8,
  scale = 1.02,
  ...props
}: HoverCardProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm', className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{
        y: -depth,
        scale,
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(34, 197, 94, 0.1)',
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 24,
      }}
      className={cn(
        'group relative rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-colors duration-300',
        className
      )}
      {...props}
    >
      {/* Subtle glassmorphism overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
};
