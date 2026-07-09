import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Circle } from 'lucide-react';

export function getCmsIcon(name: string): LucideIcon {
  const Icon = (LucideIcons as Record<string, LucideIcon>)[name];
  return Icon || Circle;
}

export const CMS_ICON_OPTIONS = [
  'Cpu', 'Shield', 'Users', 'ClipboardCheck', 'DollarSign', 'Layers',
  'Globe', 'Smartphone', 'Palette', 'Brain', 'Laptop', 'Cloud',
  'Briefcase', 'Heart', 'Clock', 'Star', 'Zap', 'Target', 'Award',
] as const;
