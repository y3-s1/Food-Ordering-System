import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/paymentController';
import bodyParser from 'body-parser';

const router = express.Router();

// Route: create payment intent
router.post('/create-intent', express.json(), createPaymentIntent);

// Route: handle Stripe webhook
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), handleWebhook);

export default router;
