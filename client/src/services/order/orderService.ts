import axios from 'axios';
import { CreateOrderDTO, OrderDTO } from '../../types/order/order';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

export const placeOrder = (data: CreateOrderDTO) =>
  api.post('/orders', data);

export const fetchOrderById = (orderId: string) =>
  api.get(`/orders/${orderId}`);

export const fetchOrderStatus = (orderId: string) =>
  api.get(`/orders/${orderId}/status`);

export const fetchOrders = async (): Promise<OrderDTO[]> => {
  const res = await api.get<OrderDTO[]>('/orders');
  return res.data;
};

export const modifyOrder = (orderId: string, data: OrderDTO) =>
  api.put<OrderDTO>(`/orders/${orderId}`, data);

export const updateOrderStatus = (orderId: string, status: string) =>
  api.put<OrderDTO>(`/orders/${orderId}/status`, { status });
