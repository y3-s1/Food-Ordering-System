import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be set in .env');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default stripe;
