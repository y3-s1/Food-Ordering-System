import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import connectDB from './config/db';
import errorHandler from './middleware/errorMiddleware';
import restaurantRoutes from './routes/restaurantRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // ✅ must match your frontend config!

// ✅ CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173', // allow only frontend
  credentials: true,               // allow cookies
}));

app.options('*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ parse JSON body
app.use(express.json());

// ✅ Routes
app.use('/api/restaurants', restaurantRoutes);

// ✅ Error Handling
app.use(errorHandler);

// ✅ Start Server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Restaurant service running at http://localhost:${PORT}`));
});
