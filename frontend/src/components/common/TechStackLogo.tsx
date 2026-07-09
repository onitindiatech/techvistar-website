import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { getTechLogoUrl } from '@/lib/techStackLogos';
import { cn } from '@/lib/utils';

interface TechStackLogoProps {
  name: string;
  className?: string;
  /** sm = marquee/cards (24px), md = service details (28px) */
  size?: 'sm' | 'md';
  /** Use eager + sync decoding for off-screen marquee items */
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-7 w-7',
} as const;

export const TechStackLogo = ({
  name,
  className,
  size = 'md',
  loading = 'lazy',
  priority = false,
}: TechStackLogoProps) => {
  const [failed, setFailed] = useState(false);
  const logoUrl = getTechLogoUrl(name);
  const dimension = sizeClasses[size];

  if (!logoUrl || failed) {
    return (
      <Cpu
        className={cn(dimension, 'shrink-0 text-emerald-600', className)}
        aria-hidden
        strokeWidth={2}
      />
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      loading={loading}
      decoding={loading === 'eager' ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
      className={cn(dimension, 'shrink-0 object-contain', className)}
    />
  );
};

export default TechStackLogo;
