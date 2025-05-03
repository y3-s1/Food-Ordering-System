import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SERVICE_URLS } from '../config';

const router = express.Router();

router.use('/api/deliveries', createProxyMiddleware({
  target: SERVICE_URLS.delivery,
  changeOrigin: true,
}));

router.use('/api/orders', createProxyMiddleware({
  target: SERVICE_URLS.order,
  changeOrigin: true,
}));

router.use('/api/cart', createProxyMiddleware({
  target: SERVICE_URLS.cart,
  changeOrigin: true,
}));

router.use('/api/notification', createProxyMiddleware({
  target: SERVICE_URLS.notification,
  changeOrigin: true,
}));

router.use('/api/restaurants', createProxyMiddleware({
  target: SERVICE_URLS.restaurant,
  changeOrigin: true,
}));

router.use('/api/users', createProxyMiddleware({
  target: SERVICE_URLS.user,
  changeOrigin: true,
}));

router.use('/api/payments', createProxyMiddleware({
  target: SERVICE_URLS.payment,
  changeOrigin: true,
}));

export default router;
