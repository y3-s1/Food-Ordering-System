import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import proxyRoutes from './routes/proxyRoutes';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

const raw = process.env.CLIENT_ORIGIN || '';
const allowedOrigins = raw
  .split(',')
  .map(o => o.trim())
  .filter(o => !!o)
  .map(o => o.endsWith('/') ? o.slice(0, -1) : o);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS', 'PATCH'],
}));

app.use(morgan('[:date[iso]] :method :url → :status'));

app.use('/', proxyRoutes);

app.use(express.json());

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
