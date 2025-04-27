import { deliveryApi } from './axiosInstances';
import { Delivery } from '../types/delivery';

export const getDeliveriesByDriver = async (driverId: string): Promise<Delivery[]> => {
  const res = await deliveryApi.get(`/`, {
    params: { driverId }
  });
  return res.data;
};

export const updateDeliveryStatus = async (deliveryId: string, status: string): Promise<Delivery> => {
  const res = await deliveryApi.put(`/${deliveryId}/status`, { status });
  return res.data;
};