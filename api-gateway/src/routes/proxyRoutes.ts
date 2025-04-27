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
  pathRewrite: { '^/api/orders': '' }
}));

router.use('/api/restaurants', createProxyMiddleware({
  target: SERVICE_URLS.restaurant,
  changeOrigin: true,
  pathRewrite: { '^/api/restaurants': '' }
}));

router.use('/api/users', createProxyMiddleware({
  target: SERVICE_URLS.user,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

export default router;
