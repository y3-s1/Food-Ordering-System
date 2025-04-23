import stripe from '../config/stripe';

export const createPaymentIntentService = async (amount: number) => {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });
};

export const handleWebhookEventService = async (payload: any, sig: string) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET must be set in .env');
  }

  const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

  // Handle different event types
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('💰 Payment succeeded:', paymentIntent.id);
  }

  return event;
};
