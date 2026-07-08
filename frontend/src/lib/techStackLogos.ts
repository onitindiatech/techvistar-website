export type TechLogoProvider = 'simpleicons' | 'devicon' | 'simpleiconsnpm';

export interface TechLogoSource {
  provider: TechLogoProvider;
  /** simple-icons slug or devicon path (e.g. `react/react-original`) */
  id: string;
  /** Brand hex color without # — used for card styling and simple-icons tint */
  color: string;
}

export interface TechBrandStyle {
  logoUrl: string | null;
  borderColor: string;
  bg: string;
  textColor: string;
  glowColor: string;
}

function normalizeTechName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Centralized technology logo map.
 * Case-insensitive aliases resolve through `normalizeTechName`.
 *
 * CDN sources:
 * - Simple Icons: https://cdn.simpleicons.org/{slug}/{color}
 * - Devicon: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{path}.svg
 */
export const TECH_LOGO_MAP: Record<string, TechLogoSource> = {
  // Frontend
  html5: { provider: 'simpleicons', id: 'html5', color: 'E34F26' },
  css3: { provider: 'devicon', id: 'css3/css3-original', color: '1572B6' },
  javascript: { provider: 'simpleicons', id: 'javascript', color: 'F7DF1E' },
  js: { provider: 'simpleicons', id: 'javascript', color: 'F7DF1E' },
  typescript: { provider: 'simpleicons', id: 'typescript', color: '3178C6' },
  ts: { provider: 'simpleicons', id: 'typescript', color: '3178C6' },
  react: { provider: 'simpleicons', id: 'react', color: '61DAFB' },
  reactjs: { provider: 'simpleicons', id: 'react', color: '61DAFB' },
  reactnative: { provider: 'simpleicons', id: 'react', color: '61DAFB' },
  nextjs: { provider: 'simpleicons', id: 'nextdotjs', color: '000000' },
  next: { provider: 'simpleicons', id: 'nextdotjs', color: '000000' },
  vuejs: { provider: 'simpleicons', id: 'vuedotjs', color: '4FC08D' },
  vue: { provider: 'simpleicons', id: 'vuedotjs', color: '4FC08D' },
  angular: { provider: 'simpleicons', id: 'angular', color: 'DD0031' },
  tailwindcss: { provider: 'simpleicons', id: 'tailwindcss', color: '06B6D4' },
  tailwind: { provider: 'simpleicons', id: 'tailwindcss', color: '06B6D4' },
  tailwindtokens: { provider: 'simpleicons', id: 'tailwindcss', color: '06B6D4' },
  bootstrap: { provider: 'simpleicons', id: 'bootstrap', color: '7952B3' },
  vite: { provider: 'simpleicons', id: 'vite', color: '646CFF' },

  // Backend
  nodejs: { provider: 'simpleicons', id: 'nodedotjs', color: '339933' },
  node: { provider: 'simpleicons', id: 'nodedotjs', color: '339933' },
  express: { provider: 'simpleicons', id: 'express', color: '000000' },
  expressjs: { provider: 'simpleicons', id: 'express', color: '000000' },
  nestjs: { provider: 'simpleicons', id: 'nestjs', color: 'E0234E' },
  nest: { provider: 'simpleicons', id: 'nestjs', color: 'E0234E' },
  python: { provider: 'simpleicons', id: 'python', color: '3776AB' },
  java: { provider: 'devicon', id: 'java/java-original', color: '007396' },
  php: { provider: 'simpleicons', id: 'php', color: '777BB4' },
  go: { provider: 'simpleicons', id: 'go', color: '00ADD8' },
  golang: { provider: 'simpleicons', id: 'go', color: '00ADD8' },
  ruby: { provider: 'simpleicons', id: 'ruby', color: 'CC342D' },
  rust: { provider: 'simpleicons', id: 'rust', color: '000000' },

  // Mobile
  flutter: { provider: 'simpleicons', id: 'flutter', color: '02569B' },
  swift: { provider: 'simpleicons', id: 'swift', color: 'F05138' },
  kotlin: { provider: 'simpleicons', id: 'kotlin', color: '7F52FF' },
  android: { provider: 'simpleicons', id: 'android', color: '3DDC84' },
  ios: { provider: 'simpleicons', id: 'apple', color: '000000' },

  // Databases
  mongodb: { provider: 'simpleicons', id: 'mongodb', color: '47A248' },
  postgresql: { provider: 'simpleicons', id: 'postgresql', color: '4169E1' },
  postgres: { provider: 'simpleicons', id: 'postgresql', color: '4169E1' },
  mysql: { provider: 'simpleicons', id: 'mysql', color: '4479A1' },
  redis: { provider: 'simpleicons', id: 'redis', color: 'FF4438' },
  firebase: { provider: 'simpleicons', id: 'firebase', color: 'DD2C00' },
  supabase: { provider: 'simpleicons', id: 'supabase', color: '3FCF8E' },
  prisma: { provider: 'simpleicons', id: 'prisma', color: '2D3748' },

  // Cloud & DevOps
  docker: { provider: 'simpleicons', id: 'docker', color: '2496ED' },
  kubernetes: { provider: 'simpleicons', id: 'kubernetes', color: '326CE5' },
  k8s: { provider: 'simpleicons', id: 'kubernetes', color: '326CE5' },
  aws: { provider: 'devicon', id: 'amazonwebservices/amazonwebservices-plain-wordmark', color: 'FF9900' },
  amazonaws: { provider: 'devicon', id: 'amazonwebservices/amazonwebservices-plain-wordmark', color: 'FF9900' },
  rds: { provider: 'devicon', id: 'amazonwebservices/amazonwebservices-plain-wordmark', color: 'FF9900' },
  vpc: { provider: 'devicon', id: 'amazonwebservices/amazonwebservices-plain-wordmark', color: 'FF9900' },
  iam: { provider: 'devicon', id: 'amazonwebservices/amazonwebservices-plain-wordmark', color: 'FF9900' },
  awsiam: { provider: 'devicon', id: 'amazonwebservices/amazonwebservices-plain-wordmark', color: 'FF9900' },
  cloudtrail: { provider: 'devicon', id: 'amazonwebservices/amazonwebservices-plain-wordmark', color: 'FF9900' },
  azure: { provider: 'devicon', id: 'azure/azure-original', color: '0078D4' },
  microsoftazure: { provider: 'devicon', id: 'azure/azure-original', color: '0078D4' },
  activedirectory: { provider: 'devicon', id: 'azure/azure-original', color: '0078D4' },
  googlecloud: { provider: 'simpleicons', id: 'googlecloud', color: '4285F4' },
  gcp: { provider: 'simpleicons', id: 'googlecloud', color: '4285F4' },
  terraform: { provider: 'simpleicons', id: 'terraform', color: '844FBA' },
  githubactions: { provider: 'simpleicons', id: 'githubactions', color: '2088FF' },
  grafana: { provider: 'simpleicons', id: 'grafana', color: 'F46800' },
  prometheus: { provider: 'simpleicons', id: 'prometheus', color: 'E6522C' },
  linux: { provider: 'simpleicons', id: 'linux', color: 'FCC624' },
  nginx: { provider: 'simpleicons', id: 'nginx', color: '009639' },

  // Version control
  git: { provider: 'simpleicons', id: 'git', color: 'F05032' },
  github: { provider: 'simpleicons', id: 'github', color: '181717' },
  gitlab: { provider: 'simpleicons', id: 'gitlab', color: 'FC6D26' },
  bitbucket: { provider: 'simpleicons', id: 'bitbucket', color: '0052CC' },

  // Design
  figma: { provider: 'simpleicons', id: 'figma', color: 'F24E1E' },
  figjam: { provider: 'simpleicons', id: 'figma', color: 'F24E1E' },
  adobexd: { provider: 'devicon', id: 'xd/xd-plain', color: 'FF61F6' },
  illustrator: { provider: 'devicon', id: 'illustrator/illustrator-plain', color: 'FF9A00' },
  adobeillustrator: { provider: 'devicon', id: 'illustrator/illustrator-plain', color: 'FF9A00' },
  photoshop: { provider: 'devicon', id: 'photoshop/photoshop-plain', color: '31A8FF' },
  adobephotoshop: { provider: 'devicon', id: 'photoshop/photoshop-plain', color: '31A8FF' },
  indesign: { provider: 'devicon', id: 'photoshop/photoshop-plain', color: 'FF3366' },
  aftereffects: { provider: 'devicon', id: 'aftereffects/aftereffects-plain', color: '9999FF' },
  premierepro: { provider: 'devicon', id: 'premierepro/premierepro-plain', color: '9999FF' },
  sketch: { provider: 'simpleicons', id: 'sketch', color: 'F7B500' },
  canva: { provider: 'simpleicons', id: 'canva', color: '00C4CC' },
  storybook: { provider: 'simpleicons', id: 'storybook', color: 'FF4785' },

  // AI / ML
  openai: { provider: 'simpleiconsnpm', id: 'openai', color: '412991' },
  openaiapi: { provider: 'simpleiconsnpm', id: 'openai', color: '412991' },
  chatgpt: { provider: 'simpleiconsnpm', id: 'openai', color: '412991' },
  claude: { provider: 'simpleicons', id: 'anthropic', color: '191919' },
  anthropic: { provider: 'simpleicons', id: 'anthropic', color: '191919' },
  langchain: { provider: 'simpleicons', id: 'langchain', color: '1C3C3C' },
  tensorflow: { provider: 'simpleicons', id: 'tensorflow', color: 'FF6F00' },
  pytorch: { provider: 'simpleicons', id: 'pytorch', color: 'EE4C2C' },
  huggingface: { provider: 'simpleicons', id: 'huggingface', color: 'FFD21E' },
  n8n: { provider: 'simpleicons', id: 'n8n', color: 'EA4B71' },
  vllm: { provider: 'simpleiconsnpm', id: 'openai', color: '412991' },

  // CMS / Commerce
  wordpress: { provider: 'simpleicons', id: 'wordpress', color: '21759B' },
  shopify: { provider: 'simpleicons', id: 'shopify', color: '7AB55C' },
  webflow: { provider: 'simpleicons', id: 'webflow', color: '146EF5' },
  strapi: { provider: 'simpleicons', id: 'strapi', color: '4945FF' },
  contentful: { provider: 'simpleicons', id: 'contentful', color: '2478CC' },

  // Analytics / Marketing
  googletagmanager: { provider: 'simpleicons', id: 'googletagmanager', color: '246FDB' },
  ga4: { provider: 'simpleicons', id: 'googleanalytics', color: 'E37400' },
  googleanalytics: { provider: 'simpleicons', id: 'googleanalytics', color: 'E37400' },
  hubspot: { provider: 'simpleicons', id: 'hubspot', color: 'FF7A59' },
  semrush: { provider: 'simpleicons', id: 'semrush', color: 'FF642D' },
  meta: { provider: 'simpleicons', id: 'meta', color: '0467DF' },
  metabusinesssuite: { provider: 'simpleicons', id: 'meta', color: '0467DF' },

  // Payments / APIs
  stripe: { provider: 'simpleicons', id: 'stripe', color: '635BFF' },
  stripeapi: { provider: 'simpleicons', id: 'stripe', color: '635BFF' },
  paypal: { provider: 'simpleicons', id: 'paypal', color: '00457C' },
  swagger: { provider: 'simpleicons', id: 'swagger', color: '85EA2D' },
  graphql: { provider: 'simpleicons', id: 'graphql', color: 'E10098' },

  // Collaboration / Docs
  miro: { provider: 'simpleicons', id: 'miro', color: '050038' },
  loom: { provider: 'simpleicons', id: 'loom', color: '625DF5' },
  gitbook: { provider: 'simpleicons', id: 'gitbook', color: '3884FF' },
  mermaid: { provider: 'simpleicons', id: 'mermaid', color: 'FF3670' },
  confluence: { provider: 'simpleicons', id: 'confluence', color: '172B4D' },
  markdown: { provider: 'simpleicons', id: 'markdown', color: '000000' },
  yaml: { provider: 'simpleicons', id: 'yaml', color: 'CB171E' },
  jwt: { provider: 'simpleicons', id: 'jsonwebtoken', color: '000000' },
  jsonwebtoken: { provider: 'simpleicons', id: 'jsonwebtoken', color: '000000' },
  sentry: { provider: 'simpleicons', id: 'sentry', color: '362D59' },
  rabbitmq: { provider: 'simpleicons', id: 'rabbitmq', color: 'FF6600' },

  // Security
  owasp: { provider: 'simpleicons', id: 'owasp', color: '000000' },
  owaspzap: { provider: 'simpleicons', id: 'owasp', color: '000000' },
};

/** Favicon fallback for brands without simple-icons / devicon entries */
const TECH_FAVICON_DOMAINS: Record<string, string> = {
  pinecone: 'pinecone.io',
  fastlane: 'fastlane.tools',
  burpsuite: 'portswigger.net',
  nmap: 'nmap.org',
  cron: 'cron-job.org',
  restapis: 'swagger.io',
  webhooks: 'webhook.site',
};

function buildLogoUrl(source: TechLogoSource): string {
  if (source.provider === 'devicon') {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${source.id}.svg`;
  }
  if (source.provider === 'simpleiconsnpm') {
    // Pinned legacy icons removed from cdn.simpleicons.org (e.g. OpenAI)
    return `https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${source.id}.svg`;
  }
  return `https://cdn.simpleicons.org/${source.id}/${source.color}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function resolveTechLogoSource(name: string): TechLogoSource | null {
  const normalized = normalizeTechName(name);
  if (!normalized) return null;
  return TECH_LOGO_MAP[normalized] ?? null;
}

export function getTechLogoUrl(name: string): string | null {
  const normalized = normalizeTechName(name);
  const source = TECH_LOGO_MAP[normalized];
  if (source) return buildLogoUrl(source);

  const domain = TECH_FAVICON_DOMAINS[normalized];
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  }

  return null;
}

export function getTechBrandStyle(name: string): TechBrandStyle {
  const source = resolveTechLogoSource(name);
  const colorHex = source?.color ?? '10B981';

  return {
    logoUrl: getTechLogoUrl(name),
    borderColor: hexToRgba(colorHex, 0.35),
    bg: hexToRgba(colorHex, 0.06),
    textColor: `#${colorHex}`,
    glowColor: hexToRgba(colorHex, 0.22),
  };
}

/** Human-readable list of canonical technologies with official logo mappings */
export function getSupportedTechLogoNames(): string[] {
  const canonical = new Set<string>();
  Object.entries(TECH_LOGO_MAP).forEach(([key, source]) => {
    if (source.id.includes('/')) {
      canonical.add(key);
      return;
    }
    canonical.add(source.id.replace('dot', '.').replace('nextdotjs', 'next.js').replace('nodedotjs', 'node.js').replace('vuedotjs', 'vue.js'));
  });
  return Array.from(canonical).sort();
}

/** Technologies that only have favicon fallback (no vector brand asset) */
export function getFaviconOnlyTechNames(): string[] {
  return Object.keys(TECH_FAVICON_DOMAINS).sort();
}
