import axios from 'axios';
import { CreateOrderDTO, OrderDTO } from '../../types/order/order';
import { orderApi } from '../../api/axiosInstances';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

export const placeOrder = (data: CreateOrderDTO) =>
  orderApi.post('/', data);

export const fetchOrderById = (orderId: string) =>
  orderApi.get(`/${orderId}`);

export const fetchOrderStatus = (orderId: string) =>
  orderApi.get(`/${orderId}/status`);

export const fetchOrders = async (): Promise<OrderDTO[]> => {
  const res = await orderApi.get<OrderDTO[]>('/');
  return res.data;
};

export const modifyOrder = (orderId: string, data: OrderDTO) =>
  orderApi.put<OrderDTO>(`/${orderId}`, data);

export const updateOrderStatus = (orderId: string, status: string) =>
  orderApi.put<OrderDTO>(`/${orderId}/status`, { status });
