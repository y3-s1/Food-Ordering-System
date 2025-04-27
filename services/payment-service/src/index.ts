import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRoutes from './routes/paymentRoutes';
import refundRoutes from "./routes/refundRoutes";
import webhookRoutes from './routes/webhookRoutes';
import { errorHandler } from './middleware/errorHandler';
import bodyParser from 'body-parser';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5005;

// For normal routes
app.use('/api/payments', express.json());

// For Stripe Webhook (must use raw body!)
app.use('/api/payments/webhook', bodyParser.raw({ type: 'application/json' }));

// CORS setup
app.use(cors());

// Payment Routes
app.use('/api/payments', paymentRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api", webhookRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Payment Service running at http://localhost:${PORT}`);
});
