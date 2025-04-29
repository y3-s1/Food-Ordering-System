import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCart, updateItemQuantity, removeItem, clearCart, fetchDraft } from '../../services/cart/cartService';
import CartComponent from '../../components/cart/Cart';
import { Cart, OrderDraft } from '../../types/cart/cart';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useAuth } from '../../auth/AuthContext';

const CartPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart>({
    items: [],
    discountAmount: 0,
    subtotal: 0,
    fees: { deliveryFee: 0, serviceFee: 0, tax: 0 },
    total: 0,
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  // detect desktop > hide page on desktop
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (isDesktop) {
      // If resized to desktop while on /cart, redirect back or close
      // navigate('/', { replace: true });
    }
  }, [isDesktop, navigate]);

  useEffect(() => {
    setLoading(true);
    fetchCart()
      .then(cart => {
        setCart(cart);
        console.log('cart-new', cart)
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
        setLoading(false);
      });
  }, [user]);

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty < 1) return;
    updateItemQuantity(id, qty).then(setCart);
  };

  const handleRemove = (id: string) => {
    removeItem(id).then(setCart);
  };

  const handleClearCart = () => {
    clearCart().then(setCart);
  };

  const handlePlaceOrder = async () => {
    try {
      if (!user) {
        // Redirect to login first if user is not authenticated
        navigate('/login', { state: { returnTo: '/order/new' } });
        return;
      }
      
      const draft: OrderDraft = await fetchDraft();
      navigate('/order/new', { state: draft });
    } catch (err) {
      console.error('Error preparing order:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading cart...</div>;
  }

  return (
    <div className="flex justify-end p-6 md:justify-end md:p-0">
      <CartComponent
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
};

export default CartPage;
