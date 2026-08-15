import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

// 1. Reusable Aurora Background
// Renders animated low-opacity colorful ambient blur nodes drifting in smooth keyframes.
export const AuroraBackground = ({ className = '', children }: BackgroundProps) => {
  return (
    <div className={cn('relative w-full overflow-hidden bg-transparent', className)}>
      {/* Aurora Glow Node 1 - Emerald */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none z-0"
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora Glow Node 2 - Deep Teal */}
      <motion.div
        className="absolute top-1/2 right-10 w-[450px] h-[450px] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none z-0"
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 80, -60, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora Glow Node 3 - Soft Blue */}
      <motion.div
        className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none z-0"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 40, -40, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

// 2. Reusable Spotlight 3D Background with Parallax Particles
// Dot grid matrix, low-opacity mouse tracking spotlight, and floating particles shifting relative to cursor coordinates.
export const Spotlight3DBackground = ({ className = '', children }: BackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Parallax transform mapping for subtle 3D depth floating particles
  const parallaxX = useTransform(mouseX, (value) => (value - 400) * -0.03);
  const parallaxY = useTransform(mouseY, (value) => (value - 400) * -0.03);
  const parallaxDeepX = useTransform(mouseX, (value) => (value - 400) * 0.05);
  const parallaxDeepY = useTransform(mouseY, (value) => (value - 400) * 0.05);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const spotlightBg = useMotionTemplate`
    radial-gradient(
      500px circle at ${mouseX}px ${mouseY}px,
      rgba(14, 165, 233, 0.04),
      transparent 80%
    )
  `;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative w-full overflow-hidden bg-transparent', className)}
    >
      {/* 3D Dot Grid matrix layer */}
      <div 
        className="absolute inset-0 opacity-[0.22] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(rgba(13, 58, 54, 0.15) 1.2px, transparent 1.2px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Mouse spotlight glow tracker */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 z-0"
        style={{
          background: spotlightBg,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Subtle 3D floating parallax particle 1 */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute top-1/4 left-1/4 w-[140px] h-[140px] rounded-full bg-emerald-500/[0.025] blur-xl pointer-events-none z-0"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle 3D floating parallax particle 2 (Deep layer) */}
      <motion.div
        style={{ x: parallaxDeepX, y: parallaxDeepY }}
        className="absolute bottom-1/4 right-1/4 w-[160px] h-[160px] rounded-full bg-teal-500/[0.02] blur-xl pointer-events-none z-0"
        animate={{
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
