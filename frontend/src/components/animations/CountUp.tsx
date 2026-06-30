import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  value: string;
  duration?: number;
}

export const CountUp = ({ value, duration = 1.8 }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Parse numeric parts and surrounding characters (prefixes/suffixes)
    const match = value.match(/([0-9.]+)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const numericPart = match[0];
    const prefix = value.substring(0, match.index);
    const suffix = value.substring(match.index! + numericPart.length);
    const target = parseFloat(numericPart);
    const isDecimal = numericPart.includes('.');

    const start = 0;
    const startTime = performance.now();

    const animateValue = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad transition
      const easeProgress = progress * (2 - progress);
      const current = start + easeProgress * (target - start);

      if (isDecimal) {
        setDisplayValue(`${prefix}${current.toFixed(1)}${suffix}`);
      } else {
        setDisplayValue(`${prefix}${Math.floor(current)}${suffix}`);
      }

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animateValue);
  }, [isInView, value, duration]);

  return <span ref={ref}>{displayValue}</span>;
};
