import api from './axios';
import { Delivery } from '../types/delivery';

export const getDeliveriesByDriver = async (driverId: string): Promise<Delivery[]> => {
  const res = await api.get(`/deliveries`, {
    params: { driverId }
  });
  return res.data;
};

export const updateDeliveryStatus = async (deliveryId: string, status: string): Promise<Delivery> => {
  const res = await api.put(`/deliveries/${deliveryId}/status`, { status });
  return res.data;
};