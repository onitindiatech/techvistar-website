import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { PagesCmsConfig } from '../src/models/PagesCmsConfig';

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function updateHomeMessaging() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set in environment.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully.');

  const existingConfig = await PagesCmsConfig.findOne({ configKey: 'global' });
  const prevHome = existingConfig?.home ? (existingConfig.home as any) : {};

  const updatedHome = {
    ...prevHome,
    hero: {
      ...(prevHome.hero || {}),
      badge: '',
      headlineLine1: 'BECOME THE NAME THEY REMEMBER.',
      headlineAccent: '',
      headlineLine2: '',
      tagline: 'The brand & venture scaling partner for ambitious businesses.',
      ctaPrimary: 'Get in touch',
      ctaSecondary: 'View services',
      ctaPrimaryLink: '/#contact',
      ctaSecondaryLink: '/#services',
    },
    mobileHero: {
      ...(prevHome.mobileHero || {}),
      enabled: false,
      badge: '',
      heading: 'BECOME THE NAME THEY REMEMBER.',
      headingLine2: '',
      mobileHighlightedHeading: '',
      description: 'The brand & venture scaling partner for ambitious businesses.',
    },
    benefits: {
      ...(prevHome.benefits || {}),
      badge: 'OUR PILLARS',
      heading: 'POSITION. EXPERIENCE. ENGINE. SCALE.',
      highlight: '',
      subtitle: 'WHEN AMBITION OUTGROWS THE BUSINESS.',
      description: 'A business can outgrow its current brand, digital presence, systems, and growth model as its ambitions become bigger.',
      cards: [
        {
          icon: 'Compass',
          image: '',
          title: 'POSITION',
          description: 'Strategic brand positioning to define authority and distinctiveness in your market as your ambition grows.',
          accentColor: '#10b981',
          sortOrder: 0,
        },
        {
          icon: 'Layout',
          image: '',
          title: 'EXPERIENCE',
          description: 'Premium digital experience, design systems, and interfaces engineered for modern user engagement.',
          accentColor: '#10b981',
          sortOrder: 1,
        },
        {
          icon: 'Cpu',
          image: '',
          title: 'ENGINE',
          description: 'Scalable tech architecture, custom software, and automated workflows powering operational growth.',
          accentColor: '#10b981',
          sortOrder: 2,
        },
        {
          icon: 'TrendingUp',
          image: '',
          title: 'SCALE',
          description: 'Venture scaling models and robust infrastructure built to sustain long-term business expansion.',
          accentColor: '#10b981',
          sortOrder: 3,
        },
      ],
      visible: true,
    },
    featuredServices: {
      ...(prevHome.featuredServices || {}),
      heading: 'WHEN AMBITION OUTGROWS THE BUSINESS.',
      subtitle: 'A business can outgrow its current brand, digital presence, systems, and growth model as its ambitions become bigger.',
      ctaText: 'View All Services',
      ctaLink: '/services',
      visible: true,
    },
    stats: [
      {
        icon: 'TrendingUp',
        value: '+180%',
        prefix: '',
        suffix: '',
        label: 'Average Revenue Growth Post-Scale',
        sortOrder: 0,
      },
      {
        icon: 'Zap',
        value: '4.2x',
        prefix: '',
        suffix: '',
        label: 'Pipeline Conversion Acceleration',
        sortOrder: 1,
      },
      {
        icon: 'ShieldCheck',
        value: '99.8%',
        prefix: '',
        suffix: '',
        label: 'Operational Engine Velocity & Reliability',
        sortOrder: 2,
      },
      {
        icon: 'Building2',
        value: '50+',
        prefix: '',
        suffix: '',
        label: 'Ambitious Brands & Ventures Scaled',
        sortOrder: 3,
      },
    ],
    portfolio: {
      ...(prevHome.portfolio || {}),
      badge: 'OUR WORK',
      heading: 'THE BRANDS BEHIND OUR WORK.',
      highlight: '',
      description: 'Representative work and case studies of ambitious businesses scaling with our brand, digital experience, and engineering solutions.',
      primaryButtonText: 'Explore Portfolio',
      primaryButtonLink: '/work',
      secondaryButtonText: 'View Case Studies',
      secondaryButtonLink: '/work',
      globeEnabled: true,
      visible: true,
    },
    contactCta: {
      ...(prevHome.contactCta || {}),
      badge: 'GET IN TOUCH',
      heading: 'READY FOR WHAT COMES NEXT?',
      highlight: '',
      description: "Let's partner to scale your brand, digital experience, tech engine, and growth model.",
      ctaText: 'Send Message',
      visible: true,
    },
    cta: {
      ...(prevHome.cta || {}),
      title: 'READY FOR WHAT COMES NEXT?',
      description: "Let's partner to scale your brand, digital experience, tech engine, and growth model.",
      buttonText: 'Get in touch',
      buttonLink: '/contact',
    },
  };

  const updatedDoc = await PagesCmsConfig.findOneAndUpdate(
    { configKey: 'global' },
    { $set: { home: updatedHome } },
    { upsert: true, new: true }
  );

  console.log('Successfully updated PagesCmsConfig in MongoDB!');
  console.log('Updated Home document hero headline:', updatedDoc.home?.hero?.headlineLine1);
  await mongoose.disconnect();
}

updateHomeMessaging().catch((err) => {
  console.error('Error updating home messaging:', err);
  process.exit(1);
});
