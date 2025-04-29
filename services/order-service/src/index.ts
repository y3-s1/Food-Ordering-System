// src/index.ts
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './config/db';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middleware/errorHandler';
import { PORT, CLIENT_ORIGIN } from './config';

dotenv.config();

// declare & export the io reference
export let io: SocketIOServer;

async function bootstrap() {
  await connectDB();

  const app = express();
  
  // Fix 1: Make sure CLIENT_ORIGIN doesn't have a trailing slash
  const origin = CLIENT_ORIGIN.endsWith('/') 
    ? CLIENT_ORIGIN.slice(0, -1) 
    : CLIENT_ORIGIN;
  
  app.use(cors({ origin }));
  app.use(json());
  app.use('/api/v1/orders', orderRoutes);
  app.use(errorHandler);

  // create HTTP server & Socket.IO
  const server = http.createServer(app);
  
  // Fix 2: Use the same origin value for Socket.IO CORS
  io = new SocketIOServer(server, { 
    cors: { 
      origin,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    } 
  });

  io.on('connection', socket => {
    console.log('▶ client connected', socket.id);
    socket.on('disconnect', () => {
      console.log('◀ client disconnected', socket.id);
    });
  });
  app.locals.io = io;

  server.listen(PORT, () =>
    console.log(`Order service + Socket.IO running on port ${PORT}`)
  );
}

bootstrap().catch(err => {
  console.error('Failed to start service:', err);
  process.exit(1);
});