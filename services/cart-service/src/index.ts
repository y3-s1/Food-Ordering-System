
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
// import connectBroker from './config/broker';
import cartRoutes from './routes/cartRoutes';
import errorHandler from './middleware/errorHandler';
import { PORT } from './config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  await connectDB();
//   await connectBroker();

  const app = express();
  app.use(cookieParser()); 
  app.use(
    cors({
      origin: 'http://localhost:5173',  
      methods: ['GET','POST','PUT','DELETE','OPTIONS'],
      credentials: true                 
    })
  );
  app.use(express.json());

  app.use('/api/v1/cart', cartRoutes);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Cart service on port ${PORT}`));
}

bootstrap().catch(err => {
  console.error('Startup error:', err);
  process.exit(1);
});
