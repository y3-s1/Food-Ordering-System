import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCart, updateItemQuantity, removeItem, clearCart, fetchDraft } from '../../services/cart/cartService';
import CartComponent from '../../components/cart/Cart';
import { Cart, OrderDraft } from '../../types/cart/cart';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    discountAmount: 0,
    subtotal: 0,
    fees: { deliveryFee: 0, serviceFee: 0, tax: 0 },
    total: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart().then(setCart);
  }, []);

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
      const draft: OrderDraft = await fetchDraft();
      navigate('/order/new', { state: draft });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-end p-6">
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
