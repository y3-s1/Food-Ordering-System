import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '../types/cart/cart';
import { fetchCart, addToCart, updateItemQuantity, removeItem, clearCart, updateCartItem } from '../services/cart/cartService';

interface CartContextType {
  cart: Cart;
  loading: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItemToCart: (item: any) => Promise<void>;
  updateQty: (itemId: string, quantity: number) => Promise<void>;
  updateCartItem: (item: CartItem) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  emptyCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    discountAmount: 0,
    subtotal: 0,
    fees: { deliveryFee: 0, serviceFee: 0, tax: 0 },
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const refreshCart = async () => {
    setLoading(true);
    try {
      const updatedCart = await fetchCart();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error refreshing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addItemToCart = async (item: any) => {
    try {
      const updatedCart = await addToCart(item);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const updateQty = async (itemId: string, quantity: number) => {
    try {
      const updatedCart = await updateItemQuantity(itemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleUpdateCartItem = async (item: CartItem) => {
    try {
      const updatedCart = await updateCartItem(item);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeCartItem = async (itemId: string) => {
    try {
      const updatedCart = await removeItem(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const emptyCart = async () => {
    try {
      const updatedCart = await clearCart();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartOpen,
        setCartOpen,
        addItemToCart,
        updateQty,
        updateCartItem: handleUpdateCartItem,
        removeCartItem,
        emptyCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};