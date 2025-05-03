import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDraft } from '../../services/cart/cartService';
import CartComponent from '../../components/cart/Cart';
import {  OrderDraft } from '../../types/cart/cart';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../context/cartContext';

const CartPage: React.FC = () => {
  // const [loading, setLoading] = useState(true);
  const { cart, loading, updateQty, removeCartItem, emptyCart, refreshCart } = useCart();
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
    refreshCart();
  }, [user]);

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty < 1) return;
    updateQty(id, qty);
  };

  const handleRemove = (id: string) => {
    removeCartItem(id);
  };

  const handleClearCart = () => {
    emptyCart();
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
