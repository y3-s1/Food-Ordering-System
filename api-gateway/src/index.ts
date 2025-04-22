import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import proxyRoutes from './routes/proxyRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/', proxyRoutes);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
