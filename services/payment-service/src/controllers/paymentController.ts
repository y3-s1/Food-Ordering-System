import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import Payment from "../models/Payment";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating PaymentIntent:", err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
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
    console.error("Error saving Payment:", err);
    res.status(500).json({ error: "Failed to save payment" });
  }
};

// Get User's Payment History
export const getUserPayments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({ userId }).sort({ createdAt: -1});
    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching user payments:", err);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
};

// Get All Payments (Admin)
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching all payments:", err);
    res.status(500).json({ error: "Failed to fetch all payments" });
  }
};
