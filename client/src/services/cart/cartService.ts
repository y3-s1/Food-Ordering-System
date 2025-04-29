
import { Cart, CartItem, OrderDraft } from '../../types/cart/cart';
import { cartApi } from '../../api/axiosInstances';

export const fetchCart = async (): Promise<Cart> => {
  const response = await cartApi.get<Cart>('/');
  return response.data;
};

export const clearCart = async (): Promise<Cart> => {
  const response = await cartApi.delete<Cart>('/items');
  return response.data;
};

// CART ITEMS
export const addToCart = async (item: CartItem): Promise<Cart> => {
  const response = await cartApi.post<Cart>('/items', { item });
  return response.data;
};

export const updateItemQuantity = async (
  id: string,
  quantity: number
): Promise<Cart> => {
  const response = await cartApi.put<Cart>(`/items/${id}`, { quantity });
  return response.data;
};

export const removeItem = async (id: string): Promise<Cart> => {
  const response = await cartApi.delete<Cart>(`/items/${id}`);
  return response.data;
};

// ORDER DRAFT
export const fetchDraft = async (): Promise<OrderDraft> => {
  const response = await cartApi.get<OrderDraft>('/draft');
  return response.data;
};