import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Office } from '../models/Office';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/techvistar';

const OFFICES_DATA = [
  {
    officeId: 'hyderabad',
    name: 'Hyderabad, Telangana',
    badge: 'HEAD OFFICE',
    address: 'HITEC City, Hyderabad, Telangana, India',
    city: 'Hyderabad',
    country: 'India',
    googleMapsUrl: 'https://maps.google.com/?q=HITEC+City,+Hyderabad,+Telangana',
    image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?q=80&w=800',
    imagePublicId: '',
    imageAlt: 'Hyderabad Skyline',
    displayOrder: 0,
    isActive: true,
  },
  {
    officeId: 'iiit-delhi',
    name: 'IIIT Delhi',
    badge: 'INNOVATION HUB',
    address: 'Indraprastha Institute of Information Technology Delhi\nOkhla Industrial Estate Phase III\nNew Delhi – 110020',
    city: 'New Delhi',
    country: 'India',
    googleMapsUrl: 'https://maps.google.com/?q=Indraprastha+Institute+of+Information+Technology+Delhi',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800',
    imagePublicId: '',
    imageAlt: 'IIIT Delhi Campus',
    displayOrder: 1,
    isActive: true,
  }
];

async function seed() {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected successfully.');

    console.log('[Seed] Cleaning up existing offices...');
    await Office.deleteMany({});
    console.log('[Seed] Cleaned successfully.');

    console.log('[Seed] Inserting 2 offices...');
    await Office.insertMany(OFFICES_DATA);
    console.log('[Seed] Seeding completed successfully!');
  } catch (error) {
    console.error('[Seed] Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected.');
  }
}

seed();
