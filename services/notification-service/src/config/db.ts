// src/config/db.ts
import mongoose from 'mongoose';
import { MONGO_URI } from './index';

export async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Notification DB connected');
}
