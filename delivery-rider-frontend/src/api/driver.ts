import api from './axios';

export const updateDriverLocation = async (userId: string, lat: number, lng: number) => {
  const res = await api.put(`/deliveries/drivers/${userId}/location`, { lat, lng });
  return res.data;
};
