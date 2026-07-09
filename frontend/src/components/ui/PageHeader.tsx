import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  backgroundImage?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, description, backgroundImage, children }: PageHeaderProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-zinc-950 pt-28 pb-16 md:pt-32 md:pb-20 border-b border-zinc-900 text-white"
    >
      {/* Animated Mesh Waves + Mouse Parallax */}
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 opacity-80 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'auto 100%',
            backgroundPosition: 'right',
            backgroundRepeat: 'no-repeat',
          }}
          animate={{
            x: [0, 6, 0],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'auto 100%',
              backgroundPosition: 'right',
              backgroundRepeat: 'no-repeat',
            }}
            animate={{
              x: mousePosition.x * 8,
              y: mousePosition.y * 8,
            }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
          />
        </motion.div>
      )}

      {/* Grid Pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Gradient Breathing (Background radial glow) */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none z-0"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.6, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-emerald-400/40 rounded-full blur-[0.5px]"
            style={{
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
              left: `${(i * 15) + 10}%`,
              top: `${(i * 12) + 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 5, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 14 + (i % 3) * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-0 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl text-left relative z-10">
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium mb-3">
              {subtitle}
            </Badge>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-display"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-2xl"
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};
