import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { FAQModel } from '../models/FAQ';
import { Service } from '../models/Service';
import { Solution } from '../models/Solution';
import { ProjectModel as Project } from '../models/Project';
import { Job } from '../models/Job';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/techvistar';

async function seedData() {
  try {
    console.log('[Seed:Data] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed:Data] Connected successfully.');

    const seedFilePath = path.join(__dirname, '../../../frontend/seed.json');
    if (!fs.existsSync(seedFilePath)) {
      throw new Error(`seed.json not found at ${seedFilePath}`);
    }

    const data = JSON.parse(fs.readFileSync(seedFilePath, 'utf-8'));

    // Clear existing collections
    console.log('[Seed:Data] Clearing collections...');
    await FAQModel.deleteMany({});
    await Service.deleteMany({});
    await Solution.deleteMany({});
    await Project.deleteMany({});
    await Job.deleteMany({});

    // Seed FAQs
    if (data.faqs && data.faqs.length > 0) {
      console.log(`[Seed:Data] Inserting ${data.faqs.length} FAQs...`);
      const mappedFaqs = data.faqs.map((f: any, index: number) => ({
        ...f,
        faqId: f.id,
        displayOrder: index,
        status: 'active'
      }));
      await FAQModel.insertMany(mappedFaqs);
    }

    // Seed Services
    if (data.services && data.services.length > 0) {
      console.log(`[Seed:Data] Inserting ${data.services.length} Services...`);
      const mappedServices = data.services.map((s: any, index: number) => ({
        ...s,
        displayOrder: index,
        status: 'active',
        fullDescription: s.longDescription || s.shortDescription
      }));
      await Service.insertMany(mappedServices);
    }

    // Seed Solutions
    if (data.solutions && data.solutions.length > 0) {
      console.log(`[Seed:Data] Inserting ${data.solutions.length} Solutions...`);
      const mappedSolutions = data.solutions.map((s: any, index: number) => ({
        ...s,
        displayOrder: index,
        status: 'active',
        fullDescription: s.longDescription || s.shortDescription
      }));
      await Solution.insertMany(mappedSolutions);
    }

    // Seed Projects
    if (data.projects && data.projects.length > 0) {
      console.log(`[Seed:Data] Inserting ${data.projects.length} Projects...`);
      const mappedProjects = data.projects.map((p: any, index: number) => ({
        ...p,
        displayOrder: index,
        status: 'Completed'
      }));
      await Project.insertMany(mappedProjects);
    }

    // Seed Jobs
    if (data.jobs && data.jobs.length > 0) {
      console.log(`[Seed:Data] Inserting ${data.jobs.length} Jobs...`);
      const mappedJobs = data.jobs.map((j: any) => ({
        ...j,
        status: 'active',
        employmentType: j.employmentType === 'Full-Time' ? 'Full-time' : (j.employmentType === 'Part-Time' ? 'Part-time' : j.employmentType)
      }));
      await Job.insertMany(mappedJobs);
    }

    console.log('[Seed:Data] Seeding completed successfully!');
  } catch (error) {
    console.error('[Seed:Data] Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed:Data] Disconnected.');
  }
}

seedData();
