import axios from 'axios';
import { CreateOrderDTO } from '../../types/order/order';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

export const placeOrder = (data: CreateOrderDTO) =>
  api.post('/api/orders', data);

export const fetchOrderById = (orderId: string) =>
  api.get(`/api/orders/${orderId}`);

export const fetchOrderStatus = (orderId: string) =>
  api.get(`/api/orders/${orderId}/status`);
