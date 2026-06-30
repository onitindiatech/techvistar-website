import React from 'react';
import { cn } from '@/lib/utils';

interface GlowBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowClassName?: string;
}

export const GlowBorder = ({
  children,
  className = '',
  glowClassName = '',
  ...props
}: GlowBorderProps) => {
  return (
    <div
      className={cn(
        'group relative rounded-2xl p-[1px] overflow-hidden transition-all duration-300',
        className
      )}
      {...props}
    >
      {/* Glow effect in the background */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-primary via-emerald-500 to-teal-500 opacity-0 blur-md transition-all duration-500 group-hover:opacity-60 group-hover:scale-[1.02]',
          glowClassName
        )}
      />
      {/* Solid/Moving gradient border */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/30 via-emerald-500/30 to-teal-500/30 opacity-40 group-hover:opacity-100 transition-opacity duration-500"
      />
      {/* Inner card container */}
      <div className="relative z-10 h-full w-full rounded-[15px] bg-white transition-colors duration-300">
        {children}
      </div>
    </div>
  );
};
