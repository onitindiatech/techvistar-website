const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb://amritasingh38381_db_user:Amrita38381%40@ac-wtahugv-shard-00-00.x08gmze.mongodb.net:27017,ac-wtahugv-shard-00-01.x08gmze.mongodb.net:27017,ac-wtahugv-shard-00-02.x08gmze.mongodb.net:27017/techvistar?ssl=true&replicaSet=atlas-69sgm4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const industries = [
  {
    title: "Healthcare",
    slug: "healthcare",
    shortDescription: "HIPAA-compliant telemedicine platforms and operational databases.",
    description: "We build secure, compliant healthcare technology solutions including telemedicine platforms, patient management systems, and operational databases that meet HIPAA and regional regulatory requirements.",
    icon: "Heart",
    featured: true,
    active: true,
    displayOrder: 1,
    challenges: [{ title: "Regulatory Compliance", description: "Meeting HIPAA, GDPR, and other health data regulations across regions." }],
    solutions: [{ title: "Compliant Architecture", description: "End-to-end encrypted platforms with built-in audit trails and access control." }],
    services: ["custom-web-development", "cloud-migration"],
    technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
    statistics: [{ value: "10+", label: "Projects Delivered" }],
    caseStudies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  },
  {
    title: "Finance",
    slug: "finance",
    shortDescription: "High-security transaction systems and digital banking analytics.",
    description: "We develop high-performance fintech solutions including digital banking platforms, payment gateways, fraud detection systems, and real-time analytics dashboards for financial institutions.",
    icon: "TrendingUp",
    featured: false,
    active: true,
    displayOrder: 2,
    challenges: [{ title: "Security & Fraud", description: "Preventing fraud and ensuring transaction security at scale." }],
    solutions: [{ title: "Secure Fintech Stack", description: "PCI-DSS compliant architectures with real-time fraud detection." }],
    services: ["custom-web-development", "data-analytics"],
    technologies: ["TypeScript", "PostgreSQL", "Redis", "Kafka"],
    statistics: [{ value: "8+", label: "Fintech Projects" }],
    caseStudies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  },
  {
    title: "Education",
    slug: "education",
    shortDescription: "Custom LMS architectures and student tracking dashboards.",
    description: "We design and build modern educational technology platforms including Learning Management Systems, student progress tracking, virtual classrooms, and adaptive learning engines.",
    icon: "GraduationCap",
    featured: false,
    active: true,
    displayOrder: 3,
    challenges: [{ title: "Engagement & Retention", description: "Keeping students engaged in digital learning environments." }],
    solutions: [{ title: "Adaptive LMS", description: "Custom-built LMS with gamification, progress tracking, and live sessions." }],
    services: ["custom-web-development"],
    technologies: ["React", "Node.js", "MongoDB", "WebRTC"],
    statistics: [{ value: "5+", label: "EdTech Platforms" }],
    caseStudies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  },
  {
    title: "Logistics",
    slug: "logistics",
    shortDescription: "Route optimization solvers, capacity scheduling, and GPS trackers.",
    description: "We build intelligent logistics and supply chain solutions including route optimization engines, real-time fleet tracking, warehouse management systems, and last-mile delivery platforms.",
    icon: "Truck",
    featured: false,
    active: true,
    displayOrder: 4,
    challenges: [{ title: "Route Efficiency", description: "Optimizing delivery routes and reducing operational costs at scale." }],
    solutions: [{ title: "Smart Routing Engine", description: "AI-powered route optimization with real-time GPS tracking and scheduling." }],
    services: ["custom-web-development", "ai-agents"],
    technologies: ["Python", "React", "PostgreSQL", "Google Maps API"],
    statistics: [{ value: "6+", label: "Logistics Systems" }],
    caseStudies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  },
  {
    title: "Real Estate",
    slug: "real-estate",
    shortDescription: "Multi-tenant property portals and CRM pipelines.",
    description: "We develop modern real estate technology platforms including multi-tenant property listing portals, CRM systems, virtual property tours, and automated lead management pipelines.",
    icon: "Building2",
    featured: false,
    active: true,
    displayOrder: 5,
    challenges: [{ title: "Lead Management", description: "Converting high volumes of leads efficiently across property types." }],
    solutions: [{ title: "PropTech CRM", description: "Automated CRM pipelines with multi-tenant portal and virtual tour integration." }],
    services: ["custom-web-development", "crm-systems"],
    technologies: ["React", "Node.js", "PostgreSQL", "Mapbox"],
    statistics: [{ value: "4+", label: "PropTech Projects" }],
    caseStudies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  },
  {
    title: "Manufacturing",
    slug: "manufacturing",
    shortDescription: "IoT sensor telemetry platforms and predictive maintenance schedulers.",
    description: "We build Industry 4.0 solutions for manufacturing including IoT sensor integration, predictive maintenance systems, production monitoring dashboards, and supply chain automation.",
    icon: "Factory",
    featured: false,
    active: true,
    displayOrder: 6,
    challenges: [{ title: "Downtime Prevention", description: "Unplanned equipment failures causing costly production shutdowns." }],
    solutions: [{ title: "Predictive Maintenance", description: "IoT telemetry with ML-based failure prediction and automated alerts." }],
    services: ["data-analytics", "custom-web-development"],
    technologies: ["Python", "React", "InfluxDB", "MQTT"],
    statistics: [{ value: "5+", label: "Industry 4.0 Projects" }],
    caseStudies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  },
  {
    title: "Retail",
    slug: "retail-ecommerce",
    shortDescription: "Scalable headless eCommerce backends and custom checkouts.",
    description: "We build high-performance retail and eCommerce solutions including headless commerce architectures, custom checkout flows, inventory management systems, and personalization engines.",
    icon: "ShoppingCart",
    featured: false,
    active: true,
    displayOrder: 7,
    challenges: [{ title: "Conversion Optimization", description: "Reducing cart abandonment and improving checkout completion rates." }],
    solutions: [{ title: "Headless Commerce", description: "Decoupled frontend with optimized checkout and personalization engine." }],
    services: ["custom-web-development", "api-integration"],
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    statistics: [{ value: "7+", label: "eCommerce Builds" }],
    caseStudies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  },
  {
    title: "Government",
    slug: "government",
    shortDescription: "Secure civic portal databases and administrative dashboards.",
    description: "We develop secure, accessible e-government solutions including citizen portals, permit management systems, administrative dashboards, and inter-agency data integration platforms.",
    icon: "Shield",
    featured: false,
    active: true,
    displayOrder: 8,
    challenges: [{ title: "Data Security & Access", description: "Ensuring secure multi-level access to sensitive civic data systems." }],
    solutions: [{ title: "Secure Gov Portals", description: "Role-based access control with end-to-end encryption and audit logs." }],
    services: ["custom-web-development", "cyber-security"],
    technologies: ["React", "Node.js", "PostgreSQL", "OAuth2"],
    statistics: [{ value: "3+", label: "Gov Projects" }],
    caseStudies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  }
];

async function seedIndustries() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('techvistar');
    const collection = db.collection('industries');

    // Check existing
    const existing = await collection.countDocuments({ deleted: false });
    if (existing > 0) {
      console.log(`Found ${existing} existing industries. Skipping seed to avoid duplicates.`);
      console.log('If you want to re-seed, delete existing records first.');
      return;
    }

    const result = await collection.insertMany(industries);
    console.log(`✅ Successfully seeded ${result.insertedCount} industries!`);
  } catch (err) {
    console.error('Error seeding industries:', err.message);
  } finally {
    await client.close();
  }
}

seedIndustries();
