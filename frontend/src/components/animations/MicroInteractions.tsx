import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// 1. Magnetic Pull Effect: Softly attracts the element towards the mouse cursor
interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  range?: number; // Distance threshold to activate magnet
}

export const Magnetic = ({ children, className = '', range = 0.3 }: MagneticProps) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * range, y: y * range });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 2. Shine Light Sweep Effect: Sweeps a glassy gloss shine on hover
export const ShineEffect = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative overflow-hidden group/shine", className)}>
      {children}
      <div className="absolute inset-0 -translate-x-full group-hover/shine:translate-x-full transition-transform duration-1200 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
    </div>
  );
};

// 3. Hover Glow Shadow Effect
export const GlowHover = ({
  children,
  glowColor = 'rgba(14, 165, 233, 0.15)',
  className = '',
}: {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
}) => {
  return (
    <div 
      className={cn("transition-all duration-300 hover:shadow-md", className)}
      style={{
        boxShadow: `0 0 0 0 transparent`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 10px 30px -10px ${glowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
      }}
    >
      {children}
    </div>
  );
};
