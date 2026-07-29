import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileBackButtonProps {
  to: string;
  label: string;
  className?: string;
}

export const MobileBackButton = ({ to, label, className }: MobileBackButtonProps) => {
  return (
    <Link
      to={to}
      className={cn('back-btn-premium', className)}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};
