export type EnterpriseLogoProvider = 'simpleicons' | 'simpleicons-npm' | 'devicon';

export interface EnterpriseMarqueeBrand {
  name: string;
  /** Simple Icons slug (when applicable) */
  slug: string;
  /** Brand hex without # — used by cdn.simpleicons.org */
  color: string;
  provider?: EnterpriseLogoProvider;
  /** Devicon path, e.g. `azure/azure-original` */
  deviconPath?: string;
  /** Pinned simple-icons npm version for slugs removed from cdn.simpleicons.org */
  npmVersion?: string;
}

/** Recognizable enterprise & technology brands for the logo marquee. */
export const ENTERPRISE_MARQUEE_BRANDS: EnterpriseMarqueeBrand[] = [
  {
    name: 'AWS',
    slug: 'amazonaws',
    color: 'FF9900',
    provider: 'devicon',
    deviconPath: 'amazonwebservices/amazonwebservices-plain-wordmark',
  },
  {
    name: 'Microsoft Azure',
    slug: 'microsoftazure',
    color: '0078D4',
    provider: 'devicon',
    deviconPath: 'azure/azure-original',
  },
  { name: 'Google Cloud', slug: 'googlecloud', color: '4285F4' },
  { name: 'Docker', slug: 'docker', color: '2496ED' },
  { name: 'Kubernetes', slug: 'kubernetes', color: '326CE5' },
  { name: 'GitHub', slug: 'github', color: '181717' },
  { name: 'GitLab', slug: 'gitlab', color: 'FC6D26' },
  { name: 'Vercel', slug: 'vercel', color: '000000' },
  { name: 'Netlify', slug: 'netlify', color: '00C7B7' },
  { name: 'Cloudflare', slug: 'cloudflare', color: 'F38020' },
  { name: 'MongoDB', slug: 'mongodb', color: '47A248' },
  { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1' },
  { name: 'Node.js', slug: 'nodedotjs', color: '339933' },
  { name: 'React', slug: 'react', color: '61DAFB' },
  { name: 'Next.js', slug: 'nextdotjs', color: '000000' },
  { name: 'TypeScript', slug: 'typescript', color: '3178C6' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4' },
  {
    name: 'OpenAI',
    slug: 'openai',
    color: '412991',
    provider: 'simpleicons-npm',
    npmVersion: '15',
  },
  { name: 'Gemini', slug: 'googlegemini', color: '8E75B2' },
  { name: 'Stripe', slug: 'stripe', color: '635BFF' },
];

export function getEnterpriseLogoSvgUrl(brand: EnterpriseMarqueeBrand): string {
  if (brand.provider === 'devicon' && brand.deviconPath) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${brand.deviconPath}.svg`;
  }
  if (brand.provider === 'simpleicons-npm') {
    const version = brand.npmVersion ?? '15';
    return `https://cdn.jsdelivr.net/npm/simple-icons@${version}/icons/${brand.slug}.svg`;
  }
  return `https://cdn.simpleicons.org/${brand.slug}/${brand.color}`;
}
