import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';


import connectDB from './config/db';
import errorHandler from './middleware/errorMiddleware';
import restaurantRoutes from './routes/restaurantRoutes';
// import menuItemRoutes from './routes/menuItemRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// middleware
app.use(cors());
app.use(express.json());



// Routes
app.use('/api/restaurants', restaurantRoutes);



// Error Handling Middleware
app.use(errorHandler);



//connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Restaurant service running on port ${PORT}`));
});