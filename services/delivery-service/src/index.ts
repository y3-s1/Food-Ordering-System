import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import deliveryRoutes from './routes/deliveryRoutes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/deliveries', deliveryRoutes);

// Error Handling Middleware
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Delivery service running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
