
import { CreateOrderDTO, OrderDTO } from '../../types/order/order';
import { orderApi } from '../../api/axiosInstances';

export const placeOrder = (data: CreateOrderDTO) =>
  orderApi.post('/', data);

export const fetchOrderById = (orderId: string) =>
  orderApi.get(`/${orderId}`);

export const fetchOrderStatus = (orderId: string) =>
  orderApi.get(`/${orderId}/status`);

export const fetchOrders = async (userId: string): Promise<OrderDTO[]> => {
  const res = await orderApi.get<OrderDTO[]>(`/user/${userId}`);
  return res.data;
};

export const modifyOrder = (orderId: string, data: OrderDTO) =>
  orderApi.put<OrderDTO>(`/${orderId}`, data);

export const updateOrderStatus = (orderId: string, status: string) =>
  orderApi.put<OrderDTO>(`/${orderId}/status`, { status });

export const cancelOrderById = (orderId: string) =>
  orderApi.delete<{ message: string }>(`/${orderId}`);
