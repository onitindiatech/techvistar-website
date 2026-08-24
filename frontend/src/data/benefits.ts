import { Compass, Layout, Cpu, TrendingUp } from 'lucide-react';

/** Benefits grid — mirrors “Key benefits” style landing pages */
export const SECTION_BENEFITS = {
  tag: 'OUR PILLARS',
  title: 'POSITION. EXPERIENCE. ENGINE. SCALE.',
  highlight: '',
  description:
    'A business can outgrow its current brand, digital presence, systems, and growth model as its ambitions become bigger.',
} as const;

export const BENEFITS = [
  {
    icon: Compass,
    title: 'POSITION',
    description:
      'Strategic brand positioning to define authority and distinctiveness in your market as your ambition grows.',
  },
  {
    icon: Layout,
    title: 'EXPERIENCE',
    description:
      'Premium digital experience, design systems, and interfaces engineered for modern user engagement.',
  },
  {
    icon: Cpu,
    title: 'ENGINE',
    description:
      'Scalable tech architecture, custom software, and automated workflows powering operational growth.',
  },
  {
    icon: TrendingUp,
    title: 'SCALE',
    description:
      'Venture scaling models and robust infrastructure built to sustain long-term business expansion.',
  },
] as const;
