// cartService.ts
import axios from 'axios';
import { Cart, CartItem, OrderDraft } from '../../types/cart/cart';
import { MenuItem } from '../../types/restaurant/restaurant';

const API_URL = 'http://localhost:5005/api/v1';

// Create axios instance with credentials to send/receive cookies
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json'
  }
});


export const fetchCart = async (): Promise<Cart> => {
  const response = await api.get<Cart>('/cart');
  return response.data;
};

export const updateItemQuantity = async (id: string, qty: number): Promise<Cart> => {
  const response = await api.put<Cart>(`/cart/items/${id}`, { quantity: qty });
  return response.data;
};

export const removeItem = async (id: string): Promise<Cart> => {
  const response = await api.delete<Cart>(`/cart/items/${id}`);
  return response.data;
};

export const clearCart = async (): Promise<Cart> => {
  const response = await api.delete<Cart>('/cart/items');
  return response.data;
};

export const fetchDraft = async (): Promise<OrderDraft> => {
  const response = await api.get<OrderDraft>('/cart/draft');
  return response.data;
};

export const addToCart = async (item: CartItem): Promise<Cart> => {
  const response = await api.post<Cart>('/cart/items', { 
    item
  });
  return response.data;
};