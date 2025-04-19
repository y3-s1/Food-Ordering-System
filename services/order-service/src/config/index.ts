import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const required = ['PORT','MONGO_URI','BROKER_URL','JWT_SECRET'] as const;
for (const k of required) {
  if (!process.env[k]) {
    console.error(`Missing env var ${k}`);
    process.exit(1);
  }
}

export const PORT       = parseInt(process.env.PORT!, 10);
export const MONGO_URI  = process.env.MONGO_URI!;
export const BROKER_URL = process.env.BROKER_URL!;
export const JWT_SECRET = process.env.JWT_SECRET!;
