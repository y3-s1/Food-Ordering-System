import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import notificationRoutes from './routes/notificationRoutes';
import { PORT } from './config';
import { mailer } from './services/notificationService';
import { processPending } from './services/notificationService';
import errorHandler from './middleware/errorHandler';

async function bootstrap() {
  await connectDB();
  try {
    await mailer.verify();
    console.log('✅ SMTP credentials are valid');
  } catch (err) {
    console.error('❌ SMTP verification failed:', err);
    process.exit(1);
  }
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/v1/notifications', notificationRoutes);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`🚀 Notification Service running on ${PORT}`));
}

bootstrap();

setInterval(() => {
    processPending().catch(console.error);
  }, 5000);