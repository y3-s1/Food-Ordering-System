import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import CartItemComponent from './CartItem';
import { Cart } from '../../types/cart/cart';

interface Props {
  cart: Cart;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
}

const CartComponent: React.FC<Props> = ({ cart, onUpdateQty, onRemove, onClearCart, onPlaceOrder }) => {
  const { discountAmount, subtotal, fees, total } = cart;
  const feesTotal = (fees?.deliveryFee ?? 0) + (fees?.serviceFee ?? 0) + (fees?.tax ?? 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="w-full md:w-1/3 bg-white shadow-lg p-4 relative">
      {/* Three-dot menu button */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
      >
        <MoreVertical size={20} />
      </button>
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-10 right-4 bg-white rounded shadow-md z-10"
        >
          <button
            onClick={() => { onClearCart(); setMenuOpen(false); }}
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-red-600 space-x-2"
          >
            <Trash2 size={16} />
            <span>Clear Cart</span>
          </button>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Your Order</h2>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-4">
        {cart.items.map(item => (
          <CartItemComponent
            key={item._id}
            item={item}
            onUpdateQty={onUpdateQty}
            onRemove={onRemove}
          />
        ))}
      </div>

      <textarea
        placeholder="Add an order note"
        className="w-full border rounded p-2 mb-4"
      />
      <div className="space-y-2 text-lg font-medium">
        <div className="flex justify-between">
          <span>Discount</span>
          <span className="text-green-600">- LKR {discountAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Fees</span>
          <span>LKR {feesTotal.toFixed(2)}</span>
        </div>
        <div className="ml-4 space-y-1 text-sm text-gray-600">
        <div className="flex justify-between">
            <span>Delivery</span>
            <span>LKR {(fees?.deliveryFee ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
            <span>Service</span>
            <span>LKR {(fees?.serviceFee ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
            <span>Tax</span>
            <span>LKR {(fees?.tax ?? 0).toFixed(2)}</span>
            </div>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>LKR {total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        className="mt-2 w-full bg-black text-white py-3 rounded-lg"
      >
        Place Order
      </button>
    </div>
  );
};

export default CartComponent;
