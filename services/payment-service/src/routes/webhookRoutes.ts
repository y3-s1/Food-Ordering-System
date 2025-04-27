import express from "express";
import { handleStripeWebhook } from "../controllers/webhookController";

const router = express.Router();

// raw body parser for Stripe
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
