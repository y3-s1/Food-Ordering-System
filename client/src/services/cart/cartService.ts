import axios from 'axios';
import { Cart, CartItem, OrderDraft } from '../../types/cart/cart';

export const fetchCart = async (): Promise<Cart> => {
  const res = await axios.get<Cart>('http://localhost:5005/api/v1/cart', {
    headers: { 'Content-Type': 'application/json', 'X-Cart-Id': 'e175d675-79b6-4a7c-9fca-3c0657b51ada' }
  });
  console.log('res.data', res.data)
  return res.data;
};

export const updateItemQuantity = async (itemId: string, quantity: number): Promise<Cart> => {
  const res = await axios.put<Cart>(`http://localhost:5005/api/v1/cart/items/${itemId}`, { quantity },{
    headers: { 'Content-Type': 'application/json', 'X-Cart-Id': 'e175d675-79b6-4a7c-9fca-3c0657b51ada' }
  });
  return res.data;
};

export const removeItem = async (itemId: string): Promise<Cart> => {
  const res = await axios.delete<Cart>(`http://localhost:5005/api/v1/cart/items/${itemId}`, {
    headers: { 'Content-Type': 'application/json', 'X-Cart-Id': 'e175d675-79b6-4a7c-9fca-3c0657b51ada' }
  });
  return res.data;
};

export const clearCart = async (): Promise<Cart> => {
    const res = await axios.delete<Cart>('http://localhost:5005/api/v1/cart', {
     headers: { 'Content-Type': 'application/json', 'X-Cart-Id': 'e175d675-79b6-4a7c-9fca-3c0657b51ada' }
    });
    return res.data;
  };

export const fetchDraft = async (): Promise<OrderDraft> => {
    const res = await axios.get<OrderDraft>('http://localhost:5005/api/v1/cart/draft', {
        headers: { 'Content-Type': 'application/json', 'X-Cart-Id': 'e175d675-79b6-4a7c-9fca-3c0657b51ada' }
    });
    return res.data;
  };
