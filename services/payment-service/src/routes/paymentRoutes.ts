import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/paymentController';
import bodyParser from 'body-parser';

const router = express.Router();

// Normal routes
router.post('/create-intent', createPaymentIntent);

// Stripe webhook route (needs raw body)
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  handleWebhook
);

export default router;
