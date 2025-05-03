// index.ts or app.ts
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db';
import errorHandler from './middleware/errorMiddleware';
import restaurantRoutes from './routes/restaurantRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3002', 'http://localhost:3001', 'http://localhost:3003'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // For parsing cookies with token

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'restaurant-service' });
});

// ✅ Routes
app.use('/api/restaurants', restaurantRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Restaurant service running at http://localhost:${PORT}`));
});
