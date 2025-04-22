import axios from 'axios';
import { Restaurant, MenuItem } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Restaurant API calls
export const fetchAllRestaurants = async (): Promise<Restaurant[]> => {
  const response = await axios.get(`${API_URL}/restaurants`);
  return response.data;
};

export const fetchApprovedRestaurants = async (): Promise<Restaurant[]> => {
  const response = await axios.get(`${API_URL}/restaurants/approved`);
  return response.data;
};

export const fetchPendingRestaurants = async (): Promise<Restaurant[]> => {
  const response = await axios.get(`${API_URL}/restaurants/pending`);
  return response.data;
};

export const fetchRestaurantById = async (id: string): Promise<Restaurant> => {
  const response = await axios.get(`${API_URL}/restaurants/${id}`);
  return response.data;
};

export const createRestaurant = async (restaurantData: Omit<Restaurant, '_id' | 'createdAt' | 'updatedAt' | 'approvalStatus'>): Promise<Restaurant> => {
  const response = await axios.post(`${API_URL}/restaurants`, restaurantData);
  return response.data;
};

export const updateRestaurant = async (id: string, restaurantData: Partial<Restaurant>): Promise<Restaurant> => {
  const response = await axios.put(`${API_URL}/restaurants/${id}`, restaurantData);
  return response.data;
};

export const deleteRestaurant = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/restaurants/${id}`);
};

export const toggleRestaurantAvailability = async (id: string): Promise<{isAvailable: boolean}> => {
  const response = await axios.patch(`${API_URL}/restaurants/${id}/toggle-availability`);
  return response.data;
};

export const approveRestaurant = async (id: string): Promise<Restaurant> => {
  const response = await axios.patch(`${API_URL}/restaurants/${id}/approve`);
  return response.data;
};

export const rejectRestaurant = async (id: string): Promise<Restaurant> => {
  const response = await axios.patch(`${API_URL}/restaurants/${id}/reject`);
  return response.data;
};

// Menu Item API calls
export const fetchMenuItems = async (restaurantId: string): Promise<MenuItem[]> => {
  const response = await axios.get(`${API_URL}/restaurants/${restaurantId}/menu-items`);
  return response.data;
};

export const fetchMenuItemById = async (restaurantId: string, itemId: string): Promise<MenuItem> => {
  const response = await axios.get(`${API_URL}/restaurants/${restaurantId}/menu-items/${itemId}`);
  return response.data;
};

export const createMenuItem = async (
  restaurantId: string, 
  menuItemData: Omit<MenuItem, '_id' | 'restaurantId' | 'createdAt' | 'updatedAt'>
): Promise<MenuItem> => {
  const response = await axios.post(`${API_URL}/restaurants/${restaurantId}/menu-items`, menuItemData);
  return response.data;
};

export const updateMenuItem = async (
  restaurantId: string,
  itemId: string,
  menuItemData: Partial<MenuItem>
): Promise<MenuItem> => {
  const response = await axios.put(`${API_URL}/restaurants/${restaurantId}/menu-items/${itemId}`, menuItemData);
  return response.data;
};

export const deleteMenuItem = async (restaurantId: string, itemId: string): Promise<void> => {
  await axios.delete(`${API_URL}/restaurants/${restaurantId}/menu-items/${itemId}`);
};

export const toggleMenuItemAvailability = async (restaurantId: string, itemId: string): Promise<{isAvailable: boolean}> => {
  const response = await axios.patch(`${API_URL}/restaurants/${restaurantId}/menu-items/${itemId}/toggle-availability`);
  return response.data;
};