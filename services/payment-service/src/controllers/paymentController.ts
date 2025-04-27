import { Request, Response } from "express";
import Payment from "../models/Payment";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });

// Create PaymentIntent (already done previously)
export const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send({ clientSecret: paymentIntent.client_secret });
};


// Save Payment after Success
export const savePayment = async (req: Request, res: Response) => {
  try {
    const { userId, email, amount, stripePaymentIntentId, status } = req.body;

    const payment = await Payment.create({
      userId,
      email,
      amount,
      stripePaymentIntentId,
      status,
    });

    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save payment" });
  }
};

// Get User's Payment History
export const getUserPayments = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
};

// Get All Payments (Admin)
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all payments" });
  }
};
