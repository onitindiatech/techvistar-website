import {
  Heart,
  GraduationCap,
  Landmark,
  ShoppingCart,
  Factory,
  Home,
  Truck,
  Sprout,
  Utensils,
  LucideIcon
} from 'lucide-react';

export interface IndustryChallenge {
  title: string;
  description: string;
}

export interface IndustrySolution {
  title: string;
  description: string;
}

export interface IndustryFaq {
  question: string;
  answer: string;
}

export interface IndustryStatistic {
  value: string;
  label: string;
  description?: string;
}

export interface IndustryCta {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
}

export interface Industry {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  icon: LucideIcon;
  industriesColor: string; // Tailwind gradient/accent class (e.g., 'from-blue-500 to-indigo-600')
  challenges: IndustryChallenge[];
  solutions: IndustrySolution[];
  services: string[]; // Slugs of related services from services.ts
  technologies: string[]; // Key technologies utilized in this industry vertical
  caseStudies: string[]; // Slugs of related projects/case studies from projects.ts
  faqs: IndustryFaq[];
  statistics: IndustryStatistic[];
  cta: IndustryCta;
}

export const INDUSTRIES: readonly Industry[] = [
  {
    id: 'healthcare',
    slug: 'healthcare',
    title: 'Healthcare',
    shortDescription: 'HIPAA-compliant custom software, telehealth portals, and AI diagnostics built for modern medicine.',
    description: 'We design and build secure, regulatory-compliant digital systems for healthcare providers, medical device manufacturers, and healthtech startups. From EHR integrations and remote patient monitoring to telehealth apps and medical billing systems, our solutions prioritize data security, interoperability, and fluid patient experiences.',
    heroImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop',
    icon: Heart,
    industriesColor: 'from-emerald-500 to-teal-600',
    challenges: [
      {
        title: 'HIPAA & GDPR Compliance',
        description: 'Healthcare organizations face strict regulations regarding patient data security and transmission, with severe penalties for non-compliance.'
      },
      {
        title: 'Fragmented Legacy Systems',
        description: 'Connecting new digital solutions to older Electronic Health Record (EHR) systems like Epic or Cerner often results in significant integration overhead.'
      },
      {
        title: 'User Adoption Barriers',
        description: 'Clinicians and patient populations have widely varying technical competencies, necessitating highly accessible and friction-free user interfaces.'
      }
    ],
    solutions: [
      {
        title: 'Encrypted Telehealth Portals',
        description: 'End-to-end encrypted video channels and messaging lines that satisfy security guidelines while delivering intuitive patient onboarding.'
      },
      {
        title: 'FHIR API & HL7 Integrations',
        description: 'Standardized medical data pipelines allowing seamless patient record exchanges across clinics, pharmacies, and insurance providers.'
      },
      {
        title: 'Accessibility-First UI Design',
        description: 'Clean layouts that adhere strictly to WCAG Guidelines, supporting screen readers, adjustable text sizing, and high-contrast styling.'
      }
    ],
    services: ['web-development', 'mobile-app-development', 'ui-ux-design', 'ai-automation'],
    technologies: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'FHIR API standards', 'AWS KMS'],
    caseStudies: ['sustainability-dashboard'], // Linked to matching project slug
    faqs: [
      {
        question: 'Are your digital healthcare products HIPAA-compliant?',
        answer: 'Yes, all our healthcare systems implement AES-256 data encryption at rest and TLS 1.3 in transit, and are hosted on HIPAA-eligible server infrastructures like AWS or Google Cloud with full auditing logs.'
      },
      {
        question: 'Can you integrate with existing EHR systems?',
        answer: 'We construct custom API layers supporting HL7 and FHIR standards to safely read and write clinical records from legacy platforms without compromising data integrity.'
      }
    ],
    statistics: [
      {
        value: '99.99%',
        label: 'System Uptime',
        description: 'Guaranteed availability for critical patient-facing portals.'
      },
      {
        value: '100%',
        label: 'HIPAA Auditable',
        description: 'Full data access audit trails configured from day one.'
      }
    ],
    cta: {
      title: 'Ready to build a secure medical platform?',
      subtitle: 'Schedule a call with our healthtech compliance architects.',
      buttonText: 'Consult Healthtech Experts',
      buttonLink: '/contact?industry=healthcare'
    }
  },
  {
    id: 'education',
    slug: 'education',
    title: 'Education',
    shortDescription: 'Scalable LMS platforms, virtual classrooms, and interactive educational content delivery networks.',
    description: 'We develop learning management systems (LMS), student information systems (SIS), and online education platforms that make learning interactive, accessible, and scalable. Our systems support rich media delivery, automated student tracking, and gamified assessments.',
    heroImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    icon: GraduationCap,
    industriesColor: 'from-blue-500 to-indigo-600',
    challenges: [
      {
        title: 'Scalability During Peak Hours',
        description: 'LMS platforms experience immense traffic spikes during exams and morning lectures, causing performance degradation.'
      },
      {
        title: 'Maintaining Student Engagement',
        description: 'Virtual classrooms often struggle to keep students active and focused compared to face-to-face instruction.'
      }
    ],
    solutions: [
      {
        title: 'Serverless Auto-Scaling Pipelines',
        description: 'Infrastructure that scales up resources dynamically in response to traffic surges, ensuring zero downtime.'
      },
      {
        title: 'Gamified Interactive Portals',
        description: 'LMS layouts incorporating badges, real-time quizzes, progress visualization, and community discussion boards.'
      }
    ],
    services: ['web-development', 'ui-ux-design', 'cloud-devops'],
    technologies: ['Next.js', 'GraphQL', 'TailwindCSS', 'Serverless Functions', 'Mux Video', 'PostgreSQL'],
    caseStudies: [],
    faqs: [
      {
        question: 'Do your platforms support SCORM and LTI standards?',
        answer: 'Yes, we build our custom systems to integrate smoothly with standard SCORM and LTI packages for seamless courseware interoperability.'
      }
    ],
    statistics: [
      {
        value: '50%+',
        label: 'Engagement Increase',
        description: 'Observed engagement boost through gamified design elements.'
      },
      {
        value: '10k+',
        label: 'Concurrent Users',
        description: 'Stable baseline performance handled during peak examination hours.'
      }
    ],
    cta: {
      title: 'Elevate your learning experience today',
      subtitle: 'Build a custom, high-performance learning ecosystem.',
      buttonText: 'Request LMS Demo',
      buttonLink: '/contact?industry=education'
    }
  },
  {
    id: 'finance',
    slug: 'finance',
    title: 'Finance',
    shortDescription: 'Bank-grade security fintech systems, custom accounting platforms, and payment integrations.',
    description: 'We construct secure fintech products, transaction ledgers, investment dashboards, and custom banking modules. Our platforms utilize strong security controls, multi-factor authorization, and real-time transaction processing.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    icon: Landmark,
    industriesColor: 'from-amber-600 to-yellow-500',
    challenges: [
      {
        title: 'High-Value Security Risks',
        description: 'Financial products represent primary targets for cybercriminals, demanding absolute security compliance.'
      },
      {
        title: 'Real-Time Syncing Bottlenecks',
        description: 'Delayed balance updates or double-transfers can lead to financial losses and severe compliance penalties.'
      }
    ],
    solutions: [
      {
        title: 'Zero-Trust Architecture',
        description: 'Multi-factor authentication, biometric logins, and tokenized APIs protecting user assets and sessions.'
      },
      {
        title: 'Event-Driven Ledger Systems',
        description: 'Transactional databases that verify account balances sequentially with absolute consistency rules.'
      }
    ],
    services: ['web-development', 'mobile-app-development', 'ui-ux-design', 'ai-automation'],
    technologies: ['TypeScript', 'Node.js', 'Redis', 'PostgreSQL', 'Stripe API', 'OAuth 2.0'],
    caseStudies: ['ecosystem-environmental-intelligence'],
    faqs: [
      {
        question: 'What payment gateways do you support?',
        answer: 'We integrate with global processors like Stripe, Adyen, and PayPal, alongside custom bank transfers (ACH/SEPA) and regional payment APIs.'
      }
    ],
    statistics: [
      {
        value: '0',
        label: 'Security Breaches',
        description: 'A spotless security record across all our deployed financial applications.'
      },
      {
        value: '2.5x',
        label: 'Processing Speed',
        description: 'Faster checkouts and transfers via optimized database queries.'
      }
    ],
    cta: {
      title: 'Discuss your fintech project',
      subtitle: 'Build a secure, modern, and reliable financial interface.',
      buttonText: 'Connect with Fintech Engineers',
      buttonLink: '/contact?industry=finance'
    }
  },
  {
    id: 'retail-ecommerce',
    slug: 'retail-ecommerce',
    title: 'Retail & E-commerce',
    shortDescription: 'High-conversion checkout funnels, head-less commerce solutions, and inventory tracking portals.',
    description: 'We engineer dynamic e-commerce platforms designed for lightning-fast speeds and high conversion rates. Our headless CMS solutions integrate product management, localized pricing, discount campaigns, and real-time inventory systems.',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    icon: ShoppingCart,
    industriesColor: 'from-pink-500 to-rose-600',
    challenges: [
      {
        title: 'Slow Checkout Speeds',
        description: 'Every 100ms of latency during checkout results in a measurable drop in user conversion rate.'
      },
      {
        title: 'Inventory Syncing Delays',
        description: 'Failing to sync live inventory in real time across warehouse outlets can lead to customer disappointment.'
      }
    ],
    solutions: [
      {
        title: 'Headless Frontend Architectures',
        description: 'React/Next.js store frontends served from global CDN edge networks for rapid load speeds.'
      },
      {
        title: 'Websocket Inventory Broadcasts',
        description: 'Live inventory telemetry that updates product stock counts automatically without page refreshes.'
      }
    ],
    services: ['web-development', 'ui-ux-design', 'digital-marketing', 'cloud-devops'],
    technologies: ['Next.js', 'Shopify Storefront API', 'Stripe', 'Algolia Search', 'TailwindCSS'],
    caseStudies: [],
    faqs: [
      {
        question: 'Can you migrate our store from Shopify to a headless setup?',
        answer: 'Yes, we specialize in building headless Next.js frontends that pull product data directly from Shopify or BigCommerce APIs.'
      }
    ],
    statistics: [
      {
        value: '35%+',
        label: 'Conversion Boost',
        description: 'Average conversion rate increase after optimizing load times and UX.'
      },
      {
        value: '400ms',
        label: 'Average Load Time',
        description: 'Near-instant page loads across product and listing pages.'
      }
    ],
    cta: {
      title: 'Optimize your sales funnel',
      subtitle: 'Build a custom, high-speed storefront optimized for mobile and desktop conversions.',
      buttonText: 'Optimize My Store',
      buttonLink: '/contact?industry=retail'
    }
  },
  {
    id: 'manufacturing',
    slug: 'manufacturing',
    title: 'Manufacturing',
    shortDescription: 'Industrial telemetry pipelines, warehouse optimization systems, and predictive maintenance portals.',
    description: 'We develop custom manufacturing Execution Systems (MES), IoT dashboard interfaces, and predictive equipment maintenance planners. We make operational floor data readable, helping factories reduce downtime and optimize supply throughput.',
    heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    icon: Factory,
    industriesColor: 'from-orange-500 to-amber-600',
    challenges: [
      {
        title: 'Unplanned Equipment Downtime',
        description: 'Unexpected machine breakdowns cost manufacturers billions annually in delayed deliveries and repair costs.'
      },
      {
        title: 'Disconnected IoT Devices',
        description: 'Factories operate hundreds of legacy hardware models that report sensor metrics in siloed formats.'
      }
    ],
    solutions: [
      {
        title: 'Predictive Alert Telemetry',
        description: 'Ingesting sensor temperatures, vibrations, and run-times to flag anomalies before failures occur.'
      },
      {
        title: 'Unified IoT Middleware',
        description: 'Custom industrial hubs translating various telemetry protocols into structured, readable JSON records.'
      }
    ],
    services: ['web-development', 'ai-automation', 'custom-software-development'],
    technologies: ['Python', 'MQTT Brokers', 'TimescaleDB', 'Docker', 'React', 'D3.js'],
    caseStudies: ['navigation-route-optimization'],
    faqs: [
      {
        question: 'Can you interface with Modbus or OPC UA equipment?',
        answer: 'Yes, we build middleware bridges that extract data from common PLC networks and pipe it into web-based dashboards.'
      }
    ],
    statistics: [
      {
        value: '22%',
        label: 'Downtime Reduction',
        description: 'Average decrease in machine shutdowns using predictive scheduling.'
      },
      {
        value: '1M+',
        label: 'Daily Telemetry Points',
        description: 'Millions of IoT events ingested and analyzed securely every day.'
      }
    ],
    cta: {
      title: 'Digitize your factory floor',
      subtitle: 'Talk to our IoT architects about building custom monitoring dashboards.',
      buttonText: 'Consult Industrial Architects',
      buttonLink: '/contact?industry=manufacturing'
    }
  },
  {
    id: 'real-estate',
    slug: 'real-estate',
    title: 'Real Estate',
    shortDescription: 'Virtual tour portals, custom CRM dashboards, and transaction management platforms.',
    description: 'We build digital solutions for real estate developers, agencies, and proptech startups. Our services include property listings, search engines, CRM dashboards, and digital contract signing.',
    heroImage: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=1200&auto=format&fit=crop',
    icon: Home,
    industriesColor: 'from-cyan-500 to-blue-600',
    challenges: [
      {
        title: 'Outdated Listing Interfaces',
        description: 'Slow property loading and poor search filtering lead to high bounce rates for buyers.'
      },
      {
        title: 'Scattered Communications',
        description: 'Brokers struggle to track calls, emails, and document statuses across separate apps.'
      }
    ],
    solutions: [
      {
        title: 'Faceted Elasticsearch engines',
        description: 'Allows buyers to filter thousands of properties by price, square footage, and location instantly.'
      },
      {
        title: 'Integrated Agent CRMs',
        description: 'A unified broker dashboard linking customer chat histories with document templates.'
      }
    ],
    services: ['web-development', 'mobile-app-development', 'ui-ux-design'],
    technologies: ['React', 'Elasticsearch', 'Node.js', 'PostgreSQL', 'Google Maps API'],
    caseStudies: [],
    faqs: [
      {
        question: 'Can you integrate MLS data feeds?',
        answer: 'Yes, we integrate IDX and RESO Web API feeds to dynamically update listing databases across your platform.'
      }
    ],
    statistics: [
      {
        value: '40%',
        label: 'Leads Retention',
        description: 'Increase in lead retention through real-time communication tools.'
      },
      {
        value: '< 100ms',
        label: 'Filter Speed',
        description: 'Property search updates render in milliseconds.'
      }
    ],
    cta: {
      title: 'Launch your proptech platform',
      subtitle: 'Build custom property search portals and broker systems.',
      buttonText: 'Speak to a Proptech Engineer',
      buttonLink: '/contact?industry=realestate'
    }
  },
  {
    id: 'logistics',
    slug: 'logistics',
    title: 'Logistics',
    shortDescription: 'Dynamic route optimization solvers, fleet tracking dashboards, and delivery systems.',
    description: 'We engineer complete dispatch systems, real-time vehicle trackers, and automated routing solvers for supply chains. Our platforms help operators optimize transit times and monitor active vehicles.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    icon: Truck,
    industriesColor: 'from-violet-500 to-purple-600',
    challenges: [
      {
        title: 'Inefficient Delivery Routes',
        description: 'Manual route planning leads to high fuel expenditures and late deliveries.'
      },
      {
        title: 'Low Operational Visibility',
        description: 'Dispatchers lack live status updates, making dispatch management reactive and chaotic.'
      }
    ],
    solutions: [
      {
        title: 'Solver-Backed Route Optimizers',
        description: 'Calculates optimal multi-stop schedules under vehicle weight and delivery window limits.'
      },
      {
        title: 'Live Tracking Dashboards',
        description: 'Websocket-powered maps displaying active truck locations and ETA adjustments.'
      }
    ],
    services: ['web-development', 'mobile-app-development', 'custom-software-development', 'cloud-devops'],
    technologies: ['React', 'TypeScript', 'Mapbox GL', 'Go', 'Python', 'Websockets'],
    caseStudies: ['navigation-route-optimization'],
    faqs: [
      {
        question: 'How accurate are the ETA calculations?',
        answer: 'We combine real-time traffic APIs with historic performance metadata to predict arrival times within a 5-minute window.'
      }
    ],
    statistics: [
      {
        value: '18%',
        label: 'Fuel Savings',
        description: 'Average fuel reduction achieved through optimized routes.'
      },
      {
        value: '98%',
        label: 'On-Time rate',
        description: 'Delivery compliance rate reached across optimized fleets.'
      }
    ],
    cta: {
      title: 'Optimize your fleet operations',
      subtitle: 'Consult on building custom route optimization engines.',
      buttonText: 'Streamline My Logistics',
      buttonLink: '/contact?industry=logistics'
    }
  },
  {
    id: 'agriculture',
    slug: 'agriculture',
    title: 'Agriculture',
    shortDescription: 'Precision farming telemetry, crop health imaging dashboards, and market supply trackers.',
    description: 'We construct precision agriculture dashboards, IoT sensor monitors, and supply-chain databases for modern growers. We build systems that parse satellite images and field metrics to maximize crop outputs.',
    heroImage: 'https://images.unsplash.com/photo-1628102422497-6f9c69889a01?q=80&w=1200&auto=format&fit=crop',
    icon: Sprout,
    industriesColor: 'from-green-500 to-emerald-600',
    challenges: [
      {
        title: 'Erratic Weather Factors',
        description: 'Growers struggle to adjust crop planning because weather metrics are siloed.'
      },
      {
        title: 'Unmonitored Soil Conditions',
        description: 'Irrigating without soil health data leads to water waste or crop disease.'
      }
    ],
    solutions: [
      {
        title: 'Agronomic Sensor Syncing',
        description: 'Pipes soil moisture, humidity, and temperature data into interactive dashboards.'
      },
      {
        title: 'Spectral Imaging Maps',
        description: 'Visualizes normalized difference vegetation index (NDVI) mapping to track crop stress.'
      }
    ],
    services: ['web-development', 'custom-software-development', 'ui-ux-design'],
    technologies: ['React', 'Leaflet', 'TimescaleDB', 'Python', 'GIS tools'],
    caseStudies: [],
    faqs: [
      {
        question: 'Can the dashboard function offline in remote fields?',
        answer: 'Our mobile applications store telemetry metrics locally when offline and sync to the cloud once network connectivity is restored.'
      }
    ],
    statistics: [
      {
        value: '30%',
        label: 'Water Conservation',
        description: 'Average water savings reached through smart moisture monitoring.'
      },
      {
        value: '15%',
        label: 'Yield Improvement',
        description: 'Increase in crop yields using predictive disease alert models.'
      }
    ],
    cta: {
      title: 'Digitize your farming operation',
      subtitle: 'Build smart monitoring systems with our agriculture software team.',
      buttonText: 'Talk to AgriTech Experts',
      buttonLink: '/contact?industry=agriculture'
    }
  },
  {
    id: 'hospitality',
    slug: 'hospitality',
    title: 'Hospitality',
    shortDescription: 'Custom hotel booking engines, CRM integrations, and mobile guest experience platforms.',
    description: 'We develop custom reservation platforms, digital concierge products, and guest engagement apps for hotel brands. Our systems integrate with Property Management Systems (PMS) to streamline guest check-ins.',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    icon: Utensils,
    industriesColor: 'from-amber-500 to-orange-600',
    challenges: [
      {
        title: 'High OTA Commission Fees',
        description: 'Hotels lose up to 20% of revenue to Online Travel Agencies due to outdated direct booking options.'
      },
      {
        title: 'Fragmented Guest Services',
        description: 'Guests face delays ordering services because staff manage requests via paper logs or emails.'
      }
    ],
    solutions: [
      {
        title: 'Optimized Booking Funnels',
        description: 'Fast, native-style booking steps that encourage customers to reserve directly.'
      },
      {
        title: 'Digital Concierge Apps',
        description: 'Mobile apps allowing guests to order room service or request keys with their phones.'
      }
    ],
    services: ['web-development', 'mobile-app-development', 'ui-ux-design'],
    technologies: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'PMS API Integrations'],
    caseStudies: [],
    faqs: [
      {
        question: 'Do you integrate with standard Property Management Systems?',
        answer: 'Yes, we build custom integrations with popular PMS solutions like Opera, Cloudbeds, and Mews to sync reservations instantly.'
      }
    ],
    statistics: [
      {
        value: '25%+',
        label: 'Direct Bookings',
        description: 'Increase in direct hotel website bookings post-replatforming.'
      },
      {
        value: '94%',
        label: 'Guest Satisfaction',
        description: 'Average feedback rating for our deployed mobile key systems.'
      }
    ],
    cta: {
      title: 'Upgrade your guest experience',
      subtitle: 'Build direct booking portals and custom guest check-in systems.',
      buttonText: 'Request Booking Engine Audit',
      buttonLink: '/contact?industry=hospitality'
    }
  }
];
