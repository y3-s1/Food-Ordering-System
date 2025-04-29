import { deliveryApi } from './axiosInstances';

export const updateDriverLocation = async (userId: string, lat: number, lng: number) => {
  const res = await deliveryApi.put(`/drivers/${userId}/location`, { lat, lng });
  return res.data;
};

export const updateDriverAvailability = async (userId: string, isAvailable: boolean) => {
  const res = await deliveryApi.put(`/drivers/${userId}/availability`, { isAvailable });
  return res.data;
};
