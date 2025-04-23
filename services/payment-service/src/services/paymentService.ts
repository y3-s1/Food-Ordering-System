import stripe from '../config/stripe';
import { Stripe } from 'stripe';

export const createPaymentIntentService = async (amount: number): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });
};

export const handleWebhookEventService = async (
  payload: Buffer | string,
  sig: string
): Promise<Stripe.Event> => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET must be set in .env');
  }

  const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

  // Handle different event types
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log('Payment succeeded:', paymentIntent.id);
    
    // You can now safely access paymentIntent properties
    console.log('Amount:', paymentIntent.amount);
    console.log('Customer:', paymentIntent.customer);
  }

  return event;
};