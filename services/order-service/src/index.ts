import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
// import connectBroker from './config/broker';
import orderRoutes from './routes/orderRoutes';
// import { authMiddleware } from './middleware/auth';
import errorHandler from './middleware/errorHandler';
import { PORT } from './config';

dotenv.config();

async function bootstrap() {
  await connectDB();
//   await connectBroker();

  const app = express();
  app.use(cors());
  app.use(json());

  // All /api/v1/orders routes
//   app.use('/api/v1/orders', authMiddleware, orderRoutes);
  app.use('/api/v1/orders', orderRoutes);

  // Global error handler
  app.use(errorHandler);

  app.listen(PORT, () =>
    console.log(`Order service running on port ${PORT}`)
  );
}

bootstrap().catch(err => {
  console.error('Failed to start service:', err);
  process.exit(1);
});
