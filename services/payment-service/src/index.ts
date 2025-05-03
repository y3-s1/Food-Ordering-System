import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose"; //  ADD Mongoose
import paymentRoutes from "./routes/paymentRoutes";
import refundRoutes from "./routes/refundRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import { errorHandler } from "./middleware/errorHandler";
import bodyParser from "body-parser";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5006;

//  Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

//  Setup CORS properly
app.use(cors({
  origin: [process.env.FRONTEND_URL!],
  credentials: true,
}));

//  Normal body parsing
app.use(express.json());

//  Stripe Webhook raw body parsing
app.use('/api/payments/webhook', bodyParser.raw({ type: 'application/json' }));

//  Routes
app.use("/api/payments", paymentRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api", webhookRoutes);

//  Global error handler
app.use(errorHandler);

//  Start server
app.listen(PORT, () => {
  console.log(` Payment Service running at http://localhost:${PORT}`);
});
