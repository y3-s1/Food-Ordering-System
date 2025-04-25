import api from './axios';
import { Delivery } from '../types/delivery';

export const getDeliveriesByDriver = async (driverId: string): Promise<Delivery[]> => {
  const res = await api.get(`/deliveries`, {
    params: { driverId }
  });
  return res.data;
};
