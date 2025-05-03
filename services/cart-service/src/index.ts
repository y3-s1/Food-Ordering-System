
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
  const raw = process.env.CLIENT_ORIGIN || '';
  const allowedOrigins = raw
    .split(',')
    .map(o => o.trim())               
    .filter(o => !!o)                  
    .map(o => o.endsWith('/') ? o.slice(0, -1) : o); 

  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  }));
  app.use(express.json());

  app.use('/api/v1/cart', cartRoutes);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Cart service on port ${PORT}`));
}

bootstrap().catch(err => {
  console.error('Startup error:', err);
  process.exit(1);
});
