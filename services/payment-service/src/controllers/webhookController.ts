import { Request, Response } from "express";
import stripe from "../utils/stripe";
import Payment from "../models/Payment";
import type Stripe from 'stripe'; // Import Stripe types

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    await Payment.create({
      userId: paymentIntent.metadata.userId,
      amount: paymentIntent.amount / 100,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });
    console.log(" Payment saved to DB");
  }
  
  res.json({ received: true });
};