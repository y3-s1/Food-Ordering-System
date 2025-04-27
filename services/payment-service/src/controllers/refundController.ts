import { Request, Response } from "express";
import Stripe from "stripe";
import Payment from "../models/Payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });

export const refundPayment = async (req: Request, res: Response) => {
  const { paymentId } = req.body;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
    });

    res.json({ message: "Refund initiated", refund });
  } catch (err) {
    res.status(500).json({ error: "Failed to process refund" });
  }
};
