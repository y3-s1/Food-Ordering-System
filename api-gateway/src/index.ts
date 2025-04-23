import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import proxyRoutes from './routes/proxyRoutes';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());

app.use(morgan('[:date[iso]] :method :url → :status'));

app.use('/', proxyRoutes);

app.use(express.json());

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
