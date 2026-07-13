import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface AnimatedStatProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  variant: 'hero-tall' | 'sidebar-row' | 'hero-card' | 'solution-card' | 'capability-card' | 'contact-badge';
  themeIconClass?: string;
}

export const AnimatedStat: React.FC<AnimatedStatProps> = ({
  value,
  label,
  description,
  icon,
  className = '',
  variant,
  themeIconClass = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState<string | number>(value);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse the stat value — only animate a single leading number (e.g. "50+", "99%").
  // Values with extra digits after the first number (e.g. "24/7") render literally.
  const numericMatch = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const suffixPart = numericMatch?.[3] ?? '';
  const isNumeric = Boolean(numericMatch) && !/\d/.test(suffixPart);
  const numberPart = numericMatch?.[2] ?? '';
  const parsedNum = isNumeric ? parseFloat(numberPart) : 0;
  const prefix = isNumeric ? numericMatch![1] : '';
  const suffix = isNumeric ? suffixPart : '';
  const hasDecimals = isNumeric && numberPart.includes('.');
  const decimalPlaces = hasDecimals ? (numberPart.split('.')[1] || '').length : 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    if (prefersReducedMotion || !isNumeric) {
      setCount(value);
      return;
    }

    let start = 0;
    const duration = 1500; // 1.5s in milliseconds
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo formula
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = start + (parsedNum - start) * easeProgress;

      if (hasDecimals) {
        setCount(currentVal.toFixed(decimalPlaces));
      } else {
        setCount(Math.floor(currentVal));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(parsedNum);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, parsedNum, isNumeric, value, prefersReducedMotion, hasDecimals, decimalPlaces]);

  // Premium hover and fade-up variables
  const hoverClasses =
    variant !== 'sidebar-row' && variant !== 'hero-tall'
      ? 'transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-emerald-500/40 hover:shadow-[0_8px_20px_rgba(16,185,129,0.12)]'
      : '';

  // Return specific markup based on variant to preserve the UI structure exactly
  switch (variant) {
    case 'hero-tall':
      return (
        <div ref={containerRef} className={`hero-tall-stats-item ${className}`}>
          <span className="hero-tall-stats-value">
            {isNumeric ? `${prefix}${count}${suffix}` : value}
          </span>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="hero-tall-stats-label"
          >
            {label}
          </motion.span>
        </div>
      );

    case 'sidebar-row':
      return (
        <div ref={containerRef} className={`flex items-center justify-between border-b border-slate-100 pb-3 text-xs ${className}`}>
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="font-semibold uppercase tracking-wider text-slate-400"
          >
            {label}
          </motion.span>
          <span className="font-bold text-slate-800">
            {isNumeric ? `${prefix}${count}${suffix}` : value}
          </span>
        </div>
      );

    case 'hero-card':
      return (
        <div
          ref={containerRef}
          className={`flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-sm ${hoverClasses} ${className}`}
        >
          {icon && (
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${themeIconClass}`}>
              {icon}
            </div>
          )}
          <div>
            <p className="mb-0.5 text-sm font-bold leading-none text-slate-900">
              {isNumeric ? `${prefix}${count}${suffix}` : value}
            </p>
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
              className="text-[10px] font-semibold leading-tight text-slate-500"
            >
              {label}
            </motion.p>
          </div>
        </div>
      );

    case 'solution-card':
      return (
        <div
          ref={containerRef}
          className={`bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm ${hoverClasses} ${className}`}
        >
          <div className="flex gap-4 items-start">
            {icon && (
              <div className="h-10 w-10 rounded-[12px] bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div className="pt-0.5">
              <h3 className="text-[24px] font-black text-slate-900 leading-none mb-1.5">
                {isNumeric ? `${prefix}${count}${suffix}` : value}
              </h3>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                className="text-[13px] font-bold text-slate-800 mb-1.5"
              >
                {label}
              </motion.p>
              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
                  className="text-[12px] text-slate-500 leading-relaxed font-medium"
                >
                  {description}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      );

    case 'capability-card':
      return (
        <div
          ref={containerRef}
          className={`rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-5 text-center shadow-sm ${hoverClasses} ${className}`}
        >
          <p className="font-display text-xl font-black text-emerald-700 md:text-2xl">
            {isNumeric ? `${prefix}${count}${suffix}` : value}
          </p>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500"
          >
            {label}
          </motion.p>
        </div>
      );

    case 'contact-badge':
      return (
        <div ref={containerRef} className={`flex items-center gap-3 ${className}`}>
          {icon && (
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              {icon}
            </div>
          )}
          <div>
            <div className="text-sm font-bold text-slate-900 leading-none">
              {isNumeric ? `${prefix}${count}${suffix}` : value}
            </div>
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="text-[10px] text-slate-500 font-semibold uppercase block mt-0.5"
            >
              {label}
            </motion.span>
          </div>
        </div>
      );

    default:
      return null;
  }
};
