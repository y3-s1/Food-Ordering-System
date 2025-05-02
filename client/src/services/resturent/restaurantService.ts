
import { restaurantApi } from '../../api/axiosInstances';
import { IRestaurant, MenuItem } from '../../types/restaurant/restaurant';

export const getRestaurantById = async (restaurantId: string) => {
    const res = await await restaurantApi.get(`/${restaurantId}`);
    return res.data;
  };

  export const fetchApprovedRestaurants = async (): Promise<IRestaurant[]> => {
    const response = await restaurantApi.get(`/approved`);
    return response.data;
  };

  export const fetchMenuItems = async (restaurantId: string): Promise<MenuItem[]> => {
    const response = await restaurantApi.get(`/${restaurantId}/menu-items`);
    return response.data;
  };

  export const fetchRestaurantById = async (id: string): Promise<IRestaurant> => {
    const response = await restaurantApi.get(`/${id}`);
    return response.data;
  };