import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface MouseGradientProps {
  color?: string; // e.g. "rgba(34, 197, 94, 0.12)"
  className?: string;
}

export const MouseGradient = ({
  color = 'rgba(16, 185, 129, 0.12)',
  className = '',
}: MouseGradientProps) => {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 250);
      mouseY.set(e.clientY - 250);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      className={`pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[500px] rounded-full blur-[80px] ${className}`}
    />
  );
};
