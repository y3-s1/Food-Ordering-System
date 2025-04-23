import { Request, Response } from 'express';
import { createPaymentIntentService, handleWebhookEventService } from '../services/paymentService';

// Create Payment Intent
export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400).json({ error: 'Invalid amount' });
    return;
  }

  const paymentIntent = await createPaymentIntentService(amount);
  res.status(201).json({ clientSecret: paymentIntent.client_secret });
};

// Handle Stripe Webhook Events
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  const payload = req.body; // Raw body for verification

  try {
    const event = await handleWebhookEventService(payload, sig);
    console.log('✅ Stripe Event Received:', event.type);

    res.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
