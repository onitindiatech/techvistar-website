/**
 * @file src/database/seedAdmin.ts
 * @description Seed a default administrator account for authentication testing.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Admin } from '../models/Admin';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/techvistar';

async function seedAdmin() {
  try {
    console.log('[Seed:Admin] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed:Admin] Connected successfully.');

    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@techvistar.com';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@1234';

    const existingAdmin = await Admin.findOne({ email: defaultEmail });
    if (existingAdmin) {
      console.log('[Seed:Admin] Default admin already exists.');
      return;
    }

    const admin = new Admin({
      name: 'TechVistar Admin',
      email: defaultEmail,
      password: defaultPassword,
      role: 'admin',
    });

    await admin.save();

    console.log('[Seed:Admin] Default admin created successfully.');
    console.log(`[Seed:Admin] Email: ${defaultEmail}`);
  } catch (error) {
    console.error('[Seed:Admin] Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed:Admin] Disconnected.');
  }
}

seedAdmin();
