export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Services' | 'Work' | 'Careers' | 'Contact' | 'AI' | 'Backend' | 'Frontend';
  page: 'home' | 'services' | 'work' | 'careers' | 'contact' | 'all';
  tags: string[];
  featured: boolean;
}

export const FAQs: readonly FAQ[] = [
  {
    id: 'faq-methodology',
    category: 'General',
    page: 'home',
    tags: ['methodology', 'process'],
    featured: true,
    question: "What is TechVistar's delivery methodology?",
    answer: 'We use an iterative, milestone-driven delivery process. It begins with aligning on vision, locking in the scope, executing clean development sprints with regular demos, and finalizing with production launch and handover training.'
  },
  {
    id: 'faq-codebase',
    category: 'General',
    page: 'home',
    tags: ['codebase', 'ownership'],
    featured: true,
    question: 'Will our internal team own the codebase after delivery?',
    answer: 'Yes. Upon project completion and sign-off, you receive full intellectual property rights, the complete codebase, and comprehensive documentation so your internal team can fully own and maintain the system.'
  },
  {
    id: 'faq-1',
    category: 'General',
    page: 'home',
    tags: ['company', 'services'],
    featured: true,
    question: 'What services does TechVistar offer?',
    answer: 'We offer end-to-end digital solutions including Web & Mobile Development, AI Solutions, Cloud & DevOps, UI/UX Design, Automation, Data Analytics, and Product Engineering.'
  },
  {
    id: 'faq-2',
    category: 'General',
    page: 'home',
    tags: ['quality', 'qa'],
    featured: true,
    question: 'How do you ensure the quality of your work?',
    answer: 'We ensure high standards by executing thorough unit testing, continuous integration checks, peer code reviews, and staging environment verification before release.'
  },
  {
    id: 'faq-3',
    category: 'General',
    page: 'home',
    tags: ['process', 'milestones'],
    featured: true,
    question: 'What is your typical project development process?',
    answer: 'Our process follows a four-phase VISTAR methodology: align on vision and insight, lock detailed scope and milestones, execute clean iteration sprints, and complete production launch training.'
  },
  {
    id: 'faq-4',
    category: 'General',
    page: 'home',
    tags: ['startups', 'clients'],
    featured: true,
    question: 'Do you work with startups and small businesses?',
    answer: 'Yes, we build scalable software matching the budgets and timeline velocities of early-stage startups and small businesses, enabling rapid feature launches.'
  },
  {
    id: 'faq-5',
    category: 'General',
    page: 'services',
    tags: ['timeline', 'duration'],
    featured: true,
    question: 'How long does a typical project take?',
    answer: 'Depending on complexity, small MVP builds take 4 to 8 weeks, while comprehensive enterprise systems and digital transformations range from 3 to 6 months.'
  },
  {
    id: 'faq-6',
    category: 'General',
    page: 'services',
    tags: ['technologies', 'stack'],
    featured: true,
    question: 'What technologies do you use?',
    answer: 'We use React, Next.js, TypeScript, TailwindCSS for frontend; Node.js, Go, Python for backend; AWS, Azure, Docker, Kubernetes for cloud operations.'
  },
  {
    id: 'faq-7',
    category: 'Backend',
    page: 'services',
    tags: ['cloud', 'backend'],
    featured: false,
    question: 'How do you handle backend scaling and security?',
    answer: 'We construct server frameworks utilizing Node.js, Go, or Python, deployed in containerized Docker environments on AWS/Azure. We manage infrastructures via Terraform, implementing auto-scaling policies, CDN caching, and encrypted database networks.'
  },
  {
    id: 'faq-8',
    category: 'Frontend',
    page: 'services',
    tags: ['performance', 'seo'],
    featured: false,
    question: 'Are your designs and web layouts fully optimized for SEO?',
    answer: 'Yes, we optimize every application to score 90+ on Google Lighthouse/Core Web Vitals. We implement server-side rendering (SSR), optimized responsive images, clean semantics, meta configurations, and microdata parameters.'
  },
  {
    id: 'faq-9',
    category: 'Services',
    page: 'services',
    tags: ['devops', 'deployment'],
    featured: false,
    question: 'How do you manage deployments and CI/CD operations?',
    answer: 'We configure automated CI/CD pipelines (e.g. GitHub Actions or GitLab CI) that trigger automated linting, unit tests, and build processes before deploying directly to staging or production.'
  }
];
