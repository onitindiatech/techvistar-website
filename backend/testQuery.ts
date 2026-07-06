import mongoose from 'mongoose';
import { FAQModel } from './src/models/FAQ';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techvistar');
  const faqs = await FAQModel.find({});
  console.log(`Found ${faqs.length} FAQs totally`);
  console.log(faqs.slice(0, 2).map(f => ({ id: f.faqId, page: f.page, category: f.category })));
  process.exit(0);
}
check();
