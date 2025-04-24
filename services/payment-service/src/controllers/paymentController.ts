import { Request, Response } from 'express';
import { createPaymentIntentService, handleWebhookEventService } from '../services/paymentService';

// Create Payment Intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const paymentIntent = await createPaymentIntentService(amount);
  res.status(201).json({ clientSecret: paymentIntent.client_secret });
};

// Handle Stripe Webhook Events
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const payload = req.body; // Raw body for verification

  try {
    const event = await handleWebhookEventService(payload, sig);
    console.log('✅ Stripe Event Received:', event.type);

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error instanceof Error ? error.message : 'Unknown error');
    res.status(400).send(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
}
};
